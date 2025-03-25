import EditPetModal from "@/components/Pet/EditPetModal";
import EditVetVisitModal from "@/components/Pet/EditVetVisitModal";
import AddVetVisitModal from "@/components/VetVisit/AddVetVisitModal";
import { FullPetData, VetVisit } from "@/types/pet";
import React from "react";

interface PetModalsProps {
  petId: number;
  isAddVisitModalOpen: boolean;
  isEditVisitModalOpen: boolean;
  isEditPetModalOpen: boolean;
  currVisit: VetVisit | null;
  vetVisits: VetVisit[];
  petData: FullPetData | null;
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
  vetVisits,
  petData,
  onCloseAddVisitModal,
  onCloseEditVisitModal,
  onCloseEditPetModal,
}) => (
  <>
    <AddVetVisitModal petId={petId} isOpen={isAddVisitModalOpen} onClose={onCloseAddVisitModal} />
    <EditVetVisitModal
      isOpen={isEditVisitModalOpen}
      onClose={onCloseEditVisitModal}
      visits={vetVisits}
      visitId={currVisit?.id ?? 0}
    />
    <EditPetModal isOpen={isEditPetModalOpen} onClose={onCloseEditPetModal} pet={petData} />
  </>
);

export default PetModals;
