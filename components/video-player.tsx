"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  onClose: () => void;
}

export function VideoPlayer({ src, onClose }: VideoPlayerProps) {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 5000);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {showCloseButton && (
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 left-4 w-4 h-4 opacity-0 cursor-default z-50"
          aria-label="Close video"
        />
      )}
      <video
        src={src}
        className="w-full h-full"
        autoPlay
        controls={false}
      />
    </div>
  );
}