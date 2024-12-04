'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RatIcon, Calendar, Stethoscope, EditIcon, PaintRoller, TrashIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Pet, VetVisit } from '@/types/pet';
import AddVetVisitModal from '@/components/AddVetVisitModal';
import EditVetVisitModal from '@/components/EditVetVisitModal';
import EditPetModal from '@/components/EditPetModal';

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const router = useRouter();
  const [petData, setPetData] = useState<Pet | null>(null);
  const petId = params.id;
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [updateVists, setUpdateVists] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [currVisit, setCurrVisit] = useState<VetVisit | null>(null);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  useEffect(() => {
    if (!user?.id) {
      router.push('/sign-in');
    }

    const fetchPetData = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.set('id', params.id);
        const response = await fetch(`/api/getPetsData?${searchParams.toString()}`);

        const data = await response.json();

        if (data.length > 0) {
          const pet = data[0];
          setPetData({
            id: pet.id,
            name: pet.name,
            breed: pet.breed,
            weight: pet.weight,
            birthDate: pet.birthDate,
            color: pet.color,
            isDead: pet.isDead
          });

          setVetVisits(pet.VetVisit.map((visit: any) => ({
            id: visit.id,
            petId: visit.petId,
            date: new Date(visit.date),
            description: visit.description,
            medication: visit.medication
          })));
        }
        console.log("petData", petData);
        console.log("vetVisits", vetVisits);
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };

    fetchPetData();
  }, [user, router, updateVists ]);

  const handleEditClick = () => {
    setIsEditPetModalOpen(true);
  };


  const handleCloseAddVisitModal = () => {
    setIsAddVisitModalOpen(false);
    setUpdateVists(prev => !prev);
  };

  const handleAddVisitClick = () => {
    setIsAddVisitModalOpen(true);
  };

  const handleCloseEditVisitModal = () => {
    setIsEditVisitModalOpen(false);
    setUpdateVists(prev => !prev);
  };

  const handleCloseEditPetModal = () => {
    setIsEditPetModalOpen(false);
    setUpdateVists(prev => !prev);
  };

  const handleEditVisit = (index: number) => {
    setCurrVisit(vetVisits[index]);
    console.log("currVisit", currVisit);
    setIsEditVisitModalOpen(true);
    setUpdateVists(prev => !prev);

  };

  const handleRemoveVisit = async (index: number) => {
    try {
      const response = await fetch("/api/deleteVetVisit", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: vetVisits[index].id }),
      });
    } catch (error) {
      console.error('Error deleting vet visit:', error);
    }
    setUpdateVists(true);
  };
  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8 relative">
        <button onClick={handleEditClick} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <EditIcon className="w-6 h-6" />
        </button>
        {petData && (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <RatIcon className="w-12 h-12 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-primary-800">{petData.name}</h1>
                <p className="text-secondary-600">{petData.breed}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 p-4 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-secondary-600">Data urodzenia</p>
                <p className="font-medium">{new Date(petData.birthDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-secondary-600">Waga [g]</p>
                <p className="font-medium">{petData.weight}</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <PaintRoller className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-secondary-600">Umaszczenie</p>
                <p className="font-medium">{petData.color}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Historia medyczna</h2>
              <button onClick={handleAddVisitClick} className="mb-4 bg-primary-600 text-white py-2 px-4 rounded">
                Dodaj nową wizytę
              </button>
              <div className="space-y-4">
                {vetVisits
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((visit, index) => (
                    <div key={index} className="border-l-4 border-primary-400 pl-4 py-2 flex justify-between items-start">
                      <div>
                        <p className="font-medium text-primary-700">{visit.description}</p>
                        <p className="text-sm text-secondary-600">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                        <p className="text-secondary-700 mt-2">{visit.medication}</p>
                      </div>

                      <div>                
                      <button 
                      onClick={() => handleEditVisit(index)}
                      className="text-blue-600 hover:text-blue-800"
                      >
                        <EditIcon className="w-6 h-6" />
                      </button>
             
                      <button
                        onClick={() => handleRemoveVisit(index)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                      </div>
                    </div>

                    
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      <AddVetVisitModal
        petId={petId}
        isOpen={isAddVisitModalOpen}
        onClose={handleCloseAddVisitModal}
      />
      <EditVetVisitModal
        isOpen={isEditVisitModalOpen}
        onClose={handleCloseEditVisitModal}
        visits={vetVisits}
        visitId={currVisit?.id}
      />

      <EditPetModal
        isOpen={isEditPetModalOpen}
        onClose={handleCloseEditPetModal}
        pet={petData}
      />
    </div>
  );
}