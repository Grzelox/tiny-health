import { useDeletePet } from "@/hooks/useQueries";
import { PetWithShared } from "@/types/pet";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";

interface PetCardProps {
  pet: PetWithShared;
}

export default function PetCard({ pet }: PetCardProps) {
  const deletePetMutation = useDeletePet();
  const isDead = pet.isDead;

  return (
    <div
      className={`
        relative block h-64 rounded-xl overflow-hidden transition-all duration-300 group animate-in
        ${
          isDead
            ? "bg-gradient-to-br from-gray-100/90 to-gray-200/80 backdrop-blur-sm border border-gray-300/50 shadow-md"
            : "card-modern hover:shadow-modern-lg hover:-translate-y-1"
        }
      `}
    >
      {/* Background pattern for living pets */}
      {!isDead && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-secondary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="p-6 h-full flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`
            text-sm font-medium px-3 py-1 rounded-full transition-all duration-300
            ${
              isDead
                ? "text-gray-600 bg-gray-200/60"
                : "text-secondary-700 bg-secondary-100/80 backdrop-blur-xs"
            }
          `}
          >
            {pet.animalType}
            {pet.breed ? ` | ${pet.breed}` : ""}
          </span>
          {!pet.isShared && (
            <button
              onClick={() => deletePetMutation.mutate({ petId: pet.id, ownerId: pet.ownerId })}
              className={`
                p-2 rounded-full transition-all duration-300 hover:scale-110
                ${
                  isDead
                    ? "text-gray-600 hover:bg-gray-300/50"
                    : "text-red-500 hover:text-red-600 hover:bg-red-50/80 backdrop-blur-xs"
                }
              `}
            >
              <Trash2Icon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-grow">
          <h3
            className={`
              text-xl font-semibold mb-2 transition-all duration-300
              ${
                isDead
                  ? "text-gray-700"
                  : "text-gradient group-hover:from-primary-400 group-hover:to-primary-600"
              }
            `}
          >
            {pet.name}
          </h3>
          <p
            className={`
            transition-all duration-300
            ${isDead ? "text-gray-600" : "text-secondary-600 group-hover:text-secondary-700"}
          `}
          >
            {pet.animalType}
            {pet.breed ? ` - ${pet.breed}` : ""}
          </p>
        </div>

        <div className="mt-4">
          <Link href={`/pet/${pet.uuid}`} className="group/link">
            <span
              className={`
                text-sm font-medium inline-flex items-center gap-2 transition-all duration-300
                ${
                  isDead
                    ? "text-gray-600 hover:text-gray-800"
                    : "text-primary-400 hover:text-primary-500 group-hover/link:gap-3"
                }
              `}
            >
              Szczegóły
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
