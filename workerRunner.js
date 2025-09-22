// workerRunner.js
const PROXY_SERVER_URL = "http://localhost:3000/proxy";

export async function runUserScriptInWorker(script, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const workerSource = `
      const $ = {
        log: (...args) => postMessage({ type: "log", data: args }),
        // 关键修改：$.get 方法直接解析为 JSON
        get: async (url, headers = {}) => {
          const res = await fetch(\`${PROXY_SERVER_URL}\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, method: "GET", headers }),
          });
          
          if (!res.ok) {
            throw new Error(\`API returned status \${res.status}\`);
          }
          
          return res.json();
        },
        // 关键修改：$.post 方法直接解析为 JSON
        post: async (url, body, headers = {}) => {
          const res = await fetch(\`${PROXY_SERVER_URL}\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, method: "POST", body, headers }),
          });
          
          if (!res.ok) {
            throw new Error(\`API returned status \${res.status}\`);
          }

          return res.json();
        },
      };

      self.onmessage = async function(e) {
        try {
          const fn = new Function("params", "$", \`return (async function() { \${e.data.script} })();\`);
          const result = await fn(e.data.params || {}, $);
          self.postMessage({ success: true, result });
        } catch (err) {
          self.postMessage({ success: false, error: (err && err.message) ? err.message : String(err) });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    const objectURL = worker.URL;

    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        worker.terminate();
        resolve({ success: false, error: "Script timeout" });
        URL.revokeObjectURL(objectURL);
      }
    }, timeoutMs);

    worker.onmessage = (ev) => {
      if (ev.data.type === "log") {
        console.log("Worker log:", ...ev.data.data);
        return;
      }
      if (ev.data.success !== undefined) {
        finished = true;
        clearTimeout(timer);
        worker.terminate();
        resolve(ev.data);
        URL.revokeObjectURL(objectURL);
      }
    };

    worker.postMessage({ script, params: {} });
  });
}
