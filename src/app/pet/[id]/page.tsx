"use client";

import PetSummary from "@/components/Pet/PetSummary";
import { usePetData } from "@/hooks/useQueries";
import { PetData, UploadedImage, VetVisit } from "@/types/pet";

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const { data: petQueryData = null, isLoading, error } = usePetData(params.id);
  console.log("petQueryData", petQueryData);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-blue-500 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-red-400 text-lg">Error loading pets</span>
      </div>
    );
  }

  const petData = petQueryData as PetData;
  const vetVisits = petData.vetVisits;
  const images = petData.uploadedFiles;
  const petId = petData.id;

  return (
    <PetSummary
      petId={petId}
      pet={petData}
      vetVisits={vetVisits}
      images={images}
    />
  );
}
