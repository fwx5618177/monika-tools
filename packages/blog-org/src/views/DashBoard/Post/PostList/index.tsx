import { Button, Card, Table, message } from "antd";
import styles from "./index.module.scss";
import { columns, detailColumns } from "./conf";
import {
  useLocalAllPostStatus,
  useLocalPostList,
  useLocalPostStatus,
} from "@/services/Local/hooks";
import { find } from "lodash";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import "moment/locale/zh-cn";
import EditPost from "@/components/EditPost";
import { PostStatusProps } from "Dashboard";

const Post = () => {
  moment.locale("zh-cn");
  const { data, isLoading, refetch } = useLocalPostList();
  const { mutateAsync } = useLocalPostStatus<PostStatusProps>();
  const { mutateAsync: updateAllPosts } =
    useLocalAllPostStatus<PostStatusProps>();
  const [detailData, setDetailData] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalRecord, setModalRecord] = useState(null);

  const findDetailData = (slug: string) => {
    const detailData = find(data, (item) => item.slug === slug);
    setDetailData([detailData]);
  };

  const ops: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <Button
              style={{
                marginRight: 5,
              }}
              type="primary"
              size="small"
              loading={isLoading}
              onClick={async () => {
                console.log({
                  record,
                });

                const { isExist } = await mutateAsync({
                  id: record?.id,
                  title: record?.title,
                  slug: record?.slug,
                } as PostStatusProps);

                if (isExist) {
                  message.success("同步成功");
                  refetch();
                }
              }}
            >
              插入ID
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setVisible(true);
                setModalRecord(record);
              }}
            >
              编辑
            </Button>
            <Button
              style={{
                marginLeft: 5,
              }}
              type="primary"
              size="small"
              danger
              onClick={() => {}}
            >
              归档
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles["post-list-box"]}>
      {!visible && (
        <Card
          style={{
            backgroundColor: "transparent",
          }}
          loading={isLoading}
          title={
            <div className={styles["card-title"]}>
              本地文章列表(total: {data?.length})
            </div>
          }
        >
          <div
            style={{
              margin: 12,
            }}
          >
            <Button
              type="primary"
              onClick={async () => {
                const list = data?.map((item) => ({
                  id: item?.id,
                  title: item?.title,
                  slug: item?.slug,
                }));

                const updatedResult = await updateAllPosts(list);
                const { successIds, failedIds } = updatedResult;

                message.success(
                  `同步结束, 成功:${successIds?.length}条, 失败:${failedIds?.length}条!`
                );
                refetch();
              }}
            >
              所有Post规格化
            </Button>
          </div>
          <Table
            loading={isLoading}
            rowKey={(record) => record?.slug}
            columns={ops}
            dataSource={data}
            scroll={{
              y: 800,
            }}
            expandable={{
              expandedRowRender: () => (
                <Table
                  columns={detailColumns}
                  dataSource={detailData}
                  pagination={false}
                  rowKey={(record) => record?.slug + record?.id}
                />
              ),
              onExpand: (_, record) => {
                findDetailData(record?.slug);
              },
            }}
          />
        </Card>
      )}

      {visible && (
        <EditPost
          setVisible={setVisible}
          data={modalRecord}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Post;
