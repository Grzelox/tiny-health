/**
 * @jest-environment jsdom
 */
import { useAddPet } from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
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
    });
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
    expect(screen.getByText("Dodaj nową myszkę")).toBeInTheDocument();
  });

  it("does not render modal content when closed", () => {
    renderComponent(false);
    expect(screen.queryByText("Dodaj nową myszkę")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByText("Zamknij"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("updates input fields correctly", () => {
    renderComponent(true);

    // Test name input
    const nameInput = screen.getByPlaceholderText("Imię myszy");
    fireEvent.change(nameInput, { target: { name: "name", value: "Mickey" } });
    expect(nameInput).toHaveValue("Mickey");

    // Test breed input
    const breedInput = screen.getByPlaceholderText("Rasa");
    fireEvent.change(breedInput, { target: { name: "breed", value: "Fancy" } });
    expect(breedInput).toHaveValue("Fancy");

    // Test color input
    const colorInput = screen.getByPlaceholderText("Umaszczenie");
    fireEvent.change(colorInput, { target: { name: "color", value: "Brown" } });
    expect(colorInput).toHaveValue("Brown");

    // Test weight input
    const weightInput = screen.getByPlaceholderText("Waga");
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
    fireEvent.change(screen.getByPlaceholderText("Imię myszy"), {
      target: { name: "name", value: "Mickey" },
    });

    const dateInput = screen.getByPlaceholderText("Data Urodzenia");
    fireEvent.change(dateInput, {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    const submitButton = screen.getByText("Dodaj");
    expect(submitButton).not.toBeDisabled();
  });

  it("submits form with correct data", async () => {
    renderComponent(true);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Imię myszy"), {
      target: { name: "name", value: "Mickey" },
    });
    fireEvent.change(screen.getByPlaceholderText("Rasa"), {
      target: { name: "breed", value: "Fancy" },
    });
    fireEvent.change(screen.getByPlaceholderText("Umaszczenie"), {
      target: { name: "color", value: "Brown" },
    });
    fireEvent.change(screen.getByPlaceholderText("Data Urodzenia"), {
      target: { name: "bornAt", value: "2024-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText("Waga"), {
      target: { name: "weight", value: "20" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Dodaj"));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: "Mickey",
      breed: "Fancy",
      color: "Brown",
      bornAt: expect.any(String), // ISO string format
      weight: 20,
      isDead: false,
      ownerId: "mock-user-id",
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles submission error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockMutateAsync.mockRejectedValueOnce(new Error("Test error"));

    renderComponent(true);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Imię myszy"), {
      target: { name: "name", value: "Mickey" },
    });
    fireEvent.change(screen.getByPlaceholderText("Data Urodzenia"), {
      target: { name: "bornAt", value: "2024-01-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Dodaj"));

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error adding pet:", expect.any(Error));
    expect(mockOnClose).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
