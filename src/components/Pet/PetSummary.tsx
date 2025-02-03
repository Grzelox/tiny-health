"use client";

import { PetData, UploadedImage, VetVisit } from "@/types/pet";
import { useState } from "react";

import Gallery from "../Media/Gallery";
import MediaUploader from "../Media/MediaUploader";
import VetVisitList from "../VetVisit/VetVisitList";
import PetInfo from "./PetInfo";

export default function PetSummary({
  petId,
  pet,
  vetVisits,
  images,
}: {
  petId: number;
  pet: PetData;
  vetVisits: VetVisit[];
  images: UploadedImage[];
}) {
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const handleEditClick = () => setIsEditPetModalOpen(true);
  return (
    <div>
      <div>
        <PetInfo petData={pet} />
      </div>
      <div>
        <VetVisitList petId={petId} vetVisits={vetVisits} />
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
