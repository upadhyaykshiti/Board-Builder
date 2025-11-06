
// import React from 'react'
// import useLocalStorage from '../utils/useLocalStorage'

// const GRID_COLS = 12
// const COLUMN_GAP = 12

// function initDefault(){
//   return [
//     {id:'a', x:0, y:0, w:4, h:6, title:'Card A'},
//     {id:'b', x:4, y:0, w:4, h:4, title:'Card B'},
//     {id:'c', x:8, y:0, w:4, h:8, title:'Card C'},
//   ]
// }

// export default function Builder(){
//   const [cards,setCards] = useLocalStorage('bb_layout_v1', initDefault)
//   const canvasRef = React.useRef(null)

//   function pxToGrid(px, width){
//     const colW = width / GRID_COLS
//     return Math.round(px / colW)
//   }

//   function startDrag(e, card){
//     e.preventDefault()
//     const canvas = canvasRef.current
//     const rect = canvas.getBoundingClientRect()
//     const startX = e.clientX
//     const startY = e.clientY
//     const startLeft = card.x
//     const startTop = card.y

//     function onMove(ev){
//       const dx = ev.clientX - startX
//       const dy = ev.clientY - startY
//       const width = rect.width
//       const newGridX = Math.max(0, Math.min(GRID_COLS - card.w, pxToGrid((startLeft * (width/GRID_COLS)) + dx, width)))
//       const newGridY = Math.max(0, Math.round((startTop*20 + dy) / 20))
//       setCards(prev => prev.map(c => c.id===card.id ? {...c, x:newGridX, y:newGridY} : c))
//     }

//     function onUp(){
//       window.removeEventListener('pointermove', onMove)
//       window.removeEventListener('pointerup', onUp)
//     }

//     window.addEventListener('pointermove', onMove)
//     window.addEventListener('pointerup', onUp)
//   }

//   return (
//     <div>
//       <div style={{display:'flex',gap:8,marginBottom:12}}>
//         <button className="btn" onClick={()=>setCards(prev => [...prev, {id:Date.now().toString(), x:0,y:Math.max(0, prev.length*6), w:4,h:4,title:'New'}])}>Add card</button>
//         <button className="btn" onClick={()=>{navigator.clipboard.writeText(JSON.stringify(cards));}}>Export JSON</button>
//         <label className="btn">Import<input type="file" style={{display:'none'}} onChange={(e)=>{
//           const f = e.target.files[0]
//           if(!f) return
//           const r = new FileReader()
//           r.onload = ()=>{
//             try{ const parsed = JSON.parse(r.result); setCards(parsed) }catch(err){alert('Invalid JSON')}
//           }
//           r.readAsText(f)
//         }} /></label>
//       </div>

//       <div className="canvas" ref={canvasRef}>
//         {cards.map(card=> (
//           <GridCard key={card.id} card={card} onPointerDown={startDrag} canvasRef={canvasRef} />
//         ))}
//       </div>
//     </div>
//   )
// }

// function GridCard({card, onPointerDown, canvasRef}){
//   const style = React.useMemo(()=>({
//     left: `calc(${(card.x/12)*100}% )`,
//     width: `calc(${(card.w/12)*100}% - 12px)`,
//     top: `${card.y * 20}px`,
//     height: `${card.h * 20}px`
//   }),[card])

//   return (
//     <div className="grid-card" style={style} onPointerDown={(e)=>onPointerDown(e,card)} tabIndex={0} role="button" aria-label={`Card ${card.title}`}>
//       <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
//         <strong>{card.title}</strong>
//         <div style={{display:'flex',gap:6}}>
//           <button className="btn" aria-label="resize">↔</button>
//         </div>
//       </div>
//       <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>x:{card.x} y:{card.y} w:{card.w} h:{card.h}</div>
//     </div>
//   )
// }


// src/pages/LayoutBuilder.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from '../components/atoms/Button';
import { TextField } from '../components/atoms/TextField';
import { Toast } from '../components/molecules/Toast';

const GRID_COLUMNS = 12;
const MIN_CARD_WIDTH = 2;
const MIN_CARD_HEIGHT = 1;

export const LayoutBuilder = () => {
  const [cards, setCards] = useLocalStorage('layout-cards', [
    { id: '1', x: 0, y: 0, w: 4, h: 2, title: 'Welcome Card' },
    { id: '2', x: 5, y: 1, w: 3, h: 3, title: 'Drag Me!' },
  ]);

  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [jsonInput, setJsonInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const gridUnit = 80; // px

  const handleMouseDown = (e, card) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(card.id);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging === null) return;
      const newCards = [...cards];
      const cardIndex = newCards.findIndex(c => c.id === isDragging);
      if (cardIndex === -1) return;

      const gridX = Math.floor((e.clientX - dragOffset.x) / (window.innerWidth / GRID_COLUMNS));
      const gridY = Math.floor((e.clientY - dragOffset.y) / gridUnit);

      const clampedX = Math.max(0, Math.min(gridX, GRID_COLUMNS - newCards[cardIndex].w));
      const clampedY = Math.max(0, gridY);

      newCards[cardIndex] = { ...newCards[cardIndex], x: clampedX, y: clampedY };
      setCards(newCards);
    },
    [isDragging, dragOffset, cards, setCards]
  );

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const addCard = () => {
    const newCard = {
      id: Date.now().toString(),
      x: 0,
      y: Math.max(...cards.map(c => c.y + c.h), 0),
      w: MIN_CARD_WIDTH,
      h: MIN_CARD_HEIGHT,
      title: 'New Card',
    };
    setCards([...cards, newCard]);
  };

  const exportLayout = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importLayout = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        setCards(parsed);
        setToastMessage('Import successful!');
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      setToastMessage('Invalid JSON');
    }
    setShowToast(true);
  };

  const debouncedJson = useDebounce(jsonInput, 300);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={addCard}>+ Add Card</Button>
        <Button variant="outline" onClick={exportLayout}>Export JSON</Button>
        <div className="flex gap-2">
          <TextField
            label="Import JSON"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste layout JSON'
            className="w-64"
          />
          <Button variant="outline" onClick={importLayout} disabled={!debouncedJson}>
            Import
          </Button>
        </div>
      </div>

      <div
        className="grid grid-cols-12 gap-3 relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 min-h-[80vh]"
        style={{ gridTemplateRows: `repeat(auto-fill, minmax(${gridUnit}px, 1fr))` }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-card border border-border rounded shadow-sm p-3 cursor-move select-none ${
              isDragging === card.id ? 'opacity-75' : ''
            }`}
            style={{
              gridColumn: `${card.x + 1} / span ${card.w}`,
              gridRow: `${card.y + 1} / span ${card.h}`,
            }}
            onMouseDown={(e) => handleMouseDown(e, card)}
          >
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.w}×{card.h} at ({card.x}, {card.y})
            </p>
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