"use client";

import { UploadedImage } from "@/types/pet";
import Image from "next/image";
import { useState } from "react";

interface GalleryProps {
  uploadedFiles: UploadedImage[];
}

export default function Gallery({ uploadedFiles }: GalleryProps) {
  if (uploadedFiles.length === 0) return null;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;
    const newIndex =
      direction === "prev"
        ? (selectedImageIndex - 1 + uploadedFiles.length) % uploadedFiles.length
        : (selectedImageIndex + 1) % uploadedFiles.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Galeria</h2>
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadedFiles.map((file, index) => (
          <div
            key={file.id}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={file.url}
              alt={`Pet photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover rounded-lg"
              priority={index < 4} // Load first 4 images immediately
            />
          </div>
        ))}
      </div>

      {/* Modal Gallery */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("prev");
              }}
            >
              ←
            </button>
            <div
              className="relative w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={uploadedFiles[selectedImageIndex].url}
                alt={`Pet photo ${selectedImageIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("next");
              }}
            >
              →
            </button>
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={handleCloseModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
