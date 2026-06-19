"use client";

import { useAddVaccination, useEditVaccination } from "@/hooks/useQueries";
import { Vaccination } from "@/types/pet";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface VaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petUuid: string;
  vaccination?: Vaccination | null;
}

const toDateInput = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const VaccinationModal: React.FC<VaccinationModalProps> = ({
  isOpen,
  onClose,
  petId,
  petUuid,
  vaccination,
}) => {
  const t = useTranslations("VaccinationModal");
  const isEdit = Boolean(vaccination);

  const [name, setName] = useState("");
  const [administeredDate, setAdministeredDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: addVaccination } = useAddVaccination();
  const { mutate: editVaccination } = useEditVaccination();

  useEffect(() => {
    setName(vaccination?.name ?? "");
    setAdministeredDate(toDateInput(vaccination?.administeredDate));
    setNextDueDate(toDateInput(vaccination?.nextDueDate));
    setNotes(vaccination?.notes ?? "");
  }, [vaccination, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !administeredDate) return;

    const payload = {
      petId,
      petUuid,
      name: name.trim(),
      administeredDate,
      nextDueDate: nextDueDate || null,
      notes,
    };

    if (isEdit && vaccination) {
      editVaccination({ data: { ...payload, id: vaccination.id } });
    } else {
      addVaccination({ data: payload });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slide-up max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          {isEdit ? t("editTitle") : t("addTitle")}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm text-secondary-600">
              {t("administeredDateLabel")}
              <input
                type="date"
                value={administeredDate}
                onChange={(e) => setAdministeredDate(e.target.value)}
                className="mt-1 w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </label>
            <label className="text-sm text-secondary-600">
              {t("nextDueDateLabel")}
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="mt-1 w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </label>
          </div>
          <textarea
            placeholder={t("notesPlaceholder")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={2}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg">
            {t("close")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !administeredDate}
            className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationModal;
