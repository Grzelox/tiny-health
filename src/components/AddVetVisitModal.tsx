import { VetVisit } from "@/types/pet";
import React, { useState } from "react";

interface AddVetVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
}

const AddVetVisitModal: React.FC<AddVetVisitModalProps> = ({
  isOpen,
  onClose,
  petId,
}) => {
  const [description, setDescription] = useState("");
  const [medication, setMedication] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/addVetVisit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          medication,
          date,
          petId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new pet");
      }

      const newVisit = await response.json();
    } catch (error) {
      console.error("Error adding new visit:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          Dodaj wizytę weterynaryjną
        </h2>
        <div className="space-y-4">
          <textarea
            placeholder="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={5}
          />
          <textarea
            placeholder="Leki"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={2}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            Dodaj wizytę
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVetVisitModal;
