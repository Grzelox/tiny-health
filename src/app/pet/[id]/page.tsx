'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { RatIcon, Calendar, Stethoscope, Pill, EditIcon } from 'lucide-react';
import AddPetModal from '@/components/AddPetModal';
import { useUser } from '@clerk/nextjs';
import { Pet, VetVisit } from '@/types/pet';

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const router = useRouter();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            lastCheckup: pet.VetVisit.length > 0 ? pet.VetVisit[0].date : 'No visits'
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
  }, [user, router]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                <p className="font-medium">{new Date(petData.lastCheckup).toLocaleDateString()}</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-secondary-600">Waga</p>
                <p className="font-medium">{petData.weight}</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <Pill className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-secondary-600">Leki na stałe</p>
                <p className="font-medium">{vetVisits.length} medication(s)</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Historia medyczna</h2>
              <div className="space-y-4">
                {vetVisits.map((visit, index) => (
                  <div key={index} className="border-l-4 border-primary-400 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-primary-700">{visit.description}</p>
                        <p className="text-sm text-secondary-600">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-secondary-700 mt-2">{visit.medication}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <AddPetModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}