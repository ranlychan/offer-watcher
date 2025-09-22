import React, { useState } from "react";
import ExampleScripts from "./example.js";

export default function ScriptEditor({ open, initial, onClose, onSave }) {
  const [script, setScript] = useState(initial || "");
  const [name, setName] = useState("");

  // when open changed, populate
  React.useEffect(() => {
    setScript(initial || "");
    setName("");
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>编辑/新增脚本</h3>
        <div style={{marginBottom:8}}>
          <label>显示名称（可选）：</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="公司名（仅用于面板展示）" />
        </div>
        <div style={{display:"flex",gap:8, marginBottom:8}}>
          <button onClick={()=>setScript(ExampleScripts.bytedance)}>示例：字节跳动</button>
          <button onClick={()=>setScript(ExampleScripts.tencent)}>示例：腾讯（异步）</button>
          <button onClick={()=>setScript(ExampleScripts.dji)}>示例：大疆</button>
          <button onClick={()=>setScript("// 返回空示例\\nreturn { company: '空公司', position: '', tags: [], steps: [] };")}>清空</button>
        </div>
        <textarea value={script} onChange={e=>setScript(e.target.value)} rows={12} />
        <div className="modal-actions">
          <button onClick={()=>{ onSave(script, name); }}>保存</button>
          <button onClick={onClose}>取消</button>
        </div>
        <div style={{marginTop:8, fontSize:12, color:"#666"}}>
          <div>脚本要求：必须 <code>return</code> 一个对象，格式示例见页面下方示例。</div>
          <div>脚本在 Web Worker 中执行，支持异步/await 与 fetch（受 CORS 限制）。</div>
        </div>
      </div>
    </div>
  );
}
