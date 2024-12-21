import { PostStatusDisplay } from "@/types/common";
import { Avatar, Button, Form, Input, Select, Typography, message } from "antd";
import TagsModify from "../TagsModify";
import MarkdownEditor from "../MarkdownEditor";
import ImageShow from "../ImageShow";
import { useLocalPostUpdate } from "@/services/Local/hooks";
import { PostEditFormProps } from "Dashboard";
import SynchronizeId from "../SynchronizeId";

const EditPost = ({ setVisible, data, refetch }) => {
  const [form] = Form.useForm();
  const { mutateAsync, isLoading, isError, isIdle } = useLocalPostUpdate();

  const initialValues = {
    ...data,
    ...data?.meta,
    name: data?.author?.name,
    cover: "https://picsum.photos/950/300",
  };

  const onFinish = async (values: PostEditFormProps) => {
    try {
      console.log({
        values,
      });
      // 执行异步操作
      await mutateAsync(values);

      if (!isIdle && !isError && isLoading) {
        setVisible(false);
        message.success("更新成功");
      }
    } catch (error) {
      console.error("Error updating local post:", error);
    } finally {
      console.log("refetch");
      refetch();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div>
        <Button
          type="default"
          style={{ marginRight: 8 }}
          onClick={() => setVisible(false)}
        >
          返回
        </Button>
      </div>
      <Form
        form={form}
        name="edit"
        autoComplete="off"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={initialValues}
        preserve={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="ID" name="id">
          <SynchronizeId />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Typography.Text>{data?.slug}</Typography.Text>
        </Form.Item>

        <Form.Item label="Local Path" name={"localPath"}>
          <Typography.Text>{data?.localPath}</Typography.Text>
        </Form.Item>

        <Form.Item label="用户">
          <div>
            <Avatar src={data?.author?.avatarUrl}>{data?.author?.name}</Avatar>
          </div>
        </Form.Item>
        <Form.Item label="置顶" name="isSticky">
          <Select placeholder="请选择是否置顶">
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: "请输入标题",
            },
          ]}
        >
          <Input allowClear placeholder="请输入标题" showCount maxLength={50} />
        </Form.Item>

        <Form.Item label="封面" name="cover">
          {/* <Input allowClear placeholder="请输入封面" /> */}
          <ImageShow />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态">
            {Object.entries(PostStatusDisplay)?.map((item, index) => (
              <Select.Option key={index} value={item[0]}>
                {item[1]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="类型" name="type">
          <Input allowClear placeholder="请输入类型" />
        </Form.Item>

        <Form.Item label="语言" name="language" rules={[{ required: true }]}>
          <Input allowClear placeholder="请输入语言" />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <Input allowClear placeholder="请输入描述" onChange={console.log} />
        </Form.Item>

        <Form.Item label="摘要" name="excerpt">
          <Input.TextArea
            allowClear
            placeholder="请输入摘要"
            showCount
            maxLength={200}
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item label="作者" name="name">
          <Input allowClear placeholder="请输入作者" />
        </Form.Item>

        <Form.Item label="标签" name="tags">
          <TagsModify />
        </Form.Item>

        <Form.Item label="额外关联tag" name={"addition"}>
          <TagsModify />
        </Form.Item>

        {/* 
        <Form.Item label="版本选择" name={"version"}>
          <VersionSelector />
        </Form.Item> */}

        <Form.Item label="内容" name={"content"}>
          <MarkdownEditor />
        </Form.Item>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            提交
          </Button>
          <Button type="default" htmlType="reset" style={{ marginLeft: 8 }}>
            重置
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditPost;
