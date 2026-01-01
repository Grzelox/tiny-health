export const ANIMAL_TYPE_OTHER = "Inne" as const;

export const ANIMAL_TYPE_OPTIONS = [
  "Mysz",
  "Szczur",
  "Myszoskoczek",
  "Fretka",
  "Świnka Morska",
  "Chomik",
  "Szynszyla",
  "Królik",
  "Pies",
  "Kot",
  ANIMAL_TYPE_OTHER,
] as const;

export type AnimalTypeOption = (typeof ANIMAL_TYPE_OPTIONS)[number];
