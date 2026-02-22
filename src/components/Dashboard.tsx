"use client";

import AddPetButton from "@/components/Pet/AddPetButton";
import PetCard from "@/components/Pet/PetCard";
import { ANIMAL_TYPE_RODENT_OPTIONS } from "@/constants/animalTypes";
import { usePets } from "@/hooks/useQueries";
import { PetWithShared, Pets } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import { ShareIcon } from "lucide-react";
import { DownloadIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

import LoadingSpinner from "./Animations/LoadingSpinner";
import AddPetModal from "./Pet/AddPetModal";
import SharePetsModal from "./SharePetsModal";

interface DashboardContentProps {
  ownedPets: PetWithShared[];
  sharedPets: PetWithShared[];
  onOpenModal: () => void;
}

const RODENT_TYPE_SET = new Set<string>(ANIMAL_TYPE_RODENT_OPTIONS as readonly string[]);

type PetSortOption = "createdAt" | "name" | "updatedAt";

const sortPets = (pets: PetWithShared[], sortOption: PetSortOption): PetWithShared[] => {
  const withDeadLast = [...pets].sort((a, b) => {
    if (a.isDead === b.isDead) return 0;
    return a.isDead ? 1 : -1;
  });

  const compareByOption = (a: PetWithShared, b: PetWithShared) => {
    if (a.isDead && b.isDead) {
      const aDeathDate = a.deathDate ? new Date(a.deathDate).getTime() : 0;
      const bDeathDate = b.deathDate ? new Date(b.deathDate).getTime() : 0;
      return bDeathDate - aDeathDate;
    }

    if (sortOption === "name") {
      return a.name.localeCompare(b.name, "pl");
    }

    if (sortOption === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  };

  const alivePets = withDeadLast.filter((pet) => !pet.isDead).sort(compareByOption);
  const deadPets = withDeadLast.filter((pet) => pet.isDead).sort(compareByOption);

  return [...alivePets, ...deadPets];
};

const splitPetsByCategory = (pets: PetWithShared[], sortOption: PetSortOption) => {
  const rodents: PetWithShared[] = [];
  const others: PetWithShared[] = [];

  for (const pet of pets) {
    if (RODENT_TYPE_SET.has(pet.animalType)) {
      rodents.push(pet);
    } else {
      others.push(pet);
    }
  }

  return {
    rodents: sortPets(rodents, sortOption),
    others: sortPets(others, sortOption),
  };
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  ownedPets,
  sharedPets,
  onOpenModal,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sortOption, setSortOption] = useState<PetSortOption>("createdAt");
  const gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const { rodents: ownedRodents, others: ownedOthers } = useMemo(
    () => splitPetsByCategory(ownedPets, sortOption),
    [ownedPets, sortOption],
  );
  const { rodents: sharedRodents, others: sharedOthers } = useMemo(
    () => splitPetsByCategory(sharedPets, sortOption),
    [sharedPets, sortOption],
  );

  const showOwnedSubheadings = ownedRodents.length > 0 && ownedOthers.length > 0;
  const showSharedSubheadings = sharedRodents.length > 0 && sharedOthers.length > 0;

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
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Moje stadko</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-secondary-700">Sortowanie:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as PetSortOption)}
                  className="appearance-none bg-white/80 border border-secondary-200 text-secondary-700 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="createdAt">Data dodania</option>
                  <option value="name">Alfabetycznie</option>
                  <option value="updatedAt">Ostatnia edycja</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="btn-secondary flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {isExporting ? (
                    <ClipLoader size={14} color="#3F6F5E" />
                  ) : (
                    <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </span>
                <span className="hidden sm:inline">
                  {isExporting ? "Przygotowywanie" : "Pobierz dane"}
                </span>
                <span className="sm:hidden">{isExporting ? "Pobierz..." : "Dane"}</span>
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="btn-secondary flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base"
              >
                <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Udostępnij stado</span>
                <span className="sm:hidden">Udostępnij</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <div>
          {ownedPets.length === 0 ? (
            <div className={gridClassName}>
              <AddPetButton onClick={onOpenModal} />
            </div>
          ) : (
            <div className="space-y-10">
              {ownedRodents.length > 0 && (
                <div>
                  {showOwnedSubheadings && (
                    <h2 className="text-xl font-semibold text-gradient mb-6">Gryzonie</h2>
                  )}
                  <div className={gridClassName}>
                    {ownedRodents.map((pet) => (
                      <PetCard key={pet.uuid} pet={pet} />
                    ))}
                    <AddPetButton onClick={onOpenModal} />
                  </div>
                </div>
              )}

              {ownedOthers.length > 0 && (
                <div>
                  {showOwnedSubheadings && (
                    <h2 className="text-xl font-semibold text-gradient mb-6">Inne</h2>
                  )}
                  <div className={gridClassName}>
                    {ownedOthers.map((pet) => (
                      <PetCard key={pet.uuid} pet={pet} />
                    ))}
                    {ownedRodents.length === 0 && <AddPetButton onClick={onOpenModal} />}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {sharedPets.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gradient mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-secondary-gradient rounded-full"></div>
              Udostępnione
            </h2>

            {showSharedSubheadings ? (
              <div className="space-y-10">
                {sharedRodents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-700 mb-4">Gryzonie</h3>
                    <div className={gridClassName}>
                      {sharedRodents.map((pet) => (
                        <PetCard key={pet.uuid} pet={pet} />
                      ))}
                    </div>
                  </div>
                )}

                {sharedOthers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-700 mb-4">Inne</h3>
                    <div className={gridClassName}>
                      {sharedOthers.map((pet) => (
                        <PetCard key={pet.uuid} pet={pet} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={gridClassName}>
                {sortPets(sharedPets, sortOption).map((pet) => (
                  <PetCard key={pet.uuid} pet={pet} />
                ))}
              </div>
            )}
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
          <div className="w-16 h-16 bg-gradient-to-br from-danger-100 to-danger-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-danger-600 text-2xl">!</span>
          </div>
          <span className="text-danger-600 text-lg font-medium">Error loading pets</span>
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
