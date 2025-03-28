// src/components/SharePetsModal.tsx
import { useRemoveShare, useSharePets, useSharedUsers } from "@/hooks/useQueries";
import { TrashIcon, UserX2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";

interface SharePetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePetsModal({ isOpen, onClose }: SharePetsModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate: sharePets, isPending: isSharing } = useSharePets();
  const { data: sharedUsers = [], isLoading: isLoadingUsers } = useSharedUsers();
  const { mutate: removeShare, isPending: isRemoving } = useRemoveShare();

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

  const handleRemoveAccess = async (userId: string) => {
    try {
      await removeShare(userId, {
        onError: (error: Error) => {
          setError(error.message);
        },
      });
    } catch (error) {
      setError("Failed to remove access");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-800">Udostępnij Zwierzęta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Wpisz adres email osoby, której chcesz udostępnić wszystkie swoje zwierzęta.
        </p>

        <form onSubmit={handleShare} className="mb-6">
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

        {/* Shared users list */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-primary-800 mb-3">Osoby z dostępem</h3>

          {isLoadingUsers ? (
            <div className="text-center py-3">
              <span className="text-gray-500">Ładowanie...</span>
            </div>
          ) : sharedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-2">Brak udostępnień</p>
          ) : (
            <ul className="divide-y">
              {sharedUsers.map((sharedUser) => (
                <li key={sharedUser.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {sharedUser.user?.firstName} {sharedUser.user?.lastName}
                      </p>
                      <p className="text-gray-500">
                        {sharedUser.user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAccess(sharedUser.sharedWith)}
                    disabled={isRemoving}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Cofnij dostęp"
                  >
                    <UserX2Icon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
