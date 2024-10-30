"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLogoFromStorage } from "@/lib/storage";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  const [logoSrc, setLogoSrc] = useState("/logo.png");

  useEffect(() => {
    const storedLogo = getLogoFromStorage();
    if (storedLogo) {
      setLogoSrc(storedLogo);
    }
  }, []);

  return (
    <div className={className}>
      <Image
        src={logoSrc}
        alt="App Logo"
        width={64}
        height={64}
        className="w-full h-full"
      />
    </div>
  );
}