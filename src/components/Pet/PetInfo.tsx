import { FullPetData } from "@/types/pet";
import { Calendar, EditIcon, LineChart, PaintRoller, RefreshCcw, Stethoscope } from "lucide-react";
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
    <div className="animate-in">
      {/* Main Pet Card */}
      <div className="card-modern rounded-2xl p-8 mb-8 relative overflow-hidden">
        {/* Background decoration for living pets */}
        {!petData.isDead && (
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-full blur-3xl" />
        )}

        <div className="relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1
                className={`text-4xl font-bold mb-2 ${petData.isDead ? "text-gray-700" : "text-gradient"}`}
              >
                {petData.name}
              </h1>
              <p className={`text-lg ${petData.isDead ? "text-gray-600" : "text-secondary-600"}`}>
                {petData.animalType} • {petData.breed} • {petData.color}
                {petData.isDead && (
                  <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    Zmarła
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`
                  btn-secondary p-3 rounded-xl transition-all duration-300 group
                  ${isRefreshing ? "animate-spin" : "hover:scale-110"}
                `}
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleOpenModal}
                className="btn-secondary p-3 rounded-xl hover:scale-110 transition-all duration-300"
              >
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Birth Date */}
            <div className="glass-effect bg-primary-50/80 backdrop-blur-sm p-6 rounded-xl border border-primary-200/50 hover:shadow-modern-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-sm text-secondary-600 mb-1 font-medium">Data urodzenia</p>
              <p className="font-semibold text-primary-800">
                {new Date(petData.bornAt).toLocaleDateString("pl-PL")}
              </p>
            </div>

            {/* Death Date */}
            {hasDeathDate && (
              <div className="glass-effect bg-gray-50/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-modern-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Data śmierci</p>
                <p className="font-semibold text-gray-800">
                  {new Date(petData.deathDate!).toLocaleDateString("pl-PL")}
                </p>
              </div>
            )}

            {/* Weight */}
            <div
              className={`glass-effect bg-secondary-50/80 backdrop-blur-sm p-6 rounded-xl border border-secondary-200/50 hover:shadow-modern-lg hover:border-secondary-300/70 transition-all duration-300 group relative hover:bg-secondary-100/60 ${
                petData.weight !== null ? "cursor-pointer" : ""
              }`}
              onClick={petData.weight !== null ? handleWeightTrackerClick : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <Stethoscope className="w-6 h-6 text-secondary-600" />
                {petData.weight !== null && (
                  <div className="relative">
                    <div className="p-2 bg-secondary-100/80 rounded-lg group-hover:bg-secondary-200/90 transition-all duration-300">
                      <LineChart className="w-5 h-5 text-secondary-600 group-hover:text-secondary-700 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  </div>
                )}
              </div>
              <p className="text-sm text-secondary-600 mb-1 font-medium group-hover:text-secondary-700 transition-colors duration-300">
                Waga [g]
                {petData.weight !== null}
              </p>
              <p className="font-semibold text-secondary-800 group-hover:text-secondary-900 transition-colors duration-300">
                {petData.weight !== null ? `${petData.weight} g` : "Nie podano"}
              </p>
              {petData.weight !== null && (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-100/0 via-secondary-100/20 to-secondary-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              )}
            </div>

            {/* Color */}
            <div className="glass-effect bg-primary-50/80 backdrop-blur-sm p-6 rounded-xl border border-primary-200/50 hover:shadow-modern-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <PaintRoller className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-sm text-secondary-600 mb-1 font-medium">Kolor</p>
              <p className="font-semibold text-primary-800">{petData.color}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="animate-in">
        <PetNotes petData={petData} onUpdate={onRefresh} />
      </div>

      {/* Modals */}
      <EditPetModal isOpen={isModalOpen} onClose={handleCloseModal} pet={petData} />
      <WeightTrackerModal
        isOpen={isWeightModalOpen}
        onClose={handleCloseWeightModal}
        petId={petData.id}
        currentWeight={petData.weight}
        uuid={petData.uuid}
      />
    </div>
  );
}
