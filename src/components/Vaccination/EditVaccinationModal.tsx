import { useEditVaccination } from "@/hooks/useQueries";
import { Vaccination } from "@/types/pet";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface EditVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaccination: Vaccination | null;
  petUuid: string;
}

const EditVaccinationModal: React.FC<EditVaccinationModalProps> = ({
  isOpen,
  onClose,
  vaccination,
  petUuid,
}) => {
  const [vaccineName, setVaccineName] = useState("");
  const [administeredDate, setAdministeredDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: editVaccination, isPending } = useEditVaccination();

  useEffect(() => {
    if (vaccination) {
      setVaccineName(vaccination.vaccineName);
      setAdministeredDate(format(new Date(vaccination.administeredDate), "yyyy-MM-dd"));
      setNextDueDate(
        vaccination.nextDueDate ? format(new Date(vaccination.nextDueDate), "yyyy-MM-dd") : "",
      );
      setNotes(vaccination.notes || "");
    }
  }, [vaccination]);

  const handleSubmit = () => {
    if (!vaccination || !vaccineName || !administeredDate) return;

    editVaccination({
      data: {
        ...vaccination,
        petUuid,
        vaccineName,
        administeredDate,
        nextDueDate: nextDueDate || null,
        notes: notes || null,
      },
    });
    onClose();
  };

  if (!isOpen || !vaccination) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slide-up">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Edytuj szczepienie</h2>
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
            {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVaccinationModal;
