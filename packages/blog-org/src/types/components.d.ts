declare module "Components" {
  import { ReactNode } from "react";
  import { TocState, ActionTypes } from "Reducer";

  type PaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number, pageSize?: number, total?: number) => void;
  };

  interface PageSet {
    page: number;
    pageSize: number;
    total: number;
  }

  interface HomeImageProps {
    id: string;
    link: string;
    small: string;
    welcome: string;
  }

  interface BackScrollProps {
    children?: ReactNode;
    header?: ReactNode;
    imageData: HomeImageProps;
  }

  interface HomePageProps {
    imageData: HomeImageProps;
    list: ArticleDisplayProps[];
    recentArticles: Article[];
    tags: string[];
    websiteStats: WebsiteStatsProps;
    profileInfo: ProfileCardProps;
  }

  interface MetaDataProps {
    isSticky: boolean;
    type: string;
    date: string | Date | number;
    readCount: string | number;
    wordCount: string | number;
    readTimeCost: string | number;
  }

  type WebsiteStatsProps = {
    articleCount: number;
    totalWordCount: number;
    totalVisitors: number;
    totalVisits: number;
    lastUpdated: string | Date | number;
  };

  interface Author {
    url?: string | URL;
    name?: string;
  }

  interface RelativeArticleProps {
    title: string;
    updatedDate: string | number | Date;
    imageUrl: string;
    type: "pre" | "next" | string;
    slug: string;
  }

  type RelativeArticleListProps = RelativeArticleProps[];

  interface ArticleDisplayProps {
    id: string | number;
    slug: string;
    imageUrl: string;
    title: string;
    createdDate: string | Date | number;
    publishedDate: string | Date | number;
    updatedDate: string | Date | number;
    content: string;
    position: "left" | "right";
    meta: MetaDataProps;
    description: string;
    excerpt: string;
    author: Author;
    tags: string[];
    readCount: number;
    commentsCount: number;
    status: PostStatusEnum;
    type: string;
    language: string;
    addition: string[];
    websiteStats: WebsiteStatsProps;
    relatives?: RelativeArticleListProps;
  }

  interface PostPageParmaProps {
    params: {
      slug: string;
    };
  }

  interface PostViewProps {
    children?: ReactNode;
    defaultData: HomePageProps;
    postData?: ArticleDisplayProps;
  }

  interface PostPageProps {
    content: string;
    slug: string;
    title: string;
    updatedDate: string | Date | number;
    author: Author;
    type: string;
    addition?: string[];
    relatives: RelativeArticleListProps;
    excerpt?: string;
  }

  type TagCloudProps = {
    tags: string[];
    title: string;
  };

  interface ListSectionProps {
    defaultArticles: ArticleDisplayProps[];
  }

  interface DetailInfoProps {
    data?: ArticleDisplayProps[];
    recentArticles?: Article[];
    tags?: string[];
    websiteStats?: WebsiteStatsProps;
    profileInfo?: ProfileCardProps;
    isHomeList?: boolean;
    children?: ReactNode;
  }

  interface Article {
    title: string;
    date: string;
    imageUrl: string;
  }

  interface NewPressProps {
    title: string | ReactNode;
    articles: Article[];
  }

  interface ProfileCardProps {
    avatarUrl: string;
    name: string;
    description: string;
    articlesCount: number;
    tagsCount: number;
    categoriesCount: number;
    qqLink: string;
    emailLink: string;
    githubLink: string;
  }

  interface HeaderProps {
    small: string;
    children?: ReactNode;
    height?: number;
    isPost?: boolean;
    postData?: ArticleDisplayProps;
  }

  interface InfoBoxProps {
    width?: string | number;
    height?: string | number;
    children?: React.ReactNode;
    scrollable?: boolean;
    infoBoxStyle?: React.CSSProperties;
  }

  interface HeaderTitleProps {
    title: string;
    publishedDate: string | Date | number;
    updatedDate: string | Date | number;
    readCount: string | number;
    wordCount: string | number;
    readTimeCost: string | number;
    type: string | ReactNode;
  }

  interface TocTypes {
    key: string;
    level: number;
    text: string;
    href: string;
  }

  interface TocContextType {
    tocState: TocState;
    tocDispatch: React.Dispatch<ActionTypes>;
  }

  interface TocProgressProps {
    active: string;
    total: TocTypes[];
  }

  interface TocAccordionProps {
    toc: TocTypes[];
    currentTitle: string;
  }

  type HocTree = TocTypes & {
    children: TocTypes[];
  };

  interface ArticleStatusType {
    status: PostStatusEnum;
    onStatusChange?: (newStatus: PostStatusEnum) => void;
  }

  interface LoginRequest {
    username: string;
    password: string;
    remember: boolean;
  }

  interface DashboardLayoutProps {
    children?: ReactNode;
  }

  interface ComponentMap {
    [key: string]: React.ComponentType<any>;
  }

  interface MenuProps {
    name: string;
    key: string;
    icon: JSX.Element;
    href?: string;
    children?: MenuProps[];
    label?: ReactNode;
  }
  [];

  interface MenuItemProps extends MenuProps {
    active?: boolean;
  }

  interface HeatMapDataProps {
    date: string;
    count: number;
  }

  interface CalendarHeatMapProps {
    startDate: string | number | Date | undefined;
    endDate: string | number | Date | undefined;
    values: Array<HeatMapDataProps>;
    pushCount: number;
    pushDate: string;
  }

  interface CodeBlockProps {
    language: string;
    text: string;
    setTheme?: Dispatch<SetStateAction<string>>;
    children?: ReactNode;
  }

  interface DropdownSelectorProps {
    dataList: string[];
    onChange: (value: string) => void;
  }
}
