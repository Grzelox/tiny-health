/**
 * @jest-environment jsdom
 */
import {
  useAddPet,
  useDeletePet,
  useImportPets,
  usePets,
  useRemoveShare,
  useSharedUsers,
  useSharePets,
} from "@/hooks/useQueries";
import { PetWithShared } from "@/types/pet";
import { useUser } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import Dashboard from "./Dashboard";

jest.mock("@/hooks/useQueries", () => ({
  usePets: jest.fn(),
  useDeletePet: jest.fn(),
  useAddPet: jest.fn(),
  useSharePets: jest.fn(),
  useSharedUsers: jest.fn(),
  useRemoveShare: jest.fn(),
  useImportPets: jest.fn(),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

const basePet = {
  id: "1",
  uuid: "uuid-1",
  color: "Biały",
  weight: 100,
  bornAt: "2023-01-01",
  ownerId: "user-1",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  uploadedFiles: [],
  vetVisits: [],
};

const buildPets = (): PetWithShared[] => [
  {
    ...basePet,
    id: "1",
    uuid: "uuid-1",
    name: "Bury",
    breed: "Standardowy",
    animalType: "Szczur",
    color: "Szary",
    isDead: false,
    isShared: false,
  } as unknown as PetWithShared,
  {
    ...basePet,
    id: "2",
    uuid: "uuid-2",
    name: "Reksio",
    breed: "Mieszaniec",
    animalType: "Pies",
    color: "Brązowy",
    isDead: false,
    isShared: false,
  } as unknown as PetWithShared,
  {
    ...basePet,
    id: "3",
    uuid: "uuid-3",
    name: "Nieboszczyk",
    breed: "Standardowy",
    animalType: "Szczur",
    color: "Czarny",
    isDead: true,
    deathDate: "2023-06-01",
    isShared: false,
  } as unknown as PetWithShared,
  {
    ...basePet,
    id: "4",
    uuid: "uuid-4",
    name: "Sasha",
    breed: "Standardowa",
    animalType: "Świnka Morska",
    color: "Pomarańczowy",
    isDead: false,
    isShared: true,
  } as unknown as PetWithShared,
];

describe("Dashboard filtering", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: "user-1" } });
    (useDeletePet as jest.Mock).mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    (useAddPet as jest.Mock).mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    (useSharePets as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useSharedUsers as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useRemoveShare as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useImportPets as jest.Mock).mockReturnValue({ mutateAsync: jest.fn(), isPending: false });
    (usePets as jest.Mock).mockReturnValue({
      data: buildPets(),
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDashboard = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

  it("renders all pets by default", () => {
    renderDashboard();

    expect(screen.getByText("Bury")).toBeInTheDocument();
    expect(screen.getByText("Reksio")).toBeInTheDocument();
    expect(screen.getByText("Nieboszczyk")).toBeInTheDocument();
    expect(screen.getByText("Sasha")).toBeInTheDocument();
  });

  it("filters pets by search query in real time", () => {
    renderDashboard();

    const searchInput = screen.getByPlaceholderText("Szukaj po imieniu, rasie lub kolorze...");
    fireEvent.change(searchInput, { target: { value: "bury" } });

    expect(screen.getByText("Bury")).toBeInTheDocument();
    expect(screen.queryByText("Reksio")).not.toBeInTheDocument();
    expect(screen.queryByText("Sasha")).not.toBeInTheDocument();
  });

  it("filters pets by animal type", () => {
    renderDashboard();

    const typeSelect = screen.getByLabelText("Filtruj po gatunku");
    fireEvent.change(typeSelect, { target: { value: "Pies" } });

    expect(screen.getByText("Reksio")).toBeInTheDocument();
    expect(screen.queryByText("Bury")).not.toBeInTheDocument();
    expect(screen.queryByText("Sasha")).not.toBeInTheDocument();
  });

  it("filters pets by alive/dead status", () => {
    renderDashboard();

    const statusSelect = screen.getByLabelText("Filtruj po statusie");
    fireEvent.change(statusSelect, { target: { value: "dead" } });

    expect(screen.getByText("Nieboszczyk")).toBeInTheDocument();
    expect(screen.queryByText("Bury")).not.toBeInTheDocument();
    expect(screen.queryByText("Reksio")).not.toBeInTheDocument();
    expect(screen.queryByText("Sasha")).not.toBeInTheDocument();
  });

  it("filters pets by ownership (owned vs shared)", () => {
    renderDashboard();

    const ownershipSelect = screen.getByLabelText("Filtruj po właścicielu");
    fireEvent.change(ownershipSelect, { target: { value: "shared" } });

    expect(screen.getByText("Sasha")).toBeInTheDocument();
    expect(screen.queryByText("Bury")).not.toBeInTheDocument();
    expect(screen.queryByText("Reksio")).not.toBeInTheDocument();
    expect(screen.queryByText("Nieboszczyk")).not.toBeInTheDocument();
  });

  it("shows the guided onboarding empty state for a first-time user with no pets", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: "user-1", firstName: "Ola" } });
    (usePets as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });

    renderDashboard();

    expect(screen.getByText("Witaj, Ola!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dodaj pierwszego zwierzaka/ }),
    ).toBeInTheDocument();
    // Core features are highlighted
    expect(screen.getByText("Śledź wagę")).toBeInTheDocument();
    expect(screen.getByText("Wizyty u weterynarza")).toBeInTheDocument();
    expect(screen.getByText("Zdjęcia")).toBeInTheDocument();
  });

  it("opens the add-pet modal with first-pet guidance from the onboarding state", () => {
    (usePets as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });

    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: /Dodaj pierwszego zwierzaka/ }));

    expect(screen.getByText("Dodaj nowego zwierzaka")).toBeInTheDocument();
    expect(screen.getByText(/To Twój pierwszy zwierzak!/)).toBeInTheDocument();
  });

  it("shows an empty-state message when no pets match the filters", () => {
    renderDashboard();

    const searchInput = screen.getByPlaceholderText("Szukaj po imieniu, rasie lub kolorze...");
    fireEvent.change(searchInput, { target: { value: "nie istnieje" } });

    expect(screen.getByText("Brak zwierzaków spełniających kryteria")).toBeInTheDocument();

    const [clearButton] = screen.getAllByRole("button", { name: "Wyczyść filtry" });
    fireEvent.click(clearButton);

    expect(screen.getByText("Bury")).toBeInTheDocument();
    expect(
      screen.queryByText("Brak zwierzaków spełniających kryteria"),
    ).not.toBeInTheDocument();
  });
});
