// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path"); // 引入 path 模块

const app = express();
const PORT = 3000;

// 使用 CORS 中间件，允许所有跨域请求
app.use(cors());
// 解析 JSON 请求体
app.use(express.json());

// 关键改动：添加静态文件服务中间件
// 告诉 Express 在 build 目录下查找和提供静态文件
app.use(express.static(path.join(__dirname, 'build')));

// 代理路由，用于处理跨域请求
app.post("/proxy", async (req, res) => {
  const { url, method, body, headers } = req.body;

  if (!url || !method) {
  console.log(`URL and method are required. url:${url} method:${method}`);
    return res.status(400).json({ error: "URL and method are required." });
  }

  try {
    const response = await axios({
      method,
      url,
      data: body,
      headers: { ...headers },
      validateStatus: (status) => true, 
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
