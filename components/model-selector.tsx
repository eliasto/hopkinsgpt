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
import { useEffect } from "react";
import { getModels } from "@/lib/ollama";

type ModelSelectorProps = {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
};

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  const [availableModels, setAvailableModels] = React.useState<string[]>([]);
  const [isModelsLoading, setIsModelsLoading] = React.useState(false);
  const [showNoModelsAlert, setShowNoModelsAlert] = React.useState(false);
  useEffect(() => {
    const loadModels = async () => {
      setIsModelsLoading(true);
      const models = await getModels();
      setAvailableModels(models);

      if (models.length === 0) {
        setShowNoModelsAlert(true);
      } else if (!models.includes(model)) {
        // Si le modèle actuel n'est pas dans la liste, définir le premier comme défaut
        setModel(models[0]);
      }

      setIsModelsLoading(false);
    };

    loadModels();
  }, [model, setModel]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{model}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sélectionner votre modèle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          {isModelsLoading && (
            <DropdownMenuRadioItem disabled value="Chargement...">
              Chargement...
            </DropdownMenuRadioItem>
          )}
          {showNoModelsAlert && (
            <DropdownMenuRadioItem disabled value={""}>
              Aucun modèle disponible
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
