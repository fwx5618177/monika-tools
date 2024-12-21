"use client";

import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { FaGithub, FaGoogle, FaUser, FaLock } from "react-icons/fa";
import styles from "@/styles/loginView.module.scss";
import { useLoginBgImage } from "@/services/Login/hooks";
import { LoginSettingResponse } from "Response";
import { useAuthContext } from "@/contexts/AuthContext";

const LoginView = () => {
  const [form] = Form.useForm();
  const { login, isLoggedIn } = useAuthContext();
  const { data, isError } = useLoginBgImage<LoginSettingResponse>();
  const backgroundImage =
    data?.backgroundImage ||
    "/login_bg_default.jpg" ||
    "https://picsum.photos/2560/1600";

  const initialValues = {
    remember: false,
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    login({
      username: values?.username,
      password: values?.password,
      remember: values?.remember,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("登录失败");
  };

  return (
    <div
      className={styles.loginBackground}
      style={{
        backgroundImage: isError
          ? `url("/login_bg_default.jpg")`
          : `url(${backgroundImage})`,
      }}
    >
      <div className={styles.loginContainer}>
        <Form
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入您的邮箱或用户名!" }]}
          >
            <Input
              className={styles.inputField}
              size="large"
              prefix={<FaUser />}
              placeholder="Email or Username"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码!" }]}
          >
            <Input.Password
              className={styles.inputField}
              size="large"
              prefix={<FaLock />}
              placeholder="Password"
              allowClear
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className={styles["login-checkbox"]}>
              30天内免密登录
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              size="large"
              className={styles.loginButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* <div className={styles.options}>
          <a href="#">忘记密码?</a>
          <a href="#">没有账号? 注册</a>
        </div> */}

        <div className={styles.ssoLogin}>
          <Button icon={<FaGithub />} />
          <Button icon={<FaGoogle />} />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
