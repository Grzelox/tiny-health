"use client";

import { useDeleteMedication } from "@/hooks/useQueries";
import { Medication } from "@/types/pet";
import { isMedicationActive } from "@/utils/medication";
import { EditIcon, Pill, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import MedicationModal from "./MedicationModal";

interface MedicationListProps {
  petId: number;
  petUuid: string;
  medications: Medication[];
}

function formatDatePl(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function MedicationList({ petId, petUuid, medications }: MedicationListProps) {
  const t = useTranslations("MedicationList");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Medication | null>(null);
  const { mutate: deleteMedication } = useDeleteMedication();

  const { active, past } = useMemo(() => {
    const now = new Date();
    const sorted = [...(medications ?? [])].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    return {
      active: sorted.filter((m) => isMedicationActive(m, now)),
      past: sorted.filter((m) => !isMedicationActive(m, now)),
    };
  }, [medications]);

  const handleAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleEdit = (medication: Medication) => {
    setSelected(medication);
    setIsModalOpen(true);
  };

  const renderItem = (medication: Medication, isActive: boolean) => (
    <div
      key={medication.id}
      className={`border-l-4 pl-4 py-2 flex justify-between items-start ${
        isActive ? "border-emerald-500" : "border-secondary-300"
      }`}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-primary-700">{medication.name}</p>
          {isActive && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {t("activeBadge")}
            </span>
          )}
        </div>
        {(medication.dosage || medication.frequency || medication.route) && (
          <p className="text-sm text-secondary-700 mt-0.5">
            {[medication.dosage, medication.frequency, medication.route]
              .filter(Boolean)
              .join(" • ")}
          </p>
        )}
        <p className="text-xs text-secondary-500 mt-1">
          {formatDatePl(medication.startDate)}
          {medication.endDate ? ` — ${formatDatePl(medication.endDate)}` : ` — ${t("ongoing")}`}
        </p>
        {medication.notes && (
          <p className="text-sm text-secondary-600 mt-1 whitespace-pre-wrap">{medication.notes}</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row shrink-0">
        <button
          onClick={() => handleEdit(medication)}
          aria-label={t("editAriaLabel")}
          className="text-primary-600 hover:text-primary-800"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => deleteMedication({ id: medication.id, petUuid })}
          aria-label={t("deleteAriaLabel")}
          className="ml-0 md:ml-4 mt-2 md:mt-0 text-danger-600 hover:text-danger-800"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-primary-800">{t("title")}</h2>
      </div>
      <button
        onClick={handleAdd}
        className="mb-4 bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        {t("addButton")}
      </button>

      {active.length === 0 && past.length === 0 ? (
        <p className="text-sm text-secondary-500 italic">{t("empty")}</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-secondary-700 mb-2 uppercase tracking-wider">
              {t("currentHeading")}
            </h3>
            {active.length > 0 ? (
              <div className="space-y-3">{active.map((m) => renderItem(m, true))}</div>
            ) : (
              <p className="text-sm text-secondary-500 italic">{t("noActive")}</p>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-2 uppercase tracking-wider">
                {t("historyHeading")}
              </h3>
              <div className="space-y-3">{past.map((m) => renderItem(m, false))}</div>
            </div>
          )}
        </div>
      )}

      <MedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        petId={petId}
        petUuid={petUuid}
        medication={selected}
      />
    </div>
  );
}
