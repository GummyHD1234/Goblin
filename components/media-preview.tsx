"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2, Trash2 } from "lucide-react";

interface MediaPreviewProps {
  type: "image" | "video";
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onDelete?: () => void;
}

export function MediaPreview({ 
  type, 
  src, 
  className = "", 
  autoPlay = false, 
  muted = false,
  onDelete 
}: MediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          {type === "image" ? (
            <img
              src={src}
              alt="Preview"
              className={`rounded-md ${className}`}
            />
          ) : (
            <video
              src={src}
              controls
              autoPlay={autoPlay}
              muted={muted}
              className={`rounded-md ${className}`}
            />
          )}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogTitle className="sr-only">
          {type === "image" ? "Bild Vorschau" : "Video Vorschau"}
        </DialogTitle>
        {type === "image" ? (
          <img
            src={src}
            alt="Full size"
            className="w-full h-auto"
          />
        ) : (
          <video
            src={src}
            controls
            autoPlay={autoPlay}
            muted={muted}
            className="w-full h-auto"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}