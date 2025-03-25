"use client";

import AddPetButton from "@/components/Pet/AddPetButton";
import PetCard from "@/components/Pet/PetCard";
import { usePets } from "@/hooks/useQueries";
import { OwnedPets } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import { ShareIcon } from "lucide-react";
import React, { useState } from "react";

import LoadingSpinner from "./LoadingSpinner";
import AddPetModal from "./Pet/AddPetModal";
import SharePetsModal from "./SharePetsModal";

interface DashboardContentProps {
  ownedPets: OwnedPets[];
  sharedPets: (OwnedPets & { isShared: boolean })[];
  onOpenModal: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  ownedPets,
  sharedPets,
  onOpenModal,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  if (ownedPets.length === 0 && sharedPets.length === 0) {
    return (
      <div className={gridClassName}>
        <AddPetButton onClick={onOpenModal} />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-900">Moje stadko</h1>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 px-4 py-2 rounded-lg border border-primary-200 hover:bg-primary-50"
        >
          <ShareIcon className="w-5 h-5" />
          <span>Udostępnij dane innemu użytkownikowi</span>
        </button>
      </div>

      <div className="space-y-12">
        <div>
          <div className={gridClassName}>
            {sortPets(ownedPets).map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <AddPetButton onClick={onOpenModal} />
          </div>
        </div>

        {sharedPets.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-primary-800 mb-6">Udostępnione Tobie</h2>
            <div className={gridClassName}>
              {sortPets(sharedPets).map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SharePetsModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
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

  const ownedPets = pets.filter((pet) => !pet.isShared);
  const sharedPets = pets.filter((pet) => pet.isShared);

  return (
    <div className="min-h-screen">
      <DashboardContent
        ownedPets={ownedPets}
        sharedPets={sharedPets}
        onOpenModal={() => setIsModalOpen(true)}
      />
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
