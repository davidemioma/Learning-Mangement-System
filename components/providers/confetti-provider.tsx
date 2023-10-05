"use client";

import React from "react";
import ReactConfetti from "react-confetti";
import useConfettiStore from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
  const confettiStore = useConfettiStore();

  if (!confettiStore.isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      className="z-[100] pointer-events-none"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        confettiStore.onClose();
      }}
    />
  );
};
