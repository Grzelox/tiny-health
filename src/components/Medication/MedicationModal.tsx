"use client";

import { useAddMedication, useEditMedication } from "@/hooks/useQueries";
import { Medication } from "@/types/pet";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petUuid: string;
  medication?: Medication | null;
}

const toDateInput = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  petId,
  petUuid,
  medication,
}) => {
  const t = useTranslations("MedicationModal");
  const isEdit = Boolean(medication);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [route, setRoute] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: addMedication } = useAddMedication();
  const { mutate: editMedication } = useEditMedication();

  useEffect(() => {
    setName(medication?.name ?? "");
    setDosage(medication?.dosage ?? "");
    setFrequency(medication?.frequency ?? "");
    setRoute(medication?.route ?? "");
    setStartDate(toDateInput(medication?.startDate));
    setEndDate(toDateInput(medication?.endDate));
    setNotes(medication?.notes ?? "");
  }, [medication, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !startDate) return;

    const payload = {
      petId,
      petUuid,
      name: name.trim(),
      dosage,
      frequency,
      route,
      startDate,
      endDate: endDate || null,
      notes,
    };

    if (isEdit && medication) {
      editMedication({ data: { ...payload, id: medication.id } });
    } else {
      addMedication({ data: payload });
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
            <input
              type="text"
              placeholder={t("dosagePlaceholder")}
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="text"
              placeholder={t("frequencyPlaceholder")}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <input
            type="text"
            placeholder={t("routePlaceholder")}
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm text-secondary-600">
              {t("startDateLabel")}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </label>
            <label className="text-sm text-secondary-600">
              {t("endDateLabel")}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            disabled={!name.trim() || !startDate}
            className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
