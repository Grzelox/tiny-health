import { useAddPet } from "@/hooks/useQueries";
import { AnimalType, Pet } from "@/types/pet";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";

interface AddPetModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const ANIMAL_TYPES: AnimalType[] = [
  "Mysz",
  "Szczur",
  "Myszoskoczek",
  "Fretka",
  "Świnka Morska",
  "Chomik",
  "Szynszyla",
  "Królik",
];

const AddPetModal: React.FC<AddPetModalProps> = ({ user, isOpen, onClose }) => {
  const addPetMutation = useAddPet();
  const [pet, setPet] = useState<Omit<Pet, "id" | "updatedAt" | "ownerId">>({
    name: "",
    breed: "",
    animalType: "Mysz",
    bornAt: "",
    weight: 0,
    color: "",
    isDead: false,
    deathDate: "",
  });

  // Reset form function
  const resetForm = () => {
    setPet({
      name: "",
      breed: "",
      animalType: "Mysz",
      bornAt: "",
      weight: 0,
      color: "",
      isDead: false,
      deathDate: "",
    });
  };

  // Format date for display in the input field
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    } catch (error) {
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setPet((prev) => ({
        ...prev,
        [name]: checked,
      }));

      // Clear death date if isDead is unchecked
      if (name === "isDead" && !checked) {
        setPet((prev) => ({
          ...prev,
          deathDate: "",
        }));
      }
    } else if (name === "weight") {
      setPet((prev) => ({
        ...prev,
        weight: Number(value),
      }));
    } else if (name === "bornAt" || name === "deathDate") {
      // For date fields, store the ISO string in state but display formatted date
      setPet((prev) => ({
        ...prev,
        [name]: value ? new Date(value).toISOString() : "",
      }));
    } else {
      setPet((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    try {
      await addPetMutation.mutateAsync({
        ...pet,
        ownerId: user.id,
        // Don't send deathDate if isDead is false
        ...(pet.isDead ? {} : { deathDate: undefined }),
      });

      // Reset the form state after successful submission
      resetForm();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg border border-white/50 shadow-2xl rounded-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden animate-slide-up">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-gradient opacity-10 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-gradient rounded-xl shadow-modern">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient">Dodaj nowego gryzonia</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary p-2 rounded-xl hover:scale-110 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6 relative">
          {/* Animal Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary-700">Rodzaj</label>
            <select
              name="animalType"
              value={pet.animalType}
              onChange={handleChange}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800 font-medium"
            >
              {ANIMAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary-700">Imię</label>
            <input
              type="text"
              name="name"
              placeholder="Wprowadź imię gryzonia"
              value={pet.name}
              onChange={handleChange}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800 placeholder-secondary-400"
            />
          </div>

          {/* Grid for Breed and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Rasa</label>
              <input
                type="text"
                name="breed"
                placeholder="Laboratoryjna"
                value={pet.breed}
                onChange={handleChange}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800 placeholder-secondary-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Umaszczenie</label>
              <input
                type="text"
                name="color"
                placeholder="np. Czarna"
                value={pet.color}
                onChange={handleChange}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800 placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Grid for Birth Date and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Data urodzenia</label>
              <input
                type="date"
                name="bornAt"
                value={formatDateForInput(pet.bornAt)}
                onChange={handleChange}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Waga (g)</label>
              <input
                type="number"
                name="weight"
                placeholder="30"
                value={pet.weight || ""}
                onChange={handleChange}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-primary-800 placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Death Status */}
          <div className="bg-gray-50/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-secondary-700">
                Czy zwierzak zmarł?
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isDead"
                  checked={pet.isDead}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {pet.isDead && (
              <div className="mt-4 space-y-2">
                <label className="text-sm font-semibold text-gray-600">Data śmierci</label>
                <input
                  type="date"
                  name="deathDate"
                  value={formatDateForInput(pet.deathDate || "")}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/80 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            Anuluj
          </button>
          <button
            onClick={handleSubmit}
            disabled={!pet.name || !pet.bornAt || addPetMutation.isPending}
            className="btn-primary px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addPetMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Dodaję...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Dodaj gryzonia
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
