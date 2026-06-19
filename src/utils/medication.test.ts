import { isMedicationActive, isVaccinationDue } from "./medication";

describe("isMedicationActive", () => {
  const now = new Date("2026-06-19T12:00:00Z");

  it("is active when started and has no end date (ongoing)", () => {
    expect(isMedicationActive({ startDate: "2026-06-01", endDate: null }, now)).toBe(true);
  });

  it("is active when end date is today or in the future", () => {
    expect(isMedicationActive({ startDate: "2026-06-01", endDate: "2026-06-19" }, now)).toBe(true);
    expect(isMedicationActive({ startDate: "2026-06-01", endDate: "2026-06-25" }, now)).toBe(true);
  });

  it("is inactive when the end date has passed", () => {
    expect(isMedicationActive({ startDate: "2026-05-01", endDate: "2026-06-10" }, now)).toBe(false);
  });

  it("is inactive when it has not started yet", () => {
    expect(isMedicationActive({ startDate: "2026-07-01", endDate: null }, now)).toBe(false);
  });
});

describe("isVaccinationDue", () => {
  const now = new Date("2026-06-19T12:00:00Z");

  it("is not due without a next-due date", () => {
    expect(isVaccinationDue({ nextDueDate: null }, now)).toBe(false);
  });

  it("is due when next-due date is today or in the past", () => {
    expect(isVaccinationDue({ nextDueDate: "2026-06-19" }, now)).toBe(true);
    expect(isVaccinationDue({ nextDueDate: "2026-05-01" }, now)).toBe(true);
  });

  it("is not due when next-due date is in the future", () => {
    expect(isVaccinationDue({ nextDueDate: "2026-07-01" }, now)).toBe(false);
  });
});
