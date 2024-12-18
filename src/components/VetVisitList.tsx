// src/components/VetVisitList.tsx
import React from 'react';
import { VetVisit } from '@/types/pet';
import VetVisitItem from './VetVisitItem';

interface VetVisitListProps {
  vetVisits: VetVisit[];
  onEditVisit: (index: number) => void;
  onRemoveVisit: (index: number) => void;
  onAddVisitClick: () => void;
}

const VetVisitList: React.FC<VetVisitListProps> = ({ vetVisits, onEditVisit, onRemoveVisit, onAddVisitClick }) => (
  <div>
    <h2 className="text-xl font-semibold text-primary-800 mb-4">Medical History</h2>
    <button
      onClick={onAddVisitClick}
      className="mb-4 bg-primary-600 text-white py-2 px-4 rounded"
    >
      Add New Visit
    </button>
    <div className="space-y-4">
      {vetVisits
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((visit, index) => (
          <VetVisitItem
            key={index}
            visit={visit}
            onEdit={() => onEditVisit(index)}
            onRemove={() => onRemoveVisit(index)}
          />
        ))}
    </div>
  </div>
);

export default VetVisitList;