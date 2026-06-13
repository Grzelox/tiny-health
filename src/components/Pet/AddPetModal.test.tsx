/**
 * @jest-environment jsdom
 */
import { useAddPet } from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import AddPetModal from "./AddPetModal";

// Mock the useAddPet hook
jest.mock("@/hooks/useQueries", () => ({
  useAddPet: jest.fn(),
}));

describe("AddPetModal Component", () => {
  const mockOnClose = jest.fn();
  const mockMutateAsync = jest.fn();
  const mockUser = { id: "mock-user-id" };
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    (useAddPet as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
    mockMutateAsync.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isOpen: boolean) => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddPetModal user={mockUser} isOpen={isOpen} onClose={mockOnClose} />
      </QueryClientProvider>,
    );
  };

  it("renders modal content when open", () => {
    renderComponent(true);
    expect(screen.getByText("Dodaj nowego zwierzaka")).toBeInTheDocument();
  });

  it("does not render modal content when closed", () => {
    renderComponent(false);
    expect(screen.queryByText("Dodaj nowego zwierzaka")).not.toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    renderComponent(true);

    // Test name input
    const nameInput = screen.getByPlaceholderText("Wprowadź imię gryzonia");
    fireEvent.change(nameInput, { target: { name: "name", value: "Mickey" } });
    expect(nameInput).toHaveValue("Mickey");

    // Test breed input
    const breedInput = screen.getByPlaceholderText("Laboratoryjna");
    fireEvent.change(breedInput, { target: { name: "breed", value: "Fancy" } });
    expect(breedInput).toHaveValue("Fancy");

    // Test color input
    const colorInput = screen.getByPlaceholderText("np. Czarna");
    fireEvent.change(colorInput, { target: { name: "color", value: "Brown" } });
    expect(colorInput).toHaveValue("Brown");

    // Test weight input
    const weightInput = screen.getByPlaceholderText("30");
    fireEvent.change(weightInput, { target: { name: "weight", value: "20" } });
    expect(weightInput).toHaveValue(20);
  });

  it("disables submit button when required fields are empty", () => {
    renderComponent(true);
    const submitButton = screen.getByText("Dodaj");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when required fields are filled", () => {
    renderComponent(true);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Wprowadź imię gryzonia"), {
      target: { name: "name", value: "Mickey" },
    });

    const dateInput = document.querySelector<HTMLInputElement>('input[name="bornAt"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    const submitButton = screen.getByText("Dodaj");
    expect(submitButton).not.toBeDisabled();
  });

  it("submits form without weight (weight is optional)", async () => {
    renderComponent(true);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Wprowadź imię gryzonia"), {
      target: { name: "name", value: "Mickey" },
    });
    fireEvent.change(screen.getByPlaceholderText("Laboratoryjna"), {
      target: { name: "breed", value: "Fancy" },
    });
    fireEvent.change(screen.getByPlaceholderText("np. Czarna"), {
      target: { name: "color", value: "Brown" },
    });
    const dateInput = document.querySelector<HTMLInputElement>('input[name="bornAt"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Dodaj"));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "Mickey",
        breed: "Fancy",
        animalType: "Mysz",
        color: "Brown",
        bornAt: expect.any(String), // ISO string format
        weight: null,
        isDead: false,
        deathDate: undefined,
      }),
    );

    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it("shows custom animal type input when 'Inne' is selected", () => {
    renderComponent(true);

    const typeSelect = document.querySelector<HTMLSelectElement>('select[name="animalType"]');
    expect(typeSelect).not.toBeNull();

    fireEvent.change(typeSelect as HTMLSelectElement, {
      target: { name: "animalType", value: "Inne" },
    });

    expect(screen.getByPlaceholderText("np. Jeż")).toBeInTheDocument();
  });

  it("submits custom animal type when 'Inne' is selected", async () => {
    renderComponent(true);

    // Select "Inne"
    const typeSelect = document.querySelector<HTMLSelectElement>('select[name="animalType"]');
    expect(typeSelect).not.toBeNull();

    fireEvent.change(typeSelect as HTMLSelectElement, {
      target: { name: "animalType", value: "Inne" },
    });

    fireEvent.change(screen.getByPlaceholderText("np. Jeż"), {
      target: { name: "customAnimalType", value: "Jeż" },
    });

    // Fill out required fields
    fireEvent.change(screen.getByPlaceholderText("Wprowadź imię gryzonia"), {
      target: { name: "name", value: "Mickey" },
    });
    const dateInput = document.querySelector<HTMLInputElement>('input[name="bornAt"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Dodaj"));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          animalType: "Jeż",
        }),
      ),
    );
  });

  it("handles submission error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockMutateAsync.mockRejectedValueOnce(new Error("Test error"));

    renderComponent(true);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Wprowadź imię gryzonia"), {
      target: { name: "name", value: "Mickey" },
    });
    const dateInput = document.querySelector<HTMLInputElement>('input[name="bornAt"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Dodaj"));

    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error adding pet:", expect.any(Error)),
    );
    expect(mockOnClose).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
