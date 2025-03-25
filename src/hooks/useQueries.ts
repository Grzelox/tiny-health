import { Pet, PetWithShared, VetVisit } from "@/types/pet";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePets = () => {
  const { userId } = useAuth();
  return useQuery<PetWithShared[]>({
    queryKey: ["pets", userId],
    queryFn: async () => {
      const response = await fetch("/api/v1/pets");
      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }
      return response.json();
    },
  });
};

export const usePet = (petId: string) => {
  const { userId } = useAuth();
  return useQuery<PetWithShared>({
    queryKey: ["pet", petId, userId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/pet?id=${petId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pet");
      }
      console.log("response", response);
      return response.json();
    },
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
    mutationFn: async (data: Record<string, any>) => {
      console.log("update data", data);
      const response = await fetch("/api/v1/pet", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to edit pet");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.id] });
    },
  });
};

export const useAddVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<VetVisit, "id" | "petId"> & { petId: string }) => {
      const response = await fetch(`/api/v1/visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add vet visit");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
  });
};

export const useDeleteVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, visitId }: { petId: string; visitId: string }) => {
      const response = await fetch(`/api/v1/visit/${visitId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete vet visit");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
  });
};

export const useEditVetVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      petId,
      visitId,
      data,
    }: {
      petId: string;
      visitId: string;
      data: Omit<VetVisit, "id" | "petId">;
    }) => {
      const response = await fetch(`/api/v1/visit/${visitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to edit vet visit");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
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

export const useUpdatePetNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await fetch(`/api/v1/pet/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, notes }),
      });
      if (!response.ok) {
        throw new Error("Failed to update notes");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.id] });
    },
  });
};

export const useSharePets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/v1/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to share pets");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared-users"] });
    },
  });
};

export const useRemoveShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/v1/share?userId=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove share access");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared-users"] });
    },
  });
};

export const deletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ petId }: { petId: string }) => {
      const response = await fetch(`/api/v1/pet?id=${petId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pet");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};
