import { Plus } from 'lucide-react';

export default function AddPetButton() {
  return (
    <button className="h-64 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-primary-300 hover:border-primary-400 transition-colors">
      <div className="flex flex-col items-center text-primary-600">
        <Plus className="w-12 h-12 mb-2" />
        <span className="text-lg font-medium">Add New Pet</span>
      </div>
    </button>
  );
}