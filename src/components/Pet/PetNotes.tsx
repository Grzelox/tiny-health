import { useUpdatePetNotes } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import { EditIcon } from "lucide-react";
import React, { useState } from "react";

interface PetNotesProps {
  petData: FullPetData;
  onUpdate: () => void;
}

export default function PetNotes({ petData, onUpdate }: PetNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(petData.notes || "");
  const { mutate: updateNotes, isPending } = useUpdatePetNotes();

  const handleSave = () => {
    updateNotes(
      {
        id: petData.id,
        uuid: petData.uuid,
        notes: notes,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          onUpdate();
        },
      },
    );
  };

  const handleCancel = () => {
    setNotes(petData.notes || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary-800">Notatki</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Edit notes"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dodaj notatki o swoim pupilu..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[150px]"
            disabled={isPending}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isPending}
            >
              Anuluj
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
              disabled={isPending}
            >
              {isPending ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-primary-50 p-4 rounded-lg">
          {petData.notes ? (
            <p className="whitespace-pre-wrap">{petData.notes}</p>
          ) : (
            <p className="text-gray-400 italic">Brak notatek. Kliknij ikonę edycji, aby dodać.</p>
          )}
        </div>
      )}
    </div>
  );
}
