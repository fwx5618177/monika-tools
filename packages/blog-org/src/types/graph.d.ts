declare module "Graph" {
  import { Application } from "@pixi/app";
  import { Sprite } from "@pixi/sprite";

  interface CharacterOptions {
    imagePath: string;
  }

  interface AnimationOptions {
    speed: number;
  }

  interface ShaderOptions {
    shaderType: string;
  }

  interface ResourcesOptions {
    resourcePath: string;
    // 其他资源特定选项
  }

  type PluginOptions =
    | CharacterOptions
    | AnimationOptions
    | ShaderOptions
    | ResourcesOptions;

  interface PluginOption {
    // 定义一些通用的插件选项
    type: "character" | "animation" | "shader" | "resources";
    options: PluginOptions;
  }

  interface LoadPlugin {
    character: PIXI.Sprite;
    animation: AnimationOptions;
    resources: string[];
    shader: ShaderOptions;
  }
}
