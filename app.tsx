import React, { useEffect, useState } from "react";
import CardGrid from "./CardGrid.tsx";
import ExampleScripts from "./example.js";

// 初始示例 - 两个 cards + 最后一个新增卡
const initialCards = [
  { id: "c-1", name: "示例 - 字节", script: ExampleScripts.bytedance },
  { id: "c-2", name: "示例 - 腾讯", script: ExampleScripts.tencent }
];

export default function App() {
  const [cards, setCards] = useState(() => {
    // 在 localStorage 中恢复顺序（可选）
    const saved = localStorage.getItem("job_cards_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // keep initial samples if none
        return parsed;
      } catch {
        return initialCards;
      }
    }
    return initialCards;
  });

  useEffect(() => {
    localStorage.setItem("job_cards_v1", JSON.stringify(cards));
  }, [cards]);

  // 添加新卡（从编辑器保存会调用）
  const addCard = (card) => {
    setCards((s) => [...s, { id: `c-${Date.now()}`, ...card }]);
  };

  // 按新顺序保存（drag end）
  const reorder = (newList) => setCards(newList);

  // 更新单张 card（比如保存脚本后）
  const updateCard = (id, patch) => {
    setCards((s) => s.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  // 删除卡片
  const removeCard = (id) => {
    setCards((s) => s.filter((c) => c.id !== id));
  };

  return (
    <div className="page">
      <header className="header">
        <h1>招聘进度面板（Playground）</h1>
        <div className="header-sub">支持用户脚本抓取、拖拽排序、网格/列表切换</div>
      </header>

      <main className="main">
        <CardGrid
          cards={cards}
          onAddCard={addCard}
          onReorder={reorder}
          onUpdateCard={updateCard}
          onRemoveCard={removeCard}
        />
      </main>

      <footer className="footer">
        <small>提示：用户脚本在 Web Worker 中运行，必须 <code>return</code> 标准对象。</small>
      </footer>
    </div>
  );
}
