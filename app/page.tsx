"use client"; // This line makes the component a Client Component

import { useState } from "react";
import { UnlimitedPoemGeneratorComponent } from "@/components/unlimited-poem-generator";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <UnlimitedPoemGeneratorComponent />
    </div>
  );
}

