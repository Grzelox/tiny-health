import { PetData } from "@/types/pet";
import {
  Calendar,
  EditIcon,
  PaintRoller,
  RatIcon,
  Stethoscope,
} from "lucide-react";
import React from "react";

interface PetInfoProps {
  petData: PetData;
  onEditClick: () => void;
}

export default function PetInfo({ petData, onEditClick }: PetInfoProps) {
  if (!petData) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8 relative">
      <button
        onClick={onEditClick}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        <EditIcon className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-4 mb-6">
        <RatIcon className="w-12 h-12 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-primary-800">
            {petData.name}
          </h1>
          <p className="text-secondary-600">{petData.breed}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary-50 p-4 rounded-lg">
          <Calendar className="w-6 h-6 text-primary-600 mb-2" />
          <p className="text-sm text-secondary-600">Birth Date</p>
          <p className="font-medium">
            {new Date(petData.bornAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
          <p className="text-sm text-secondary-600">Weight [g]</p>
          <p className="font-medium">{petData.weight}</p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <PaintRoller className="w-6 h-6 text-primary-600 mb-2" />
          <p className="text-sm text-secondary-600">Color</p>
          <p className="font-medium">{petData.color}</p>
        </div>
      </div>
    </div>
  );
}
