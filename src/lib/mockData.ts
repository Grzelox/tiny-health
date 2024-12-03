import { PetDetails } from '@/types/pet';

export const mockPets = [
  { id: 1, name: 'Whiskers', breed: 'Fancy Mouse', lastCheckup: '2024-02-15' },
  { id: 2, name: 'Pip', breed: 'Field Mouse', lastCheckup: '2024-02-20' },
  { id: 3, name: 'Luna', breed: 'House Mouse', lastCheckup: '2024-02-25' },
];

export const mockPetDetails: PetDetails = {
  id: 1,
  name: 'Whiskers',
  breed: 'Fancy Mouse',
  lastCheckup: '2024-02-15',
  birthDate: '2023-06-15',
  weight: '28g',
  visits: [
    {
      date: '2024-02-15',
      type: 'Regular Checkup',
      notes: 'All vitals normal, weight stable',
      medications: ['Vitamin supplement']
    },
    {
      date: '2024-01-15',
      type: 'Vaccination',
      notes: 'Annual vaccination completed',
      medications: []
    }
  ]
};