"use client";

import PetSummary from "@/components/Pet/PetSummary";
import { usePetData } from "@/hooks/useQueries";
import { PetData } from "@/types/pet";
import { useQueryClient } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const { data: petQueryData = null, isLoading, error, refetch } = usePetData(params.id);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["pet", params.id] });
    return refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <SyncLoader color="#3b82f6" size={15} margin={8} />
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
      onRefresh={handleRefresh}
    />
  );
}
