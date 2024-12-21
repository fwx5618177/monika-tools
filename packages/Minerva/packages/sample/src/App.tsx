import React from "react";

import Layout from "./pages/Layout";
import Sidebar from "@components/Sidebar/Sidebar";
import Main from "@components/Main/Main";
import Header from "@components/Header/Header";

import styles from "@styles/app.module.scss";
import { useTranslation } from "react-i18next";
import { Button } from "@minerva/lib-core";

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout theme="light">
      <Sidebar />
      <Main>
        <Header />
        <section className={styles.section}>
          <h2>{t("lib.about")}</h2>
          <p>{t("lib.about.description")}</p>
        </section>
        <section className={styles.section}>
          <h2>{t("lib.installation")}</h2>
          <p>{t("lib.installation.description")}</p>
          <div className={styles.codeBlock}>
            <pre>
              <code>npm install @acme/components</code>
            </pre>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Components</h2>
          <p>
            Acme Components provides a wide range of beautifully designed
            components to help you build your web applications. Here are some of
            the available components:
          </p>
          <div className={styles.componentsGrid}>
            <div className={styles.componentCard}>
              <img src="/placeholder.svg" alt="Button" />
              <h3>Button</h3>
              <p>
                A customizable button component with various styles and sizes.
              </p>
              <div className={styles.buttonExamples}>
                <h3>small</h3>
                <div className={styles.buttonGroup}>
                  <Button size="small">Button</Button>
                  <Button size="small" variant="error">
                    Button
                  </Button>
                  <Button size="small" variant="warning">
                    Button
                  </Button>
                  <Button size="small" variant="retry">
                    Button
                  </Button>

                  <Button size="small" variant="back">
                    Button
                  </Button>
                  <Button size="small" variant="disabled">
                    Button
                  </Button>
                </div>

                <h3>medium</h3>
                <div className={styles.buttonGroup}>
                  <Button size="medium">Button</Button>
                  <Button size="medium" variant="error">
                    Button
                  </Button>
                  <Button size="medium" variant="warning">
                    Button
                  </Button>
                  <Button size="medium" variant="retry">
                    Button
                  </Button>
                  <Button size="medium" variant="back">
                    Button
                  </Button>
                  <Button size="medium" variant="disabled">
                    Button
                  </Button>
                </div>

                <h3>large</h3>
                <div className={styles.buttonGroup}>
                  <Button size="large">Button</Button>
                  <Button size="large" variant="error">
                    Button
                  </Button>
                  <Button size="large" variant="warning">
                    Button
                  </Button>
                  <Button size="large" variant="retry">
                    Button
                  </Button>
                  <Button size="large" variant="back">
                    Button
                  </Button>
                  <Button size="large" variant="disabled">
                    Button
                  </Button>
                </div>

                <h3>xlarge</h3>
                <div className={styles.buttonGroup}>
                  <Button size="xlarge">Button</Button>
                  <Button size="xlarge" variant="error">
                    Button
                  </Button>
                  <Button size="xlarge" variant="warning">
                    Button
                  </Button>
                  <Button size="xlarge" variant="retry">
                    Button
                  </Button>
                  <Button size="xlarge" variant="back">
                    Button
                  </Button>
                  <Button size="xlarge" variant="disabled">
                    Button
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.componentCard}>
              <img src="/placeholder.svg" alt="Card" />
              <h3>Card</h3>
              <p>
                A versatile card component with header, content, and footer
                sections.
              </p>
            </div>
            <div className={styles.componentCard}>
              <img src="/placeholder.svg" alt="Dropdown" />
              <h3>Dropdown</h3>
              <p>
                A customizable dropdown menu component with various interaction
                options.
              </p>
            </div>
          </div>
        </section>
      </Main>
    </Layout>
  );
};

export default App;
