import deepmerge from "deepmerge";
import { StyleDefinition } from "../interfaces/lib.interface";

export const resolveStyleDefinition = <Style, Attributes>(
  styleDefinition: StyleDefinition<Style, Attributes>,
  attributes: Attributes
): Style => {
  let style: { [Key in keyof Style]?: StyleDefinition<Style[Key], Attributes> };
  if (styleDefinition instanceof Function) {
    style = styleDefinition(attributes);
  } else if (typeof styleDefinition === "object" && styleDefinition !== null) {
    style = Object.fromEntries(
      Object.entries(styleDefinition).map(([key, styleDefinition]) => {
        return [key, resolveStyleDefinition(styleDefinition, attributes)];
      })
    ) as Style;
  } else {
    style = styleDefinition;
  }
  return style as Style;
};

export const resolveStyleDefinitions = <Style, Attributes>(
  styleDefinitions: (StyleDefinition<Style, Attributes> | undefined)[],
  attributes: Attributes
): Style => {
  const styles = styleDefinitions
    .filter((x) => !!x)
    .map((styleDefinition) =>
      resolveStyleDefinition(styleDefinition!, attributes)
    );
  const style = deepmerge.all<Style>(styles);
  return style;
};
