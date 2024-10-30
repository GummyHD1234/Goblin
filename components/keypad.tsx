"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { formatNumberInput } from "@/lib/utils";

interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function Keypad({ value, onChange, onSearch }: KeypadProps) {
  const handleNumberClick = (num: string) => {
    const currentNumbers = value.replace(/[^\d]/g, "");
    if (currentNumbers.length < 5) {
      const newValue = currentNumbers + num;
      onChange(formatNumberInput(newValue));
    }
  };

  const handleClear = () => {
    onChange("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatNumberInput(input);
    onChange(formatted);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Input
          value={value}
          onChange={handleInputChange}
          maxLength={7}
          className="text-center text-2xl w-48"
          placeholder="0.00.00"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-12 text-xl"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-12"
          onClick={onSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}