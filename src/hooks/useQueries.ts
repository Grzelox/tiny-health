import { Pet, VetVisit } from "@/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePets = (ownerId: string | null) => {
  return useQuery({
    queryKey: ["pets", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const searchParams = new URLSearchParams();
      searchParams.set("ownerId", ownerId);
      const response = await fetch(
        `/api/getOwnedPets?${searchParams.toString()}`,
      );
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
      const response = await fetch(
        `/api/getPetData?${searchParams.toString()}`,
      );
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
      const response = await fetch("/api/addPet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...petData }),
      });
      if (!response.ok) throw new Error("Failed to add pet");
      const data = await response.json();
      return { ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};

export const useEditPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData: Pet) => {
      const response = await fetch("/api/editPet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error("Failed to edit pet");
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
    mutationFn: async (visitData: Omit<VetVisit, "id">) => {
      const response = await fetch("/api/addVetVisit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
      if (!response.ok) throw new Error("Failed to add visit");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });
    },
  });
};

export const useEditVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitData: VetVisit) => {
      const response = await fetch("/api/editVetVisit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
      if (!response.ok) throw new Error("Failed to edit visit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet"] });
    },
  });
};

export const useDeleteVetVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitId: Number) => {
      const response = await fetch(`/api/deleteVetVisit`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: visitId }),
      });
      if (!response.ok) throw new Error("Failed to delete visit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet"] });
    },
  });
};

export const deletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petId: string) => {
      const response = await fetch(`/api/deletePet`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting pet:", error);
    },
  });
};
