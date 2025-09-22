// 提供几个示例脚本，方便用户一键使用
const byteland = `// 示例：返回静态数据
return {
  company: "字节跳动",
  position: "前端实习",
  tags: ["番茄小说", "Web", "28*15"],
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
  tags: ["腾讯元宝", "AI应用", "32*15"],
  steps: [
    { label: "简历筛选", status: "done" },
    { label: "笔试", status: "done" },
    { label: "面试", status: "current" },
    { label: "Offer", status: "wait" }
  ]
};`;

const dji = `// 示例：大疆创新
const COOKIE = "your_cookie_here"
const API_URL = "https://we.dji.com/hire_front/api/hire/personalcenter/resumedelivery/queryDelivery";

try {
  const data = await $.get(
    API_URL,
    {
      "Cookie": COOKIE,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Origin": "https://we.dji.com",
      "Referer": "https://we.dji.com/hire/personalcenter/resumedelivery"
    }
  );

  if (!data.success) {
    throw new Error(\`API error: \${data.msg || '未知API错误'}, code: \${data.code}\`);
  }

  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("API返回了意料之外的数据格式，data.data不是数组。");
  }

  const result = data.data.map((item) => {
    const progress = item.schedules.map((s) => {
      // Determine the status of the step
      const status =
        s.statusCode === item.statusCode
          ? "current"
          : s.statusCode < item.statusCode && item.statusCode !== "G00"
          ? "done"
          : "wait";

      // Assign a description only for the current step, using item.statusName
      const description = status === "current" ? item.statusName : undefined;
      
      return {
        label: s.statusName,
        status,
        description,
        subTitle: undefined, // Explicitly set subTitle to undefined as it doesn't exist
      };
    });

    return {
      company: "DJI 大疆创新",
      position: item.jobTitle,
      steps: progress,
    };
  });

  $.log(JSON.stringify(result, null, 2));

  return {
    company: "DJI 大疆创新",
    tags: [],
    position: result[0]?.position || "未找到职位",
    steps: result[0]?.steps || [],
  };

} catch (err) {
  $.log("❌ Error:", err.message || err);
  throw err;
}`;

export default { bytedance: byteland, tencent, dji };
