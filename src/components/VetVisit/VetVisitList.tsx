// src/components/VetVisitList.tsx
import {
  useAddVetVisit,
  useDeleteVetVisit,
  useEditVetVisit,
} from "@/hooks/useQueries";
import { VetVisit } from "@/types/pet";
import React from "react";

import VetVisitItem from "./VetVisitItem";

interface VetVisitListProps {
  petId: number;
  vetVisits: VetVisit[];
}

export default function VetVisitList({ petId, vetVisits }: VetVisitListProps) {
  if (!vetVisits) return null;

  const { mutate: addVetVisit } = useAddVetVisit();
  const { mutate: editVetVisit } = useEditVetVisit();
  const { mutate: deleteVetVisit } = useDeleteVetVisit();
  const handleAddVisitClick = () => {
    addVetVisit({
      petId: petId,
      description: "",
      date: new Date(),
      medication: "",
    });
  };
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-800 mb-4">
        Historia wizyt
      </h2>
      <button
        onClick={handleAddVisitClick}
        className="mb-4 bg-primary-600 text-white py-2 px-4 rounded"
      >
        Dodaj nową wizytę
      </button>
      <div className="space-y-4">
        {vetVisits
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((visit, index) => (
            <VetVisitItem
              key={index}
              visit={visit}
              onEdit={() => editVetVisit(visit)}
              onRemove={() => deleteVetVisit(visit.id)}
            />
          ))}
      </div>
    </div>
  );
}
