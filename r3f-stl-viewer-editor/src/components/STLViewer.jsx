// STLViewer.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds } from '@react-three/drei';

function STLViewer({
  geometry,
  opacity,
  isMemoMode,
  memos,
  onNewMemoPosition,
  onEditMemoRequest,
}) {
  // 모델을 클릭(메모 모드일 때만) → 새 메모 생성 요청
  const handleMeshClick = (e) => {
    e.stopPropagation();
    if (!isMemoMode) return; // 메모 모드 X → 무시
    const clickPos = e.point;
    onNewMemoPosition(clickPos);
  };

  // 메모 아이콘 클릭 → 기존 메모 수정/삭제 요청
  const handleMemoIconClick = (e, idx) => {
    e.stopPropagation();
    onEditMemoRequest(idx);
  };

  return (
    <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 5] }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {geometry && (
        <Bounds fit clip observe>
          <mesh geometry={geometry} onPointerDown={handleMeshClick}>
            <meshStandardMaterial color="orange" transparent opacity={opacity} />
          </mesh>
        </Bounds>
      )}

      {/* 메모 아이콘들 */}
      {memos.map((memo, idx) => (
        <group position={memo.position} key={idx}>
          <mesh onPointerDown={(e) => handleMemoIconClick(e, idx)}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        </group>
      ))}
    </Canvas>
  );
}

export default STLViewer;