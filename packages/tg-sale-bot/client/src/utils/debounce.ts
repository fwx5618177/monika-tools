import { debounce } from "lodash";

type CallbackFunction = (...args: any[]) => void;

export const debounceClick = (callback: CallbackFunction, wait = 5000) =>
  debounce(callback, wait);
