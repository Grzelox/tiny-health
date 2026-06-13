// Stored in DB as a free-form string.
// UI components may offer presets, but custom values are allowed.
export type AnimalType = string;

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
  name: string;
  breed: string;
  animalType: AnimalType;
  color: string;
  bornAt: string;
  updatedAt: string;
  weight: number | null;
  isDead: boolean;
  deathDate?: string;
  ownerId: string;
  notes?: string;
}

export interface FullPetData {
  id: number;
  uuid: string;
  name: string;
  breed: string;
  animalType: AnimalType;
  color: string;
  weight: number | null;
  bornAt: string;
  isDead: boolean;
  deathDate?: string;
  ownerId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  uploadedFiles: UploadedImage[];
  vetVisits: VetVisit[];
  medications: Medication[];
  vaccinations: Vaccination[];
}

export interface PetWithShared extends FullPetData {
  isShared: boolean;
}

export interface VetVisit {
  id: number;
  petId: number;
  petUuid: string;
  date: Date;
  description: string;
  medication: string;
}

export interface Medication {
  id: number;
  petId: number;
  petUuid?: string;
  vetVisitId?: number | null;
  name: string;
  dosage: string;
  frequency: string;
  route?: string | null;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  notes?: string | null;
}

export interface Vaccination {
  id: number;
  petId: number;
  petUuid?: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate?: string | null;
  notes?: string | null;
}

export interface UploadedImage {
  id: string;
  url: string;
  createdAt: string;
}

export interface WeightRecord {
  id: number;
  petId: number;
  weight: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}
