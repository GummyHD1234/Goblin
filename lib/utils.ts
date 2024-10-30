import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, SearchItem } from "@/types/tasks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTaskNumber(input: string): string {
  const numbers = input.replace(/[^\d]/g, "");
  
  if (numbers.length === 5) {
    return `${numbers[0]}.${numbers[1]}${numbers[2]}.${numbers[3]}${numbers[4]}`;
  }
  
  return "";
}

export function formatNumberInput(input: string): string {
  const numbers = input.replace(/[^\d]/g, "");
  let formatted = "";
  
  for (let i = 0; i < numbers.length && i < 5; i++) {
    if (i === 1 || i === 3) {
      formatted += ".";
    }
    formatted += numbers[i];
  }
  
  return formatted;
}

export function compareTaskNumbers(a: string, b: string): number {
  const cleanA = a.split('.').map(Number);
  const cleanB = b.split('.').map(Number);

  for (let i = 0; i < cleanA.length; i++) {
    if (cleanA[i] !== cleanB[i]) {
      return cleanA[i] - cleanB[i];
    }
  }
  return 0;
}

export function validateImportData(data: any): { 
  isValid: boolean; 
  tasks?: Task[]; 
  searchItems?: SearchItem[]; 
  error?: string; 
} {
  try {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'Ungültiges Dateiformat' };
    }

    // Check if data has the required arrays
    if (!Array.isArray(data.tasks) || !Array.isArray(data.searchItems)) {
      return { isValid: false, error: 'Fehlende oder ungültige Daten' };
    }

    // Validate each task
    for (const task of data.tasks) {
      if (!task.id || typeof task.id !== 'string' ||
          !task.question || typeof task.question !== 'string' ||
          !task.solution || typeof task.solution !== 'string' ||
          typeof task.room !== 'string' ||
          typeof task.tip !== 'string' ||
          typeof task.key !== 'string') {
        return { 
          isValid: false, 
          error: `Ungültiges Auftragsformat: ${JSON.stringify(task)}` 
        };
      }

      // Validate media if present
      if (task.media !== undefined) {
        if (!Array.isArray(task.media)) {
          return { 
            isValid: false, 
            error: `Ungültiges Medienformat für Auftrag ${task.id}` 
          };
        }

        for (const media of task.media) {
          if (!media.type || !media.url ||
              !['image', 'video'].includes(media.type) ||
              typeof media.url !== 'string') {
            return { 
              isValid: false, 
              error: `Ungültiges Medienformat in Auftrag ${task.id}` 
            };
          }
        }
      }
    }

    // Validate each search item
    for (const item of data.searchItems) {
      if (!item.item || typeof item.item !== 'string' ||
          !item.location || typeof item.location !== 'string') {
        return { 
          isValid: false, 
          error: `Ungültiges Format für gesuchten Gegenstand: ${JSON.stringify(item)}` 
        };
      }
    }

    return {
      isValid: true,
      tasks: data.tasks,
      searchItems: data.searchItems,
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Fehler beim Validieren der Daten: ' + (error as Error).message 
    };
  }
}