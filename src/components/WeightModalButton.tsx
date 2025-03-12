"use client";

import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { useState } from "react";

import WeightModal from "./WeightModal";

interface WeightModalButtonProps {
  petId: string;
}

export default function WeightModalButton({ petId }: WeightModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Scale size={16} />
        Add Weight
      </Button>
      <WeightModal isOpen={isOpen} onClose={() => setIsOpen(false)} petId={petId} />
    </>
  );
}
