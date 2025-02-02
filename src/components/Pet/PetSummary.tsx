import { PetData, UploadedImage, VetVisit } from "@/types/pet";
import { useState } from "react";

import MediaUploader from "../Media/MediaUploader";
import VetVisitList from "../VetVisit/VetVisitList";
import PetInfo from "./PetInfo";
import Gallery from "../Media/Gallery";

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
  console.log("petSummary", pet);
  return (
    <div>
      <div>
        <PetInfo petData={pet} onEditClick={handleEditClick} />
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
