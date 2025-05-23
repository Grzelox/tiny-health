"use client";

import AddPetButton from "@/components/Pet/AddPetButton";
import PetCard from "@/components/Pet/PetCard";
import { usePets } from "@/hooks/useQueries";
import { PetWithShared, Pets } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import { ShareIcon } from "lucide-react";
import { DownloadIcon } from "lucide-react";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

import LoadingSpinner from "./Animations/LoadingSpinner";
import AddPetModal from "./Pet/AddPetModal";
import SharePetsModal from "./SharePetsModal";

interface DashboardContentProps {
  ownedPets: PetWithShared[];
  sharedPets: PetWithShared[];
  onOpenModal: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  ownedPets,
  sharedPets,
  onOpenModal,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/pets/export");

      if (!response.ok) {
        throw new Error(`Error fetching CSV: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `pets-export-${new Date().toISOString().split("T")[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      //TOOD: display error messasge to end user
    } finally {
      setIsExporting(false);
    }
  };

  if (ownedPets.length === 0 && sharedPets.length === 0) {
    return (
      <div className={gridClassName}>
        <AddPetButton onClick={onOpenModal} />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient">Moje stadko</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {isExporting ? (
                <ClipLoader size={16} color="#617544" />
              ) : (
                <DownloadIcon className="w-5 h-5" />
              )}
            </span>
            <span>{isExporting ? "Przygotowywanie" : "Pobierz dane"}</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-lg"
          >
            <ShareIcon className="w-5 h-5" />
            <span>Udostępnij stado</span>
          </button>
        </div>
      </div>

      <div className="space-y-16">
        <div>
          <div className={gridClassName}>
            {sortPets(ownedPets).map((pet) => (
              <PetCard key={pet.uuid} pet={pet} />
            ))}
            <AddPetButton onClick={onOpenModal} />
          </div>
        </div>

        {sharedPets.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gradient mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-secondary-gradient rounded-full"></div>
              Udostępnione
            </h2>
            <div className={gridClassName}>
              {sortPets(sharedPets).map((pet) => (
                <PetCard key={pet.uuid} pet={pet} />
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <span className="text-red-600 text-lg font-medium">Error loading pets</span>
        </div>
      </div>
    );
  }

  const ownedPets = pets.filter((pet) => !pet.isShared);
  const sharedPets = pets.filter((pet) => pet.isShared);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardContent
          ownedPets={ownedPets}
          sharedPets={sharedPets}
          onOpenModal={() => setIsModalOpen(true)}
        />
      </div>
      <AddPetModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const sortPets = (pets: PetWithShared[]): PetWithShared[] => {
  return [...pets].sort((a, b) => {
    if (a.isDead === b.isDead) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.isDead ? 1 : -1;
  });
};
