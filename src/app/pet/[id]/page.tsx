"use client";

import LoadingSpinner from "@/components/Animations/LoadingSpinner";
import PetSummary from "@/components/Pet/PetSummary";
import { usePet } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import { useQueryClient } from "@tanstack/react-query";
import { use } from "react";

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
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <span className="text-red-600 text-lg font-medium">Error loading pet data</span>
          </div>
        </div>
      </div>
    );
  }

  const petData = petQueryData as FullPetData;
  const vetVisits = petData?.vetVisits ?? [];
  const images = petData?.uploadedFiles ?? [];
  const petId = petData?.id ?? 0;
  const petUuid = petData?.uuid ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <PetSummary
        petId={petId}
        pet={petData}
        vetVisits={vetVisits}
        images={images}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
