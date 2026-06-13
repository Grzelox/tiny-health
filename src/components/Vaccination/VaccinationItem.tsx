import { Vaccination } from "@/types/pet";
import { getVaccinationDueStatus } from "@/utils/medication";
import { EditIcon, TrashIcon } from "lucide-react";
import React from "react";

interface VaccinationItemProps {
  vaccination: Vaccination;
  onEdit: () => void;
  onRemove: () => void;
}

const DUE_STATUS_LABELS: Record<string, string> = {
  overdue: "Termin minął",
  "due-soon": "Termin nadchodzi",
  ok: "Zaplanowano",
};

const DUE_STATUS_STYLES: Record<string, string> = {
  overdue: "bg-danger-100 text-danger-700",
  "due-soon": "bg-warning-100 text-warning-700",
  ok: "bg-success-100 text-success-700",
};

const VaccinationItem: React.FC<VaccinationItemProps> = ({ vaccination, onEdit, onRemove }) => {
  const dueStatus = getVaccinationDueStatus(vaccination);

  return (
    <div className="border-l-4 border-primary-400 pl-4 py-2 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-primary-600">{vaccination.vaccineName}</p>
          {dueStatus !== "none" && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${DUE_STATUS_STYLES[dueStatus]}`}
            >
              {DUE_STATUS_LABELS[dueStatus]}
            </span>
          )}
        </div>
        <p className="text-sm text-secondary-600 mt-1">
          Podano: {new Date(vaccination.administeredDate).toLocaleDateString("pl-PL")}
        </p>
        {vaccination.nextDueDate && (
          <p className="text-sm text-secondary-600">
            Następna dawka: {new Date(vaccination.nextDueDate).toLocaleDateString("pl-PL")}
          </p>
        )}
        {vaccination.notes && <p className="text-secondary-700 mt-2">{vaccination.notes}</p>}
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

export default VaccinationItem;
