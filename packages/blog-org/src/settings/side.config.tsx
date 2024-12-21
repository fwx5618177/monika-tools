import {
  UserOutlined,
  HomeOutlined,
  QqCircleFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { FcManager, FcSearch, FcSurvey, FcReddit } from "react-icons/fc";
import DashBoardRootView from "@/views/DashBoard/DashBoardRootView";
import { MenuProps } from "Components";
import { FaUsers } from "react-icons/fa";
import Link from "next/link";

export const defaultSelectedKeys = ["1"];

export const SideItem: MenuProps[] = [
  {
    name: "首页",
    key: "home",
    label: <Link href="/dashboard/home">首页</Link>,
    icon: <HomeOutlined />,
    href: "/dashboard/home",
  },
  {
    name: "文章",
    key: "post",
    label: "文章",
    icon: <FcSearch />,
    children: [
      {
        name: "文章列表",
        key: "postList",
        label: <Link href="/dashboard/postList">文章列表</Link>,
        href: "/dashboard/postList",
        icon: <FcSearch />,
      },
      {
        name: "创建文章",
        key: "createPost",
        label: <Link href="/dashboard/createPost">创建文章</Link>,
        href: "/dashboard/createPost",
        icon: <FcSearch />,
      },
    ],
  },
  {
    name: "小说工具",
    key: "novelTools",
    label: "小说工具",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        name: "人物关系",
        label: <Link href="/dashboard/characterDesign">人物关系</Link>,
        key: "characterDesign",
        href: "/dashboard/characterDesign",
        icon: <UserOutlined />,
      },
      {
        name: "人物时间线发展",
        label: <Link href="/dashboard/characterTimeLine">人物时间线发展</Link>,
        key: "characterTimeLine",
        href: "/dashboard/characterTimeLine",
        icon: <UserOutlined />,
      },
    ],
  },
  {
    name: "用户",
    key: "users",
    label: "用户",
    icon: <QqCircleFilled />,
    children: [
      {
        name: "用户列表",
        label: <Link href="/dashboard/userList">用户列表</Link>,
        key: "userList",
        href: "/dashboard/userList",
        icon: <UserOutlined />,
      },
    ],
  },
  {
    name: "客服",
    label: "客服",
    key: "customerService",
    icon: <FcManager />,
    children: [
      {
        name: "客服消息",
        label: <Link href="/dashboard/customerServiceMessage">客服消息</Link>,
        key: "customerServiceMessage",
        href: "/dashboard/customerServiceMessage",
        icon: <FaUsers />,
      },
      {
        name: "机器人设置",
        label: <Link href="/dashboard/robotSet">机器人设置</Link>,
        key: "robotSet",
        href: "/dashboard/robotSet",
        icon: <FcReddit />,
      },
    ],
  },
  {
    name: "SEO",
    key: "seo",
    label: "SEO",
    icon: <FcSearch />,
    children: [
      {
        name: "SEO设置",
        key: "seoSet",
        label: <Link href="/dashboard/seoSet">SEO设置</Link>,
        href: "/dashboard/seoSet",
        icon: <FcSurvey />,
      },
      {
        name: "子页面seo",
        key: "childSeo",
        label: <Link href="/dashboard/childSeo">子页面seo</Link>,
        href: "/dashboard/childSeo",
        icon: <FcSurvey />,
      },
    ],
  },
];

export const DefaultItem = DashBoardRootView;
