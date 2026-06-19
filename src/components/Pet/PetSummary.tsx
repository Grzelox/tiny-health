"use client";

import { FullPetData, Medication, UploadedImage, Vaccination, VetVisit } from "@/types/pet";

import MedicationList from "../Medication/MedicationList";
import Gallery from "../Media/Gallery";
import MediaUploader from "../Media/MediaUploader";
import VaccinationList from "../Vaccination/VaccinationList";
import VetVisitList from "../VetVisit/VetVisitList";
import HealthReport from "./HealthReport";
import PetInfo from "./PetInfo";

interface PetSummaryProps {
  pet: FullPetData;
  vetVisits: VetVisit[];
  medications: Medication[];
  vaccinations: Vaccination[];
  images: UploadedImage[];
  onRefresh: () => Promise<any>;
}

export default function PetSummary({
  pet,
  vetVisits,
  medications,
  vaccinations,
  images,
  onRefresh,
}: PetSummaryProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Pet Information Section */}
      <div className="mb-12">
        <PetInfo petData={pet} onRefresh={onRefresh} />
      </div>

      {/* Content Grid */}
      <div className="space-y-12">
        {/* Health Report Section */}
        <section className="animate-in">
          <HealthReport pet={pet} vetVisits={vetVisits} />
        </section>

        {/* Medications Section */}
        <section className="animate-in">
          <MedicationList petId={pet.id} petUuid={pet.uuid} medications={medications} />
        </section>

        {/* Vaccinations Section */}
        <section className="animate-in">
          <VaccinationList petId={pet.id} petUuid={pet.uuid} vaccinations={vaccinations} />
        </section>

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
