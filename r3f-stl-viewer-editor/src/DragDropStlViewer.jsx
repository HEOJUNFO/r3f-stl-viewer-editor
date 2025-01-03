// DragDropStlViewer.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// MUI import
import {
  Slider, Typography, Box,
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
  TextField
} from '@mui/material';

function DragDropStlViewer() {
  const [geometry, setGeometry] = useState(null);
  const [opacity, setOpacity] = useState(1);

  // 메모 배열: [{ position: [x,y,z], text: '메모 내용' }, ...]
  const [memos, setMemos] = useState([]);

  // 새 메모 작성용 다이얼로그
  const [newMemoDialogOpen, setNewMemoDialogOpen] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');
  const [newMemoPosition, setNewMemoPosition] = useState([0, 0, 0]);

  // 기존 메모 조회/수정/삭제용 다이얼로그
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(null); // 몇 번째 메모인지
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [editedText, setEditedText] = useState('');  // 수정 중인 텍스트

  // STL Drag & Drop 로직
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new STLLoader();
      const arrayBuffer = e.target.result;
      const stlGeometry = loader.parse(arrayBuffer);

      // 모델 중심 정렬 및 스케일 정규화
      stlGeometry.center();
      stlGeometry.computeBoundingSphere();
      if (stlGeometry.boundingSphere) {
        const radius = stlGeometry.boundingSphere.radius;
        const scaleFactor = 1 / radius;
        stlGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
      }

      setGeometry(stlGeometry);
      // 새 모델 불러오면 기존 메모들 초기화(선택 사항)
      setMemos([]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 투명도 슬라이더 변경
  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
  };

  /**
   * (A) 모델(mesh)을 클릭 → 새 메모 작성 다이얼로그 열기
   */
  const handleMeshClick = (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    const clickPos = e.point;
    setNewMemoPosition([clickPos.x, clickPos.y, clickPos.z]);
    setNewMemoDialogOpen(true);
  };

  /**
   * 새 메모 작성 다이얼로그 닫기
   */
  const handleCloseNewMemoDialog = () => {
    setNewMemoDialogOpen(false);
    setNewMemoText('');
  };

  /**
   * 새 메모 작성 다이얼로그 "저장" 버튼
   */
  const handleSaveNewMemo = () => {
    if (!newMemoText.trim()) {
      alert('메모 내용을 입력하세요!');
      return;
    }
    setMemos((prev) => [
      ...prev,
      { position: newMemoPosition, text: newMemoText },
    ]);
    handleCloseNewMemoDialog();
  };

  /**
   * (B) 메모 아이콘(구)을 클릭 → 해당 메모를 읽거나 수정/삭제 할 다이얼로그 열기
   * - index를 함께 저장해두어야 수정/삭제 시 특정 메모를 식별 가능
   */
  const handleMemoIconClick = (e, memoIndex) => {
    e.stopPropagation(); // mesh 클릭 이벤트(handleMeshClick) 방지
    setSelectedMemoIndex(memoIndex);
    setDialogOpen(true);
    setIsEditing(false); // 처음에는 "읽기 모드"로 열림
    setEditedText(memos[memoIndex].text); // 현재 메모의 텍스트를 대입
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMemoIndex(null);
  };

  /**
   * 수정 버튼 → isEditing을 true로 전환
   */
  const handleEditMemo = () => {
    setIsEditing(true);
  };

  /**
   * 삭제 버튼 → 해당 메모 제거
   */
  const handleDeleteMemo = () => {
    if (selectedMemoIndex === null) return;
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    setMemos((prev) => prev.filter((_, i) => i !== selectedMemoIndex));
    handleCloseDialog();
  };

  /**
   * 수정 모드에서 "저장" 버튼
   * - editedText로 memos 배열을 업데이트
   */
  const handleSaveEditedMemo = () => {
    if (selectedMemoIndex === null) return;
    setMemos((prev) =>
      prev.map((memo, i) =>
        i === selectedMemoIndex ? { ...memo, text: editedText } : memo
      )
    );
    setIsEditing(false); // 수정 완료 → 읽기 모드
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: '#000',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* 
        [1] 투명도 조절 UI
      */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 999,
          padding: '8px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="body1" color="white" sx={{ mb: 1 }}>
          Opacity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
          <Slider
            value={opacity}
            onChange={handleOpacityChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              color: '#ff9800',
              flex: 1,
              mr: 2,
            }}
          />
          <Typography variant="body2" color="white" sx={{ width: 30 }}>
            {opacity.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* 
        [2] Three.js 씬
      */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {geometry && (
          <Bounds fit clip observe>
            <mesh geometry={geometry} onPointerDown={handleMeshClick}>
              <meshStandardMaterial
                color="orange"
                transparent={true}
                opacity={Number(opacity)}
              />
            </mesh>
          </Bounds>
        )}

        {/* [3] 메모 아이콘들 표시 */}
        {memos.map((memo, idx) => (
          <group position={memo.position} key={idx}>
            {/* 아이콘(구)을 클릭하면 메모 다이얼로그 오픈 */}
            <mesh onPointerDown={(e) => handleMemoIconClick(e, idx)}>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshBasicMaterial color="red" />
            </mesh>
          </group>
        ))}
      </Canvas>

      {/* 
        [4] 새 메모 작성 다이얼로그 
      */}
      <Dialog open={newMemoDialogOpen} onClose={handleCloseNewMemoDialog}>
        <DialogTitle>새 메모 작성</DialogTitle>
        <Box sx={{ height: 0}} />
        <DialogContent>
          <TextField
            label="메모 내용"
            value={newMemoText}
            onChange={(e) => setNewMemoText(e.target.value)}
            multiline
            rows={3}
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewMemoDialog}>취소</Button>
          <Button onClick={handleSaveNewMemo} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 
        [5] 기존 메모(읽기/수정/삭제) 다이얼로그 
      */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>메모 내용</DialogTitle>
        <Box sx={{ height: 0}} />
        <DialogContent>
          {isEditing ? (
            // 수정 모드: TextField로 편집
            <TextField
              label="메모 내용 수정"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              multiline
              rows={3}
              autoFocus
              fullWidth
            />
          ) : (
            // 읽기 모드
            <DialogContentText>
              {selectedMemoIndex !== null ? memos[selectedMemoIndex].text : ''}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {/* 읽기 모드일 때만 Edit/Delete 표시 */}
          {!isEditing && (
            <>
              <Button onClick={handleEditMemo}>수정</Button>
              <Button onClick={handleDeleteMemo} color="error">
                삭제
              </Button>
            </>
          )}

          {/* 수정 모드일 때는 "저장" / "취소" */}
          {isEditing && (
            <>
              <Button onClick={() => setIsEditing(false)}>취소</Button>
              <Button onClick={handleSaveEditedMemo} variant="contained">
                저장
              </Button>
            </>
          )}
          <Button onClick={handleCloseDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DragDropStlViewer;
