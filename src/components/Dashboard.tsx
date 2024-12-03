"use client";

import React, { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import PetCard from '@/components/ui/PetCard';
import AddPetButton from '@/components/ui/AddPetButton';
import AddPetModal from './AddPetModal';
import { useUser } from '@clerk/nextjs';

const prisma = new PrismaClient();

export default function Dashboard() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
          const response = await fetch('/api/getPets');
          if (!response.ok) {
              throw new Error('Failed to fetch pets');
          }
          const pets = await response.json();
          console.log('Fetched pets:', pets);
          return pets;
      } catch (error) {
          console.error('Error fetching pets:', error);
          return [];
      }
  };

    fetchPets();
  }, []);

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