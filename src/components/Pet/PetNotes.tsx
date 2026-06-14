import { useUpdatePetNotes } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import { renderNotesMarkdown } from "@/utils/markdown";
import { EditIcon } from "lucide-react";
import React, { useState } from "react";

interface PetNotesProps {
  petData: FullPetData;
  onUpdate: () => void;
}

export default function PetNotes({ petData, onUpdate }: PetNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [notes, setNotes] = useState(petData.notes || "");
  const { mutate: updateNotes, isPending } = useUpdatePetNotes();

  const handleSave = () => {
    updateNotes(
      {
        id: petData.id,
        petUuid: petData.uuid,
        notes: notes,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setIsPreviewing(false);
          onUpdate();
        },
      },
    );
  };

  const handleCancel = () => {
    setNotes(petData.notes || "");
    setIsEditing(false);
    setIsPreviewing(false);
  };

  return (
    <div className="card-modern rounded-2xl p-8 mb-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary-800">Notatki</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
            aria-label="Edit notes"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex space-x-2 text-sm">
            <button
              type="button"
              onClick={() => setIsPreviewing(false)}
              className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                !isPreviewing
                  ? "bg-primary-500 text-white"
                  : "bg-surface/80 text-secondary-600 hover:bg-primary-50"
              }`}
            >
              Edycja
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewing(true)}
              className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                isPreviewing
                  ? "bg-primary-500 text-white"
                  : "bg-surface/80 text-secondary-600 hover:bg-primary-50"
              }`}
            >
              Podgląd
            </button>
          </div>

          {isPreviewing ? (
            <div className="bg-primary-50 p-4 rounded-lg min-h-[150px]">
              {notes ? (
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: renderNotesMarkdown(notes) }}
                />
              ) : (
                <p className="text-secondary-400 italic">Brak treści do podglądu.</p>
              )}
            </div>
          ) : (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dodaj notatki o swoim pupilu..."
                className="w-full p-3 bg-background/70 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[150px]"
                disabled={isPending}
              />
              <p className="text-xs text-secondary-400">
                Wspierany Markdown: **pogrubienie**, *kursywa*, # nagłówki, listy (-, 1.) oraz
                [linki](https://...).
              </p>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="btn-secondary px-4 py-2 rounded-lg"
              disabled={isPending}
            >
              Anuluj
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-primary-50 p-4 rounded-lg">
          {petData.notes ? (
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderNotesMarkdown(petData.notes) }}
            />
          ) : (
            <p className="text-secondary-400 italic">
              Brak notatek. Kliknij ikonę edycji, aby dodać.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
