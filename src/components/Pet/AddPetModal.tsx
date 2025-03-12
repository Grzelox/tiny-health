import { useAddPet } from "@/hooks/useQueries";
import { NewPet } from "@/types/pet";
import React, { useState } from "react";

interface AddPetModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ user, isOpen, onClose }) => {
  const addPetMutation = useAddPet();
  const [pet, setPet] = useState<NewPet>({
    name: "",
    breed: "",
    bornAt: "",
    weight: 0,
    color: "",
    isDead: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPet((prev) => ({
      ...prev,
      [name]:
        name === "weight"
          ? Number(value)
          : name === "bornAt"
            ? new Date(value).toISOString()
            : value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    try {
      await addPetMutation.mutateAsync({
        ...pet,
        ownerId: user.id,
      });
      onClose();
    } catch (error) {
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
            value={pet.bornAt}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Waga</p>
          <input
            type="text"
            name="weight"
            placeholder="Waga"
            value={pet.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Zamknij
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
