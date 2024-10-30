"use client";

import { Button } from "@/components/ui/button";

interface ChapterNavigationProps {
  onChapterSelect: (chapter: number) => void;
}

export function ChapterNavigation({ onChapterSelect }: ChapterNavigationProps) {
  const chapters = [1, 2, 3, 4];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <Button
            key={chapter}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onChapterSelect(chapter)}
          >
            Kapitel {chapter}
          </Button>
        ))}
      </div>
    </div>
  );
}