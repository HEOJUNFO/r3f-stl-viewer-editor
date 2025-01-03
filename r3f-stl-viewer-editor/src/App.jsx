// App.jsx
import React, { useState } from 'react';
import ControlsPanel from './components/ControlsPanel';
import STLViewer from './components/STLViewer';
import MemoManager from './components/MemoManager';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

function App() {
  // STL & 메모 관련 상태
  const [geometry, setGeometry] = useState(null);
  const [memos, setMemos] = useState([]);

  // 투명도 & 메모 모드
  const [opacity, setOpacity] = useState(1);
  const [isMemoMode, setIsMemoMode] = useState(false);

  // 새 메모 작성 다이얼로그
  const [newMemoDialogOpen, setNewMemoDialogOpen] = useState(false);
  const [newMemoPosition, setNewMemoPosition] = useState([0, 0, 0]);

  // 수정/삭제용 다이얼로그
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(null);

  // 임시 수정 텍스트
  const [editText, setEditText] = useState('');

  //--------------- Drag & Drop ---------------
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
        const radius = stlGeometry.boundingSphere.radius;
        const scaleFactor = 1 / radius;
        stlGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
      }
      setGeometry(stlGeometry);
      setMemos([]); // 새 모델 불러오면 메모 초기화(선택)
    };
    reader.readAsArrayBuffer(file);
  };
  const handleDragOver = (e) => e.preventDefault();

  //--------------- 새 메모 로직 ---------------
  /** STLViewer에서 모델 클릭 시 (메모 모드 활성화 상태) → 새 메모 작성 */
  const handleNewMemoRequest = (clickPos) => {
    setNewMemoPosition([clickPos.x, clickPos.y, clickPos.z]);
    setNewMemoDialogOpen(true);
  };

  //--------------- 기존 메모 수정/삭제 로직 ---------------
  /** STLViewer의 아이콘 클릭 → "메모 idx 수정" 요청 */
  const handleEditMemoRequest = (idx) => {
    setSelectedMemoIndex(idx);
    setEditText(memos[idx].text);   // 다이얼로그에 표시할 내용
    setEditDialogOpen(true);
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ControlsPanel
        opacity={opacity}
        setOpacity={setOpacity}
        isMemoMode={isMemoMode}
        setIsMemoMode={setIsMemoMode}
      />

      <STLViewer
        geometry={geometry}
        opacity={opacity}
        isMemoMode={isMemoMode}
        memos={memos}
        // 새 메모 콜백
        onNewMemoPosition={handleNewMemoRequest}
        // 기존 메모 편집 콜백
        onEditMemoRequest={handleEditMemoRequest}
      />

      {/* 메모 관련 다이얼로그 & 로직 */}
      <MemoManager
        // 새 메모
        newMemoDialogOpen={newMemoDialogOpen}
        setNewMemoDialogOpen={setNewMemoDialogOpen}
        newMemoPosition={newMemoPosition}
        setNewMemoPosition={setNewMemoPosition}
        memos={memos}
        setMemos={setMemos}
        // 수정/삭제
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedMemoIndex={selectedMemoIndex}
        setSelectedMemoIndex={setSelectedMemoIndex}
        editText={editText}
        setEditText={setEditText}
      />
    </div>
  );
}

export default App;
