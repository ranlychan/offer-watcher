import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardItem from "./CardItem.tsx";
import ScriptEditor from "./ScriptEditor.tsx";

export default function CardGrid({ cards, onAddCard, onReorder, onUpdateCard, onRemoveCard }) {
  const [layoutMode, setLayoutMode] = useState("grid"); // 'grid' or 'list'
  const [editor, setEditor] = useState({ open: false, cardId: null, initial: "" });

  // drag end handler
  function handleDragEnd(result) {
    if (!result.destination) return;
    const src = result.source.index;
    const dest = result.destination.index;
    const newList = Array.from(cards);
    const [moved] = newList.splice(src, 1);
    newList.splice(dest, 0, moved);
    onReorder(newList);
  }

  return (
    <div>
      <div className="controls">
        <div>
          <button onClick={() => setLayoutMode("grid")} className={layoutMode === "grid" ? "active" : ""}>网格</button>
          <button onClick={() => setLayoutMode("list")} className={layoutMode === "list" ? "active" : ""}>竖向</button>
        </div>
        <div className="hint">拖拽卡片改变顺序 · 最后一个卡为新增</div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/*
          Direction is always horizontal for better drag-and-drop behavior.
          The layout (grid vs list) is controlled by CSS classes below.
        */}
        <Droppable droppableId="cards" direction="horizontal"> 
          {(provided) => (
            <div
              className={layoutMode === "grid" ? "cards-grid" : "cards-list"}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="card-wrapper"
                    >
                      <CardItem
                        card={card}
                        onEdit={() => setEditor({ open: true, cardId: card.id, initial: card.script || "" })}
                        onRemove={() => onRemoveCard(card.id)}
                        onSaveScript={(newScript) => onUpdateCard(card.id, { script: newScript })}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {/* Add New Card Button */}
              <div 
                className="card-wrapper add-card" 
                onClick={() => setEditor({ open: true, cardId: null, initial: "" })}
              >
                <div className="add-inner">＋ 新增卡片</div>
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ScriptEditor
        open={editor.open}
        initial={editor.initial}
        onClose={() => setEditor({ open: false, cardId: null, initial: "" })}
        onSave={(script, name) => {
          if (!editor.cardId) {
            onAddCard({ name: name || "自定义卡片", script });
          } else {
            onUpdateCard(editor.cardId, { script, name: name || undefined });
          }
          setEditor({ open: false, cardId: null, initial: "" });
        }}
      />
    </div>
  );
}