
// import React from 'react'
// import useLocalStorage from '../utils/useLocalStorage'

// const DEFAULT = [
//   {id:'col-1', title:'Backlog', cards:[{id:'t1',title:'Task A'},{id:'t2',title:'Task B'}]},
//   {id:'col-2', title:'In Progress', cards:[{id:'t3',title:'Task C'}]},
//   {id:'col-3', title:'Done', cards:[]}
// ]

// export default function Kanban(){
//   const [cols,setCols] = useLocalStorage('bb_kanban_v1', DEFAULT)
//   const [query,setQuery] = React.useState('')

//   function onDragStart(e, payload){
//     e.dataTransfer.setData('application/json', JSON.stringify(payload))
//     e.dataTransfer.effectAllowed = 'move'
//   }

//   function onDrop(e, colId){
//     const raw = e.dataTransfer.getData('application/json')
//     if(!raw) return
//     const payload = JSON.parse(raw)
//     setCols(prev => {
//       // remove from source
//       const without = prev.map(c=> ({...c, cards: c.cards.filter(t=> t.id !== payload.cardId)}))
//       // add to target column
//       return without.map(c => c.id === colId ? {...c, cards:[...c.cards, {id:payload.cardId, title:payload.title}]} : c)
//     })
//   }

//   function addCard(colId){
//     const text = prompt('Card title')
//     if(!text) return
//     setCols(prev => prev.map(c => c.id===colId ? {...c, cards:[...c.cards, {id:Date.now().toString(), title:text}]} : c))
//   }

//   const filtered = cols.map(c=> ({...c, cards: c.cards.filter(t=> t.title.toLowerCase().includes(query.toLowerCase()))}))

//   return (
//     <div>
//       <div style={{display:'flex',gap:8,marginBottom:12}}>
//         <input placeholder="Search tasks..." value={query} onChange={e=>setQuery(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid rgba(0,0,0,0.06)'}} />
//       </div>
//       <div className="kanban-board">
//         {filtered.map(col=> (
//           <div key={col.id} className="kanban-column" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,col.id)}>
//             <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
//               <strong>{col.title}</strong>
//               <button className="btn" onClick={()=>addCard(col.id)}>+ Card</button>
//             </div>
//             <div>
//               {col.cards.map(card=> (
//                 <div key={card.id} className="kanban-card" draggable onDragStart={(e)=>onDragStart(e,{cardId:card.id,title:card.title})}>
//                   {card.title}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// src/pages/KanbanBoard.jsx
import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // optional; install: npm install uuid
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from '../components/atoms/Button';
import { TextField } from '../components/atoms/TextField';
import { Badge } from '../components/atoms/Badge';
import { Toast } from '../components/molecules/Toast';

const DEFAULT_COLUMNS = {
  backlog: { id: 'backlog', title: 'Backlog', cardIds: [] },
  progress: { id: 'progress', title: 'In Progress', cardIds: [] },
  done: { id: 'done', title: 'Done', cardIds: [] },
};

export const KanbanBoard = () => {
  const [columns, setColumns] = useLocalStorage('kanban-columns', DEFAULT_COLUMNS);
  const [cards, setCards] = useLocalStorage('kanban-cards', {});
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  // Add column
  const addColumn = () => {
    const id = `col-${Date.now()}`;
    setColumns(prev => ({
      ...prev,
      [id]: { id, title: 'New Column', cardIds: [] }
    }));
  };

  // Rename column
  const renameColumn = (id, newTitle) => {
    setColumns(prev => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle }
    }));
  };

  // Delete column
  const deleteColumn = (id) => {
    if (Object.keys(columns).length <= 1) {
      setToastMessage('At least one column required');
      setShowToast(true);
      return;
    }
    const newColumns = { ...columns };
    const cardIds = newColumns[id].cardIds;
    delete newColumns[id];
    setColumns(newColumns);

    // Also delete orphaned cards
    const newCards = { ...cards };
    cardIds.forEach(cid => delete newCards[cid]);
    setCards(newCards);
  };

  // Add card to column
  const addCard = (columnId) => {
    const id = uuidv4();
    const newCard = { id, content: 'New task', color: 'blue', tags: [] };
    setCards(prev => ({ ...prev, [id]: newCard }));
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cardIds: [...prev[columnId].cardIds, id]
      }
    }));
  };

  // Move card between columns (simplified DnD)
  const moveCard = (cardId, fromColId, toColId) => {
    if (fromColId === toColId) return;
    setColumns(prev => {
      const newFrom = prev[fromColId].cardIds.filter(id => id !== cardId);
      const newTo = [...prev[toColId].cardIds, cardId];
      return {
        ...prev,
        [fromColId]: { ...prev[fromColId], cardIds: newFrom },
        [toColId]: { ...prev[toColId], cardIds: newTo }
      };
    });
  };

  // Filter cards
  const filteredCardIds = useMemo(() => {
    if (!debouncedSearch) return null;
    return Object.keys(cards).filter(id =>
      cards[id].content.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [cards, debouncedSearch]);

  const allColumns = Object.values(columns);

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-3">
        <TextField
          label="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <Button onClick={addColumn}>+ Add Column</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {allColumns.map(col => (
          <div
            key={col.id}
            className="w-72 flex-shrink-0 bg-card rounded-lg border border-border shadow-sm"
          >
            <div className="p-3 border-b border-border flex justify-between items-center">
              <TextField
                value={col.title}
                onChange={(e) => renameColumn(col.id, e.target.value)}
                className="text-lg font-bold bg-transparent border-none w-full focus:ring-0 p-0"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteColumn(col.id)}
                aria-label="Delete column"
              >
                🗑️
              </Button>
            </div>
            <div className="p-3 space-y-3 min-h-[200px]">
              {col.cardIds
                .filter(id => !filteredCardIds || filteredCardIds.includes(id))
                .map(cardId => {
                  const card = cards[cardId];
                  return card ? (
                    <div
                      key={cardId}
                      className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border-l-4 border-blue-500"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, fromColId: col.id }));
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        try {
                          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                          moveCard(data.cardId, data.fromColId, col.id);
                        } catch {}
                      }}
                    >
                      <TextField
                        value={card.content}
                        onChange={(e) =>
                          setCards(prev => ({
                            ...prev,
                            [cardId]: { ...prev[cardId], content: e.target.value }
                          }))
                        }
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                      />
                      <div className="mt-2 flex gap-1 flex-wrap">
                        <Badge color={card.color}>{card.color}</Badge>
                      </div>
                    </div>
                  ) : null;
                })}
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-center"
                onClick={() => addCard(col.id)}
              >
                + Add Card
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />
    </div>
  );
};