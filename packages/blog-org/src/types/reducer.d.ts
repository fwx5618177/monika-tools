declare module "Reducer" {
  import { ReactNode } from "react";
  import { TocTypes } from "Components";

  type TocState = {
    toc: TocTypes[];
  };

  type ActionTypes =
    | { type: "ADD_TO_TOC"; payload: TocTypes }
    | { type: "ADD_MULTIPLE_TOC"; payload: TocTypes[] }
    | { type: "REMOVE_FROM_TOC"; payload: TocTypes["key"] }
    | { type: "CLEAR_TOC" };

  type Dispatch = (action: ActionTypes) => void;
}
