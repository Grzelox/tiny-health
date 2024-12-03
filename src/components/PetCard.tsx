import { format } from 'date-fns';
import { MouseIcon } from 'lucide-react';
import Link from 'next/link';

interface Pet {
  id: number;
  name: string;
  breed: string;
  lastCheckup: string;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <Link
      href={`/pet/${pet.id}`}
      className="block h-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <MouseIcon className="w-8 h-8 text-primary-600" />
          <span className="text-sm text-secondary-600">
            Last checkup: {format(new Date(pet.lastCheckup), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-primary-800 mb-2">{pet.name}</h3>
          <p className="text-secondary-600">{pet.breed}</p>
        </div>
        <div className="mt-4">
          <span className="text-sm text-primary-600 hover:text-primary-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;