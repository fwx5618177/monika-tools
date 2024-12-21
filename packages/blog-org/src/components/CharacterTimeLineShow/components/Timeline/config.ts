import { DropShadowFilter } from "@pixi/filter-drop-shadow";

// 配置对象
export const config = {
  timelineHeightFactor: 1, // 时间线高度为画布高度的占比
  timelineWidth: 5, // 时间线宽度
  paddingFactor: 0.1,
  eventRadius: 50,
  normalStyle: {
    scale: 1.0,
    fontSize: 14,
    lineWidth: 2,
    lineColor: 0xf5b041, // 柔和的橙色边框
    fillColor: 0xf39c12, // 明亮的橙色填充
  },
  hoverStyle: {
    scale: 1.2,
    fontSize: 18,
    lineWidth: 3, // 悬停时的边框宽度
    fillColor: 0x5dade2, // 悬停时的填充颜色，淡蓝色
    lineColor: 0x3498db, // 较深的蓝色边框
  },
  clickStyle: {
    scale: 1.1, // 点击时的缩放
    fontSize: 16, // 点击时的字体大小
    lineWidth: 3, // 点击时的边框宽度
    lineColor: 0x1abc9c, // 较亮的青色边框
    fillColor: 0x48c9b0, // 点击时的填充颜色，青蓝色
  },
};

// 滤镜
export const dropShadowFilter = new DropShadowFilter({
  blur: 2,
  distance: 3,
  alpha: 0.5,
});
