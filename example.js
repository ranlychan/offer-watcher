// 提供几个示例脚本，方便用户一键使用
const byteland = `// 示例：返回静态数据
return {
  company: "字节跳动",
  position: "前端实习",
  steps: [
    { label: "简历筛选", status: "done" },
    { label: "一面", status: "current" },
    { label: "二面", status: "wait" },
    { label: "Offer", status: "wait" }
  ]
};`;

const tencent = `// 示例：模拟异步（可 fetch）并返回结果
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(300); // 模拟网络延迟
return {
  company: "腾讯",
  position: "后端工程师",
  steps: [
    { label: "简历筛选", status: "done" },
    { label: "笔试", status: "done" },
    { label: "面试", status: "current" },
    { label: "Offer", status: "wait" }
  ]
};`;

export default { bytedance: byteland, tencent };
