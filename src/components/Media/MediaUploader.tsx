"use client";

import { UploadDropzone, useUploadThing } from "@/utils/uploadthing";
import React, { useState } from "react";

export default function MediaUploader({ petId }: { petId: number }) {
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
      return files;
    },
    onUploadBegin: (name) => {},
    onClientUploadComplete: (res) => {
      setUploadedFiles((prev) => [
        ...prev,
        ...res.map((file) => ({ url: file.url, key: file.key })),
      ]);
    },
    onUploadProgress(p) {
    },
  });

  return (
    <div className="bg-pastel-green p-6 rounded-lg shadow-md">
      <UploadDropzone
        /**
         * @see https://docs.uploadthing.com/api-reference/react#uploaddropzone
         */
        endpoint="imageUploader"
        input={{ petId: petId.toString() }}
        onUploadAborted={() => {
          alert("Upload Aborted");
        }}
        onClientUploadComplete={(res) => {
          setUploadedFiles((prev) => [
            ...prev,
            ...res.map((file) => ({ url: file.url, key: file.key })),
          ]);
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
        onUploadBegin={() => {
          console.log("upload begin");
        }}
        className="bg-pastel-yellow text-black py-2 px-4 rounded-full hover:bg-pastel-yellow-dark transition mt-4"
      />
    </div>
  );
}
