import React, { FC, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Space, Image, Upload, message } from "antd";
import { UploadChangeParam, RcFile } from "antd/lib/upload/interface";
import { UploadFile } from "antd/lib/upload/interface";
import { ImageShowProps } from "Dashboard";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ImageShow: FC<Partial<ImageShowProps>> = ({ value, onChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const acceptedList = [".png", ".jpeg", ".jpg"];
  const LimitFileSize = 2; // 2 MB

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      try {
        file.preview = await getBase64(file.originFileObj as RcFile);
      } catch (error) {
        message.error("Failed to load preview image.");
      }
    }

    message.success("Preview loaded successfully!");
  };

  const handleChange = ({ fileList: newFileList }: UploadChangeParam) => {
    setFileList(newFileList);
    if (onChange && newFileList.length > 0 && newFileList[0].url) {
      onChange(newFileList[0].url);
    }
  };

  const handleBeforeUpload = (file) => {
    // Limit file types
    const isAcceptedType = acceptedList.some((type) =>
      file.type.includes(type)
    );
    if (!isAcceptedType) {
      message.error("Invalid file type. Please upload a valid image.");
      return false;
    }
    // Limit file size (2MB)
    const isLt2M = file.size / 1024 / 1024 < LimitFileSize;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return true;
  };

  return (
    <Space size={[0, 8]} wrap>
      <Image src={value} width={400} alt="avatar" />
      <Upload
        accept={acceptedList.join(",")}
        listType="picture-circle"
        onPreview={handlePreview}
        onChange={handleChange}
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        style={{
          marginLeft: 8,
        }}
      >
        <div>
          <PlusOutlined />
          <div style={{ margin: 8 }}>Upload</div>
        </div>
      </Upload>
    </Space>
  );
};

export default ImageShow;
