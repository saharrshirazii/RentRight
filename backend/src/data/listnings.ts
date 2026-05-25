import { Listning, ListingImage } from '../types';
import ListningModel, { IListning } from '../models/Listning';
import mongoose from 'mongoose';

type CreateListningInput = {
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
};

type UpdateListningInput = Partial<CreateListningInput>;

const toListning = (listning: IListning): Listning => ({
  id: listning._id.toString(),
  title: listning.title,
  description: listning.description,
  price: listning.price,
  amenities: listning.amenities,
  images: listning.images,
  createdAt: listning.createdAt.toISOString(),
});

export const getListnings = async () => {
  const listnings = await ListningModel.find().sort({ createdAt: -1 });
  return listnings.map(toListning);
};

export const createListning = async (input: CreateListningInput) => {
  const listning = await ListningModel.create(input);
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
