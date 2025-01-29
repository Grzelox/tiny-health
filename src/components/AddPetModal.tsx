import { useAuthUser } from "@/hooks/useAuthUSer";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUpdatedPets: (updated: boolean) => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  setUpdatedPets,
}) => {
  const supabase = createClient();
  const user = useAuthUser();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthday] = useState("");
  const [weight, setWeight] = useState(0);
  const [color, setColor] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    try {
      const { data: newPet, error } = await supabase
        .from("pets")
        .insert([
          {
            name,
            breed,
            birth_date: birthDate,
            weight,
            color,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("New pet added successfully:", newPet);
      setUpdatedPets(true);
      onClose();
    } catch (error) {
      console.error("Error adding new pet:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          Dodaj nową myszkę
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
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
