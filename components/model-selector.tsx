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
import { AI_ENDPOINTS_MODELS } from "@/lib/constants";
import { BrainCircuit } from "lucide-react";
import { Model } from "@/lib/interfaces";

type ModelSelectorProps = {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
  availableModels: Model[];
};

export function ModelSelector({
  model,
  setModel,
  availableModels,
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="hidden sm:inline">{model.name}</span>
          <BrainCircuit
            className="h-5 w-5 sm:hidden"
            aria-label="Select model"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Modèles en local (ollama)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={model.name}
          onValueChange={(name) =>
            setModel(availableModels.find((m) => m.name === name)!)
          }
        >
          {availableModels.length < 1 && (
            <DropdownMenuRadioItem disabled value={""}>
              Aucun modèle disponible
            </DropdownMenuRadioItem>
          )}
          {availableModels.map((m) => (
            <DropdownMenuRadioItem key={m.name} value={m.name}>
              {m.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuLabel>AI Endpoints (OVHcloud)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={model.name}
          onValueChange={(name) =>
            setModel(AI_ENDPOINTS_MODELS.find((m) => m.name === name)!)
          }
        >
          {AI_ENDPOINTS_MODELS.map((m) => (
            <DropdownMenuRadioItem key={m.name} value={m.name}>
              {m.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
