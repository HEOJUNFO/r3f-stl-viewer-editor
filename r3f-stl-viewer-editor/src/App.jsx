// App.jsx
import React, { useState } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// (기존) 하위 컴포넌트들
import ControlsPanel from './components/ControlsPanel';
import STLViewer from './components/STLViewer';
import MemoManager from './components/MemoManager';

// (새) SculptPanel
import SculptPanel from './components/SculptPanel';

function App() {
  const [geometry, setGeometry] = useState(null);
  const [memos, setMemos] = useState([]);

  // 기존: 투명도 & 메모 모드
  const [opacity, setOpacity] = useState(1);
  const [isMemoMode, setIsMemoMode] = useState(false);

  // Sculpt 관련 상태
  const [isSculptMode, setIsSculptMode] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [intensity, setIntensity] = useState(0.5);
  const [sculptMode, setSculptMode] = useState('push'); 
    // pull / push / smooth / flatten

  // 새 메모
  const [newMemoDialogOpen, setNewMemoDialogOpen] = useState(false);
  const [newMemoPosition, setNewMemoPosition] = useState([0, 0, 0]);

  // 메모 수정/삭제
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // -- Drag & Drop (STL 로딩) --
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const loader = new STLLoader();
      const arrayBuffer = ev.target.result;
      const stlGeometry = loader.parse(arrayBuffer);

      stlGeometry.center();
      stlGeometry.computeBoundingSphere();
      if (stlGeometry.boundingSphere) {
        const r = stlGeometry.boundingSphere.radius;
        const scaleFactor = 1 / r;
        stlGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
      }
      setGeometry(stlGeometry);
      setMemos([]); // 초기화 (옵션)
    };
    reader.readAsArrayBuffer(file);
  };
  const handleDragOver = (e) => e.preventDefault();

  // -- 메모 로직 --
  const handleNewMemoRequest = (clickPos) => {
    setNewMemoPosition([clickPos.x, clickPos.y, clickPos.z]);
    setNewMemoDialogOpen(true);
  };
  const handleEditMemoRequest = (idx) => {
    setSelectedMemoIndex(idx);
    setEditText(memos[idx].text);
    setEditDialogOpen(true);
  };

  // -- Sculpt 로직 (UI만) --
  const handleApplySculpt = () => {
    console.log('Sculpt 적용:', { brushSize, intensity, sculptMode });
  };
  const handleCancelSculpt = () => {
    console.log('Sculpt 취소');
  };

  // ===== 커스텀 브러쉬(커서) 위해 마우스 위치 관리 =====
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // 브라우저 윈도우 기준 좌표
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        // sculpt 모드일 때 기본 커서 숨김
        cursor: isSculptMode ? 'none' : 'default',
      }}
      onMouseMove={handleMouseMove}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* (1) 투명도/메모 모드 */}
      <ControlsPanel
        opacity={opacity}
        setOpacity={setOpacity}
        isMemoMode={isMemoMode}
        setIsMemoMode={setIsMemoMode}
      />

      {/* (2) Sculpt UI */}
      <SculptPanel
        isSculptMode={isSculptMode}
        setIsSculptMode={setIsSculptMode}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        intensity={intensity}
        setIntensity={setIntensity}
        sculptMode={sculptMode}
        setSculptMode={setSculptMode}
        onApplySculpt={handleApplySculpt}
        onCancelSculpt={handleCancelSculpt}
      />

      {/* (3) r3f 뷰어 */}
      <STLViewer
        geometry={geometry}
        opacity={opacity}
        isMemoMode={isMemoMode}
        memos={memos}
        onNewMemoPosition={handleNewMemoRequest}
        onEditMemoRequest={handleEditMemoRequest}
      />

      {/* (4) 메모 다이얼로그 */}
      <MemoManager
        memos={memos}
        setMemos={setMemos}
        newMemoDialogOpen={newMemoDialogOpen}
        setNewMemoDialogOpen={setNewMemoDialogOpen}
        newMemoPosition={newMemoPosition}
        setNewMemoPosition={setNewMemoPosition}

        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedMemoIndex={selectedMemoIndex}
        setSelectedMemoIndex={setSelectedMemoIndex}
        editText={editText}
        setEditText={setEditText}
      />

      {/* 
        (5) Sculpt 모드 커스텀 커서 (브러시 모양)
        - 마우스 위치에 따라 원형 overlay
        - brushSize 반영 (예: 픽셀 단위로 반지름 적용)
        - pointerEvents: 'none'으로 해서 클릭 방해 안 하도록
      */}
      {isSculptMode && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x - brushSize / 2, // 원의 중심이 마우스에 오도록
            top: mousePos.y - brushSize / 2,
            width: brushSize,
            height: brushSize,
            borderRadius: '50%',
            background: 'rgba(255, 0, 0, 0.3)',
            border: '1px solid red',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
}

export default App;
