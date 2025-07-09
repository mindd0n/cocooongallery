import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * InstancedMesh를 사용한 버튼 최적화 샘플
 * 동일한 버튼들을 하나의 InstancedMesh로 렌더링하여 Draw-Call을 크게 줄임
 */
export const InstancedButtonMesh = ({ buttonData, texture, onClick }) => {
  const instancedMeshRef = useRef();
  const instancesRef = useRef([]);
  
  useEffect(() => {
    if (!instancedMeshRef.current || !buttonData.length) return;
    
    const mesh = instancedMeshRef.current;
    const matrix = new THREE.Matrix4();
    
    // 각 버튼의 위치와 회전을 인스턴스에 적용
    buttonData.forEach((button, index) => {
      matrix.setPosition(button.position[0], button.position[1], button.position[2]);
      if (button.rotation) {
        matrix.makeRotationFromEuler(new THREE.Euler(...button.rotation));
      }
      mesh.setMatrixAt(index, matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
    instancesRef.current = buttonData;
  }, [buttonData]);
  
  // 클릭 이벤트 처리
  const handleClick = (event) => {
    if (!instancedMeshRef.current) return;
    
    const mesh = instancedMeshRef.current;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // 마우스 위치를 정규화된 좌표로 변환
    const rect = event.target.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, event.camera);
    const intersects = raycaster.intersectObject(mesh);
    
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      const button = instancesRef.current[instanceId];
      if (button && onClick) {
        onClick(button.key, instanceId);
      }
    }
  };
  
  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[null, null, buttonData.length]}
      onClick={handleClick}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.1}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/**
 * 성능 모니터링 훅
 */
export const usePerformanceMonitor = () => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(0);
  
  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
      
      // FPS가 낮으면 경고
      if (fpsRef.current < 30) {
        console.warn(`낮은 FPS 감지: ${fpsRef.current}`);
      }
    }
  });
  
  return fpsRef.current;
};

/**
 * 사용 예시:
 * 
 * const buttonData = [
 *   { key: 'btn1', position: [0, 0, 0], rotation: [0, 0, 0] },
 *   { key: 'btn2', position: [1, 0, 0], rotation: [0, 0, 0] },
 *   // ... 더 많은 버튼들
 * ];
 * 
 * const handleButtonClick = (key, instanceId) => {
 *   console.log(`버튼 클릭: ${key}, 인스턴스 ID: ${instanceId}`);
 * };
 * 
 * return (
 *   <InstancedButtonMesh
 *     buttonData={buttonData}
 *     texture={buttonTexture}
 *     onClick={handleButtonClick}
 *   />
 * );
 */ 