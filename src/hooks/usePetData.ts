// src/hooks/usePetData.ts
import { useState, useEffect } from 'react';
import { Pet, VetVisit } from '@/types/pet';
import { useRouter } from 'next/navigation';

interface UsePetDataResult {
  petData: Pet | null;
  vetVisits: VetVisit[];
  images: string[];
  updateVisits: () => void;
}

export const usePetData = (petId: string): UsePetDataResult => {
  const { user } = useUser();
  const router = useRouter();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [updateVists, setUpdateVists] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      router.push('/sign-in');
      return;
    }

    const fetchPetData = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.set('id', petId);
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
            isDead: pet.isDead,
            updatedAt: pet.updatedAt,
          });

          setVetVisits(
            pet.VetVisit.map((visit: any) => ({
              id: visit.id,
              petId: visit.petId,
              date: new Date(visit.date),
              description: visit.description,
              medication: visit.medication,
            })),
          );

          setImages(pet.files.map((file: any) => file.url));
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };

    fetchPetData();
  }, [user, router, petId, updateVists]);

  const updateVisits = () => setUpdateVists((prev) => !prev);

  return { petData, vetVisits, images, updateVisits };
};