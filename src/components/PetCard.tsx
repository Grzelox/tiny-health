import { format } from 'date-fns';
import { RatIcon } from 'lucide-react';
import Link from 'next/link';
import { Pet } from '@/types/pet';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`/pet/${pet.id}`}
      className="block h-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <RatIcon className="w-8 h-8 text-primary-600" />
          <span className="text-sm text-secondary-600">
            Ostatnia wizyta: TODO
          </span>
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-primary-800 mb-2">{pet.name}</h3>
          <p className="text-secondary-600">{pet.breed}</p>
        </div>
        <div className="mt-4">
          <span className="text-sm text-primary-600 hover:text-primary-700">
            Szczegóły →
          </span>
        </div>
      </div>
    </Link>
  );
}