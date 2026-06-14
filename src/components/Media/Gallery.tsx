"use client";

import { UploadedImage } from "@/types/pet";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface GalleryProps {
  uploadedFiles: UploadedImage[];
  petId: number;
  petUuid: string;
}

export default function Gallery({ uploadedFiles, petId, petUuid }: GalleryProps) {
  const t = useTranslations("Gallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [modalImageLoading, setModalImageLoading] = useState<boolean>(false);
  const [focusedImageIndex, setFocusedImageIndex] = useState<number>(-1);
  const queryClient = useQueryClient();
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback((fileId: string) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  }, []);

  const handleImageLoadStart = useCallback((fileId: string) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(fileId);
      return newSet;
    });
  }, []);

  const handleModalImageLoadStart = useCallback(() => {
    setModalImageLoading(true);
  }, []);

  const handleModalImageLoad = useCallback(() => {
    setModalImageLoading(false);
  }, []);

  const handleDeleteFile = useCallback(
    async (fileId: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

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

        // Invalidate the specific pet query using UUID (key change!)
        await queryClient.invalidateQueries({
          queryKey: ["pet", petUuid],
        });
        // Also invalidate the pets list to update any summaries
        await queryClient.invalidateQueries({
          queryKey: ["pets"],
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        setError(t("deleteError"));
      } finally {
        setDeletingFileId(null);
      }
    },
    [queryClient, petUuid, t],
  );

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setModalImageLoading(true); // Start loading when modal opens
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(null);
    setModalImageLoading(false); // Reset loading state when closing
  }, []);

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImageIndex === null) return;
      setModalImageLoading(true); // Start loading for new image
      const newIndex =
        direction === "prev"
          ? (selectedImageIndex - 1 + uploadedFiles.length) % uploadedFiles.length
          : (selectedImageIndex + 1) % uploadedFiles.length;
      setSelectedImageIndex(newIndex);
    },
    [selectedImageIndex, uploadedFiles.length],
  );

  // Keyboard navigation for gallery grid
  const handleGridKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const gridCols = {
        2: 2, // Mobile
        3: 3, // Tablet
        4: 4, // Desktop
      };

      // Use desktop columns as default for keyboard navigation
      const cols = 4;
      const totalImages = uploadedFiles.length;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          setFocusedImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : prev));
          break;
        case "ArrowLeft":
          event.preventDefault();
          setFocusedImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedImageIndex((prev) => {
            const newIndex = prev + cols;
            return newIndex < totalImages ? newIndex : prev;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedImageIndex((prev) => {
            const newIndex = prev - cols;
            return newIndex >= 0 ? newIndex : prev;
          });
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedImageIndex >= 0) {
            handleImageClick(focusedImageIndex);
          }
          break;
        case "Delete":
        case "Backspace":
          event.preventDefault();
          if (focusedImageIndex >= 0) {
            const file = uploadedFiles[focusedImageIndex];
            handleDeleteFile(file.id);
          }
          break;
      }
    },
    [focusedImageIndex, uploadedFiles, handleImageClick, handleDeleteFile],
  );

  // Keyboard navigation for modal
  const handleModalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          handleCloseModal();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handleNavigate("prev");
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNavigate("next");
          break;
        case "Delete":
        case "Backspace":
          event.preventDefault();
          if (selectedImageIndex !== null) {
            const file = uploadedFiles[selectedImageIndex];
            handleDeleteFile(file.id);
            handleCloseModal();
          }
          break;
      }
    },
    [handleCloseModal, handleNavigate, selectedImageIndex, uploadedFiles, handleDeleteFile],
  );

  // Set up keyboard listeners for modal
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleModalKeyDown);
      return () => {
        document.removeEventListener("keydown", handleModalKeyDown);
      };
    }
  }, [selectedImageIndex, handleModalKeyDown]);

  // Focus management
  useEffect(() => {
    if (focusedImageIndex >= 0 && galleryRef.current) {
      const imageElement = galleryRef.current.children[focusedImageIndex] as HTMLElement;
      imageElement?.focus();
    }
  }, [focusedImageIndex]);

  // Early return after all hooks are defined
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">{error}</p>
        </div>
      )}

      {/* Image Grid */}
      <div
        ref={galleryRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        onKeyDown={handleGridKeyDown}
        role="grid"
        aria-label={t("gridLabel")}
      >
        {uploadedFiles.map((file, index) => (
          <div
            key={file.id}
            className={`relative aspect-square cursor-pointer hover:opacity-90 transition-all duration-200 rounded-lg overflow-hidden group ${
              focusedImageIndex === index
                ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => handleImageClick(index)}
            onFocus={() => setFocusedImageIndex(index)}
            tabIndex={0}
            role="gridcell"
            aria-label={t("imageOfCount", { index: index + 1, total: uploadedFiles.length })}
          >
            {/* Loading Animation */}
            {loadingImages.has(file.id) && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={file.url}
              alt={t("imageAlt", { index: index + 1 })}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              priority={index < 4}
              onLoadingComplete={() => handleImageLoad(file.id)}
              onLoadStart={() => handleImageLoadStart(file.id)}
            />

            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteFile(file.id, e)}
              disabled={deletingFileId === file.id}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                deletingFileId === file.id
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-danger-500 hover:bg-danger-600 focus:bg-danger-600"
              } text-white shadow-lg z-20`}
              title={t("deletePhoto")}
              aria-label={t("deletePhotoNumber", { index: index + 1 })}
            >
              {deletingFileId === file.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {index + 1}/{uploadedFiles.length}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Gallery */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label={t("previewLabel")}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Previous Button */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("prev");
              }}
              aria-label={t("prevImage")}
            >
              ←
            </button>

            {/* Image Container */}
            <div
              className="relative w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Loading Animation */}
              {modalImageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white mt-4 text-sm">{t("loadingImage")}</p>
                  </div>
                </div>
              )}

              <Image
                src={uploadedFiles[selectedImageIndex].url}
                alt={t("imageAlt", { index: selectedImageIndex + 1 })}
                fill
                sizes="90vw"
                className="object-contain"
                priority
                onLoadStart={handleModalImageLoadStart}
                onLoadingComplete={handleModalImageLoad}
                onError={() => setModalImageLoading(false)}
              />

            </div>

            {/* Next Button */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate("next");
              }}
              aria-label={t("nextImage")}
            >
              →
            </button>

            {/* Top-right Controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(uploadedFiles[selectedImageIndex].id);
                  handleCloseModal();
                }}
                disabled={deletingFileId === uploadedFiles[selectedImageIndex].id}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  deletingFileId === uploadedFiles[selectedImageIndex].id
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-danger-500 hover:bg-danger-600"
                } text-white shadow-lg`}
                title={t("deletePhoto")}
                aria-label={t("deleteCurrentPhoto")}
              >
                {deletingFileId === uploadedFiles[selectedImageIndex].id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={20} />
                )}
              </button>

              <button
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                aria-label={t("closePreview")}
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">
                {t("counter", { index: selectedImageIndex + 1, total: uploadedFiles.length })}
              </p>
              <p className="text-xs text-gray-300">
                {t("addedOn", {
                  date: new Date(
                    uploadedFiles[selectedImageIndex].createdAt,
                  ).toLocaleDateString("pl-PL"),
                })}
              </p>
            </div>

            {/* Keyboard Instructions */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs">
              <p>{t("kbdNavigate")}</p>
              <p>{t("kbdClose")}</p>
              <p>{t("kbdDelete")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
