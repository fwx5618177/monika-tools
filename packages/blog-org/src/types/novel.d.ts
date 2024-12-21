declare module "Novel" {
  interface SetupPixiAppProps extends Partial<PIXI.IApplicationOptions> {
    width: number;
    height: number;
    view: HTMLCanvasElement;
    backgroundColor: number | string;
  }

  interface TimelineEvent {
    title: string;
    date: string;
    color: number;
    icon?: PIXI.Texture;
  }
}
