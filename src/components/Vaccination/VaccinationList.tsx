import { useDeleteVaccination } from "@/hooks/useQueries";
import { Vaccination } from "@/types/pet";
import React, { useState } from "react";

import AddVaccinationModal from "./AddVaccinationModal";
import EditVaccinationModal from "./EditVaccinationModal";
import VaccinationItem from "./VaccinationItem";

interface VaccinationListProps {
  petId: number;
  petUuid: string;
  vaccinations: Vaccination[];
}

export default function VaccinationList({ petId, petUuid, vaccinations }: VaccinationListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  const { mutate: deleteVaccination } = useDeleteVaccination();

  if (!vaccinations) return null;

  const handleEditClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsEditModalOpen(true);
  };

  const handleRemoveClick = (vaccinationId: number) => {
    deleteVaccination({ id: vaccinationId, petUuid });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-800 mb-4">Szczepienia</h2>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        Dodaj szczepienie
      </button>

      {vaccinations.length === 0 ? (
        <p className="text-secondary-400 italic">Brak zarejestrowanych szczepień.</p>
      ) : (
        <div className="space-y-4">
          {vaccinations
            .sort(
              (a, b) =>
                new Date(b.administeredDate).getTime() - new Date(a.administeredDate).getTime(),
            )
            .map((vaccination) => (
              <VaccinationItem
                key={vaccination.id}
                vaccination={vaccination}
                onEdit={() => handleEditClick(vaccination)}
                onRemove={() => handleRemoveClick(vaccination.id)}
              />
            ))}
        </div>
      )}

      <AddVaccinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        petId={petId}
        petUuid={petUuid}
      />

      <EditVaccinationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vaccination={selectedVaccination}
        petUuid={petUuid}
      />
    </div>
  );
}
