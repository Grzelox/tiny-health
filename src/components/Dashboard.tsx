"use client";

import AddPetButton from "@/components/AddPetButton";
import PetCard from "@/components/PetCard";
import { Pet } from "@/types/pet";
import React, { useEffect, useState } from "react";

import AddPetModal from "./AddPetModal";
import { useAuthUser } from "@/hooks/useAuthUSer";

export default function Dashboard() {
  const user = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [updatedPets, setUpdatedPets] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPets = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.set("ownerId", user.id);
        console.log(searchParams.toString());
        const response = await fetch(`/api/getPets?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const pets = await response.json();
        setPets(pets);
        return pets;
      } catch (error) {
        console.error("Error fetching pets:", error);
        return [];
      }
    };

    fetchPets();
  }, [user?.id, updatedPets]);

  const handleDeletePet = async (petId: string) => {
    try {
      const response = await fetch(`/api/deletePet`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete pet");
      }

      setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-primary-800 mb-8">Moje stadko</h1>
      {pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets
            .sort((a, b) => {
              if (a.isDead === b.isDead) {
                return (
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
                );
              }
              return a.isDead ? 1 : -1;
            })
            .map((pet) => (
              <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} />
            ))}
          <AddPetButton onClick={() => setIsModalOpen(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AddPetButton onClick={() => setIsModalOpen(true)} />
        </div>
      )}
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setUpdatedPets={setUpdatedPets}
      />
    </div>
  );
}
