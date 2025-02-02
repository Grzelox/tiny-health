// src/components/VetVisitItem.tsx
import React from 'react';
import { VetVisit } from '@/types/pet';
import { EditIcon, TrashIcon } from 'lucide-react';

interface VetVisitItemProps {
  visit: VetVisit;
  onEdit: () => void;
  onRemove: () => void;
}

const VetVisitItem: React.FC<VetVisitItemProps> = ({ visit, onEdit, onRemove }) => (
  <div className="border-l-4 border-primary-400 pl-4 py-2 flex justify-between items-start">
    <div>
      <p className="font-medium text-primary-700">{visit.description}</p>
      <p className="text-sm text-secondary-600">{new Date(visit.date).toLocaleDateString()}</p>
      <p className="text-secondary-700 mt-2">{visit.medication}</p>
    </div>
    <div className="flex flex-col md:flex-row">
      <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
        <EditIcon className="w-6 h-6" />
      </button>
      <button onClick={onRemove} className="ml-0 md:ml-4 mt-2 md:mt-0 text-red-600 hover:text-red-800">
        <TrashIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
);

export default VetVisitItem;