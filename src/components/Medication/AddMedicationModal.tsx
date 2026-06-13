import { useAddMedication } from "@/hooks/useQueries";
import React, { useState } from "react";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petUuid: string;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  petId,
  petUuid,
}) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [route, setRoute] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: addMedication, isPending } = useAddMedication();

  const resetForm = () => {
    setName("");
    setDosage("");
    setFrequency("");
    setRoute("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!name || !dosage || !frequency || !startDate) return;

    addMedication({
      data: {
        petId,
        petUuid,
        name,
        dosage,
        frequency,
        route: route || null,
        startDate,
        endDate: endDate || null,
        isActive: true,
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
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Dodaj lek</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa leku"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Dawka (np. 5 mg)"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="text"
              placeholder="Częstotliwość (np. 2x dziennie)"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <input
            type="text"
            placeholder="Sposób podania (opcjonalnie, np. doustnie)"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700">Data rozpoczęcia</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700">
                Data zakończenia (opcjonalnie)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            disabled={!name || !dosage || !frequency || !startDate || isPending}
            className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Dodawanie..." : "Dodaj lek"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationModal;
