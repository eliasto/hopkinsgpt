"use client";

import * as React from "react";

import { useEffect } from "react";
import { getModels } from "@/lib/api";
import { NO_MODEL_AVAILABLE } from "@/lib/constants";

type ModelSelectorProps = {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  availableModels: string[];
  setAvailableModels: React.Dispatch<React.SetStateAction<string[]>>;
  setApiError: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Loading({
  model,
  setModel,
  setAvailableModels,
  setApiError,
}: ModelSelectorProps) {
  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await getModels();
        setAvailableModels(models);

        if (models.length === 0) {
          setModel(NO_MODEL_AVAILABLE);
        } else if (!models.includes(model)) {
          setModel(models[0]);
        }
      } catch (error) {
        console.error("Error loading models:", error);
        setApiError(true);
      }
    };

    loadModels();
  }, [model, setApiError, setAvailableModels, setModel]);

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
