import { Listning, ListingImage } from '../types';
import ListningModel, { IListning } from '../models/Listning';
import mongoose from 'mongoose';

type AvailabilityRange = {
  startDate: string;
  endDate: string;
};

type CreateListningInput = {
  userId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: ListingImage[];
  propertyType?: 'Lägenhet' | 'Radhus' | 'Studio' | 'Stuga' | 'Villa';
  availability?: AvailabilityRange[];
  status?: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  adminFeedback?: string;
};

type UpdateListningInput = Partial<CreateListningInput>;

const toListning = (listning: IListning): Listning => ({
  id: listning._id.toString(),
  userId: listning.userId?.toString() || '',
  title: listning.title,
  description: listning.description,
  location: listning.location || 'Sverige',
  price: listning.price,
  guests: listning.guests || 1,
  bedrooms: listning.bedrooms ?? 0,
  bathrooms: listning.bathrooms ?? 0,
  amenities: listning.amenities,
  images: listning.images,
  propertyType: listning.propertyType ?? 'Lägenhet',
  availability: listning.availability?.map((range) => ({
    startDate: range.startDate.toISOString(),
    endDate: range.endDate.toISOString(),
  })) ?? [],
  status: listning.status,
  adminFeedback: listning.adminFeedback,
  createdAt: listning.createdAt.toISOString(),
});

export const getListnings = async () => {
  const listnings = await ListningModel.find().sort({ createdAt: -1 });
  return listnings.map(toListning);
};

export const getApprovedListnings = async (propertyType?: 'Lägenhet' | 'Radhus' | 'Studio' | 'Stuga' | 'Villa') => {
  const filter: any = { status: 'approved' };
  if (propertyType) {
    if (propertyType === 'Lägenhet') {
      filter.$or = [{ propertyType: 'Lägenhet' }, { propertyType: { $exists: false } }];
    } else {
      filter.propertyType = propertyType;
    }
  }

  const listnings = await ListningModel.find(filter).sort({ createdAt: -1 });
  return listnings.map(toListning);
};

export const createListning = async (input: CreateListningInput) => {
  const listning = await ListningModel.create({
    userId: input.userId as any,
    title: input.title,
    description: input.description,
    location: input.location,
    price: input.price,
    guests: input.guests,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    amenities: input.amenities,
    images: input.images,
    propertyType: input.propertyType ?? 'Lägenhet',
    availability: input.availability ?? [],
    status: input.status,
    adminFeedback: input.adminFeedback,
  });
  return toListning(listning);
};

export const findListning = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const listning = await ListningModel.findById(id);
  return listning ? toListning(listning) : null;
};

export const updateListning = async (id: string, input: UpdateListningInput) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const listning = await ListningModel.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  return listning ? toListning(listning) : null;
};

export const deleteListning = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const listning = await ListningModel.findByIdAndDelete(id);
  return listning ? toListning(listning) : null;
};
