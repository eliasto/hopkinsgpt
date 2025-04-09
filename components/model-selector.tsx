"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NO_MODEL_AVAILABLE } from "@/lib/constants";

type ModelSelectorProps = {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  availableModels: string[];
};

export function ModelSelector({
  model,
  setModel,
  availableModels,
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{model}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sélectionner votre modèle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          {availableModels.length < 1 && (
            <DropdownMenuRadioItem disabled value={""}>
              {NO_MODEL_AVAILABLE}
            </DropdownMenuRadioItem>
          )}
          {availableModels.map((modelName) => (
            <DropdownMenuRadioItem key={modelName} value={modelName}>
              {modelName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
