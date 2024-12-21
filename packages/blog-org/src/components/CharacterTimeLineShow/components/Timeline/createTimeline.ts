import { TimelineEvent } from "Novel";
import { config, dropShadowFilter } from "./config";
import { createMainAxis } from "./createMainAxis";
import { Application } from "@pixi/app";
import { Container } from "@pixi/display";
import { SmoothGraphics } from "@pixi/graphics-smooth";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { Graphics } from "@pixi/graphics";

const setCircleStyle = ({ graphics, style, x, y, radius }) => {
  graphics.clear();
  graphics.beginFill(style.fillColor);
  graphics.drawCircle(x, y, radius);
  graphics.endFill();
  graphics.scale.set(style.scale);
};

const setTextStyle = ({ text, style, x, y }) => {
  text.x = x;
  text.y = y;
  text.style.fill = style.fillColor;
  text.style.fontSize = style.fontSize;
};

export const createTimeline = (
  app: Application,
  events: TimelineEvent[]
): Container => {
  const timelineContainer = new Container();
  const timelineHeight = app.screen.height * config.timelineHeightFactor; // 时间线高度为画布高度的 80%
  const timelineWidth = config.timelineWidth; // 时间线宽度
  const timelineX = app.screen.width / 2; // 时间线水平居中
  const padding = app.screen.height * config.paddingFactor; // 上下的间隔

  // 创建时间线的主轴
  const timeline = createMainAxis({
    x: timelineX,
    y: 0,
    h: timelineHeight,
    w: timelineWidth,
    filters: [dropShadowFilter],
  });
  // 将时间线添加到舞台
  timelineContainer.addChild(timeline);

  // 遍历时间线事件并创建标记
  events.forEach((event, index) => {
    let isClicked = false;
    const eventY = (timelineHeight / events.length) * index + padding;
    const eventRadius = 20;
    const textPaddingX = eventRadius + 10;
    const textPaddingY = eventRadius;

    // 绘制时间线上的事件
    const eventGraphics = new SmoothGraphics();
    const circleX = timelineX + timelineWidth / 2; // 圆的中心X坐标
    const circleY = eventY; // 圆的中心Y坐标

    eventGraphics.position.set(circleX, circleY);
    // 设置图形的pivot点为圆心
    eventGraphics.pivot.set(eventRadius, eventRadius);
    eventGraphics.filters = [dropShadowFilter];
    setCircleStyle({
      graphics: eventGraphics,
      style: config.normalStyle,
      x: eventRadius,
      y: eventRadius,
      radius: eventRadius,
    });

    // 如果提供了图标，将它添加到圆圈中心
    if (event.icon) {
      const iconSprite = new Sprite(event.icon);
      iconSprite.x = timelineX;
      iconSprite.y = eventY;
      iconSprite.anchor.set(0.5);
      timelineContainer.addChild(iconSprite);
    }

    // 添加事件文本
    const eventText = new Text(`${event.title} - ${event.date}`, {
      fill: event.color,
      fontSize: 14,
    });
    eventText.position.set(timelineX + textPaddingX, eventY);
    eventText.anchor.set(0);
    setTextStyle({
      text: eventText,
      style: config.normalStyle,
      x: timelineX + textPaddingX,
      y: eventY - textPaddingY,
    });

    // 将事件添加到舞台
    timelineContainer.addChild(eventGraphics);
    timelineContainer.addChild(eventText);

    // 添加交互性
    eventGraphics.interactive = true;
    eventGraphics.cursor = "pointer";

    const createRippleEffect = (x, y, container) => {
      const ripple = new Graphics();
      let radius = 0;
      let alpha = 0.5;

      const animateRipple = () => {
        if (radius < 100) {
          radius += 2;
          alpha -= 0.01;
          drawRipple();
          requestAnimationFrame(animateRipple);
        } else {
          container.removeChild(ripple);
        }
      };

      const drawRipple = () => {
        ripple.clear();
        ripple.beginFill(0xffffff, alpha);
        ripple.drawCircle(x, y, radius);
        ripple.endFill();
      };

      drawRipple();
      container.addChild(ripple);
      animateRipple();
    };

    // eventGraphics.on("pointerover", () => {
    //   if (isClicked) return;

    //   setCircleStyle({
    //     graphics: eventGraphics,
    //     style: config.hoverStyle,
    //     x: eventRadius,
    //     y: eventRadius,
    //     radius: eventRadius,
    //   });
    //   setTextStyle({
    //     text: eventText,
    //     style: config.hoverStyle,
    //     x: timelineX + textPaddingX,
    //     y: eventY - textPaddingY,
    //   });
    // });

    // eventGraphics.on("pointerout", () => {
    //   if (isClicked) return;

    //   setCircleStyle({
    //     graphics: eventGraphics,
    //     style: config.normalStyle,
    //     x: eventRadius,
    //     y: eventRadius,
    //     radius: eventRadius,
    //   });

    //   setTextStyle({
    //     text: eventText,
    //     style: config.normalStyle,
    //     x: timelineX + textPaddingX,
    //     y: eventY - textPaddingY,
    //   });
    // });

    // eventGraphics.on("click", () => {
    //   isClicked = !isClicked;

    //   createRippleEffect(circleX, circleY, timelineContainer);

    //   setCircleStyle({
    //     graphics: eventGraphics,
    //     style: config.clickStyle,
    //     x: eventRadius,
    //     y: eventRadius,
    //     radius: eventRadius,
    //   });
    //   setTextStyle({
    //     text: eventText,
    //     style: config.clickStyle,
    //     x: timelineX + textPaddingX,
    //     y: eventY - textPaddingY,
    //   });
    // });
  });

  return timelineContainer;
};
