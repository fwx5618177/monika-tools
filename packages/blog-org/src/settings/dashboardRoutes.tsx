import { ComponentMap } from "Components";
import dynamic from "next/dynamic";

export const routes: ComponentMap = {
  home: dynamic(() => import("@/views/DashBoard/DashBoardRootView"), {
    ssr: false,
  }),
  userList: dynamic(() => import("@/views/DashBoard/User/User"), {
    ssr: false,
  }),
  postList: dynamic(() => import("@/views/DashBoard/Post/PostList"), {
    ssr: false,
  }),
  createPost: dynamic(() => import("@/views/DashBoard/Post/CreatePost"), {
    ssr: false,
  }),
  characterDesign: dynamic(
    () => import("@/views/DashBoard/NovelTools/CharacterDesign"),
    {
      ssr: false,
    }
  ),
  characterTimeLine: dynamic(
    () => import("@/views/DashBoard/NovelTools/CharacterTimeLine"),
    {
      ssr: false,
    }
  ),
};

export const dynamicRoutes = (key: string) => {
  if (key in routes) return routes[key];

  return dynamic(
    () =>
      import("@/views/DashBoard/UnderConstructionPage/UnderConstructionPage")
  );
};

// export const filterRoutes = (
//   permission: string,
//   items: MenuProps[],
//   forbiddenKeys: string[] = []
// ): MenuProps[] => {
//   if (permission === "SALE") {
//     return items.map((item) => {
//       if (item.items) {
//         item.items = item.items.filter(
//           (subItem) => !forbiddenKeys.includes(subItem.key)
//         );
//       }
//       return item;
//     });
//   }
//   return items;
// };
