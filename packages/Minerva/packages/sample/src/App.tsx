import React from "react";

import Layout from "./pages/Layout";
import Sidebar from "@components/Sidebar/Sidebar";
import Main from "@components/Main/Main";
import Header from "@components/Header/Header";

import styles from "@styles/app.module.scss";
import { useTranslation } from "react-i18next";
import { Button, SearchButton } from "@minerva/lib-core";

const App: React.FC = () => {
  const { t } = useTranslation();

  const handleSearchClick = () => {
    console.log("Search button clicked");
  };

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
                  <Button size="small" disabled>
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
                  <Button size="medium" disabled>
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
                  <Button size="large" disabled>
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
                  <Button size="xlarge" disabled>
                    Button
                  </Button>
                </div>

                <h3>Border Radius</h3>
                <div className={styles.buttonGroup}>
                  <Button borderRadius="none">Button</Button>
                  <Button borderRadius="small">Button</Button>
                  <Button borderRadius="medium">Button</Button>
                  <Button borderRadius="large">Button</Button>
                  <Button borderRadius="circle">Button</Button>
                  <Button borderRadius="square">Button</Button>
                </div>
              </div>

              <h3>SearchButton</h3>
              <p>
                A button component with a search icon, used for search
                functionality.
              </p>
              <div className={styles.buttonExamples}>
                <h3>Search Text</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick}>
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} variant="error">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} variant="warning">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} variant="success">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} variant="info">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} shape="square">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} shape="rounded">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} animation="expand">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} animation="shrink">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} disabled>
                    Search
                  </SearchButton>
                </div>
                <h3>Search Text Size</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} size="small">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} size="medium">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} size="large">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} size="xlarge">
                    Search
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick}>
                    Search
                  </SearchButton>
                </div>
                <h3>Search Text Color</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} color="#fff">
                    Text
                  </SearchButton>
                  <SearchButton onClick={handleSearchClick} color="#000">
                    Test case
                  </SearchButton>
                </div>
                <h3>Search variant</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} />
                  <SearchButton onClick={handleSearchClick} variant="error" />
                  <SearchButton onClick={handleSearchClick} variant="warning" />
                  <SearchButton onClick={handleSearchClick} variant="success" />
                  <SearchButton onClick={handleSearchClick} variant="info" />
                  <SearchButton
                    onClick={handleSearchClick}
                    disabled
                    iconColor="#fff"
                  />
                </div>
                <h3>Search Shape</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} shape="square" />
                  <SearchButton onClick={handleSearchClick} shape="rounded" />
                  <SearchButton onClick={handleSearchClick} shape="circle" />
                </div>
                <h3>Search Animation</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} />
                  <SearchButton onClick={handleSearchClick} animation="none" />
                  <SearchButton
                    onClick={handleSearchClick}
                    animation="expand"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    animation="shrink"
                  />
                  <SearchButton onClick={handleSearchClick} animation="shake" />
                </div>
                <h3>Search Size</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} size="small" />
                  <SearchButton onClick={handleSearchClick} size="medium" />
                  <SearchButton onClick={handleSearchClick} size="large" />
                  <SearchButton onClick={handleSearchClick} size="xlarge" />
                  <SearchButton onClick={handleSearchClick} />
                </div>
                <h3>Search Icon Color</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton
                    onClick={handleSearchClick}
                    iconColor="#000000"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    iconColor="#ff0000"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    iconColor="#00ff00"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    iconColor="#0000ff"
                  />
                </div>
                <h3>Search Background Color</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} bgColor="#000000" />
                  <SearchButton onClick={handleSearchClick} bgColor="#ff0000" />
                  <SearchButton onClick={handleSearchClick} bgColor="#00ff00" />
                  <SearchButton onClick={handleSearchClick} bgColor="#0000ff" />
                </div>
                <h3>Search Loading</h3>
                <div className={styles.buttonGroup}>
                  <SearchButton onClick={handleSearchClick} loading />
                  <SearchButton
                    onClick={handleSearchClick}
                    loading
                    variant="error"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    loading
                    variant="warning"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    loading
                    variant="success"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    loading
                    variant="info"
                  />
                  <SearchButton
                    onClick={handleSearchClick}
                    loading
                    disabled
                    iconColor="#000"
                  />

                  <SearchButton onClick={handleSearchClick} />
                  <SearchButton onClick={handleSearchClick} variant="error" />
                  <SearchButton onClick={handleSearchClick} variant="warning" />
                  <SearchButton onClick={handleSearchClick} variant="success" />
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
