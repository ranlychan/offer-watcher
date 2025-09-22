import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./style.css";
import 'antd/dist/reset.css'; // Add this line for Ant Design styles

createRoot(document.getElementById("root")).render(<App />);
