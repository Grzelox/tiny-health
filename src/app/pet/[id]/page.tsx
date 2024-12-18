// src/app/pet/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { usePetData } from '@/hooks/usePetData';
import PetInfo from '@/components/PetInfo';
import VetVisitList from '@/components/VetVisitList';
import PetModals from '@/components/PetModals';
import Gallery from '@/components/Gallery';

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const { petData, vetVisits, images, updateVisits } = usePetData(params.id);
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [currVisit, setCurrVisit] = useState<VetVisit | null>(null);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);

  const handleEditClick = () => setIsEditPetModalOpen(true);
  const handleCloseAddVisitModal = () => {
    setIsAddVisitModalOpen(false);
    updateVisits();
  };
  const handleAddVisitClick = () => setIsAddVisitModalOpen(true);
  const handleCloseEditVisitModal = () => {
    setIsEditVisitModalOpen(false);
    updateVisits();
  };
  const handleCloseEditPetModal = () => {
    setIsEditPetModalOpen(false);
    updateVisits();
  };
  const handleEditVisit = (index: number) => {
    setCurrVisit(vetVisits[index]);
    setIsEditVisitModalOpen(true);
    updateVisits();
  };
  const handleRemoveVisit = async (index: number) => {
    try {
      await fetch('/api/deleteVetVisit', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vetVisits[index].id }),
      });
    } catch (error) {
      console.error('Error deleting vet visit:', error);
    }
    updateVisits();
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      {petData && (
        <>
          <PetInfo petData={petData} onEditClick={handleEditClick} />
          <VetVisitList
            vetVisits={vetVisits}
            onEditVisit={handleEditVisit}
            onRemoveVisit={handleRemoveVisit}
            onAddVisitClick={handleAddVisitClick}
          />
        </>
      )}
      <PetModals
        petId={parseInt(params.id)}
        isAddVisitModalOpen={isAddVisitModalOpen}
        isEditVisitModalOpen={isEditVisitModalOpen}
        isEditPetModalOpen={isEditPetModalOpen}
        currVisit={currVisit}
        petData={petData}
        onCloseAddVisitModal={handleCloseAddVisitModal}
        onCloseEditVisitModal={handleCloseEditVisitModal}
        onCloseEditPetModal={handleCloseEditPetModal}
      />
      <Gallery petId={parseInt(params.id)} images={images} />
    </div>
  );
}