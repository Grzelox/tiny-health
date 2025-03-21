import { useRemoveShare, useSharePets, useSharedUsers } from "@/hooks/useQueries";
import { PetData } from "@/types/pet";
import { ShareIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import React, { useState } from "react";

interface PetShareProps {
  petData: PetData;
}

export default function PetShare({ petData }: PetShareProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: sharedUsers, isLoading } = useSharedUsers();
  const { mutate: sharePets, isPending: isSharing } = useSharePets();
  const { mutate: removeShare, isPending: isRemoving } = useRemoveShare();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await sharePets(email, {
        onSuccess: () => {
          setEmail("");
          setIsAdding(false);
        },
        onError: (error: Error) => {
          setError(error.message);
        },
      });
    } catch (error) {
      setError("Failed to share pets");
    }
  };

  const handleRemoveShare = async (userId: string) => {
    try {
      await removeShare(userId);
    } catch (error) {
      setError("Failed to remove share access");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShareIcon className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-primary-800">Udostępnianie</h2>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Udostępnij</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleShare} className="mb-6">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wprowadź adres email..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isSharing}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
              disabled={isSharing}
            >
              {isSharing ? "Udostępnianie..." : "Udostępnij"}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSharing}
            >
              Anuluj
            </button>
          </div>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-600">Ładowanie...</p>
      ) : sharedUsers?.length > 0 ? (
        <div className="space-y-4">
          {sharedUsers.map((share) => (
            <div
              key={share.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {share.user?.emailAddresses[0]?.emailAddress || "Unknown email"}
                </p>
                <p className="text-sm text-gray-500">
                  Udostępniono: {new Date(share.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemoveShare(share.sharedWith)}
                className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                disabled={isRemoving}
                title="Usuń dostęp"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic">Nie udostępniono jeszcze nikomu</p>
      )}
    </div>
  );
}
