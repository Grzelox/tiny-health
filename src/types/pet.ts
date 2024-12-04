export interface Pet {
  id: string;
  name: string;
  breed: string;
  color: string;
  birthDate: string;
  updatedAt: string;
  weight: number;
  isDead: boolean;
}

export interface VetVisit {
  id: number;
  petId: number;
  date: Date;
  description: string;
  medication: string;
}
