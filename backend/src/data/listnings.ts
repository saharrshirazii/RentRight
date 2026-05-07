import { Listning, ListingImage } from '../types';

type CreateListningInput = {
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
};

type UpdateListningInput = Partial<CreateListningInput>;

const listnings: Listning[] = [
  {
    id: 'seed-1',
    title: 'Mysig lägenhet i centrum',
    description:
      'Ljus och rymlig lägenhet i hjärtat av stan med balkong och nära till kollektivtrafik.',
    price: 1450,
    amenities: ['Wifi', 'Kök', 'Tvättmaskin'],
    images: [],
    createdAt: new Date().toISOString(),
  },
];

export const getListnings = () => listnings;

export const createListning = (input: CreateListningInput) => {
  const listning: Listning = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...input,
    createdAt: new Date().toISOString(),
  };

  listnings.unshift(listning);
  return listning;
};

export const updateListning = (id: string, input: UpdateListningInput) => {
  const listningIndex = listnings.findIndex((listning) => listning.id === id);

  if (listningIndex === -1) {
    return null;
  }

  listnings[listningIndex] = {
    ...listnings[listningIndex],
    ...input,
  };

  return listnings[listningIndex];
};

export const deleteListning = (id: string) => {
  const listningIndex = listnings.findIndex((listning) => listning.id === id);

  if (listningIndex === -1) {
    return null;
  }

  const [deletedListning] = listnings.splice(listningIndex, 1);
  return deletedListning;
};
