import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 3001 });
const sockets = [];

// 监听连接事件
wss.on("connection", (ws) => {
  sockets.push(ws);
  console.log("Client connected to WebSocket server");

  ws.on("close", () => {
    const index = sockets.indexOf(ws);
    if (index !== -1) sockets.splice(index, 1);
    console.log("Client disconnected from WebSocket server");
  });
});

// 使用 chokidar 监听 dist 目录下的文件变动
const watcher = chokidar.watch(path.resolve(__dirname, "dist"));

watcher.on("change", (filePath) => {
  console.log(`File changed: ${filePath}`);
  // 当文件更改时通知所有连接的客户端
  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("update");
    }
  });
});
