/**
 * @jest-environment jsdom
 */
import { FullPetData } from "@/types/pet";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import PetInfo from "./PetInfo";

jest.mock("./EditPetModal", () => () => null);
jest.mock("./PetNotes", () => () => null);
jest.mock("./WeightTrackerModal", () => () => null);

const mockPetData: FullPetData = {
  id: 1,
  uuid: "pet-uuid",
  name: "Fluffy",
  breed: "Persian",
  animalType: "Kot",
  color: "White",
  weight: 5000,
  bornAt: new Date("2020-01-01").toISOString(),
  isDead: false,
  ownerId: "owner-id",
  createdAt: new Date("2020-01-01").toISOString(),
  updatedAt: new Date("2023-01-01").toISOString(),
  uploadedFiles: [],
  vetVisits: [],
};

describe("PetInfo Component", () => {
  it("renders color card when color is provided", () => {
    render(<PetInfo petData={mockPetData} onRefresh={jest.fn().mockResolvedValue(undefined)} />);
    expect(screen.getByText("Fluffy")).toBeInTheDocument();
    expect(screen.getByText(/Persian/)).toBeInTheDocument();
    expect(screen.getByText("Kolor")).toBeInTheDocument();
    expect(screen.getAllByText(/White/).length).toBeGreaterThan(0);
  });

  it("hides color card when color is missing", () => {
    render(
      <PetInfo
        petData={{
          ...mockPetData,
          color: "",
        }}
        onRefresh={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.queryByText("Kolor")).not.toBeInTheDocument();
  });

  it("calls onRefresh when refresh button is clicked", async () => {
    const onRefresh = jest.fn().mockResolvedValue(undefined);
    render(<PetInfo petData={mockPetData} onRefresh={onRefresh} />);

    const [refreshButton] = screen.getAllByRole("button");
    fireEvent.click(refreshButton);

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
  });
});
