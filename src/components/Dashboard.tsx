"use client";

import AddPetButton from "@/components/Pet/AddPetButton";
import PetCard from "@/components/Pet/PetCard";
import { ANIMAL_TYPE_RODENT_OPTIONS } from "@/constants/animalTypes";
import { usePets } from "@/hooks/useQueries";
import { PetWithShared, Pets } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import { DownloadIcon, SearchIcon, ShareIcon, XIcon } from "lucide-react";
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
type StatusFilter = "all" | "alive" | "dead";
type OwnershipFilter = "all" | "owned" | "shared";

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

const matchesPetFilters = (
  pet: PetWithShared,
  {
    normalizedSearchQuery,
    animalTypeFilter,
    statusFilter,
  }: { normalizedSearchQuery: string; animalTypeFilter: string; statusFilter: StatusFilter },
) => {
  if (animalTypeFilter !== "all" && pet.animalType !== animalTypeFilter) return false;
  if (statusFilter === "alive" && pet.isDead) return false;
  if (statusFilter === "dead" && !pet.isDead) return false;

  if (normalizedSearchQuery) {
    const haystack = `${pet.name} ${pet.breed} ${pet.color}`.toLowerCase();
    if (!haystack.includes(normalizedSearchQuery)) return false;
  }

  return true;
};

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ value, onChange, options, ariaLabel }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className="appearance-none bg-white/80 border border-secondary-200 text-secondary-700 text-sm sm:text-base pl-3 sm:pl-4 pr-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
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
);

const DashboardContent: React.FC<DashboardContentProps> = ({
  ownedPets,
  sharedPets,
  onOpenModal,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<PetSortOption>("createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [animalTypeFilter, setAnimalTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>("all");
  const gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const availableAnimalTypes = useMemo(() => {
    const types = new Set<string>();
    [...ownedPets, ...sharedPets].forEach((pet) => types.add(pet.animalType));
    return Array.from(types).sort((a, b) => a.localeCompare(b, "pl"));
  }, [ownedPets, sharedPets]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilters =
    normalizedSearchQuery !== "" ||
    animalTypeFilter !== "all" ||
    statusFilter !== "all" ||
    ownershipFilter !== "all";

  const filteredOwnedPets = useMemo(() => {
    if (ownershipFilter === "shared") return [];
    return ownedPets.filter((pet) =>
      matchesPetFilters(pet, { normalizedSearchQuery, animalTypeFilter, statusFilter }),
    );
  }, [ownedPets, ownershipFilter, normalizedSearchQuery, animalTypeFilter, statusFilter]);

  const filteredSharedPets = useMemo(() => {
    if (ownershipFilter === "owned") return [];
    return sharedPets.filter((pet) =>
      matchesPetFilters(pet, { normalizedSearchQuery, animalTypeFilter, statusFilter }),
    );
  }, [sharedPets, ownershipFilter, normalizedSearchQuery, animalTypeFilter, statusFilter]);

  const { rodents: ownedRodents, others: ownedOthers } = useMemo(
    () => splitPetsByCategory(filteredOwnedPets, sortOption),
    [filteredOwnedPets, sortOption],
  );
  const { rodents: sharedRodents, others: sharedOthers } = useMemo(
    () => splitPetsByCategory(filteredSharedPets, sortOption),
    [filteredSharedPets, sortOption],
  );

  const showOwnedSubheadings = ownedRodents.length > 0 && ownedOthers.length > 0;
  const showSharedSubheadings = sharedRodents.length > 0 && sharedOthers.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
    setAnimalTypeFilter("all");
    setStatusFilter("all");
    setOwnershipFilter("all");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setExportError(null);
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
      setExportError("Nie udało się pobrać danych. Spróbuj ponownie.");
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

  const hasNoFilteredResults = filteredOwnedPets.length === 0 && filteredSharedPets.length === 0;

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Moje stadko</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-secondary-700">Sortowanie:</span>
              <SelectField
                value={sortOption}
                onChange={(value) => setSortOption(value as PetSortOption)}
                ariaLabel="Sortowanie"
                options={[
                  { value: "createdAt", label: "Data dodania" },
                  { value: "name", label: "Alfabetycznie" },
                  { value: "updatedAt", label: "Ostatnia edycja" },
                ]}
              />
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

        {exportError && <p className="text-danger-600 text-sm">{exportError}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 sm:max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj po imieniu, rasie lub kolorze..."
              aria-label="Szukaj zwierzaka"
              className="w-full bg-white/80 border border-secondary-200 text-secondary-700 text-sm sm:text-base pl-9 pr-9 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Wyczyść wyszukiwanie"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <SelectField
            value={animalTypeFilter}
            onChange={setAnimalTypeFilter}
            ariaLabel="Filtruj po gatunku"
            options={[
              { value: "all", label: "Wszystkie gatunki" },
              ...availableAnimalTypes.map((type) => ({ value: type, label: type })),
            ]}
          />

          <SelectField
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            ariaLabel="Filtruj po statusie"
            options={[
              { value: "all", label: "Wszystkie statusy" },
              { value: "alive", label: "Żywe" },
              { value: "dead", label: "Zmarłe" },
            ]}
          />

          {sharedPets.length > 0 && (
            <SelectField
              value={ownershipFilter}
              onChange={(value) => setOwnershipFilter(value as OwnershipFilter)}
              ariaLabel="Filtruj po właścicielu"
              options={[
                { value: "all", label: "Moje i udostępnione" },
                { value: "owned", label: "Tylko moje" },
                { value: "shared", label: "Tylko udostępnione" },
              ]}
            />
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
            >
              Wyczyść filtry
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && hasNoFilteredResults ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-white/60 border border-secondary-100 shadow-sm">
          <p className="text-lg font-medium text-secondary-700 mb-2">
            Brak zwierzaków spełniających kryteria
          </p>
          <p className="text-sm text-secondary-500 mb-4">Spróbuj zmienić wyszukiwanie lub filtry.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          <div>
            {filteredOwnedPets.length === 0 ? (
              ownedPets.length === 0 && (
                <div className={gridClassName}>
                  <AddPetButton onClick={onOpenModal} />
                </div>
              )
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

          {filteredSharedPets.length > 0 && (
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
                  {sortPets(filteredSharedPets, sortOption).map((pet) => (
                    <PetCard key={pet.uuid} pet={pet} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <SharePetsModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const { data: pets = [], isLoading, error, refetch } = usePets(userId);

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
          <p className="text-danger-600 text-lg font-medium mb-4">
            Nie udało się wczytać zwierzaków
          </p>
          <button onClick={() => refetch()} className="btn-secondary px-4 py-2 rounded-lg text-sm">
            Spróbuj ponownie
          </button>
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
