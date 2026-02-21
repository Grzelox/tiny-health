"use client";

import { MAX_IMAGES_PER_PET, validateFileSize, validateImageCount } from "@/utils/file-validation";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

interface MediaUploaderProps {
  petId: number;
  petUuid: string;
  currentFileCount: number;
}

export default function MediaUploader({ petId, petUuid, currentFileCount }: MediaUploaderProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const validation = validateImageCount(currentFileCount);

  const handleUploadComplete = async (_res: unknown): Promise<void> => {
    // Invalidate the specific pet query using UUID (this is the key change!)
    await queryClient.invalidateQueries({
      queryKey: ["pet", petUuid],
    });
    // Also invalidate the pets list to update any summaries
    await queryClient.invalidateQueries({
      queryKey: ["pets"],
    });
  };

  const handleFileUpload = async (file: File) => {
    const countValidation = validateImageCount(currentFileCount, 1);
    if (!countValidation.isValid) {
      setError(countValidation.message);
      return;
    }

    const sizeValidation = validateFileSize(file.size);
    if (!sizeValidation.isValid) {
      setError(sizeValidation.message);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadResponse = await fetch("/api/v1/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Nie udało się przygotować uploadu");
      }

      const { uploadUrl, publicUrl, key } = (await uploadResponse.json()) as {
        uploadUrl: string;
        publicUrl: string;
        key: string;
      };

      const uploadToSpaces = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadToSpaces.ok) {
        throw new Error("Nie udało się przesłać pliku do Spaces");
      }

      const finalizeResponse = await fetch("/api/v1/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          url: publicUrl,
          storageKey: key,
        }),
      });

      if (!finalizeResponse.ok) {
        const errorData = await finalizeResponse.json();
        throw new Error(errorData.message || "Nie udało się zapisać pliku");
      }

      await handleUploadComplete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
    event.target.value = "";
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploading) return;
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="card-modern p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-600 mb-2">Dodaj zdjęcia</h3>
        <p className="text-sm text-secondary-600">
          Maksymalnie {MAX_IMAGES_PER_PET} zdjęć na zwierzaka. Maksymalny rozmiar pliku: 32MB.
        </p>
      </div>

      {/* Warning if near or at limit */}
      {!validation.isValid && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="text-danger-600 text-2xl">⚠️</div>
            <div>
              <p className="text-danger-700 text-sm font-medium">{validation.message}</p>
              <p className="text-danger-600 text-xs mt-1">
                Usuń niektóre zdjęcia z galerii, aby móc dodać nowe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {validation.isValid ? (
        <div
          className="bg-background/70 backdrop-blur-sm border-2 border-dashed border-primary-300/60 rounded-xl p-8 hover:border-primary-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div>
              <p className="text-primary-600 text-lg font-medium">Przeciągnij zdjęcie tutaj</p>
              <p className="text-secondary-600 text-sm">lub wybierz plik z dysku</p>
            </div>
            <button
              type="button"
              className="rounded-lg px-6 py-3 text-white bg-primary-500 hover:bg-primary-600 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Wysyłanie..." : "Wybierz plik"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {error && <p className="text-danger-600 text-sm">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-background/60 border-2 border-dashed border-border rounded-xl p-8 text-center">
          <div className="text-secondary-500">
            <div className="text-4xl mb-3">📸</div>
            <p className="font-medium text-lg mb-2">Osiągnięto maksymalną liczbę zdjęć</p>
            <p className="text-sm text-secondary-600">
              Masz już {currentFileCount} z {MAX_IMAGES_PER_PET} dozwolonych zdjęć
            </p>
            <p className="text-sm text-secondary-600 mt-1">
              Usuń niektóre zdjęcia z galerii, aby dodać nowe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
