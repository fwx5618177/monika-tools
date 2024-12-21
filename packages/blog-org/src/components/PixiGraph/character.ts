import { CharacterOptions } from "Graph";
import { Sprite } from "@pixi/sprite";
import { Application } from "@pixi/app";

export const loadCharacter = (
  app: Application,
  options: CharacterOptions
): Sprite => {
  const character = Sprite.from(options.imagePath);
  app.stage.addChild(character);
  return character;
};
