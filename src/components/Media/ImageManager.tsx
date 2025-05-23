"use client";

import { UploadedImage } from "@/types/pet";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageManagerProps {
  uploadedFiles: UploadedImage[];
  petId: number;
}

export default function ImageManager({ uploadedFiles, petId }: ImageManagerProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDeleteFile = async (fileId: string) => {
    setDeletingFileId(fileId);
    setError(null);

    try {
      const response = await fetch(`/api/v1/files?fileId=${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete file");
      }

      // Refresh the pet data to update the gallery
      queryClient.invalidateQueries({
        queryKey: ["pets"],
      });

      // Reload the page to ensure all data is refreshed
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Błąd podczas usuwania pliku. Spróbuj ponownie.");
    } finally {
      setDeletingFileId(null);
    }
  };

  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {uploadedFiles.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={file.url}
                  alt={`Zdjęcie ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover rounded-md"
                />
              </div>

              {/* File Info */}
              <div className="flex-grow">
                <p className="text-sm text-gray-500">
                  Dodano:{" "}
                  {new Date(file.createdAt).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteFile(file.id)}
                disabled={deletingFileId === file.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  deletingFileId === file.id
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
                title="Usuń zdjęcie"
              >
                <Trash2 size={16} />
                {deletingFileId === file.id ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
