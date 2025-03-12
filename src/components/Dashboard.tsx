"use client";

import AddPetButton from "@/components/Pet/AddPetButton";
import PetCard from "@/components/Pet/PetCard";
import { usePets } from "@/hooks/useQueries";
import { OwnedPets } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

import LoadingSpinner from "./LoadingSpinner";
import AddPetModal from "./Pet/AddPetModal";

interface DashboardContentProps {
  pets: OwnedPets[];
  onOpenModal: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ pets, onOpenModal }) => {
  const gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  if (pets.length === 0) {
    return (
      <div className={gridClassName}>
        <AddPetButton onClick={onOpenModal} />
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {sortPets(pets).map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
      <AddPetButton onClick={onOpenModal} />
    </div>
  );
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const { data: pets = [], isLoading, error } = usePets(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
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

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-primary-800 mb-8">Moje stadko</h1>
      <DashboardContent pets={pets} onOpenModal={() => setIsModalOpen(true)} />
      <AddPetModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const sortPets = (pets: OwnedPets[]): OwnedPets[] => {
  return [...pets].sort((a, b) => {
    if (a.isDead === b.isDead) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.isDead ? 1 : -1;
  });
};
