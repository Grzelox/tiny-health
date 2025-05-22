"use client";

import { FullPetData, UploadedImage, VetVisit } from "@/types/pet";
import { useState } from "react";

import Gallery from "../Media/Gallery";
import MediaUploader from "../Media/MediaUploader";
import VetVisitList from "../VetVisit/VetVisitList";
import PetInfo from "./PetInfo";

interface PetSummaryProps {
  petId: number;
  pet: FullPetData;
  vetVisits: VetVisit[];
  images: UploadedImage[];
  onRefresh: () => Promise<any>;
}

export default function PetSummary({
  petId,
  pet,
  vetVisits,
  images,
  onRefresh,
}: PetSummaryProps) {
  console.log("Pet Summary", pet);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const handleEditClick = () => setIsEditPetModalOpen(true);
  return (
    <div className="container mx-auto px-4 py-8">
      <PetInfo petData={pet} onRefresh={onRefresh} />
      <div>
        <VetVisitList petId={petId} uuid={pet.uuid} vetVisits={vetVisits} />
      </div>
      <div>
        <MediaUploader petId={petId} />
      </div>
      <div>
        <Gallery uploadedFiles={images} />
      </div>
    </div>
  );
}
