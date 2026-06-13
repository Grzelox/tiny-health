/**
 * @jest-environment jsdom
 */
import { useUpdatePetNotes } from "@/hooks/useQueries";
import { FullPetData } from "@/types/pet";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import PetNotes from "./PetNotes";

jest.mock("@/hooks/useQueries", () => ({
  useUpdatePetNotes: jest.fn(),
}));

const basePetData: FullPetData = {
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

describe("PetNotes Component", () => {
  const mockMutate = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    (useUpdatePetNotes as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("shows placeholder text when there are no notes", () => {
    render(<PetNotes petData={{ ...basePetData, notes: "" }} onUpdate={onUpdate} />);

    expect(screen.getByText(/Brak notatek/)).toBeInTheDocument();
  });

  it("renders Markdown formatting for existing notes", () => {
    render(
      <PetNotes
        petData={{ ...basePetData, notes: "# Heading\n\n**bold** and *italic*" }}
        onUpdate={onUpdate}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument();
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic").tagName).toBe("EM");
  });

  it("renders plain-text notes without Markdown syntax correctly", () => {
    render(
      <PetNotes
        petData={{ ...basePetData, notes: "Just a plain note." }}
        onUpdate={onUpdate}
      />,
    );

    expect(screen.getByText("Just a plain note.")).toBeInTheDocument();
  });

  it("sanitizes unsafe HTML/script content", () => {
    render(
      <PetNotes
        petData={{ ...basePetData, notes: '<script>window.xss = true</script>Hello' }}
        onUpdate={onUpdate}
      />,
    );

    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(screen.getByText(/<script>window.xss = true<\/script>Hello/)).toBeInTheDocument();
  });

  it("strips unsafe javascript: links", () => {
    render(
      <PetNotes
        petData={{ ...basePetData, notes: "[click me](javascript:alert(1))" }}
        onUpdate={onUpdate}
      />,
    );

    expect(document.querySelector("a")).not.toBeInTheDocument();
    expect(screen.getByText("click me")).toBeInTheDocument();
  });

  it("toggles between edit and preview modes", () => {
    render(
      <PetNotes petData={{ ...basePetData, notes: "**bold text**" }} onUpdate={onUpdate} />,
    );

    fireEvent.click(screen.getByLabelText("Edit notes"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Podgląd"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("bold text").tagName).toBe("STRONG");

    fireEvent.click(screen.getByText("Edycja"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("saves edited notes", () => {
    render(<PetNotes petData={{ ...basePetData, notes: "Old note" }} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByLabelText("Edit notes"));
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "New note" } });
    fireEvent.click(screen.getByText("Zapisz"));

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 1, petUuid: "pet-uuid", notes: "New note" },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
