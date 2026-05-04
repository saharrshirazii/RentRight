// Logik för att skapa annonser och hämta annonser
import fs from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';
import { createListning, deleteListning, getListnings, updateListning } from '../data/listnings';
import { uploadDirectory } from '../config/upload';
import { ListingImage } from '../types';

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

export const listListnings = (_req: Request, res: Response) => {
  res.json(getListnings());
};

export const addListning = (req: Request, res: Response) => {
  const { title, description, price } = req.body;
  const numericPrice = Number(price);

  if (!title || !description || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    res.status(400).json({
      message: 'Titel, beskrivning och ett pris större än 0 krävs.',
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

  const listning = createListning({
    title: String(title).trim(),
    description: String(description).trim(),
    price: numericPrice,
    amenities: parseAmenities(req.body.amenities),
    images,
  });

  res.status(201).json(listning);
};

export const editListning = async (req: Request, res: Response) => {
  const { title, description, price } = req.body;
  const numericPrice = Number(price);

  if (!title || !description || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    res.status(400).json({
      message: 'Titel, beskrivning och ett pris större än 0 krävs.',
    });
    return;
  }

  const currentListning = getListnings().find((listning) => listning.id === req.params.id);
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

  const shouldReplaceImages = req.body.replaceImages === 'true';
  const images = shouldReplaceImages && uploadedImages.length > 0
    ? uploadedImages
    : currentListning.images;

  if (shouldReplaceImages && uploadedImages.length > 0) {
    await Promise.all(
      currentListning.images.map(async (image) => {
        const imagePath = path.join(uploadDirectory, image.filename);
        await fs.unlink(imagePath).catch(() => undefined);
      }),
    );
  }

  const updatedListning = updateListning(req.params.id, {
    title: String(title).trim(),
    description: String(description).trim(),
    price: numericPrice,
    amenities: parseAmenities(req.body.amenities),
    images,
  });

  res.json(updatedListning);
};

export const removeListning = async (req: Request, res: Response) => {
  const deletedListning = deleteListning(req.params.id);

  if (!deletedListning) {
    res.status(404).json({ message: 'Annonsen hittades inte.' });
    return;
  }

  await Promise.all(
    deletedListning.images.map(async (image) => {
      const imagePath = path.join(uploadDirectory, image.filename);
      await fs.unlink(imagePath).catch(() => undefined);
    }),
  );

  res.status(204).send();
};
