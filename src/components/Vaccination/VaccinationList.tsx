"use client";

import { useDeleteVaccination } from "@/hooks/useQueries";
import { Vaccination } from "@/types/pet";
import { isVaccinationDue } from "@/utils/medication";
import { EditIcon, Syringe, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import VaccinationModal from "./VaccinationModal";

interface VaccinationListProps {
  petId: number;
  petUuid: string;
  vaccinations: Vaccination[];
}

function formatDatePl(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function VaccinationList({ petId, petUuid, vaccinations }: VaccinationListProps) {
  const t = useTranslations("VaccinationList");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Vaccination | null>(null);
  const { mutate: deleteVaccination } = useDeleteVaccination();

  const sorted = useMemo(
    () =>
      [...(vaccinations ?? [])].sort(
        (a, b) => new Date(b.administeredDate).getTime() - new Date(a.administeredDate).getTime(),
      ),
    [vaccinations],
  );

  const handleAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vaccination: Vaccination) => {
    setSelected(vaccination);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Syringe className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-primary-800">{t("title")}</h2>
      </div>
      <button
        onClick={handleAdd}
        className="mb-4 bg-primary-400 hover:bg-primary-500 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        {t("addButton")}
      </button>

      {sorted.length === 0 ? (
        <p className="text-sm text-secondary-500 italic">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((vaccination) => {
            const due = isVaccinationDue(vaccination);
            return (
              <div
                key={vaccination.id}
                className={`border-l-4 pl-4 py-2 flex justify-between items-start ${
                  due ? "border-danger-500" : "border-primary-400"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-primary-700">{vaccination.name}</p>
                    {due && (
                      <span className="text-xs font-semibold text-danger-700 bg-danger-100 px-2 py-0.5 rounded-full">
                        {t("dueBadge")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    {t("administered")}: {formatDatePl(vaccination.administeredDate)}
                  </p>
                  {vaccination.nextDueDate && (
                    <p
                      className={`text-xs mt-0.5 ${due ? "text-danger-600 font-medium" : "text-secondary-500"}`}
                    >
                      {t("nextDue")}: {formatDatePl(vaccination.nextDueDate)}
                    </p>
                  )}
                  {vaccination.notes && (
                    <p className="text-sm text-secondary-600 mt-1 whitespace-pre-wrap">
                      {vaccination.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row shrink-0">
                  <button
                    onClick={() => handleEdit(vaccination)}
                    aria-label={t("editAriaLabel")}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteVaccination({ id: vaccination.id, petUuid })}
                    aria-label={t("deleteAriaLabel")}
                    className="ml-0 md:ml-4 mt-2 md:mt-0 text-danger-600 hover:text-danger-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VaccinationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        petId={petId}
        petUuid={petUuid}
        vaccination={selected}
      />
    </div>
  );
}
