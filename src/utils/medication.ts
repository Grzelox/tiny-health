import { Medication, Vaccination } from "@/types/pet";

export const isMedicationCurrent = (medication: Medication): boolean => {
  if (!medication.isActive) return false;
  if (medication.endDate && new Date(medication.endDate) < new Date()) return false;
  return true;
};

export type VaccinationDueStatus = "overdue" | "due-soon" | "ok" | "none";

const DUE_SOON_THRESHOLD_DAYS = 30;

export const getVaccinationDueStatus = (vaccination: Vaccination): VaccinationDueStatus => {
  if (!vaccination.nextDueDate) return "none";

  const dueDate = new Date(vaccination.nextDueDate);
  const now = new Date();
  const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "overdue";
  if (diffDays <= DUE_SOON_THRESHOLD_DAYS) return "due-soon";
  return "ok";
};
