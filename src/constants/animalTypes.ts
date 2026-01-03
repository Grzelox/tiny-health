export const ANIMAL_TYPE_OTHER = "Inne" as const;

export const ANIMAL_TYPE_RODENT_OPTIONS = [
  "Mysz",
  "Szczur",
  "Myszoskoczek",
  "Świnka Morska",
  "Chomik",
  "Szynszyla",
] as const;

export const ANIMAL_TYPE_OTHER_GROUP_OPTIONS = ["Pies", "Kot", "Królik", ANIMAL_TYPE_OTHER] as const;

export const ANIMAL_TYPE_OPTIONS = [
  ...ANIMAL_TYPE_RODENT_OPTIONS,
  ...ANIMAL_TYPE_OTHER_GROUP_OPTIONS,
] as const;

export type AnimalTypeOption = (typeof ANIMAL_TYPE_OPTIONS)[number];
