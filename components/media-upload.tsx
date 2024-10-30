"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image, Video } from "lucide-react";
import { formatTaskNumber } from "@/lib/utils";

interface MediaUploadProps {
  taskId: string;
  onUpload: (file: File) => void;
}

export function MediaUpload({ taskId, onUpload }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const extension = file.name.split('.').pop();
    const newFile = new File(
      [file],
      `${formatTaskNumber(taskId)}.${extension}`,
      { type: file.type }
    );
    onUpload(newFile);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center ${
        dragActive ? "border-primary" : "border-border"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        className="hidden"
        id="media-upload"
        accept="image/*,video/*"
        onChange={handleChange}
      />
      <label
        htmlFor="media-upload"
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <div className="flex gap-2">
          <Image className="h-4 w-4" />
          <Video className="h-4 w-4" />
          <Upload className="h-4 w-4" />
        </div>
        <span className="text-sm text-muted-foreground">
          Klicken oder Dateien hierher ziehen
        </span>
      </label>
    </div>
  );
}