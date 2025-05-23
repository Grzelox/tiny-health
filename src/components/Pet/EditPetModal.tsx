import { useEditPet } from "@/hooks/useQueries";
import { AnimalType, FullPetData } from "@/types/pet";
import { Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: FullPetData | null;
}

interface ValidationErrors {
  name?: string;
  breed?: string;
  color?: string;
  birthDate?: string;
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

const EditPetModal: React.FC<EditPetModalProps> = ({ isOpen, onClose, pet }) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [animalType, setAnimalType] = useState<AnimalType>("Mysz");
  const [birthDate, setBirthday] = useState("");
  const [color, setColor] = useState("");
  const [isDead, setIsDead] = useState(false);
  const [deathDate, setDeathDate] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});

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

  // Run validation whenever form data changes
  useEffect(() => {
    validateForm();
  }, [name, breed, color, birthDate, deathDate, isDead]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Imię jest wymagane";
    } else if (name.length > MAX_STRING_LENGTH) {
      newErrors.name = `Imię nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Breed validation
    if (breed && breed.length > MAX_STRING_LENGTH) {
      newErrors.breed = `Rasa nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Color validation
    if (color && color.length > MAX_STRING_LENGTH) {
      newErrors.color = `Umaszczenie nie może przekraczać ${MAX_STRING_LENGTH} znaków`;
    }

    // Birth date validation
    if (!birthDate) {
      newErrors.birthDate = "Data urodzenia jest wymagana";
    } else {
      const birth = new Date(birthDate);
      const today = new Date();
      if (birth > today) {
        newErrors.birthDate = "Data urodzenia nie może być z przyszłości";
      }
    }

    // Death date validation
    if (isDead) {
      if (!deathDate) {
        newErrors.deathDate = "Data śmierci jest wymagana";
      } else {
        const death = new Date(deathDate);
        const birth = new Date(birthDate);
        const today = new Date();

        if (death > today) {
          newErrors.deathDate = "Data śmierci nie może być z przyszłości";
        } else if (birthDate && death < birth) {
          newErrors.deathDate = "Data śmierci nie może być wcześniejsza niż data urodzenia";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear error when field changes
  const clearError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleSubmit = () => {
    if (!pet || !initialValues) return;

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Create an object with only the changed values
    const changes: Record<string, any> = {
      petId: pet.id,
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
      // > 1 because petId is always included
      editPet({ data: changes, petUuid: pet.uuid });
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
            <label className="text-sm font-semibold text-secondary-700">Rodzaj *</label>
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
            <label className="text-sm font-semibold text-secondary-700">Imię *</label>
            <input
              type="text"
              placeholder="Wprowadź imię gryzonia"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400 ${
                errors.name
                  ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary-200/50"
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
                placeholder="Laboratoryjna"
                value={breed}
                onChange={(e) => {
                  setBreed(e.target.value);
                  clearError("breed");
                }}
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400 ${
                  errors.breed
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary-200/50"
                }`}
              />
              {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700">Umaszczenie</label>
              <input
                type="text"
                placeholder="np. Czarna"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  clearError("color");
                }}
                className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 placeholder-secondary-400 ${
                  errors.color
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary-200/50"
                }`}
              />
              {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary-700">Data urodzenia *</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthday(e.target.value);
                clearError("birthDate");
              }}
              className={`w-full p-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 text-secondary-800 ${
                errors.birthDate
                  ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary-200/50"
              }`}
            />
            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
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
                  onChange={(e) => {
                    setIsDead(e.target.checked);
                    if (!e.target.checked) {
                      setDeathDate("");
                      clearError("deathDate");
                    }
                  }}
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
                  onChange={(e) => {
                    setDeathDate(e.target.value);
                    clearError("deathDate");
                  }}
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
            disabled={isPending || Object.keys(errors).length > 0}
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
