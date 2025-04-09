"use client";

import * as React from "react";

import { useEffect } from "react";
import { getModels } from "@/lib/ollama";
import { NO_MODEL_AVAILABLE } from "@/lib/constants";

type ModelSelectorProps = {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  availableModels: string[];
  setAvailableModels: React.Dispatch<React.SetStateAction<string[]>>;
};

export function Loading({
  model,
  setModel,
  setIsLoading,
  setAvailableModels,
}: ModelSelectorProps) {
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      const models = await getModels();
      setAvailableModels(models);

      if (models.length === 0) {
        setModel(NO_MODEL_AVAILABLE);
      } else if (!models.includes(model)) {
        setModel(models[0]);
      }

      setIsLoading(false);
    };

    loadModels();
  }, [model, setAvailableModels, setIsLoading, setModel]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-6 rounded-lg">
        <div className="animate-spin mb-4 h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Chargement des modèles...
        </p>
      </div>
    </div>
  );
}
