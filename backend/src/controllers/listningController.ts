// Logik för att skapa annonser och hämta annonser
import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
import { createListning, deleteListning, findListning, getListnings, getApprovedListnings, updateListning } from '../data/listnings';
import { uploadDirectory } from '../config/upload';
import { ListingImage } from '../types';
import {logger} from './../logger/logger'
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

const parseAvailability = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const startDate = new Date((item as any).startDate);
        const endDate = new Date((item as any).endDate);
        return isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate
          ? null
          : { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
      })
      .filter(Boolean) as { startDate: string; endDate: string }[];
  }

  if (typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return parseAvailability(parsed);
  } catch {
    return [];
  }
};

const parseCount = (value: unknown) => {
  const count = Number(value);
  return Number.isInteger(count) ? count : NaN;
};

const allowedPropertyTypes = ['Lägenhet', 'Radhus', 'Studio', 'Stuga', 'Villa'] as const;

type PropertyType = (typeof allowedPropertyTypes)[number];

const parsePropertyType = (value: unknown, fallback: PropertyType): PropertyType => {
  const propertyType = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
  return allowedPropertyTypes.includes(propertyType as PropertyType)
    ? (propertyType as PropertyType)
    : fallback;
};

export const listListnings = async (_req: Request, res: Response) => {
  try {
    //INFO LOG
    logger.info("Hämtar alla aktiva fastighetsannonser");
    res.json(await getListnings());
  } catch (error:any) {
    //ERROR LOG
    logger.error({ err: error.message }, 'Fel vid hämtning av annonser');
    console.error('Fel vid hämtning av annonser:', error);
    res.status(500).json({ message: 'Kunde inte hämta annonser.' });
  }
};

export const listApprovedListnings = async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.propertyType === 'string' ? req.query.propertyType.trim() : '';
    const validCategory = allowedPropertyTypes.includes(category as PropertyType) ? (category as PropertyType) : undefined;
    res.json(await getApprovedListnings(validCategory));
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
    const propertyType = parsePropertyType(req.body.propertyType, 'Lägenhet');
    const userId = req.user?.id;

   
      
 //INFO LOG
    logger.info({ title, price: numericPrice }, "Initierar processen för att skapa listning");
    if (!title || !description || !location || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      //WARN LOG
      logger.warn({ title, price: req.body.price }, "Listing creation rejected - Invalid input parameters");
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
    //INFO LOG
    logger.info({ fileCount: files.length }, "Bearbetar uppladdade filbilagor för listning");
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
      propertyType,
      availability: parseAvailability(req.body.availability),
    });

    //INFO LOG
    logger.info({ listingId: listning.id }, "Listningen har skapats och publicerats");
    res.status(201).json(listning);
  } catch (error:any) {

    //ERROR LOG
    logger.error({ err: error.message, stack: error.stack }, 'Fel vid skapande av annons');
    console.error('Fel vid skapande av annons:', error);
    res.status(500).json({ message: 'Kunde inte skapa annonsen.' });
  }
};

export const editListning = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;
    const { title, description, location, price } = req.body;
    const numericPrice = Number(price);
    const guests = parseCount(req.body.guests);
    const bedrooms = parseCount(req.body.bedrooms);
    const bathrooms = parseCount(req.body.bathrooms);

    //INFO LOG
    logger.info({ listingId, title }, "Initierar transaktion för ändring av listning");
    if (!title || !description || !location || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      //ERROR LOG
      logger.warn({ listingId, title, price: req.body.price }, "Uppdatering av annons avvisad – Validering misslyckades");
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
      //WARn LOG
      logger.warn({ listingId }, "Uppdatering av listning avvisad – resursen hittades inte");
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    const propertyType = parsePropertyType(req.body.propertyType, currentListning.propertyType ?? 'Lägenhet');
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

    //INFO LOG
    logger.info(
      { listingId, keptCount: keptImages.length, uploadedCount: uploadedImages.length, removedCount: removedImages.length },
      "Recalculating gallery sync configurations"
    );
    await Promise.all(
      removedImages.map(async (image) => {
        const imagePath = path.join(uploadDirectory, image.filename);
          await fs.unlink(imagePath).catch((err) => {
          //WARN LOG
          logger.warn({ filename: image.filename, err: err.message }, "Misslyckades med att ta bort bildfilen från serverdisken under ersättningen");
          return undefined;
        });      
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
      propertyType,
      availability:
        req.body.availability !== undefined
          ? parseAvailability(req.body.availability)
          : currentListning.availability,
      status: 'pending',
      adminFeedback: ''
    });

    //INFO LOG
    logger.info({ listingId }, "Statistiken för listdokumentet har uppdaterats");
    res.json(updatedListning);
  } catch (error:any) {
    console.error('Fel vid uppdatering av annons:', error);
    //ERROR LOG
    logger.error({ err: error.message, listingId: req.params.id }, 'Fel vid uppdatering av annonser');
    res.status(500).json({ message: 'Kunde inte spara annonsen.' });
  }
};


export const reviewListning = async (req: Request, res: Response) => {
  try {
    const { status, feedback } = req.body;
    const adminId = req.user?.id;
    const listingId = req.params.id;

    //INFO LOG
    logger.info({ adminId, listingId, requestedStatus: status }, "Administrativ granskningsprocess har inletts för listning");
    if (!status || !['approved', 'needs_revision', 'rejected'].includes(status)) {

      //WARN LOG
      logger.warn({ adminId, listingId, invalidStatus: status }, "Recension av objekt avvisad - Ogiltigt statusvärde mottaget");
      res.status(400).json({ message: 'Ogiltig status. Välj "approved", "needs_revision" eller "rejected".' });
      return;
    }

    if ((status === 'needs_revision' || status === 'rejected') && (!feedback || String(feedback).trim() === '')) {

      //WARN LOG
      logger.warn({ adminId, listingId, status }, "Recension av objektet avvisad – feedback saknas för revision/avslag");
      res.status(400).json({ message: 'En kommentar måste anges om du begär komplettering eller nekar annonsen.' });
      return;
    }

    const currentListning = await findListning(req.params.id);
    if (!currentListning) {
      //WARN LOG
      logger.warn({ adminId, listingId }, "Granskning av listning avbruten - Mållistningsdokumentet finns inte");
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

    //INFO LOG
    logger.info({ adminId, listingId, action }, "Database AdminLog-historikpost skapad");
    // 2. Uppdatera status och eventuell feedback i databasen
    const updatedListning = await updateListning(req.params.id, {
      status,
      adminFeedback: feedback ? String(feedback).trim() : ''
    });

    //INFO LOG
    logger.info({ adminId, listingId, finalStatus: status }, "Granskning av moderering av annonsen har slutförts");
    res.status(200).json({
      message: status === 'approved' ? 'Annonsen har godkänts och publicerats.' : status === 'needs_revision' ? 'Komplettering har begärts.' : 'Annonsen har nekats.',
      listning: updatedListning
    });
  } catch (error:any) {
    console.error('Fel vid granskning av annons:', error);
    //ERROR LOG
    logger.error({ err: error.message, listingId: req.params.id, adminId: req.user?.id }, 'Fel vid granskning av annons');
    res.status(500).json({ message: 'Ett internt fel uppstod vid granskning.' });
  }
};


export const removeListning = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;
    const { reason } = req.body;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    //INFO LOG
    logger.info({ listingId, currentUserId, currentUserRole }, "Transaktion för borttagning av annons har initierats");
    const currentListning = await findListning(req.params.id);
    if (!currentListning) {
      //WARN LOG
      logger.warn({ listingId, currentUserId }, "Borttagning av annons avbruten - Målannonsen hittades inte");
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    if (currentUserRole === 'host') {
      if (currentListning.userId !== currentUserId) {
        //WARN LOG
        logger.warn({ listingId, currentUserId, listingOwnerId: currentListning.userId }, "Obehörigt borttagningsförsök – Värden äger inte den här annonsen");
        res.status(403).json({ message: 'Du kan endast ta bort dina egna annonser.' });
        return;
      }

      if (currentListning.status !== 'rejected') {
        //WARN LOG
        logger.warn({ listingId, currentUserId, listingStatus: currentListning.status }, "Borttagning av värd avvisad – Annonsen har inte statusen avvisad");
        res.status(403).json({ message: 'Du kan endast ta bort en nekad annons.' });
        return;
      }
    }

    const deletionReason = String(reason ?? '').trim() || (currentUserRole === 'host'
      ? 'Värd tog bort sin egen nekade annons.'
      : 'Annons borttagen.');

    if (currentUserRole !== 'host' && deletionReason === '') {
      //WARN LOG
      logger.warn({ listingId, currentUserId, currentUserRole }, "Borttagning av administratör avvisad – kommentar om orsaken till borttagningen saknas");
      res.status(400).json({ message: 'En anledning måste anges vid borttagning.' });
      return;
    }

    await AdminLog.create({
      adminId: currentUserId,
      action: 'DELETE_LISTING',
      targetId: req.params.id,
      reason: deletionReason
    });

    //INFO LOG
    logger.info({ listingId, actorId: currentUserId, role: currentUserRole }, "Åtgärden har lagts till i AdminLog-registret");

    // Send message to the host about the deletion
    if (currentListning.userId) {
      await Message.create({
        sender: currentUserId as any,
        receiver: currentListning.userId as any,
        text: `Din annons har tagits bort från plattformen.`,
        type: 'listing_deleted',
        listingId: req.params.id,
        listingTitle: currentListning.title,
        deletionReason
      });
      //INFO LOG
      logger.info({ listingId, recipientHostId: currentListning.userId }, "Systemvarningsmeddelande för listförstöring skickat till värdprofilen");
    }

    const deletedListning = await deleteListning(req.params.id);

    if (!deletedListning) {
      //ERROR LOG
      logger.error({ listingId, currentUserId }, "Listning saknas eller ändras samtidigt under det slutliga rensningssteget för databasen");
      res.status(404).json({ message: 'Annonsen hittades inte vid borttagning.' });
      return;
    }

    //INFO LOG
    logger.info({ listingId, totalImagesToPurge: deletedListning.images.length }, "Startar raderingsloop för binär fil av bildbilaga");
    await Promise.all(
      deletedListning.images.map(async (image) => {
        const imagePath = path.join(uploadDirectory, image.filename);
         await fs.unlink(imagePath).catch((err) => {
          //WARN LOG
          logger.warn({ filename: image.filename, err: err.message }, "Misslyckades med att rensa den föräldralösa filen från disklayouten under fullständig radering av listan.");
          return undefined;
        });
            }),
    );
    
//INFO LOG
logger.info({ listingId, purgedBy: currentUserId, actorRole: currentUserRole }, "Listning och tillhörande tillgångsfiler har tagits bort helt från ekosystemet");
    res.status(200).json({
      message: 'Annonsen raderades framgångsrikt och åtgärden loggades. Värden har informerats.',
      id: req.params.id
    });
  } catch (error:any) {
    console.error('Fel vid radering av annons:', error);
    //ERROR LOG
    logger.error({ err: error.message, listingId: req.params.id }, 'Fel vid radering av annons');
    res.status(500).json({ message: 'Ett internt fel uppstod vid radering.' });
  }
};
