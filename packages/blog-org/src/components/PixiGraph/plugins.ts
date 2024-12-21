import { Application } from "@pixi/app";
import { loadCharacter } from "./character";
import { loadResources } from "./resources";
import { setupAnimation } from "./animation";
import { applyShader } from "./shader";
import {
  AnimationOptions,
  CharacterOptions,
  LoadPlugin,
  PluginOption,
  ResourcesOptions,
  ShaderOptions,
} from "Graph";

export const loadPlugins = (app: Application, plugins: PluginOption[]) => {
  const loadedElements: Partial<LoadPlugin> = {};

  plugins.forEach((plugin) => {
    switch (plugin.type) {
      case "character":
        loadedElements.character = loadCharacter(
          app,
          plugin.options as CharacterOptions
        );
        break;
      case "animation":
        setupAnimation(
          loadedElements.character,
          plugin.options as AnimationOptions
        );
        break;
      case "resources":
        loadResources(app, plugin.options as ResourcesOptions);
        break;
      case "shader":
        applyShader(loadedElements.character, plugin.options as ShaderOptions);
        break;
    }
  });

  return loadedElements;
};
