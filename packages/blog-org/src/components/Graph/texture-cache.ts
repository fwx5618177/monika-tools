import { Container, DisplayObject } from "@pixi/display";
import { Texture, Renderer, Rectangle } from "@pixi/core";
import { SCALE_MODES, MSAA_QUALITY } from "@pixi/constants";

export class TextureCache {
  renderer: Renderer;

  private textures = new Map<string, Texture>();

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  get(key: string, callback: () => Container): Texture {
    let texture = this.textures.get(key);

    if (!texture) {
      const container = callback();
      //   获取局部边界,确保生成的纹理正好覆盖
      const region = container.getLocalBounds(undefined, true);
      //   获取局部边界的整数化,避免由于像素不对齐导致的渲染问题，如模糊或变形
      const roundedRegion = new Rectangle(
        Math.floor(region.x),
        Math.floor(region.y),
        Math.ceil(region.width),
        Math.ceil(region.height)
      );

      //  生成纹理
      texture = this.renderer.generateTexture(container, {
        multisample: MSAA_QUALITY.HIGH,
        scaleMode: SCALE_MODES.LINEAR,
        resolution: this.renderer.resolution,
        region: roundedRegion,
      });

      this.textures.set(key, texture);
    }

    return texture;
  }

  delete(key: string) {
    const texture = this.textures.get(key);
    if (!texture) {
      return;
    }

    texture.destroy();
    this.textures.delete(key);
  }

  clear() {
    Array.from(this.textures.keys()).forEach((key) => {
      this.delete(key);
    });
  }

  destroy() {
    this.clear();
  }
}
