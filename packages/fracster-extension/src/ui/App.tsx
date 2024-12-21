import React, { useState } from "react";
import styles from "./app.module.less";
import { calculateTotalScore } from "../utils/calculations";
import { getUserData } from "../utils/api";

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isChromeExtension =
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    window.location.protocol === "chrome-extension:";

  const fetchUserData = () => {
    setError(null); // Reset error message
    if (userId) {
      if (isChromeExtension) {
        chrome.runtime.sendMessage(
          { action: "fetchUserData", userId },
          (response) => {
            if (response && response.data) {
              const user = response.data;
              setUserData(user);
              const userScore = calculateTotalScore(user);
              setScore(userScore);
            } else {
              setError("Error fetching data");
            }
          }
        );
      } else {
        // Local environment
        getUserData(userId)
          .then((data: any) => {
            setUserData(data);
            const userScore = calculateTotalScore(data);
            setScore(userScore);
          })
          .catch((error: any) => {
            setError("Error fetching data");
          });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Farcaster Data Fetcher</h1>
      <div className={styles.inputGroup}>
        <label htmlFor="userId">Farcaster User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <button onClick={fetchUserData} className={styles.button}>
          Fetch User Data
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {userData && score !== null && (
        <div id="result" className={styles.result}>
          <p>
            <strong>User:</strong> {userData.name}
          </p>
          <p>
            <strong>Score:</strong> {score}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
