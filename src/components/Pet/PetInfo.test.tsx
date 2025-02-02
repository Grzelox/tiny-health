/**
 * @jest-environment jsdom
 */
import { Pet } from "@/types/pet";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import PetInfo from "./PetInfo";

const mockPetData: Pet = {
  id: "1",
  name: "Fluffy",
  breed: "Persian",
  weight: 5000,
  birthDate: "2020-01-01",
  color: "White",
  isDead: false,
  updatedAt: "2023-01-01",
};

describe("PetInfo Component", () => {
  it("renders pet information correctly", () => {
    render(<PetInfo petData={mockPetData} onEditClick={jest.fn()} />);
    expect(screen.getByText("Fluffy")).toBeInTheDocument();
    expect(screen.getByText("Persian")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("White")).toBeInTheDocument();
  });

  it("calls onEditClick when edit button is clicked", () => {
    const onEditClick = jest.fn();
    render(<PetInfo petData={mockPetData} onEditClick={onEditClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
});
