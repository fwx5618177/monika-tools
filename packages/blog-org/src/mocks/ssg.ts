import { ArticleDisplayProps } from "Components";

// 示例的背景图像数据
export const imageData = {
  id: "1",
  // link: "https://via.placeholder.com/1920x1080", // 你的背景图像链接
  link: "https://picsum.photos/2560/1600",
  small: "https://picsum.photos/2560/400",
  welcome: "Moxi的个人主页",
};

// export const articles: ArticleDisplayProps[] = [
//   {
//     id: 0,
//     slug: "1122334455666",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "探秘ElegantPaper的美学设计",
//     createdDate: "2022-11-27",
//     publishedDate: "2022-11-27",
//     updatedDate: "2022-11-27",
//     content: "精美的排版设计和卓越的阅读体验。",
//     position: "left",
//     meta: {
//       isSticky: true,
//       type: "公告",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//       date: "",
//     },
//   },
//   {
//     key: 1,
//     slug: "112233445533",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "探美学设计",
//     createdDate: "2022-11-27",
//     publishedDate: "2022-11-27",
//     updatedDate: "2022-11-27",
//     content: "不断探索设计的边界。",
//     position: "right",
//     meta: {
//       isSticky: false,
//       type: "模板",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//     },
//   },
//   {
//     key: 2,
//     slug: "112233445544",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "艺术与技术的融合",
//     createdDate: "2022-12-01",
//     publishedDate: "2022-11-27",
//     updatedDate: "2022-11-27",
//     content: "当艺术遇上技术，创新无限。",
//     position: "left",
//     meta: {
//       isSticky: false,
//       type: "专题",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//     },
//   },
//   {
//     key: 3,
//     slug: "112233445555",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "数字化转型的先行者",
//     createdDate: "2023-01-15",
//     content: "引领企业数字化转型的关键因素。",
//     position: "right",
//     meta: {
//       isSticky: false,
//       type: "分析",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//     },
//   },
//   {
//     key: 4,
//     slug: "112233445577",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "可持续设计的未来",
//     createdDate: "2023-02-20",
//     content: "环境友好型设计将如何改变世界。",
//     position: "left",
//     meta: {
//       isSticky: false,
//       type: "观点",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//     },
//   },
//   {
//     key: 5,
//     slug: "112233445588",
//     imageUrl: "https://picsum.photos/400/300",
//     title: "可持续设计的未来",
//     createdDate: "2023-02-20",
//     content: "环境友好型设计将如何改变世界。",
//     position: "left",
//     meta: {
//       isSticky: false,
//       type: "观点",
//       readCount: 100,
//       wordCount: 100,
//       readTimeCost: 100,
//     },
//   },
// ];

export const recentArticles = [
  {
    title: "探秘ElegantPaper的美学设计",
    createdDate: "2023-02-07",
    imageUrl: "https://picsum.photos/200/300?random=1",
  },
  {
    title: "现代Web开发趋势分析",
    createdDate: "2022-11-27",
    imageUrl: "https://picsum.photos/200/300?random=2",
  },
  {
    title: "使用React构建高性能应用",
    createdDate: "2022-11-27",
    imageUrl: "https://picsum.photos/200/300?random=3",
  },
];

export const tags = [
  "B-CJ理论",
  "C#",
  "LaTeX",
  "Logistic模型",
  "Monty Hall问题",
  "Riemann-Lebesgue引理",
  "VSCode",
  "iGEM",
  "一致有界",
  "紧性问题",
];

export const websiteStats = {
  articleCount: 10,
  totalWordCount: 100,
  totalVisitors: 100,
  totalVisits: 100,
  lastUpdated: Date.now(),
};

export const profileInfo = {
  name: "冯文轩",
  avatar: "https://picsum.photos/200/300?random=4",
  description: "一个热爱生活的人",
  articlesCount: 0,
  tagsCount: 0,
  categoriesCount: 0,
  qqLink: "https://im.qq.com/",
  githubLink: "https://github.com/fwx5618177/",
  emailLink: "fengwenxuan2006@126.com",
};
