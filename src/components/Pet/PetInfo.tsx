import { PetData } from "@/types/pet";
import {
  Calendar,
  EditIcon,
  LineChart,
  PaintRoller,
  RatIcon,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import React, { useState } from "react";

import EditPetModal from "./EditPetModal";
import WeightTrackerModal from "./WeightTrackerModal";

interface PetInfoProps {
  petData: PetData;
  onRefresh: () => Promise<any>;
}

export default function PetInfo({ petData, onRefresh }: PetInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  if (!petData) return null;

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleWeightTrackerClick = () => {
    setIsWeightModalOpen(true);
  };

  const handleCloseWeightModal = () => {
    setIsWeightModalOpen(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    onRefresh()
      .catch((error) => console.error("Error refreshing pet data:", error))
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
      });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 relative">
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleRefresh}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Refresh pet data"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-6 h-6 ${isRefreshing ? "animate-spin text-primary-600" : ""}`}
            />
          </button>
          <button
            onClick={handleEditClick}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Edit pet"
          >
            <EditIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <RatIcon className="w-12 h-12 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-primary-800">{petData.name}</h1>
            <p className="text-secondary-600">{petData.breed}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-50 p-4 rounded-lg">
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Data urodzenia</p>
            <p className="font-medium">{new Date(petData.bornAt).toLocaleDateString("pl-PL")}</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg relative">
            <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Waga [g]</p>
            <p className="font-medium">{petData.weight}</p>
            <button
              onClick={handleWeightTrackerClick}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              aria-label="Track weight history"
            >
              <LineChart className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <PaintRoller className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Kolor</p>
            <p className="font-medium">{petData.color}</p>
          </div>
        </div>
      </div>
      <EditPetModal isOpen={isModalOpen} onClose={handleCloseModal} pet={petData} />
      <WeightTrackerModal
        isOpen={isWeightModalOpen}
        onClose={handleCloseWeightModal}
        petId={petData.id}
        currentWeight={petData.weight}
      />
    </>
  );
}
