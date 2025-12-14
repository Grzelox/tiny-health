import { useEditVetVisit } from "@/hooks/useQueries";
import { VetVisit } from "@/types/pet";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface EditVetVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visits: VetVisit[];
  visitId: number;
  petUuid: string;
}

const EditVetVisitModal: React.FC<EditVetVisitModalProps> = ({
  isOpen,
  onClose,
  visits,
  visitId,
  petUuid,
}) => {
  const visit = visits.find((v) => v.id === visitId);

  const [description, setDescription] = useState("");
  const [medication, setMedication] = useState("");
  const [date, setDate] = useState("");

  const { mutate: editVetVisit } = useEditVetVisit();

  useEffect(() => {
    if (visit) {
      setDescription(visit.description || "");
      setMedication(visit.medication || "");
      setDate(format(visit.date, "yyyy-MM-dd"));
    }
  }, [visit]);

  const handleSubmit = async () => {
    const updatedVisit: VetVisit = {
      id: visitId,
      petId: visit?.petId || 0,
      petUuid: petUuid,
      description: description,
      medication: medication,
      date: new Date(date),
    };
    editVetVisit({ data: updatedVisit });
    onClose();
  };

  if (!isOpen || !visit) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 relative animate-slide-up">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Edytuj wizytę</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={5}
          />
          <textarea
            placeholder="Leki"
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
            Zamknij
          </button>
          <button onClick={handleSubmit} className="btn-primary px-4 py-2 rounded-lg">
            Edytuj wizytę
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVetVisitModal;
