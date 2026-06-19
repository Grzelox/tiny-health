import { Medication, Vaccination } from "@/types/pet";

/**
 * A medication is considered "active" (currently being administered) when it has
 * already started and either has no end date (ongoing) or the end date is still
 * in the future. Comparison is date-based to avoid time-of-day edge cases.
 */
export function isMedicationActive(
  medication: Pick<Medication, "startDate" | "endDate">,
  now: Date = new Date(),
): boolean {
  const today = stripTime(now);
  const start = medication.startDate ? stripTime(new Date(medication.startDate)) : null;
  if (!start || start.getTime() > today.getTime()) return false;
  if (!medication.endDate) return true;
  const end = stripTime(new Date(medication.endDate));
  return end.getTime() >= today.getTime();
}

/**
 * Whether a vaccination's booster / next dose is due (next-due date is today or
 * in the past).
 */
export function isVaccinationDue(
  vaccination: Pick<Vaccination, "nextDueDate">,
  now: Date = new Date(),
): boolean {
  if (!vaccination.nextDueDate) return false;
  const today = stripTime(now);
  const due = stripTime(new Date(vaccination.nextDueDate));
  return due.getTime() <= today.getTime();
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
