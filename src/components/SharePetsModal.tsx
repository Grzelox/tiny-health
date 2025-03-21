// src/components/SharePetsModal.tsx
import { useSharePets } from "@/hooks/useQueries";
import { XIcon } from "lucide-react";
import React, { useState } from "react";

interface SharePetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePetsModal({ isOpen, onClose }: SharePetsModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate: sharePets, isPending: isSharing } = useSharePets();

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await sharePets(email, {
        onSuccess: () => {
          setEmail("");
          onClose();
        },
        onError: (error: Error) => {
          setError(error.message);
        },
      });
    } catch (error) {
      setError("Failed to share pets");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-800">Udostępnij Zwierzęta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Wpisz adres email osoby, której chcesz udostępnić wszystkie swoje zwierzęta.
        </p>

        <form onSubmit={handleShare}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wprowadź adres email..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isSharing}
              required
            />
            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSharing}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
              disabled={isSharing}
            >
              {isSharing ? "Udostępnianie..." : "Udostępnij"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
