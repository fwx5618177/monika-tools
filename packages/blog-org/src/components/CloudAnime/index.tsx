import { useEffect, useRef } from "react";
import { GlowFilter } from "@pixi/filter-glow";
import { cloudShader, extractBrightnessFragmentShader } from "./cloud";
import { Application } from "@pixi/app";
import { Sprite } from "@pixi/sprite";
import { BLEND_MODES, Filter, Texture } from "@pixi/core";

const CloudAnime = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application({
        resizeTo: window,
        view: canvasRef.current,
      });

      const skyBg = Sprite.from(
        "https://pixijs.com/header/assets/img/skyBG.jpg"
      );
      skyBg.width = app.screen.width;
      skyBg.height = app.screen.height;
      app.stage.addChild(skyBg);

      const spaceBg = Sprite.from(
        "https://pixijs.com/header/assets/img/spaceBG.jpg"
      );
      spaceBg.width = app.screen.width;
      spaceBg.height = app.screen.height;
      spaceBg.blendMode = BLEND_MODES.ADD;
      app.stage.addChild(spaceBg);

      const skyCloud1Texture = Texture.from(
        "https://pixijs.com/header/assets/img/skyCloud1.png"
      );
      const skyCloud2Texture = Texture.from(
        "https://pixijs.com/header/assets/img/skyCloud2.png"
      );

      const clouds = [];
      const cloudAmount = 10;
      let cameraZ = 0;
      const fragmentShader = new Filter(null, cloudShader);
      const extractBrightnessFilter = new Filter(
        null,
        extractBrightnessFragmentShader,
        { threshold: 0.7 }
      );
      // const blurFilter = new BlurFilter();
      // blurFilter.blur = 5;

      const margin = app.screen.width * 0.3; // 边缘区域宽度（例如，屏幕宽度的30%）

      for (let i = 0; i < cloudAmount; i++) {
        const texture = i % 2 === 0 ? skyCloud1Texture : skyCloud2Texture; // 交替纹理

        const cloud = new Sprite(texture);

        // TODO: 比较卡，暂时不用
        // cloud.filters = [
        //   new GlowFilter({
        //     distance: 15,
        //     outerStrength: 1,
        //     color: 0xffffff,
        //     quality: 0.1,
        //     knockout: false,
        //   }),
        //   //   fragmentShader,
        //   //   extractBrightnessFilter,
        //   //   blurFilter,
        // ];
        cloud.anchor.set(0.6, 0.5);

        const side = i % 2 === 0 ? "left" : "right";

        const leftInitialX = Math.random() * 10;

        if (side === "left") {
          cloud.x = leftInitialX * margin;
          cloud.transform.rotation = Math.PI / 8;
        } else {
          cloud.x = leftInitialX * margin + app.screen.width * 0.8;
          cloud.transform.rotation = -Math.PI / 8;
        }

        cloud.y = Math.max(
          app.screen.height - cloud.height / 6,
          Math.random() * app.screen.height
        );
        // @ts-ignore
        cloud.z = Math.random() * 500;
        clouds.push(cloud);
        app.stage.addChild(cloud);
      }

      const cameraSpeed = 4;
      const cloudSpeed = cameraSpeed * 2;

      app.ticker.add((delta) => {
        cameraZ += delta * cameraSpeed;

        clouds.forEach((cloud, index) => {
          cloud.z -= delta * cloudSpeed;

          if (cloud.z < 0) {
            cloud.z += 1000;
            cloud.x =
              index % 2 === 0
                ? Math.random() * 10 * margin
                : Math.random() * 10 * margin + app.screen.width * 0.8;
            cloud.texture =
              index % 2 === 0 ? skyCloud1Texture : skyCloud2Texture; // 重新分配纹理

            cloud.scale = 2;
            cloud.alpha = 1;
          }

          const scale = 2.8 - cloud.z / 1000;
          cloud.scale.set(scale, scale); // 确保x和y方向的缩放一致
          cloud.alpha = 1 - cloud.z / 1000; // 透明度应该是由不透明到透明
        });
      });

      //   return () => app.destroy(true, { children: true, texture: true });
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ height: 1000, width: "100%" }}></canvas>
    </div>
  );
};

export default CloudAnime;
