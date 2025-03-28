import { Pet, PetWithShared, VetVisit, WeightRecord } from "@/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePets = (userId: string) => {
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
  return useQuery<PetWithShared>({
    queryKey: ["pet", petId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/pet?id=${petId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pet");
      }
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
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error("Failed to add pet");
      const data = await response.json();
      return { data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets", variables.ownerId] });
    },
  });
};

export const useEditPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, any> }) => {
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
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.id.toString()] });
    },
  });
};

export const useAddVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: Omit<VetVisit, "id"> }) => {
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
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.petId.toString()] });
    },
  });
};

export const useEditVetVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: VetVisit }) => {
      const response = await fetch("/api/v1/visit", {
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
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.petId.toString()] });
    },
  });
};

export const useDeleteVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, visitId }: { petId: number; visitId: number }) => {
      const response = await fetch("/api/v1/visit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: visitId.toString() }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete vet visit");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pet", variables.petId.toString()],
      });
    },
  });
};

export const useGetWeightHistory = (petId: number) => {
  return useQuery({
    queryKey: ["weightHistory", petId.toString()],
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
    mutationFn: async ({ data }: { data: Omit<WeightRecord, "id"> }) => {
      const response = await fetch("/api/v1/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add weight record");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["weightHistory", variables.data.petId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.petId.toString()] });
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
      queryClient.invalidateQueries({
        queryKey: ["weightHistory", variables.petId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId.toString()] });
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

export const useSharedUsers = () => {
  return useQuery({
    queryKey: ["shared-users"],
    queryFn: async () => {
      const response = await fetch("/api/v1/share");
      if (!response.ok) {
        throw new Error("Failed to fetch shared users");
      }
      return response.json();
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
