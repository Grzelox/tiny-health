import { useDeleteMedication } from "@/hooks/useQueries";
import { Medication } from "@/types/pet";
import { isMedicationCurrent } from "@/utils/medication";
import React, { useState } from "react";

import AddMedicationModal from "./AddMedicationModal";
import EditMedicationModal from "./EditMedicationModal";
import MedicationItem from "./MedicationItem";

interface MedicationListProps {
  petId: number;
  petUuid: string;
  medications: Medication[];
}

export default function MedicationList({ petId, petUuid, medications }: MedicationListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const { mutate: deleteMedication } = useDeleteMedication();

  if (!medications) return null;

  const currentMedications = medications.filter(isMedicationCurrent);
  const pastMedications = medications.filter((medication) => !isMedicationCurrent(medication));

  const handleEditClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleRemoveClick = (medicationId: number) => {
    deleteMedication({ id: medicationId, petUuid });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-800 mb-4">Leki</h2>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        Dodaj lek
      </button>

      {currentMedications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-secondary-700 mb-2 uppercase tracking-wide">
            Aktualnie podawane
          </h3>
          <div className="space-y-4">
            {currentMedications.map((medication) => (
              <MedicationItem
                key={medication.id}
                medication={medication}
                onEdit={() => handleEditClick(medication)}
                onRemove={() => handleRemoveClick(medication.id)}
              />
            ))}
          </div>
        </div>
      )}

      {pastMedications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-secondary-700 mb-2 uppercase tracking-wide">
            Historia
          </h3>
          <div className="space-y-4">
            {pastMedications
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((medication) => (
                <MedicationItem
                  key={medication.id}
                  medication={medication}
                  onEdit={() => handleEditClick(medication)}
                  onRemove={() => handleRemoveClick(medication.id)}
                />
              ))}
          </div>
        </div>
      )}

      {medications.length === 0 && (
        <p className="text-secondary-400 italic">Brak zarejestrowanych leków.</p>
      )}

      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        petId={petId}
        petUuid={petUuid}
      />

      <EditMedicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        medication={selectedMedication}
        petUuid={petUuid}
      />
    </div>
  );
}
