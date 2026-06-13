import { useAddVaccination } from "@/hooks/useQueries";
import React, { useState } from "react";

interface AddVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petUuid: string;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({
  isOpen,
  onClose,
  petId,
  petUuid,
}) => {
  const [vaccineName, setVaccineName] = useState("");
  const [administeredDate, setAdministeredDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: addVaccination, isPending } = useAddVaccination();

  const resetForm = () => {
    setVaccineName("");
    setAdministeredDate("");
    setNextDueDate("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!vaccineName || !administeredDate) return;

    addVaccination({
      data: {
        petId,
        petUuid,
        vaccineName,
        administeredDate,
        nextDueDate: nextDueDate || null,
        notes: notes || null,
      },
    });
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slide-up">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Dodaj szczepienie</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa szczepionki"
            value={vaccineName}
            onChange={(e) => setVaccineName(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700">Data podania</label>
              <input
                type="date"
                value={administeredDate}
                onChange={(e) => setAdministeredDate(e.target.value)}
                className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700">
                Następna dawka (opcjonalnie)
              </label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <textarea
            placeholder="Notatki (opcjonalnie)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg">
            Zamknij
          </button>
          <button
            onClick={handleSubmit}
            disabled={!vaccineName || !administeredDate || isPending}
            className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Dodawanie..." : "Dodaj szczepienie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVaccinationModal;
