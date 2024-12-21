import { PostStatusDisplay } from "@/types/common";
import { Avatar, Tag, Image } from "antd";
import Link from "next/link";
import moment from "moment";
import { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<any> = [
  {
    title: "是否置顶",
    dataIndex: "isTop",
    key: "isTop",
    width: 100,
    align: "center",
    render: (_, record) => {
      const { isSticky } = record?.meta || { isSticky: false };
      return isSticky ? "是" : "否";
    },
  },
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    width: 180,
    align: "center",
    render: (_, record) => {
      const { imageUrl } = record;

      return <Image alt="cover" src={imageUrl} />;
    },
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    width: 200,
    align: "center",
    render: (text: string, record) => (
      <Link href={`/post/${record.slug}`}>{text}</Link>
    ),
  },
  {
    title: "语言",
    dataIndex: "language",
    key: "language",
    width: 100,
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    width: 200,
    align: "center",
  },
  {
    title: "摘要",
    dataIndex: "excerpt",
    key: "excerpt",
    width: 200,
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
    width: 100,
    align: "center",
    render: (text) => (
      <div>
        <Avatar src={text?.avatarUrl}>{text?.name}</Avatar>
      </div>
    ),
  },
  {
    title: "分类",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    title: "标签",
    dataIndex: "tags",
    key: "tags",
    width: 150,
    align: "center",
    render: (text) => {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          {text?.map((item: string) => (
            <Tag color="#f50" key={item}>
              {item}
            </Tag>
          ))}
        </div>
      );
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
    render: (text: string) => (
      <Tag color="#2db7f5">{PostStatusDisplay[text]}</Tag>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    width: 180,
    render: (text) => {
      return (
        <div>
          {moment(text).format("YYYY-MM-DD HH:mm:ss")}
          <div
            style={{
              color: "#52c41a",
            }}
          >
            ({moment(text).fromNow()})
          </div>
        </div>
      );
    },
  },
  {
    title: "更新时间",
    dataIndex: "updatedDate",
    key: "updatedDate",
    align: "center",
    width: 200,
    render: (text) => {
      return (
        <div>
          {moment(text).format("YYYY-MM-DD HH:mm:ss")}
          <div
            style={{
              color: "#2db7f5",
            }}
          >
            ({moment(text).fromNow()})
          </div>
        </div>
      );
    },
  },
  {
    title: "发布时间",
    dataIndex: "publishedDate",
    key: "publishedDate",
    align: "center",
    width: 180,
    render: (text) => {
      return (
        <>
          {text ? (
            <div>
              {moment(text).format("YYYY-MM-DD HH:mm:ss")}
              <div
                style={{
                  color: "#f50",
                }}
              >
                ({moment(text).fromNow()})
              </div>
            </div>
          ) : (
            "--"
          )}
        </>
      );
    },
  },
];

export const detailColumns: ColumnsType<any> = [
  {
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
    width: 150,
  },
  {
    title: "id",
    dataIndex: "id",
    key: "id",
    width: 150,
  },
  {
    title: "阅读数",
    dataIndex: "readCount",
    key: "readCount",
    align: "center",
    width: 100,
    render: (_, record) => {
      const { readCount } = record?.meta || { readCount: 0 };
      return readCount;
    },
  },
  {
    title: "阅读时长",
    dataIndex: "readTimeCost",
    key: "readTimeCost",
    align: "center",
    width: 100,
    render: (_, record) => {
      const { readTimeCost } = record?.meta || { readTimeCost: 0 };
      return readTimeCost;
    },
  },
  {
    title: "字数统计",
    dataIndex: "wordCount",
    key: "wordCount",
    align: "center",
    width: 100,
    render: (_, record) => {
      const { wordCount } = record?.meta || { wordCount: 0 };
      return wordCount;
    },
  },
  {
    title: "文章额外展示数据",
    dataIndex: "addition",
    key: "addition",
    width: 200,
    render: (text: string[]) => {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 5,
          }}
        >
          {text?.map((item: string) => (
            <Tag color="#f50" key={item}>
              {item}
            </Tag>
          ))}
        </div>
      );
    },
  },
];
