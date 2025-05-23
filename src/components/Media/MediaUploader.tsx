"use client";

import { MAX_IMAGES_PER_PET, validateImageCount } from "@/utils/file-validation";
import { UploadDropzone, useUploadThing } from "@/utils/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

interface MediaUploaderProps {
  petId: number;
  currentFileCount: number;
}

export default function MediaUploader({ petId, currentFileCount }: MediaUploaderProps) {
  const queryClient = useQueryClient();
  const validation = validateImageCount(currentFileCount);

  const { startUpload } = useUploadThing("imageUploader", {
    /**
     * @see https://docs.uploadthing.com/api-reference/react#useuploadthing
     */
    onBeforeUploadBegin: (files) => {
      console.log(`Starting upload for pet ${petId} with ${files.length} files`);
      return files;
    },
    onUploadBegin: (name) => {
      console.log(`Upload begun for pet ${petId}: ${name}`);
    },
    onClientUploadComplete: (res) => {
      console.log(`Upload completed for pet ${petId}:`, res);
      queryClient.invalidateQueries({
        queryKey: ["pets"],
      });
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onUploadProgress(p) {},
  });

  return (
    <div className="bg-pastel-green p-6 rounded-lg shadow-md">
      {/* File Count Info */}
      <div className="mb-4 p-4 bg-white/70 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-700">Zdjęcia</h3>
            <p className="text-sm text-secondary-600">
              {currentFileCount} z {MAX_IMAGES_PER_PET} zdjęć
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-secondary-600">Pozostało: {validation.remaining}</div>
            <div className="text-xs text-secondary-500">Max rozmiar: 32MB</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              currentFileCount >= MAX_IMAGES_PER_PET
                ? "bg-red-500"
                : currentFileCount >= MAX_IMAGES_PER_PET * 0.8
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${Math.min((currentFileCount / MAX_IMAGES_PER_PET) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning if near or at limit */}
      {!validation.isValid && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm font-medium">⚠️ {validation.message}</p>
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
          onUploadAborted={() => {
            alert("Upload Aborted");
          }}
          onClientUploadComplete={(res) => {
            queryClient.invalidateQueries({
              queryKey: ["pets"],
            });
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
          appearance={{
            container:
              "bg-white border-2 border-dashed border-primary-300 rounded-lg p-8 hover:border-primary-400 transition-colors",
            label: "text-primary-700",
            allowedContent: "text-secondary-600",
            button:
              "ut-ready:bg-primary-600 ut-uploading:cursor-not-allowed rounded-lg px-4 py-2 text-white bg-primary-700 transition-colors",
            uploadIcon: "text-primary-500",
          }}
          onUploadBegin={() => {}}
          className="bg-pastel-yellow text-black py-4 rounded-full hover:bg-pastel-yellow-dark transition mt-4"
        />
      ) : (
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">📸</div>
            <p className="font-medium">Osiągnięto maksymalną liczbę zdjęć</p>
            <p className="text-sm">Usuń niektóre zdjęcia, aby dodać nowe</p>
          </div>
        </div>
      )}
    </div>
  );
}
