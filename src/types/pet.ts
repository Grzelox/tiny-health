export interface Pet {
  id: number;
  name: string;
  breed: string;
  lastCheckup: string;
}

export interface Visit {
  date: string;
  type: string;
  notes: string;
  medications: string[];
}

export interface PetDetails extends Pet {
  birthDate: string;
  weight: string;
  visits: Visit[];
}