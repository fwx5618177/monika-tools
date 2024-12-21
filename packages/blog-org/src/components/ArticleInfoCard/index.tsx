import React, { FC } from "react";
import { Card, Col, Row, Statistic, Tag, Tooltip, Typography } from "antd";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  TagOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";

const ArticleInfoCard: FC<{
  title: string;
  articleCount: number;
  lastPublished: {
    date: Date;
    name: string;
    slug: string;
  };
  typeCount: string[];
}> = ({ title, articleCount, lastPublished, typeCount }) => {
  return (
    <Card
      title={title}
      style={{
        width: "100%",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        borderRadius: 10,
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="文章发布"
            value={articleCount}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col span={8}>
          <Tooltip
            color="#fff"
            title={
              <Typography.Title level={5} style={{ margin: 0 }}>
                <Link href={`/post/${lastPublished?.slug}`}>
                  {lastPublished?.name}
                </Link>
              </Typography.Title>
            }
          >
            <Statistic
              title="最后更新"
              value={moment(lastPublished?.date).format("YYYY-MM-DD HH:mm:ss")}
              prefix={<ClockCircleOutlined />}
            />
          </Tooltip>
        </Col>
        <Col span={8}>
          <Tooltip
            color="#fff"
            title={
              <div>
                {typeCount?.map((item: string) => (
                  <Tag color="#f50" key={item}>
                    {item}
                  </Tag>
                ))}
              </div>
            }
          >
            <Statistic
              title="类型"
              value={typeCount.length}
              prefix={<TagOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );
};

export default ArticleInfoCard;
