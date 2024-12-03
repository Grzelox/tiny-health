"use client";

import React, { useState, useEffect } from 'react';
import PetCard from '@/components/PetCard';
import AddPetButton from '@/components/AddPetButton';
import AddPetModal from './AddPetModal';
import { useUser } from '@clerk/nextjs';


export default function Dashboard() {
  const { user } = useUser();
  const ownerId = user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (!ownerId) return;

    const fetchPets = async () => {
      try {
          const searchParams = new URLSearchParams();
          searchParams.set('ownerId', ownerId || '');
          const response = await fetch(`/api/getPets?${searchParams.toString()}`);
          if (!response.ok) {
              throw new Error('Failed to fetch pets');
          }
          const pets = await response.json();
          setPets(pets);
          return pets;
      } catch (error) {
          console.error('Error fetching pets:', error);
          return [];
      }
  };

  fetchPets();

  }, [ownerId]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-800 mb-8">Moje stadko</h1>
      {pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
          <AddPetButton onClick={() => setIsModalOpen(true)} />
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <p className="text-lg text-gray-600 mb-4">Dodaj swoją myszkę!</p>
          <AddPetButton onClick={() => setIsModalOpen(true)} />
        </div>
      )}
      <AddPetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}