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

export const usePet = (uuid: string) => {
  return useQuery<PetWithShared>({
    queryKey: ["pet", uuid],
    queryFn: async () => {
      const response = await fetch(`/api/v1/pet?uuid=${uuid}`);
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
      console.log("data Input", data);
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
      console.log("variables", variables);
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.uuid] });
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
      console.log("variables useAddVetVisit", variables);
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.uuid] });
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
      queryClient.invalidateQueries({ queryKey: ["pet", variables.data.uuid] });
    },
  });
};

export const useDeleteVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      petId,
      uuid,
      visitId,
    }: {
      petId: number;
      uuid: string;
      visitId: number;
    }) => {
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
        queryKey: ["pet", variables.uuid],
      });
    },
  });
};

export const useGetWeightHistory = (petId: number, uuid: string) => {
  return useQuery({
    queryKey: ["weightHistory", uuid],
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
    mutationFn: async ({ data, uuid }: { data: Omit<WeightRecord, "id">; uuid: string }) => {
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
        queryKey: ["weightHistory", variables.uuid],
      });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.uuid] });
    },
  });
};

export const useDeleteWeightRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, id, uuid }: { petId: number; id: string; uuid: string }) => {
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
        queryKey: ["weightHistory", variables.uuid],
      });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.uuid] });
    },
  });
};

export const useUpdatePetNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, uuid, notes }: { id: number; uuid: string; notes: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ["pet", variables.uuid] });
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

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, ownerId }: { petId: number; ownerId: string }) => {
      const response = await fetch(`/api/v1/pet?petId=${petId}&ownerId=${ownerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pet");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pets", variables.ownerId] });
    },
  });
};
