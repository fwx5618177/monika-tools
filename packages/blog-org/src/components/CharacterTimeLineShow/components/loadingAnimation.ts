import { Application } from "@pixi/app";
import { Text } from "@pixi/text";

export const showLoadingAnimation = (app: Application) => {
  const text = new Text("Loading...", {
    fill: "white",
    fontSize: 64,
    // fontWeight: "600",
    // lineHeight: 24,
  });

  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  text.anchor.set(0.5);

  app.stage.addChild(text);

  return text;
};
