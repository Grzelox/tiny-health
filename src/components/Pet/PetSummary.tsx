"use client";

import { FullPetData, UploadedImage, VetVisit } from "@/types/pet";

import Gallery from "../Media/Gallery";
import MediaUploader from "../Media/MediaUploader";
import VetVisitList from "../VetVisit/VetVisitList";
import PetInfo from "./PetInfo";

interface PetSummaryProps {
  pet: FullPetData;
  vetVisits: VetVisit[];
  images: UploadedImage[];
  onRefresh: () => Promise<any>;
}

export default function PetSummary({ pet, vetVisits, images, onRefresh }: PetSummaryProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Pet Information Section */}
      <div className="mb-12">
        <PetInfo petData={pet} onRefresh={onRefresh} />
      </div>

      {/* Content Grid */}
      <div className="space-y-12">
        {/* Vet Visits Section */}
        <section className="animate-in">
          <VetVisitList petId={pet.id} petUuid={pet.uuid} vetVisits={vetVisits} />
        </section>

        {/* Media Upload Section */}
        <section className="animate-in">
          <MediaUploader petId={pet.id} petUuid={pet.uuid} currentFileCount={images.length} />
        </section>

        {/* Gallery Section */}
        <section className="animate-in">
          <Gallery uploadedFiles={images} petId={pet.id} petUuid={pet.uuid} />
        </section>
      </div>
    </div>
  );
}
