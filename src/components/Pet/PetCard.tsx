import { useDeletePet } from "@/hooks/useQueries";
import { PetWithShared } from "@/types/pet";
import { format } from "date-fns";
import { RatIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

interface PetCardProps {
  pet: PetWithShared;
}

export default function PetCard({ pet }: PetCardProps) {
  const deletePetMutation = useDeletePet();
  const isDead = pet.isDead;

  return (
    <div
      className={`relative block h-64 ${isDead ? "bg-gray-200" : "bg-white"} rounded-lg shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-6 h-full flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RatIcon className={`w-8 h-8 ${isDead ? "text-gray-600" : "text-primary-600"}`} />
          </div>
          <span className={`text-sm ${isDead ? "text-gray-600" : "text-secondary-600"}`}>
            Ostatnia modyfikacja: {format(new Date(pet.updatedAt), "dd.MM.yyyy")}
          </span>
          {!pet.isShared && (
            <Trash2Icon
              className={`w-6 h-6 ${isDead ? "text-black" : "text-red-600"} cursor-pointer`}
              onClick={() => deletePetMutation.mutate({ petId: pet.id.toString() })}
            />
          )}
        </div>
        <div className="flex-grow">
          <h3
            className={`text-xl font-semibold ${isDead ? "text-black" : "text-primary-800"} mb-2`}
          >
            {pet.name}
          </h3>
          <p className={`text-secondary-600 ${isDead ? "text-gray-600" : ""}`}>{pet.breed}</p>
        </div>
        <div className="mt-4">
          <Link href={`/pet/${pet.id}`}>
            <span
              className={`text-sm ${isDead ? "text-black" : "text-primary-600"} hover:${isDead ? "text-gray-700" : "text-primary-700"}`}
            >
              Szczegóły →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
