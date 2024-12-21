import { SetupPixiAppProps } from "Novel";
import { Application } from "@pixi/app";
import { ICanvas } from "@pixi/core";

export const setupPixiApp = (
  props: SetupPixiAppProps
): Application<ICanvas> => {
  const app = new Application({
    ...props,
    resizeTo: window,
    width: props?.width || 800,
    height: props?.height || 600,
    view: props?.view,
    backgroundColor: props?.backgroundColor || 0x333333,
  });

  return app;
};
