import { useEditPet } from "@/hooks/useQueries";
import { PetData } from "@/types/pet";
import {
  Calendar,
  EditIcon,
  LineChart,
  PaintRoller,
  RatIcon,
  RefreshCcw,
  Stethoscope,
} from "lucide-react";
import React, { useState } from "react";

import EditPetModal from "./EditPetModal";
import PetNotes from "./PetNotes";
import PetShare from "./PetShare";
import PetWeightChart from "./PetWeightChart";
import WeightTrackerModal from "./WeightTrackerModal";

interface PetInfoProps {
  petData: PetData;
  onRefresh: () => Promise<void>;
}

export default function PetInfo({ petData, onRefresh }: PetInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  if (!petData) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleWeightTrackerClick = () => {
    setIsWeightModalOpen(true);
  };

  const handleCloseWeightModal = () => {
    setIsWeightModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">{petData.name}</h1>
          <p className="text-gray-600">
            {petData.breed} • {petData.color}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className={`p-2 text-gray-600 hover:text-gray-800 ${isRefreshing ? "animate-spin" : ""}`}
            disabled={isRefreshing}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Edytuj
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <PetNotes petData={petData} onUpdate={onRefresh} />
        <PetShare petData={petData} />
      </div>

      <EditPetModal isOpen={isModalOpen} onClose={handleCloseModal} pet={petData} />
      <WeightTrackerModal
        isOpen={isWeightModalOpen}
        onClose={handleCloseWeightModal}
        petId={petData.id}
        currentWeight={petData.weight}
      />
    </div>
  );
}
