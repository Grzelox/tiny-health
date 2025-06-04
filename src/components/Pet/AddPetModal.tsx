import { useAddPet } from "@/hooks/useQueries";
import { AnimalType, Pet } from "@/types/pet";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AddPetModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  breed?: string;
  color?: string;
  weight?: string;
  bornAt?: string;
  deathDate?: string;
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

const MAX_STRING_LENGTH = 300;

const AddPetModal: React.FC<AddPetModalProps> = ({ user, isOpen, onClose }) => {
  const addPetMutation = useAddPet();
  const [pet, setPet] = useState<Omit<Pet, "id" | "updatedAt" | "ownerId">>({
    name: "",
    breed: "",
    animalType: "Mysz",
    bornAt: "",
    weight: null,
    color: "",
    isDead: false,
    deathDate: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!pet.name.trim()) {
      newErrors.name = "Imię jest wymagane";
    } else if (pet.name.length > MAX_STRING_LENGTH) {
      newErrors.name = `Imię nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Breed validation
    if (pet.breed && pet.breed.length > MAX_STRING_LENGTH) {
      newErrors.breed = `Rasa nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Color validation
    if (pet.color && pet.color.length > MAX_STRING_LENGTH) {
      newErrors.color = `Umaszczenie nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Weight validation (now optional)
    if (pet.weight !== null && pet.weight < 0) {
      newErrors.weight = "Waga nie może być ujemna";
    } else if (pet.weight !== null && pet.weight > 10000) {
      newErrors.weight = "Waga wydaje się zbyt duża";
    }

    // Birth date validation
    if (!pet.bornAt) {
      newErrors.bornAt = "Data urodzenia jest wymagana";
    } else {
      const birthDate = new Date(pet.bornAt);
      const today = new Date();
      if (birthDate > today) {
        newErrors.bornAt = "Data urodzenia nie może być z przyszłości";
      }
    }

    // Death date validation
    if (pet.isDead) {
      if (!pet.deathDate) {
        newErrors.deathDate = "Data śmierci jest wymagana";
      } else {
        const deathDate = new Date(pet.deathDate);
        const birthDate = new Date(pet.bornAt);
        const today = new Date();

        if (deathDate > today) {
          newErrors.deathDate = "Data śmierci nie może być z przyszłości";
        } else if (pet.bornAt && deathDate < birthDate) {
          newErrors.deathDate = "Data śmierci nie może być wcześniejsza niż data urodzenia";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run validation whenever pet data changes
  useEffect(() => {
    validateForm();
  }, [pet.name, pet.breed, pet.color, pet.weight, pet.bornAt, pet.deathDate, pet.isDead]);

  // Reset form function
  const resetForm = () => {
    setPet({
      name: "",
      breed: "",
      animalType: "Mysz",
      bornAt: "",
      weight: null,
      color: "",
      isDead: false,
      deathDate: "",
    });
    setErrors({});
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

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

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
        // Clear death date error if unchecking isDead
        setErrors((prev) => ({ ...prev, deathDate: undefined }));
      }
    } else if (name === "weight") {
      setPet((prev) => ({
        ...prev,
        weight: value === "" ? null : Number(value),
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

    // Validate form before submission
    if (!validateForm()) {
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
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-400 opacity-20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-400 rounded-xl shadow-modern">
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
            <label className="text-sm font-semibold text-secondary-700">Rodzaj *</label>
            <select
              name="animalType"
              value={pet.animalType}
              onChange={handleChange}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-primary-400/30 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 font-medium"
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
            <label className="text-sm font-semibold text-secondary-700">Imię *</label>
            <input
              type="text"
              name="name"
              placeholder="Wprowadź imię gryzonia"
              value={pet.name}
              onChange={handleChange}
              className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 placeholder-secondary-400 ${
                errors.name
                  ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                  : "border-primary-400/30"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 placeholder-secondary-400 ${
                  errors.breed
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-primary-400/30"
                }`}
              />
              {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Umaszczenie</label>
              <input
                type="text"
                name="color"
                placeholder="np. Czarna"
                value={pet.color}
                onChange={handleChange}
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 placeholder-secondary-400 ${
                  errors.color
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-primary-400/30"
                }`}
              />
              {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
            </div>
          </div>

          {/* Grid for Birth Date and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Data urodzenia *</label>
              <input
                type="date"
                name="bornAt"
                value={formatDateForInput(pet.bornAt)}
                onChange={handleChange}
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 ${
                  errors.bornAt
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-primary-400/30"
                }`}
              />
              {errors.bornAt && <p className="text-red-500 text-xs mt-1">{errors.bornAt}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Waga (g)</label>
              <input
                type="number"
                name="weight"
                placeholder="30"
                value={pet.weight === null ? "" : pet.weight.toString()}
                onChange={handleChange}
                min="0"
                max="10000"
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-primary-800 placeholder-secondary-400 ${
                  errors.weight
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-primary-400/30"
                }`}
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
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
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
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
                  className={`w-full p-3 bg-white/80 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-gray-700 ${
                    errors.deathDate
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300/50"
                  }`}
                />
                {errors.deathDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.deathDate}</p>
                )}
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
            disabled={
              !pet.name || !pet.bornAt || addPetMutation.isPending || Object.keys(errors).length > 0
            }
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
