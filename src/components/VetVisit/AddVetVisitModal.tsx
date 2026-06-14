"use client";

import { useAddVetVisit } from "@/hooks/useQueries";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface AddVetVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petUuid: string;
}

const AddVetVisitModal: React.FC<AddVetVisitModalProps> = ({ isOpen, onClose, petId, petUuid }) => {
  const [description, setDescription] = useState("");
  const [medication, setMedication] = useState("");
  const [date, setDate] = useState("");

  const t = useTranslations("AddVetVisitModal");

  const { mutate: addVetVisit } = useAddVetVisit();

  const handleSubmit = () => {
    const newVisit = {
      petId,
      petUuid,
      description,
      medication,
      date: new Date(date),
    };
    addVetVisit({ data: newVisit });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slide-up">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">{t("title")}</h2>
        <div className="space-y-4">
          <textarea
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={5}
          />
          <textarea
            placeholder={t("medicationPlaceholder")}
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={2}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg">
            {t("close")}
          </button>
          <button onClick={handleSubmit} className="btn-primary px-4 py-2 rounded-lg">
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVetVisitModal;
