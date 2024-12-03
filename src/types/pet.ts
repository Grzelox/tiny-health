export interface Pet {
  id: number;
  name: string;
  breed: string;
  lastCheckup: string;
}

export interface VetVisit {
  id: number;
  petId: number;
  date: Date;
  description: string;
  medication: string;
}