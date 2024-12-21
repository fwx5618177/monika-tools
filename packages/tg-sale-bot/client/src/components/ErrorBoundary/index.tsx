import React, { Component, ErrorInfo, ReactNode } from "react";
import styles from "@styles/error.boundary.module.scss";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ErrorBoundaryProps {
  children: ReactNode;
  navigateToHome: () => void;
  t: (key: string) => string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.errorIcon}>
            <FaExclamationTriangle size={50} color="#f44336" />
          </div>
          <h1 className={styles.title}>{t("error-title")}</h1>
          <p className={styles.message}>{t("error-description")}</p>
          <div className={styles.buttonGroup}>
            <button onClick={this.handleRetry} className={styles.retryButton}>
              {t("retry")}
            </button>
            <button
              onClick={this.props.navigateToHome}
              className={styles.homeButton}
            >
              {t("back-to-home")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToHome = () => {
    navigate(-1);
  };

  return (
    <ErrorBoundary navigateToHome={navigateToHome} t={t}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
