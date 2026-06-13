// Logik för att skapa annonser och hämta annonser
import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
import { createListning, deleteListning, findListning, getListnings, updateListning } from '../data/listnings';
import { uploadDirectory } from '../config/upload';
import { ListingImage } from '../types';
import {logger} from './../logger/logger'


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

export const addListning = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const numericPrice = Number(price);

    //INFO LOG
    logger.info({ title, price: numericPrice }, "Initierar processen för att skapa listning");
    if (!title || !description || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      //WARN LOG
      logger.warn({ title, price: req.body.price }, "Skapandet av listning avvisades - Ogiltiga inmatningsparametrar");
      res.status(400).json({
        message: 'Titel, beskrivning och ett pris större än 0 krävs.',
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
      title: String(title).trim(),
      description: String(description).trim(),
      price: numericPrice,
      amenities: parseAmenities(req.body.amenities),
      images,
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
    const { title, description, price } = req.body;
    const numericPrice = Number(price);

    //INFO LOG
    logger.info({ listingId, title }, "Initierar transaktion för ändring av listning");
    if (!title || !description || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      //ERROR LOG
      logger.warn({ listingId, title, price: req.body.price }, "Uppdatering av annons avvisad – Validering misslyckades");
      res.status(400).json({
        message: 'Titel, beskrivning och ett pris större än 0 krävs.',
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

    const updatedListning = await updateListning(req.params.id, {
      title: String(title).trim(),
      description: String(description).trim(),
      price: numericPrice,
      amenities: parseAmenities(req.body.amenities),
      images,
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

export const removeListning = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;
    //INFO LOG
    logger.info({ listingId }, "Behandlar begäran om permanent borttagning av listning");
    const deletedListning = await deleteListning(req.params.id);

    if (!deletedListning) {
      //WARN LOG
      logger.warn({ listingId }, "Borttagningsmål avvisat – listan hittades inte");
      res.status(404).json({ message: 'Annonsen hittades inte.' });
      return;
    }

    // Ta bort bilderna från disk (hårddisken)
    //INFO LOG
    logger.info({ listingId, assetImagesCount: deletedListning.images.length }, "Rensa avbildningsresurser från diskinfrastruktur");
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

    // raderar rätt kort på frontenden
    //INFO LOG
    logger.info({ listingId }, "Listningsposten har helt raderats från ekosystemet");
    res.status(200).json({ 
      message: 'Annonsen raderades framgångsrikt.', 
      id: req.params.id 
    });
  } catch (error:any) {
    console.error('Fel vid radering av annons:', error);
    //ERROR LOG
    logger.error({ err: error.message, listingId: req.params.id }, 'Fel vid radering av annons');
    res.status(500).json({ message: 'Ett internt fel uppstod vid radering.' });
  }
};