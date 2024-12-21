import { useEffect, useRef } from "react";
import { setupPixiApp } from "./components/pixiSetUp";
import { showLoadingAnimation } from "./components/loadingAnimation";
import { createTimeline } from "./components/Timeline/createTimeline";

import styles from "./index.module.scss";
import { createCircle } from "./components/Timeline/createCircle";

const CharacterTimeLineShow = () => {
  const divRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const canvas = divRef.current;
      const app = setupPixiApp({
        view: canvas,
        width: 800,
        height: 800,
        backgroundColor: 0xffffff,
      });
      const loadingText = showLoadingAnimation(app);

      setTimeout(() => {
        // 移除加载动画
        app.stage.removeChild(loadingText);

        const events = [
          { title: "Event 1", date: "2021-01-01", color: 0xff0000 },
          { title: "Event 2", date: "2022-01-01", color: 0x00ff00 },
          // ...更多事件
        ];
        // const timelineContainer = createTimeline(app, events);
        const circleContainer = createCircle({ app });
        app.stage.addChild(circleContainer);
      }, 10);
    }
  }, []);

  return <canvas ref={divRef} className={styles["canvasContainer"]}></canvas>;
};

export default CharacterTimeLineShow;
