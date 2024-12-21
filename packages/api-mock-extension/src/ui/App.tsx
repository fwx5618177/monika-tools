import React, { useEffect, useState } from "react";
import { getData, setData } from "@/utils/common";
import styles from "./app.module.less";

const App: React.FC = () => {
  const [mockData, setMockData] = useState("");
  const [response, setResponse] = useState(null);
  const [url, setUrl] = useState("");
  const [view, setView] = useState<"popup" | "sidebar">("popup"); // 默认视图为 popup
  const [wsConnected, setWsConnected] = useState(false); // 追踪 WebSocket 是否连接

  // 切换视图模式
  const toggleView = () => {
    const newView = view === "popup" ? "sidebar" : "popup";
    setView(newView);
    window.history.replaceState({}, "", `?view=${newView}`);
    console.log(`Switched to ${newView} mode`);
  };

  // 获取当前视图模式（加载时根据 URL 参数确定）
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const viewParam = queryParams.get("view");
    if (viewParam === "popup" || viewParam === "sidebar") {
      setView(viewParam as "popup" | "sidebar");
    }
  }, []);

  // WebSocket 连接和热更新逻辑
  const handleConnectWS = () => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      if (event.data === "update") {
        console.log("Received update from server, reloading UI...");
        window.location.reload();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWsConnected(false);
    };
  };

  const fetchData = async () => {
    const data = await getData("mockData");
    if (data) {
      setMockData(data);
    }
  };

  const handleSave = async () => {
    await setData("mockData", mockData);
    console.log("Mock data saved");
  };

  const handleSendRequest = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.optionsContainer}>
      <h1>{view === "popup" ? "Popup Mode" : "Sidebar Mode"}</h1>
      <button onClick={toggleView} className={styles.button}>
        Switch to {view === "popup" ? "Sidebar" : "Popup"} Mode
      </button>
      <button
        onClick={handleConnectWS}
        className={styles.button}
        disabled={wsConnected}
      >
        {wsConnected
          ? "Connected to WebSocket"
          : "Connect WebSocket for Updates"}
      </button>
      <input
        type="text"
        placeholder="Enter URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={styles.input}
      />
      <textarea
        placeholder="Enter mock data here..."
        value={mockData}
        onChange={(e) => setMockData(e.target.value)}
        className={styles.textarea}
      />
      <button onClick={handleSave} className={styles.button}>
        Save Mock Data
      </button>
      <button onClick={handleSendRequest} className={styles.button}>
        Test Request
      </button>
      {response && (
        <div className={styles.responseContainer}>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
