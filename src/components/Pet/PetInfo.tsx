import { FullPetData } from "@/types/pet";
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
import WeightTrackerModal from "./WeightTrackerModal";

interface PetInfoProps {
  petData: FullPetData;
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

  const hasDeathDate = petData.isDead && petData.deathDate;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <RatIcon className="w-12 h-12 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-primary-800">{petData.name}</h1>
              <p className="text-secondary-600">
                {petData.animalType} • {petData.breed} • {petData.color}
                {petData.isDead && <span className="ml-2 text-red-600">• Zmarła</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-600 hover:text-gray-800 ${isRefreshing ? "animate-spin" : ""}`}
              disabled={isRefreshing}
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button onClick={handleOpenModal} className="p-2 text-gray-600 hover:text-gray-800">
              <EditIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-primary-50 p-4 rounded-lg">
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Data urodzenia</p>
            <p className="font-medium">{new Date(petData.bornAt).toLocaleDateString("pl-PL")}</p>
          </div>

          {hasDeathDate && (
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-secondary-600">Data śmierci</p>
              <p className="font-medium">
                {new Date(petData.deathDate!).toLocaleDateString("pl-PL")}
              </p>
            </div>
          )}

          <div
            className="bg-primary-50 p-4 rounded-lg cursor-pointer relative"
            onClick={handleWeightTrackerClick}
          >
            <LineChart className="absolute top-2 right-2 w-5 h-5 text-primary-500" />
            <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Waga [g]</p>
            <p className="font-medium">{petData.weight}</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <PaintRoller className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Kolor</p>
            <p className="font-medium">{petData.color}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <PetNotes petData={petData} onUpdate={onRefresh} />
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
