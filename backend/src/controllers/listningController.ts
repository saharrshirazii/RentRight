// Logik för att skapa annonser och hämta annonser
import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
import { createListning, deleteListning, findListning, getListnings, getApprovedListnings, updateListning } from '../data/listnings';
import { uploadDirectory } from '../config/upload';
import { ListingImage } from '../types';
import { AdminLog } from '../models/AdminLog'; // Importera den nya loggmodellen
import Message from '../models/Message'; // Importera meddelandemodellen

const parseAmenities = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const parseKeepImageIds = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : null;
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const parseCount = (value: unknown) => {
  const count = Number(value);
  return Number.isInteger(count) ? count : NaN;
};

export const listListnings = async (_req: Request, res: Response) => {
  try {
    res.json(await getListnings());
  } catch (error) {
    console.error('Fel vid hämtning av annonser:', error);
    res.status(500).json({ message: 'Kunde inte hämta annonser.' });
  }
};

export const listApprovedListnings = async (_req: Request, res: Response) => {
  try {
    res.json(await getApprovedListnings());
  } catch (error) {
    console.error('Fel vid hämtning av godkända annonser:', error);
    res.status(500).json({ message: 'Kunde inte hämta godkända annonser.' });
  }
};

export const getListning = async (req: Request, res: Response) => {
  try {
    const listning = await findListning(req.params.id);

    if (!listning) {
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    res.json(listning);
  } catch (error) {
    console.error('Fel vid hämtning av annons:', error);
    res.status(500).json({ message: 'Kunde inte hämta annonsen.' });
  }
};

export const addListning = async (req: Request, res: Response) => {
  try {
    const { title, description, location, price } = req.body;
    const numericPrice = Number(price);
    const guests = parseCount(req.body.guests);
    const bedrooms = parseCount(req.body.bedrooms);
    const bathrooms = parseCount(req.body.bathrooms);
    const userId = req.user?.id;

    if (!title || !description || !location || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({
        message: 'Titel, beskrivning, plats och ett pris större än 0 krävs.',
      });
      return;
    }

    if (
      !Number.isInteger(guests) ||
      !Number.isInteger(bedrooms) ||
      !Number.isInteger(bathrooms) ||
      guests < 1 ||
      bedrooms < 0 ||
      bathrooms < 0
    ) {
      res.status(400).json({
        message: 'Ange minst 1 gäst samt giltigt antal sovrum och badrum.',
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        message: 'Du måste vara inloggad för att skapa en annons.',
      });
      return;
    }

    const files = (req.files ?? []) as Express.Multer.File[];
    const images: ListingImage[] = files.map((file) => ({
      id: file.filename,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));


    const listning = await createListning({
      userId: String(userId),
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      price: numericPrice,
      guests,
      bedrooms,
      bathrooms,
      amenities: parseAmenities(req.body.amenities),
      images,
    });

    res.status(201).json(listning);
  } catch (error) {
    console.error('Fel vid skapande av annons:', error);
    res.status(500).json({ message: 'Kunde inte skapa annonsen.' });
  }
};

export const editListning = async (req: Request, res: Response) => {
  try {
    const { title, description, location, price } = req.body;
    const numericPrice = Number(price);
    const guests = parseCount(req.body.guests);
    const bedrooms = parseCount(req.body.bedrooms);
    const bathrooms = parseCount(req.body.bathrooms);

    if (!title || !description || !location || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({
        message: 'Titel, beskrivning, plats och ett pris större än 0 krävs.',
      });
      return;
    }

    if (
      !Number.isInteger(guests) ||
      !Number.isInteger(bedrooms) ||
      !Number.isInteger(bathrooms) ||
      guests < 1 ||
      bedrooms < 0 ||
      bathrooms < 0
    ) {
      res.status(400).json({
        message: 'Ange minst 1 gäst samt giltigt antal sovrum och badrum.',
      });
      return;
    }

    const currentListning = await findListning(req.params.id);
    if (!currentListning) {
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    const files = (req.files ?? []) as Express.Multer.File[];
    const uploadedImages: ListingImage[] = files.map((file) => ({
      id: file.filename,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const keepImageIds = parseKeepImageIds(req.body.keepImageIds);
    const keptImages = keepImageIds
      ? currentListning.images.filter((image) => keepImageIds.includes(image.id))
      : currentListning.images;
    const removedImages = currentListning.images.filter(
      (image) => !keptImages.some((keptImage) => keptImage.id === image.id),
    );
    const images = [...keptImages, ...uploadedImages];

    await Promise.all(
      removedImages.map(async (image) => {
        const imagePath = path.join(uploadDirectory, image.filename);
        await fs.unlink(imagePath).catch(() => undefined);
      }),
    );

    
    
    // Logga när host skickar tillbaka annons för ny granskning
    if (currentListning.status === 'needs_revision' || currentListning.status === 'rejected') {
      await AdminLog.create({
        adminId: req.user?.id,
        action: 'RESUBMIT_LISTING',
        targetId: req.params.id,
        reason: 'Host har kompletterat annons enligt feedback'
      });
    }

    const updatedListning = await updateListning(req.params.id, {
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      price: numericPrice,
      guests,
      bedrooms,
      bathrooms,
      amenities: parseAmenities(req.body.amenities),
      images,
      status: 'pending',
      adminFeedback: ''
    });

    res.json(updatedListning);
  } catch (error) {
    console.error('Fel vid uppdatering av annons:', error);
    res.status(500).json({ message: 'Kunde inte spara annonsen.' });
  }
};


export const reviewListning = async (req: Request, res: Response) => {
  try {
    const { status, feedback } = req.body;
    const adminId = req.user?.id;

    if (!status || !['approved', 'needs_revision', 'rejected'].includes(status)) {
      res.status(400).json({ message: 'Ogiltig status. Välj "approved", "needs_revision" eller "rejected".' });
      return;
    }

    if ((status === 'needs_revision' || status === 'rejected') && (!feedback || String(feedback).trim() === '')) {
      res.status(400).json({ message: 'En kommentar måste anges om du begär komplettering eller nekar annonsen.' });
      return;
    }

    const currentListning = await findListning(req.params.id);
    if (!currentListning) {
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    // 1. Skapa logg för granskningsåtgärden
    await AdminLog.create({
      adminId,
      action: status === 'approved' ? 'APPROVE_LISTING' : status === 'needs_revision' ? 'REVISION_REQUEST' : 'REJECT_LISTING',
      targetId: req.params.id,
      reason: feedback ? String(feedback).trim() : 'Godkänd utan anmärkning'
    });

    // 2. Uppdatera status och eventuell feedback i databasen
    const updatedListning = await updateListning(req.params.id, {
      status,
      adminFeedback: feedback ? String(feedback).trim() : ''
    });

    res.status(200).json({
      message: status === 'approved' ? 'Annonsen har godkänts och publicerats.' : status === 'needs_revision' ? 'Komplettering har begärts.' : 'Annonsen har nekats.',
      listning: updatedListning
    });
  } catch (error) {
    console.error('Fel vid granskning av annons:', error);
    res.status(500).json({ message: 'Ett internt fel uppstod vid granskning.' });
  }
};

export const removeListning = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const adminId = req.user?.id;

    if (!reason || String(reason).trim() === '') {
      res.status(400).json({ message: 'En anledning måste anges vid borttagning.' });
      return;
    }

    const currentListning = await findListning(req.params.id);
    if (!currentListning) {
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    await AdminLog.create({
      adminId,
      action: 'DELETE_LISTING',
      targetId: req.params.id,
      reason: String(reason).trim()
    });

    // Send message to the host about the deletion
    if (currentListning.userId) {
      await Message.create({
        sender: adminId as any,
        receiver: currentListning.userId as any,
        text: `Din annons har tagits bort från plattformen.`,
        type: 'listing_deleted',
        listingId: req.params.id,
        listingTitle: currentListning.title,
        deletionReason: reason
      });
    }

    const deletedListning = await deleteListning(req.params.id);

    if (!deletedListning) {
      res.status(404).json({ message: 'Annonsen hittades inte vid borttagning.' });
      return;
    }

    await Promise.all(
      deletedListning.images.map(async (image) => {
        const imagePath = path.join(uploadDirectory, image.filename);
        await fs.unlink(imagePath).catch(() => undefined);
      }),
    );

    res.status(200).json({
      message: 'Annonsen raderades framgångsrikt och åtgärden loggades. Värden har informerats.',
      id: req.params.id
    });
  } catch (error) {
    console.error('Fel vid radering av annons:', error);
    res.status(500).json({ message: 'Ett internt fel uppstod vid radering.' });
  }
};
