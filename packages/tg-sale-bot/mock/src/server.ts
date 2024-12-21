import express from "express";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes";

const app = express();
const port = 8000;

// 中间件
app.use(express.json()); // 支持 JSON 请求体
app.use(cors()); // 跨域支持

// 使用 API 路由
app.use("/api", apiRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
