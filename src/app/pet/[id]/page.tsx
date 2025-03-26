"use client";

import PetSummary from "@/components/Pet/PetSummary";
import { usePet } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import { useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { SyncLoader } from "react-spinners";

export default function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const queryClient = useQueryClient();

  const { data: petQueryData = null, isLoading, error, refetch } = usePet(resolvedParams.id);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["pet", resolvedParams.id] });
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

  const petData = petQueryData as FullPetData;
  const vetVisits = petData?.vetVisits ?? [];
  const images = petData?.uploadedFiles ?? [];
  const petId = petData?.id ?? 0;

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
