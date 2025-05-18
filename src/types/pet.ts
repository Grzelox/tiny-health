export type AnimalType =
  | "Mysz"
  | "Szczur"
  | "Myszoskoczek"
  | "Fretka"
  | "Świnka Morska"
  | "Chomik"
  | "Szynszyla"
  | "Królik";

export interface Pets {
  id: string;
  name: string;
  breed: string;
  animalType: AnimalType;
  updatedAt: string;
  isDead: boolean;
  deathDate?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  animalType: AnimalType;
  color: string;
  bornAt: string;
  updatedAt: string;
  weight: number;
  isDead: boolean;
  deathDate?: string;
  ownerId: string;
  notes?: string;
}

export interface FullPetData {
  id: number;
  name: string;
  breed: string;
  animalType: AnimalType;
  color: string;
  weight: number;
  bornAt: string;
  isDead: boolean;
  deathDate?: string;
  ownerId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  uploadedFiles: UploadedImage[];
  vetVisits: VetVisit[];
}

export interface PetWithShared extends FullPetData {
  isShared: boolean;
}

export interface VetVisit {
  id: number;
  petId: number;
  date: Date;
  description: string;
  medication: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  createdAt: string;
}

export interface WeightRecord {
  id: string;
  petId: number;
  weight: number;
}
