import { useEditPet } from "@/hooks/useQueries";
import { Pet, PetData } from "@/types/pet";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetData | null;
}

const EditPetModal: React.FC<EditPetModalProps> = ({
  isOpen,
  onClose,
  pet,
}) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthday] = useState("");
  const [weight, setWeight] = useState(0);
  const [color, setColor] = useState("");
  const [isDead, setIsDead] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const supabase = createClient();

  const { mutate: editPet } = useEditPet();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setOwnerId(user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed);
      const formattedDate = new Date(pet.bornAt).toISOString().split("T")[0];
      setBirthday(formattedDate);
      setWeight(pet.weight);
      setColor(pet.color);
      setIsDead(pet.isDead);
    }
  }, [pet]);

  const handleSubmit = () => {
    if (!pet) {
      return;
    }

    editPet({
      id: pet.id.toString(),
      name,
      breed,
      bornAt: new Date(birthDate).toISOString(),
      weight,
      color,
      isDead,
      ownerId: ownerId ?? "",
    });
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
