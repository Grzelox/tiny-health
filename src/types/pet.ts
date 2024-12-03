export interface Pet {
  id: number;
  name: string;
  breed: string;
  color: string;
  birthDate: string;
  weight: number;
}

export interface VetVisit {
  id: number;
  petId: number;
  date: Date;
  description: string;
  medication: string;
}