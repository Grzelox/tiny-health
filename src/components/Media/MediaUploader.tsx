"use client";

import { UploadDropzone, useUploadThing } from "@/utils/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function MediaUploader({ petId }: { petId: number }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader", {
    /**
     * @see https://docs.uploadthing.com/api-reference/react#useuploadthing
     */
    onBeforeUploadBegin: (files) => {
      return files;
    },
    onUploadBegin: (name) => {},
    onClientUploadComplete: (res) => {},
    onUploadProgress(p) {},
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
        className="bg-pastel-yellow text-black py-2 px-4 rounded-full hover:bg-pastel-yellow-dark transition mt-4"
      />
    </div>
  );
}
