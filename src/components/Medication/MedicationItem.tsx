import { Medication } from "@/types/pet";
import { isMedicationCurrent } from "@/utils/medication";
import { EditIcon, TrashIcon } from "lucide-react";
import React from "react";

interface MedicationItemProps {
  medication: Medication;
  onEdit: () => void;
  onRemove: () => void;
}

const MedicationItem: React.FC<MedicationItemProps> = ({ medication, onEdit, onRemove }) => {
  const isCurrent = isMedicationCurrent(medication);

  return (
    <div className="border-l-4 border-primary-400 pl-4 py-2 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-primary-600">{medication.name}</p>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isCurrent ? "bg-success-100 text-success-700" : "bg-secondary-100 text-secondary-600"
            }`}
          >
            {isCurrent ? "Aktualnie podawany" : "Zakończony"}
          </span>
        </div>
        <p className="text-sm text-secondary-700 mt-1">
          {medication.dosage} • {medication.frequency}
          {medication.route ? ` • ${medication.route}` : ""}
        </p>
        <p className="text-sm text-secondary-600 mt-1">
          {new Date(medication.startDate).toLocaleDateString("pl-PL")}
          {medication.endDate
            ? ` – ${new Date(medication.endDate).toLocaleDateString("pl-PL")}`
            : " – obecnie"}
        </p>
        {medication.notes && <p className="text-secondary-700 mt-2">{medication.notes}</p>}
      </div>
      <div className="flex flex-col md:flex-row">
        <button onClick={onEdit} className="text-primary-600 hover:text-primary-800">
          <EditIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onRemove}
          className="ml-0 md:ml-4 mt-2 md:mt-0 text-danger-600 hover:text-danger-800"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MedicationItem;
