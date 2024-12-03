"use client";

import React, { useState } from 'react';
import { mockPets } from '@/lib/mockData';
import PetCard from '@/components/ui/PetCard';
import AddPetButton from '@/components/ui/AddPetButton';
import AddPetModal from './AddPetModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-800 mb-8">My Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
        <AddPetButton onClick={() => setIsModalOpen(true)} />
      </div>
      <AddPetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}