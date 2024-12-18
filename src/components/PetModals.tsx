// src/components/PetModals.tsx
import React from 'react';
import AddVetVisitModal from '@/components/AddVetVisitModal';
import EditVetVisitModal from '@/components/EditVetVisitModal';
import EditPetModal from '@/components/EditPetModal';
import { Pet, VetVisit } from '@/types/pet';

interface PetModalsProps {
  petId: number;
  isAddVisitModalOpen: boolean;
  isEditVisitModalOpen: boolean;
  isEditPetModalOpen: boolean;
  currVisit: VetVisit | null;
  petData: Pet | null;
  onCloseAddVisitModal: () => void;
  onCloseEditVisitModal: () => void;
  onCloseEditPetModal: () => void;
}

const PetModals: React.FC<PetModalsProps> = ({
  petId,
  isAddVisitModalOpen,
  isEditVisitModalOpen,
  isEditPetModalOpen,
  currVisit,
  petData,
  onCloseAddVisitModal,
  onCloseEditVisitModal,
  onCloseEditPetModal,
}) => (
  <>
    <AddVetVisitModal
      petId={petId}
      isOpen={isAddVisitModalOpen}
      onClose={onCloseAddVisitModal}
    />
    <EditVetVisitModal
      isOpen={isEditVisitModalOpen}
      onClose={onCloseEditVisitModal}
      visits={vetVisits}
      visitId={currVisit?.id ?? 0}
    />
    <EditPetModal
      isOpen={isEditPetModalOpen}
      onClose={onCloseEditPetModal}
      pet={petData}
    />
  </>
);

export default PetModals;