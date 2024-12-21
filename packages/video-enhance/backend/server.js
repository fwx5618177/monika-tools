const express = require("express");
const multer = require("multer");
const WebSocket = require("ws");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

app.use(cors());
app.use(express.json());

// 配置 multer 保存文件
const upload = multer({ dest: "uploads/" });

// 上传视频文件并保存到服务器，重命名为 .mp4
app.post("/upload", upload.single("video"), (req, res) => {
  const tempPath = req.file.path; // 临时路径
  const targetPath = path.join(__dirname, `uploads/${req.file.filename}.mp4`); // 确保文件是 .mp4

  // 将临时文件重命名为 .mp4
  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error("File rename failed:", err);
      return res.status(500).json({ message: "File processing error" });
    }
    console.log(`Video uploaded and renamed to ${targetPath}`);

    // 返回文件路径给客户端，用于后续的 WebSocket 处理
    res.json({ message: "Video uploaded successfully", videoPath: targetPath });
  });
});

// WebSocket 连接处理
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  let beautyLevel = 50,
    brightness = 50,
    noiseReduction = 50;
  let pythonProcess;

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.videoPath) {
      // 接收到前端的视频路径，启动 Python 进程处理
      console.log(`Processing video: ${data.videoPath}`);
      pythonProcess = spawn("python3", [
        "./model/process_video.py",
        data.videoPath,
      ]);

      pythonProcess.stdout.on("data", (data) => {
        ws.send(data); // 实时发送处理后的视频帧
      });

      pythonProcess.stderr.on("data", (error) => {
        console.error(`Python error: ${error}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
        }
        ws.close(); // 处理完成后关闭 WebSocket
      });
    } else {
      // 接收实时优化参数
      console.log(`Received optimization update: ${data.type} = ${data.value}`);
      switch (data.type) {
        case "beautyLevel":
          beautyLevel = data.value;
          break;
        case "brightness":
          brightness = data.value;
          break;
        case "noiseReduction":
          noiseReduction = data.value;
          break;
      }
      // 发送参数给 Python 模型
      if (pythonProcess) {
        pythonProcess.stdin.write(
          `${beautyLevel},${brightness},${noiseReduction}\n`
        );
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    if (pythonProcess) {
      pythonProcess.kill(); // 关闭 Python 进程
    }
  });
});

app.listen(3000, () => {
  console.log("Backend server running on port 3000");
});
