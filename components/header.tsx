"use client";

import { Logo } from "./logo";

export function Header() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Logo className="w-16 h-16" />
      <h1 className="text-3xl font-bold">Aufgabenlösungs-Tool</h1>
    </div>
  );
}