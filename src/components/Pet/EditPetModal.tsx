import { useEditPet } from "@/hooks/useQueries";
import { AnimalType, FullPetData } from "@/types/pet";
import { Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: FullPetData | null;
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

const EditPetModal: React.FC<EditPetModalProps> = ({ isOpen, onClose, pet }) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [animalType, setAnimalType] = useState<AnimalType>("Mysz");
  const [birthDate, setBirthday] = useState("");
  const [color, setColor] = useState("");
  const [isDead, setIsDead] = useState(false);
  const [deathDate, setDeathDate] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);

  // Track initial values to compare against
  const [initialValues, setInitialValues] = useState<{
    name: string;
    breed: string;
    animalType: AnimalType;
    birthDate: string;
    color: string;
    isDead: boolean;
    deathDate: string;
  } | null>(null);

  const { mutate: editPet, isPending } = useEditPet();

  useEffect(() => {
    if (pet) {
      const formattedBirthDate = pet.bornAt ? new Date(pet.bornAt).toISOString().split("T")[0] : "";
      const formattedDeathDate = pet.deathDate
        ? new Date(pet.deathDate).toISOString().split("T")[0]
        : "";

      // Set current form values
      setName(pet.name);
      setBreed(pet.breed);
      setAnimalType(pet.animalType);
      setBirthday(formattedBirthDate);
      setColor(pet.color);
      setIsDead(pet.isDead);
      setDeathDate(formattedDeathDate);

      // Store initial values for comparison
      setInitialValues({
        name: pet.name,
        breed: pet.breed,
        animalType: pet.animalType,
        birthDate: formattedBirthDate,
        color: pet.color,
        isDead: pet.isDead,
        deathDate: formattedDeathDate,
      });
    }
  }, [pet]);

  const handleSubmit = () => {
    if (!pet || !initialValues) return;

    // Create an object with only the changed values
    const changes: Record<string, any> = {
      uuid: pet.uuid,
    };

    if (name !== initialValues.name) changes.name = name;
    if (breed !== initialValues.breed) changes.breed = breed;
    if (animalType !== initialValues.animalType) changes.animalType = animalType;
    if (birthDate !== initialValues.birthDate) changes.bornAt = new Date(birthDate).toISOString();
    if (color !== initialValues.color) changes.color = color;
    if (isDead !== initialValues.isDead) changes.isDead = isDead;

    // Add death date if changed, or set to null if unchecked
    if (isDead) {
      if (deathDate && deathDate !== initialValues.deathDate) {
        changes.deathDate = new Date(deathDate).toISOString();
      } else if (!deathDate && initialValues.deathDate) {
        // If no death date is provided but it was set before
        changes.deathDate = new Date().toISOString(); // Default to current date
      }
    } else {
      // If pet is not dead, clear the death date
      changes.deathDate = null;
    }

    // Only send the update if there are actual changes
    if (Object.keys(changes).length > 1) {
      // > 1 because id is always included
      editPet({ data: changes });
      onClose();
    } else {
      onClose(); // No changes, just close the modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg border border-white/50 shadow-2xl rounded-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden animate-slide-up">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary-gradient opacity-10 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-gradient rounded-xl shadow-modern">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient">Edytuj gryzonia</h2>
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
              value={animalType}
              onChange={(e) => setAnimalType(e.target.value as AnimalType)}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 font-medium"
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
              placeholder="Wprowadź imię gryzonia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400"
            />
          </div>

          {/* Grid for Breed and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Rasa</label>
              <input
                type="text"
                placeholder="Laboratoryjna"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Umaszczenie</label>
              <input
                type="text"
                placeholder="np. Czarna"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400"
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary-700">Data urodzenia</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800"
            />
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
                  checked={isDead}
                  onChange={(e) => setIsDead(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-600"></div>
              </label>
            </div>

            {isDead && (
              <div className="mt-4 space-y-2">
                <label className="text-sm font-semibold text-gray-600">Data śmierci</label>
                <input
                  type="date"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
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
            disabled={isPending}
            className="btn-secondary px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-secondary-gradient text-white hover:shadow-modern-lg"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Zapisuję...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Zapisz zmiany
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPetModal;
