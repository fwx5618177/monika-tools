"use client";

import { DashboardLayoutProps } from "Components";
import React, { FC, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme, Breadcrumb } from "antd";
import { SideItem } from "@/settings/side.config";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "@/styles/dashboard.module.scss";

const { Header, Sider, Content } = Layout;
const { Item } = Breadcrumb;

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const uriParams = usePathname();
  const { logout } = useAuthContext();
  const uriList = uriParams?.split("/");

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={SideItem}
          selectedKeys={[uriList?.[uriList?.length - 1]]}
        />
      </Sider>

      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer, display: "flex" }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              type="primary"
              onClick={logout}
              style={{
                marginRight: 12,
              }}
            >
              Logout
            </Button>
          </div>
        </Header>

        {uriList?.length > 0 && (
          <Breadcrumb style={{ margin: 16 }}>
            {uriList?.map((item) => {
              if (item) return <Item key={"_uri"}>{item}</Item>;
            })}
          </Breadcrumb>
        )}

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            // background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
          className={styles.dashboardContent}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
