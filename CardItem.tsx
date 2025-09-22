import React, { useEffect, useState } from "react";
import { runUserScriptInWorker } from "./workerRunner";
import { Steps, Spin } from 'antd'; // 仅保留需要的组件

export default function CardItem({ card, onEdit, onRemove, onSaveScript }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lastError, setLastError] = useState(null);

  const runScript = async () => {
    if (!card.script) {
      setLastError("未设置脚本");
      return;
    }
    setLoading(true);
    setLastError(null);
    const r = await runUserScriptInWorker(card.script, 10000);
    setLoading(false);
    if (!r.success) {
      setLastError(r.error || "脚本执行失败");
      setData(null);
    } else {
      setLastError(null);
      setData(r.result);
    }
  };

  useEffect(() => {
    runScript();
    // eslint-disable-next-line
  }, []);

  // 关键修改: 移除自定义图标逻辑
  const getStepStatus = (status) => {
    if (status === 'done') return 'finish';
    if (status === 'current') return 'process';
    if (status === 'wait') return 'wait';
    return 'wait';
  };
  
  const getStepsItems = () => {
    if (!data || !Array.isArray(data.steps)) return [];
    
    return data.steps.map((s) => ({
      title: s.label,
      description: s.description,
      subTitle: s.subTitle,
      // 这里的 status 决定了步骤的默认图标和颜色
      status: getStepStatus(s.status),
    }));
  };

  // 关键修改: 获取当前进度的索引
  const getCurrentStepIndex = () => {
    if (!data || !Array.isArray(data.steps)) return -1;
    // 找到 status 为 'current' 的步骤索引
    const currentIndex = data.steps.findIndex(step => step.status === 'current');
    // 如果没有找到 'current' 状态，就返回最后一个已完成的步骤索引
    if (currentIndex === -1) {
      const doneIndex = data.steps.findLastIndex(step => step.status === 'done');
      return doneIndex !== -1 ? doneIndex + 1 : 0;
    }
    return currentIndex;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{card.name || (data && data.company) || "未命名公司"}</div>
        <div className="card-actions">
          <button onClick={runScript} disabled={loading}>{loading ? "运行中..." : "刷新"}</button>
          <button onClick={onEdit}>编辑</button>
          <button onClick={onRemove}>删除</button>
        </div>
      </div>

      <div className="card-body">
        {loading && <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin tip="加载中..." /></div>}
        {lastError && !loading && <div className="error">脚本错误：{lastError}</div>}

        {!loading && data ? (
          <>
            {data.position && <div className="position">{data.position}</div>}
            <div className="steps-row">
              <Steps
                // 关键修改: 使用 getCurrentStepIndex() 设置当前进度
                current={getCurrentStepIndex()}
                items={getStepsItems()}
                direction="vertical"
                responsive
              />
            </div>
            <details style={{ marginTop: 8 }}>
              <summary>查看返回数据</summary>
              <pre className="debug">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </>
        ) : !loading && !lastError && (
          <div className="placeholder">点击“刷新”运行脚本以获取数据</div>
        )}
      </div>
    </div>
  );
}
