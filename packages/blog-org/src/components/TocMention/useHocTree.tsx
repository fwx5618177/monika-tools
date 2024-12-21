import { HocTree, TocTypes } from "Components";

const useHocTree = (hoc: TocTypes[]): HocTree[] => {
  const map = {};
  const roots = [];
  const stack = [];

  hoc.forEach((item) => {
    map[item.key] = { ...item, children: [] };
    if (item.level === 1) {
      roots.push(map[item.key]);
      stack.length = 0;
      stack.push(map[item.key]);
    } else {
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }
      const parent = stack[stack.length - 1];
      parent.children.push(map[item.key]);
      stack.push(map[item.key]);
    }
  });

  return roots;
};

export default useHocTree;
