// src/components/SharePetsModal.tsx
import { useRemoveShare, useSharePets, useSharedUsers } from "@/hooks/useQueries";
import { TrashIcon, UserX2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface SharePetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePetsModal({ isOpen, onClose }: SharePetsModalProps) {
  const t = useTranslations("SharePets");
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
      setError(t("shareFailed"));
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
      setError(t("removeAccessFailed"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-800">{t("title")}</h2>
          <button
            onClick={onClose}
            className="btn-secondary p-2 rounded-xl hover:scale-110 transition-all duration-300"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 text-secondary-600">{t("description")}</p>

        <form onSubmit={handleShare} className="mb-6">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full p-3 bg-background/70 backdrop-blur-sm border border-border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 text-secondary-800 placeholder-secondary-400"
              disabled={isSharing}
              required
            />
            {error && <p className="mt-2 text-danger-600 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-xl"
              disabled={isSharing}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSharing}
            >
              {isSharing ? t("sharing") : t("share")}
            </button>
          </div>
        </form>

        {/* Shared users list */}
        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-medium text-primary-800 mb-3">{t("usersWithAccess")}</h3>

          {isLoadingUsers ? (
            <div className="text-center py-3">
              <span className="text-secondary-500">{t("loading")}</span>
            </div>
          ) : sharedUsers.length === 0 ? (
            <p className="text-secondary-500 text-center py-2">{t("noShares")}</p>
          ) : (
            <ul className="divide-y">
              {sharedUsers.map((sharedUser) => (
                <li key={sharedUser.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-secondary-900">
                        {sharedUser.user?.firstName} {sharedUser.user?.lastName}
                      </p>
                      <p className="text-secondary-500">
                        {sharedUser.user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAccess(sharedUser.sharedWith)}
                    disabled={isRemoving}
                    className="text-danger-600 hover:text-danger-700 p-1 rounded-full hover:bg-danger-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t("revokeAccess")}
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
