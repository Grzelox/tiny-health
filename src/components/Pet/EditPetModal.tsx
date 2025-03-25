import { useEditPet } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import React, { useEffect, useState } from "react";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: FullPetData | null;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ isOpen, onClose, pet }) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthday] = useState("");
  const [color, setColor] = useState("");
  const [isDead, setIsDead] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  // Track initial values to compare against
  const [initialValues, setInitialValues] = useState<{
    name: string;
    breed: string;
    birthDate: string;
    color: string;
    isDead: boolean;
  } | null>(null);

  const { mutate: editPet } = useEditPet();

  useEffect(() => {
    if (pet) {
      const formattedDate = pet.bornAt ? new Date(pet.bornAt).toISOString().split("T")[0] : "";

      // Set current form values
      setName(pet.name);
      setBreed(pet.breed);
      setBirthday(formattedDate);
      setColor(pet.color);
      setIsDead(pet.isDead);

      // Store initial values for comparison
      setInitialValues({
        name: pet.name,
        breed: pet.breed,
        birthDate: formattedDate,
        color: pet.color,
        isDead: pet.isDead,
      });
    }
  }, [pet]);

  const handleSubmit = () => {
    if (!pet || !initialValues) return;

    // Create an object with only the changed values
    const changes: Record<string, any> = {
      id: pet.id.toString(),
    };

    if (name !== initialValues.name) changes.name = name;
    if (breed !== initialValues.breed) changes.breed = breed;
    if (birthDate !== initialValues.birthDate) changes.bornAt = new Date(birthDate).toISOString();
    if (color !== initialValues.color) changes.color = color;
    if (isDead !== initialValues.isDead) changes.isDead = isDead;

    // Only send the update if there are actual changes
    if (Object.keys(changes).length > 1) {
      // > 1 because id is always included
      editPet(changes);
      onClose();
    } else {
      onClose(); // No changes, just close the modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Aktualizuj dane myszy</h2>
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
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
