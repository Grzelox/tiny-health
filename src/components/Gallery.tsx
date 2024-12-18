"use client";

import { UploadDropzone, useUploadThing } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useState } from "react";

export default function Gallery({ petId, images }: { petId: number; images: any[] }) {
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; key: string }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null,
  );


  const { startUpload } = useUploadThing("imageUploader", {
    /**
     * @see https://docs.uploadthing.com/api-reference/react#useuploadthing
     */
    onBeforeUploadBegin: (files) => {
      console.log("Uploading", files.length, "files");
      return files;
    },
    onUploadBegin: (name) => {
      console.log("Beginning upload of", name);
    },
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res.length, "files uploaded");
      setUploadedFiles((prev) => [
        ...prev,
        ...res.map((file) => ({ url: file.url, key: file.key })),
      ]);
    },
    onUploadProgress(p) {
      console.log("onUploadProgress", p);
    },
  });

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setCurrentImageIndex(null);
  };

  const showPreviousImage = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (
      currentImageIndex !== null &&
      currentImageIndex < uploadedFiles.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className="bg-pastel-green p-6 rounded-lg shadow-md">
      <UploadDropzone
        /**
         * @see https://docs.uploadthing.com/api-reference/react#uploaddropzone
         */
        endpoint={(routeRegistry) => routeRegistry.imageUploader}
        onUploadAborted={() => {
          alert("Upload Aborted");
        }}
        onClientUploadComplete={(res) => {
          console.log(`onClientUploadComplete`, res);
          setUploadedFiles((prev) => [
            ...prev,
            ...res.map((file) => ({ url: file.url, key: file.key })),
          ]);
        }}
        onUploadBegin={() => {
          console.log("upload begin");
        }}
        className="bg-pastel-yellow text-black py-2 px-4 rounded-full hover:bg-pastel-yellow-dark transition mt-4"
      />

      <input
        type="file"
        multiple
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          await startUpload(files);
        }}
        className="mt-4 block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pastel-orange file:text-black hover:file:bg-pastel-orange-dark"
      />

      <div className="grid grid-cols-3 gap-4 mt-6">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="w-full h-32 bg-gray-200 relative">
            <Image
              src={file.url}
              alt={`Uploaded file ${index + 1}`}
              layout="fill"
              objectFit="cover"
              onClick={() => openImageModal(index)}
            />
          </div>
        ))}
      </div>

      {currentImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times;
          </button>
          <button
            onClick={showPreviousImage}
            className="absolute left-4 text-white text-2xl"
          >
            &lt;
          </button>
          <Image
            src={uploadedFiles[currentImageIndex].url}
            alt={`Full view of uploaded file ${currentImageIndex + 1}`}
            width={800}
            height={600}
            objectFit="contain"
          />
          <button
            onClick={showNextImage}
            className="absolute right-4 text-white text-2xl"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
