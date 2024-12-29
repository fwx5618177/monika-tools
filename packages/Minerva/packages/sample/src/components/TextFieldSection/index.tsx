import React, { useState } from "react";
import TextField from "@minerva/lib-core/src/components/TextField/TextField";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./index.module.scss";

const TextFieldSection: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.length < 3) {
      setError("Username must be at least 3 characters long.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  return (
    <div className={styles.section}>
      <h3>TextField Examples</h3>
      <div className={styles.group}>
        <div>
          <h4>Basic TextField with Icon</h4>
          <TextField
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
            error={error}
            icon={<FaUser />}
            iconPosition="left"
            borderRadius="0.5rem"
            showCharCount
          />
          <p>展示带有左侧图标的基本 TextField</p>
        </div>
        <div>
          <h4>Label TextField</h4>
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            icon={<FaEnvelope />}
          />
          <TextField label="Email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <h4>Password TextField with Icon</h4>
          <TextField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            icon={<FaLock />}
            iconPosition="right"
            borderColor="#ff9800"
            borderRadius="0.5rem"
            type="password"
          />
          <p>展示带有右侧图标的密码输入框</p>
        </div>
        <div>
          <h4>Minimal TextField</h4>
          <TextField
            label="Minimal TextField"
            placeholder="Minimal version"
            value={username}
            onChange={handleUsernameChange}
            minimal
            borderRadius="0.5rem"
          />
          <p>展示最小版本的 TextField</p>
        </div>
        <div>
          <h4>Error Example</h4>
          <TextField
            label="Error Example"
            placeholder="Enter text"
            value={username}
            onChange={handleUsernameChange}
            error="This is an error message"
            borderRadius="0.5rem"
          />
          <p>展示带有错误消息的 TextField</p>
        </div>
        <div>
          <h4>No Border TextField</h4>
          <TextField
            label="No Border"
            placeholder="No border"
            value={username}
            onChange={handleUsernameChange}
            hideBorder
            borderRadius="0.5rem"
          />
          <p>展示无边框的 TextField</p>
        </div>
        <div>
          <h4>Clearable TextField</h4>
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            icon={<FaEnvelope />}
            iconPosition="left"
            borderRadius="0.5rem"
            clearable
          />
          <p>展示带有清除功能的 TextField</p>
        </div>
        <div>
          <h4>Full Width TextField</h4>
          <TextField
            label="Full Width"
            placeholder="Enter text"
            value={username}
            onChange={handleUsernameChange}
            borderRadius="0.5rem"
            fullWidth
          />
          <p>展示全宽度的 TextField</p>
        </div>
        <div>
          <h4>Custom Width TextField</h4>
          <TextField
            label="Custom Width"
            value={username}
            onChange={handleUsernameChange}
            borderRadius="0.5rem"
            width="300px"
          />
          <p>展示自定义宽度的 TextField</p>
        </div>
        <div>
          <h4>Disabled TextField</h4>
          <TextField
            label="Disabled"
            placeholder="Disabled input"
            value={username}
            onChange={handleUsernameChange}
            borderRadius="0.5rem"
            disabled
          />
          <p>展示禁用状态的 TextField</p>
        </div>
      </div>
    </div>
  );
};

export default TextFieldSection;
