/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import AddPetModal from "./AddPetModal";

// Mock the useUser hook from @clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "mock-user-id" },
  }),
}));

describe("AddPetModal Component", () => {
  const mockOnClose = jest.fn();
  const mockSetUpdatedPets = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: "new-pet-id" }),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isOpen: boolean) => {
    render(
      <AddPetModal
        isOpen={isOpen}
        onClose={mockOnClose}
        setUpdatedPets={mockSetUpdatedPets}
      />,
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

  it("calls setUpdatedPets and onClose when add button is clicked", async () => {
    renderComponent(true);
    fireEvent.click(screen.getByText("Dodaj"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/addPet",
        expect.any(Object),
      );
      expect(mockSetUpdatedPets).toHaveBeenCalledWith(true);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("updates input fields correctly", () => {
    renderComponent(true);
    const nameInput = screen.getByPlaceholderText("Imię myszy");
    fireEvent.change(nameInput, { target: { value: "Mickey" } });
    expect(nameInput).toHaveValue("Mickey");
  });
});
