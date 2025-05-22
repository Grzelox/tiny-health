import { useDeleteVetVisit } from "@/hooks/useQueries";
import { VetVisit } from "@/types/pet";
import React, { useState } from "react";

import EditVetVisitModal from "../Pet/EditVetVisitModal";
import AddVetVisitModal from "./AddVetVisitModal";
import VetVisitItem from "./VetVisitItem";

interface VetVisitListProps {
  petId: number;
  uuid: string;
  vetVisits: VetVisit[];
}

export default function VetVisitList({ petId, uuid, vetVisits }: VetVisitListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VetVisit | null>(null);
  console.log("Vet Visit List", uuid);
  const { mutate: deleteVetVisit } = useDeleteVetVisit();

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (visit: VetVisit) => {
    setSelectedVisit(visit);
    setIsEditModalOpen(true);
  };

  const handleRemoveClick = (visitId: number) => {
    deleteVetVisit({ petId: petId, uuid: uuid, visitId: visitId });
  };

  if (!vetVisits) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-800 mb-4">Historia wizyt</h2>
      <button onClick={handleAddClick} className="mb-4 bg-primary-600 text-white py-2 px-4 rounded">
        Dodaj nową wizytę
      </button>
      <div className="space-y-4">
        {vetVisits
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((visit) => (
            <VetVisitItem
              key={visit.id}
              visit={visit}
              onEdit={() => handleEditClick(visit)}
              onRemove={() => handleRemoveClick(visit.id)}
            />
          ))}
      </div>

      <AddVetVisitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        petId={petId}
        uuid={uuid}
      />

      <EditVetVisitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        visits={vetVisits}
        visitId={selectedVisit?.id ?? 0}
        uuid={uuid}
      />
    </div>
  );
}
