import { Pet } from "@/types/pet";
import React, { useEffect, useState } from "react";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
}

const EditPetModal: React.FC<EditPetModalProps> = ({
  isOpen,
  onClose,
  pet,
}) => {
  const { user } = useUser();
  const ownerId = user?.id;
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthday] = useState("");
  const [weight, setWeight] = useState(0);
  const [color, setColor] = useState("");
  const [isDead, setIsDead] = useState(false);

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed);
      setBirthday(pet.birthDate);
      setWeight(pet.weight);
      setColor(pet.color);
      setIsDead(pet.isDead);
    }
  }, [pet]);

  const handleSubmit = async () => {
    try {
      if (!pet) {
        throw new Error("Pet not found");
      }
      const response = await fetch("/api/editPet", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          breed,
          birthDate,
          weight,
          color,
          ownerId,
          isDead,
          id: pet.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new pet");
      }

      const newPet = await response.json();
      console.log("New pet added successfully:", newPet);
    } catch (error) {
      console.error("Error adding new pet:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          Aktualizuj dane myszy
        </h2>
        <div className="space-y-4">
          <p>Imię myszy</p>
          <input
            type="text"
            placeholder="Imię myszy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Rasa</p>
          <input
            type="text"
            placeholder="Rasa"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Umaszczenie</p>
          <input
            type="text"
            placeholder="Umaszczenie"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p> Data urodzenia</p>
          <input
            type="date"
            placeholder="Data Urodzenia"
            value={birthDate}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p>Waga</p>
          <input
            type="text"
            placeholder="Waga"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex items-center justify-between">
            <p>Czy myszka zmarła?</p>
            <input
              type="checkbox"
              checked={isDead}
              onChange={(e) => setIsDead(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Zamknij
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Aktualizuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPetModal;
