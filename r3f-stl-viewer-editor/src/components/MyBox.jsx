import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function MyBox() {
  const meshRef = useRef();

  // 매 프레임마다 mesh를 조금씩 회전
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* 박스 지오메트리(큐브) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* 재질: 흰색 */}
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

export default MyBox;
