/**
 * File validation constants and utilities
 */

export const MAX_IMAGES_PER_PET = 10;
export const MAX_FILE_SIZE_MB = 32;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validates if adding files would exceed the pet image limit
 * @param currentFileCount Current number of files for the pet
 * @param filesToAdd Number of files being added
 * @returns Object with validation result and message
 */
export const validateImageCount = (currentFileCount: number, filesToAdd: number = 1) => {
  const newTotal = currentFileCount + filesToAdd;

  if (newTotal > MAX_IMAGES_PER_PET) {
    return {
      isValid: false,
      message: `Limit zdjęć osiągnięty. Maksymalnie ${MAX_IMAGES_PER_PET} zdjęć na gryzonia.`,
      remaining: MAX_IMAGES_PER_PET - currentFileCount,
    };
  }

  return {
    isValid: true,
    message: "",
    remaining: MAX_IMAGES_PER_PET - currentFileCount,
  };
};

/**
 * Validates file size
 * @param fileSizeBytes File size in bytes
 * @returns Object with validation result and message
 */
export const validateFileSize = (fileSizeBytes: number) => {
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      message: `Plik jest za duży. Maksymalny rozmiar to ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Formats file size in human readable format
 * @param bytes File size in bytes
 * @returns Formatted string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
