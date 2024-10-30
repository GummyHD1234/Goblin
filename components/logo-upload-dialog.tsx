"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveLogoToStorage } from "@/lib/storage";

interface LogoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogoUploaded: () => void;
}

export function LogoUploadDialog({ 
  open, 
  onOpenChange,
  onLogoUploaded 
}: LogoUploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

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

  const handleFile = async (file: File) => {
    if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml)/)) {
      toast({
        title: "Fehler",
        description: "Bitte nur Bilder im PNG, JPG oder SVG Format hochladen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (saveLogoToStorage(result)) {
          toast({
            title: "Erfolg",
            description: "Logo wurde erfolgreich aktualisiert.",
          });
          onLogoUploaded();
          onOpenChange(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Logo konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logo hochladen</DialogTitle>
        </DialogHeader>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-primary" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            id="logo-upload"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleChange}
          />
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center gap-4 cursor-pointer"
          >
            <Upload className="h-8 w-8" />
            <div>
              <p className="text-sm text-muted-foreground">
                Klicken oder Datei hierher ziehen
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG oder SVG
              </p>
            </div>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}