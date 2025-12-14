"use client";

import { MAX_IMAGES_PER_PET, validateImageCount } from "@/utils/file-validation";
import { UploadDropzone } from "@/utils/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

interface MediaUploaderProps {
  petId: number;
  petUuid: string;
  currentFileCount: number;
}

export default function MediaUploader({ petId, petUuid, currentFileCount }: MediaUploaderProps) {
  const queryClient = useQueryClient();
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
        <UploadDropzone
          /**
           * @see https://docs.uploadthing.com/api-reference/react#uploaddropzone
           */
          endpoint="imageUploader"
          // @ts-expect-error - The input prop is required by the server but not recognized by TypeScript
          input={{ petId: petId.toString() }}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(err) => {
            alert(`Upload error: ${err?.message ?? "Unknown error"}`);
          }}
          onBeforeUploadBegin={(files) => {
            // Validation before upload
            const newValidation = validateImageCount(currentFileCount, files.length);
            if (!newValidation.isValid) {
              alert(newValidation.message);
              return [];
            }
            return files;
          }}
          appearance={{
            container:
              "bg-background/70 backdrop-blur-sm border-2 border-dashed border-primary-300/60 rounded-xl p-8 hover:border-primary-400 transition-colors",
            label: "text-primary-600 text-lg font-medium",
            allowedContent: "text-secondary-600",
            button:
              "ut-ready:bg-primary-500 ut-uploading:cursor-not-allowed rounded-lg px-6 py-3 text-white bg-primary-500 hover:bg-primary-600 transition-colors font-medium",
            uploadIcon: "text-primary-400",
          }}
          className="w-full"
        />
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
