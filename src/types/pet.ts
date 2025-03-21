export interface OwnedPets {
  id: string;
  name: string;
  breed: string;
  updatedAt: string;
  isDead: boolean;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  color: string;
  bornAt: string;
  updatedAt: string;
  weight: number;
  isDead: boolean;
  ownerId: string;
  notes?: string;
}

export interface NewPet {
  name: string;
  breed: string;
  color: string;
  bornAt: string;
  weight: number;
  isDead: boolean;
  notes?: string;
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

export interface PetData {
  id: number;
  name: string;
  breed: string;
  color: string;
  weight: number;
  bornAt: string;
  isDead: boolean;
  ownerId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  uploadedFiles: UploadedImage[];
  vetVisits: VetVisit[];
}
