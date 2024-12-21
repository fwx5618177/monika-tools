import { Text, TextStyle } from "@pixi/text";
import { TextType } from "../interfaces/lib.interface";
import { BitmapText } from "@pixi/text-bitmap";

export function textToPixi(
  type: TextType,
  content: string,
  style: Partial<TextStyle>
) {
  let text: Text | BitmapText;

  console.log({
    style: style.fill,
    color: style,
  });

  if (type === TextType.TEXT) {
    // 普通文本
    text = new Text(content, {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fill: style.fill || "#000000",
    });
  } else if (type === TextType.BITMAP_TEXT) {
    // 位图文本
    text = new BitmapText(content, {
      fontName: style.fontFamily as string,
      fontSize: Number(style.fontSize),
    });
  }
  //    else if (type === TextType.SDF_TEXT) {
  //     // SDF 文本，使用自定义的 SDFText 类
  //     text = new SDFText(content, style);
  //   }
  else {
    throw new Error("Invalid text type");
  }

  text.roundPixels = true;

  return text;
}
