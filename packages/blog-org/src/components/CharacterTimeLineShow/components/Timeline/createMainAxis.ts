import { Graphics } from "@pixi/graphics";

export const createMainAxis = ({ x, y, h, w, filters }) => {
  const timeline = new Graphics();
  timeline.clear();
  timeline.beginFill(0xffffff);
  timeline.drawRect(x, y, w, h);
  timeline.endFill();

  // 添加阴影滤镜给主轴
  timeline.filters = [...filters];

  return timeline;
};
