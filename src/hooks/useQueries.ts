import { Pet, VetVisit } from "@/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePets = (ownerId: string | any) => {
  return useQuery({
    queryKey: ["pets", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const searchParams = new URLSearchParams();
      searchParams.set("ownerId", ownerId);
      const response = await fetch(`/api/v1/pets?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: !!ownerId,
  });
};

export const usePetData = (petId: string) => {
  return useQuery({
    queryKey: ["pet", petId],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("id", petId);
      const response = await fetch(`/api/v1/pet?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch pet data");
      const data = await response.json();
      return data[0] ? { ...data[0] } : null;
    },
    enabled: !!petId,
  });
};

export const useAddPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData: Omit<Pet, "id" | "updatedAt">) => {
      const response = await fetch("/api/v1/pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...petData }),
      });
      if (!response.ok) throw new Error("Failed to add pet");
      const data = await response.json();
      return { ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets", variables.ownerId] });
    },
  });
};

export const useEditPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData: {
      id: string;
      name: string;
      breed: string;
      bornAt: string;
      weight: number;
      color: string;
      isDead: boolean;
      ownerId: string;
    }) => {
      const response = await fetch("/api/v1/pet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error("Failed to edit pet");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets", variables.ownerId] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.id] });
    },
  });
};

export const useAddVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitData: Omit<VetVisit, "id">) => {
      const response = await fetch("/api/v1/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
      if (!response.ok) throw new Error("Failed to add visit");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pet", variables.petId.toString()],
      });
    },
  });
};

export const useEditVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitData: VetVisit) => {
      const response = await fetch("/api/v1/visit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
      if (!response.ok) throw new Error("Failed to edit visit");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pet", variables.petId.toString()],
      });
    },
  });
};

export const useDeleteVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData: { petId: number; visitId: number }) => {
      const { petId, visitId } = petData;
      const response = await fetch(`/api/v1/visit?id=${visitId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete visit");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pet", variables.petId.toString()],
      });
    },
  });
};

export const deletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData: { petId: string }) => {
      const { petId } = petData;
      const response = await fetch(`/api/v1/pet?petId=${petId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pet");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pets"],
      });
    },
    onError: (error: Error) => {},
  });
};

export interface WeightRecord {
  id: string;
  petId: number;
  weight: number;
}

export const useGetWeightHistory = (petId: number) => {
  return useQuery({
    queryKey: ["weightHistory", petId],
    queryFn: async () => {
      if (!petId) return [];
      const searchParams = new URLSearchParams();
      searchParams.set("petId", petId.toString());
      const response = await fetch(`/api/v1/weight?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch weight history");
      return response.json();
    },
    enabled: !!petId,
  });
};

export const useAddWeightRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weightData: Omit<WeightRecord, "id">) => {
      const response = await fetch("/api/v1/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weightData),
      });
      if (!response.ok) throw new Error("Failed to add weight record");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["weightHistory", variables.petId] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
  });
};

export const useDeleteWeightRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, id }: { petId: number; id: string }) => {
      const response = await fetch(`/api/v1/weight?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete weight record");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["weightHistory", variables.petId] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
  });
};
