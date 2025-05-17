import { useAddPet } from "@/hooks/useQueries";
import { Pet } from "@/types/pet";
import React, { useState } from "react";

interface AddPetModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ user, isOpen, onClose }) => {
  const addPetMutation = useAddPet();
  const [pet, setPet] = useState<Omit<Pet, "id" | "updatedAt" | "ownerId">>({
    name: "",
    breed: "",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Dodaj nową myszkę</h2>
        <div className="space-y-4">
          <p>Imię myszy</p>
          <input
            type="text"
            name="name"
            placeholder="Imię myszy"
            value={pet.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Rasa</p>
          <input
            type="text"
            name="breed"
            placeholder="Rasa"
            value={pet.breed}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Umaszczenie</p>
          <input
            type="text"
            name="color"
            placeholder="Umaszczenie"
            value={pet.color}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Data urodzenia</p>
          <input
            type="date"
            name="bornAt"
            placeholder="Data Urodzenia"
            value={formatDateForInput(pet.bornAt)}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Waga</p>
          <input
            type="number"
            name="weight"
            placeholder="Waga"
            value={pet.weight || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex items-center justify-between">
            <p>Czy myszka zmarła?</p>
            <input
              type="checkbox"
              name="isDead"
              checked={pet.isDead}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          {pet.isDead && (
            <>
              <p>Data śmierci</p>
              <input
                type="date"
                name="deathDate"
                placeholder="Data śmierci"
                value={formatDateForInput(pet.deathDate || "")}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Zamknij
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            disabled={!pet.name || !pet.bornAt}
          >
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
