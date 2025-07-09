import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SRGBColorSpace } from "three";

// Room dimensions
const roomHeight = 150;
const roomWidth = 166.68; // 150 * 10 / 9
const roomDepth = 166.68;
const viewerHeight = 45;

// Lighting configuration - 원본 색감 보존
const ambientLightIntensity = 1.0;
const ambientLightColor = "#ffffff";
const centralLightIntensity = 1.2;
const centralLightColor = "#ffffff";
const wallLightIntensity = 0.8;
const wallLightColor = "#ffffff";
const cornerLightIntensity = 0.6;
const cornerLightColor = "#ffffff";
const floorLightIntensity = 0.6;
const floorLightColor = "#ffffff";

const minDistance = 30;

// 모달 컴포넌트를 별도의 함수로 분리
function ImageModal({ isOpen, imageUrl, onClose }) {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  if (!isOpen) return null;

  // 이미지 URL에 따른 아이콘 위치 설정
  const getIconPositions = (type) => {
    switch(type) {
      case 'front':
        return [
          { x: '20%', y: '30%', label: '아이콘 1' },
          { x: '50%', y: '40%', label: '아이콘 2' },
          { x: '80%', y: '35%', label: '아이콘 3' }
        ];
      case 'right':
        return [
          { x: '25%', y: '45%', label: '아이콘 1' },
          { x: '60%', y: '35%', label: '아이콘 2' },
          { x: '75%', y: '50%', label: '아이콘 3' }
        ];
      case 'back':
        return [
          { x: '30%', y: '40%', label: '아이콘 1' },
          { x: '55%', y: '45%', label: '아이콘 2' },
          { x: '70%', y: '35%', label: '아이콘 3' }
        ];
      case 'left':
        return [
          { x: '35%', y: '35%', label: '아이콘 1' },
          { x: '65%', y: '40%', label: '아이콘 2' },
          { x: '45%', y: '50%', label: '아이콘 3' }
        ];
      default:
        return [];
    }
  };

  const handleIconClick = (iconLabel) => {
    console.log(`Clicked icon: ${iconLabel}`);
    // 여기에 아이콘 클릭 시 실행할 동작 추가
  };

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        cursor: 'pointer',
      }}
    >
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease-in-out',
          cursor: 'default',
        }}
      >
        {/* 닫기 아이콘 */}
        <div 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '24px',
            zIndex: 1001,
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="32" 
            height="32" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{
              transition: 'transform 0.2s ease-in-out',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <div style={{ position: 'relative' }}>
          <img 
            src={imageUrl} 
            alt="Wall art" 
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
          
          {/* 클릭 가능한 아이콘들 */}
          {getIconPositions(imageUrl.split('wall')[1]?.split('.')[0]).map((icon, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleIconClick(icon.label);
              }}
              onMouseEnter={() => setHoveredIcon(index)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                position: 'absolute',
                left: icon.x,
                top: icon.y,
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: hoveredIcon === index ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                zIndex: 1002,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  transform: hoveredIcon === index ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            </div>
          ))}
        </div>

        <div 
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
            opacity: 0.7,
          }}
        >
          클릭하여 돌아가기
        </div>
      </div>
    </div>
  );
}

function Room({ onWallClick }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const textureLoader = new THREE.TextureLoader();
  
  // 텍스처 최적화 설정
  const textureSettings = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    generateMipmaps: false
  };

  const wallTextures = {
    front: textureLoader.load('images/walls/wall1.png', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
    right: textureLoader.load('images/walls/wall2.jpg', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
    back: textureLoader.load('images/walls/wall3.jpg', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
    left: textureLoader.load('images/walls/wall4.png', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
    floor: textureLoader.load('images/floor.png', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
    ceiling: textureLoader.load('images/ceiling.png', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      Object.assign(texture, textureSettings);
    }),
  };

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: wallTextures.floor,
    roughness: 0.7,
    metalness: 0.12,
    emissive: '#b6b6a8',
    emissiveIntensity: 0.08,
  });

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: wallTextures.ceiling,
    roughness: 0.7,
    metalness: 0.12,
    emissive: '#e6e6d6',
    emissiveIntensity: 0.08,
  });

  // Ambient occlusion 효과를 위한 재질
  const occlusionMaterial = new THREE.MeshStandardMaterial({
    color: '#8b8c79',
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 0.15,
    toneMapped: false,
    depthWrite: false,
    emissive: '#8b8c79',
    emissiveIntensity: 0.05,
  });

  // Soft shadow 재질 (천장/바닥용, 투명)
  const softShadowMaterial = new THREE.MeshStandardMaterial({
    color: '#6b7d6a',
    roughness: 0.95,
    metalness: 0.1,
    transparent: true,
    opacity: 0.12,
    toneMapped: false,
    depthWrite: false,
  });

  // 경계 그라디언트 색상 (톤 조합)
  const wallFloorGradient = ['#b6b6a8', '#8b8c79']; // 밝은 바닥-중간 벽
  const wallCeilingGradient = ['#e6e6d6', '#b6b6a8']; // 밝은 천장-중간 벽
  const wallWallGradient = ['#b6b6a8', '#b6b6a8']; // 벽-벽
  // 라운딩 색상
  const cornerColor = '#8b8c79';

  // 테두리 재질
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: '#032C0C',
    roughness: 0.7,
    metalness: 0.12,
    side: THREE.DoubleSide
  });

  const handleWallClick = (wallType) => {
    onWallClick(wallType);
  };

  const handlePointerOver = () => {
    document.body.style.cursor = `url(/images/cursor.png) 16 44, auto`;
  };

  const handlePointerOut = () => {
    document.body.style.cursor = `url(/images/cursor.png) 16 44, auto`;
  };

  // 중앙 클릭 영역의 크기 설정
  const clickAreaWidth = roomWidth * 0.3;  // 벽 너비의 30%
  const clickAreaHeight = roomHeight * 0.3; // 벽 높이의 30%

  useEffect(() => {
    // 초기 커서 설정
    document.body.style.cursor = `url(/images/cursor.png) 16 44, auto`;

    const handlePointerDown = () => {
      setIsPointerDown(true);
      document.body.style.cursor = `url(/images/cursor-click.png) 16 44, auto`;
    };
    const handlePointerUp = () => {
      setIsPointerDown(false);
      document.body.style.cursor = `url(/images/cursor.png) 16 44, auto`;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <group>
      {/* 바닥 */}
      <group position={[0, -roomHeight / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roomWidth, roomDepth]} />
          <meshStandardMaterial map={wallTextures.floor} roughness={0.7} metalness={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 천장 */}
      <group position={[0, roomHeight / 2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roomWidth, roomDepth]} />
          <meshStandardMaterial map={wallTextures.ceiling} roughness={0.7} metalness={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 벽들 */}
      {[
        { pos: [0, 0, -roomDepth / 2], rot: [0, 0, 0], tex: wallTextures.front, type: 'front' },
        { pos: [0, 0, roomDepth / 2], rot: [0, Math.PI, 0], tex: wallTextures.back, type: 'back' },
        { pos: [-roomWidth / 2, 0, 0], rot: [0, Math.PI / 2, 0], tex: wallTextures.left, type: 'left' },
        { pos: [roomWidth / 2, 0, 0], rot: [0, -Math.PI / 2, 0], tex: wallTextures.right, type: 'right' },
      ].map((wall, i) => (
        <group key={i} position={wall.pos} rotation={wall.rot}>
          {/* 메인 벽면 */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[roomWidth, roomHeight]} />
            <meshStandardMaterial 
              map={wall.tex}
              roughness={0.7}
              metalness={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 테두리 - 상단 */}
          <mesh position={[0, roomHeight/2 - 1.5, 0.1]}>
            <planeGeometry args={[roomWidth - 6, 3]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 테두리 - 하단 */}
          <mesh position={[0, -roomHeight/2 + 1.5, 0.1]}>
            <planeGeometry args={[roomWidth - 6, 3]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 테두리 - 좌측 */}
          <mesh position={[-roomWidth/2 + 1.5, 0, 0.1]}>
            <planeGeometry args={[3, roomHeight - 6]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 테두리 - 우측 */}
          <mesh position={[roomWidth/2 - 1.5, 0, 0.1]}>
            <planeGeometry args={[3, roomHeight - 6]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 모서리 - 좌상단 */}
          <mesh position={[-roomWidth/2 + 1.5, roomHeight/2 - 1.5, 0.1]}>
            <planeGeometry args={[3, 3]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 모서리 - 우상단 */}
          <mesh position={[roomWidth/2 - 1.5, roomHeight/2 - 1.5, 0.1]}>
            <planeGeometry args={[3, 3]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 모서리 - 좌하단 */}
          <mesh position={[-roomWidth/2 + 1.5, -roomHeight/2 + 1.5, 0.1]}>
            <planeGeometry args={[3, 3]} />
            <primitive object={borderMaterial} />
          </mesh>

          {/* 모서리 - 우하단 */}
          <mesh position={[roomWidth/2 - 1.5, -roomHeight/2 + 1.5, 0.1]}>
            <planeGeometry args={[3, 3]} />
            <primitive object={borderMaterial} />
          </mesh>
          
          {/* 클릭 가능한 중앙 영역 */}
          <mesh 
            position={[0, 0, 0.2]}
            onClick={() => handleWallClick(wall.type)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <planeGeometry args={[clickAreaWidth, clickAreaHeight]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent={true} 
              opacity={0.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Controls({ controlsRef }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, viewerHeight, minDistance);
    camera.lookAt(0, viewerHeight, 0);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      minDistance={minDistance}
      maxDistance={roomDepth}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      makeDefault
    />
  );
}

function LoadingScreen({ isLoading }) {
  return (
    <div className={`loading ${!isLoading ? 'hidden' : ''}`}>
      <div className="loading-spinner" />
    </div>
  )
}

export default function App() {
  const controlsRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWall, setSelectedWall] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWallClick = (wallType) => {
    setSelectedWall(wallType);
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Canvas
        style={{ 
          opacity: isLoading ? 0 : 1, 
          width: "100vw", 
          height: "100vh",
          cursor: `url(/images/cursor.png) 16 44, auto`,
          position: 'relative',
          zIndex: 1
        }}
        camera={{ 
          position: [0, viewerHeight, minDistance],
          fov: 75,
          near: 0.1,
          far: 2000
        }}
        gl={{ 
          outputColorSpace: SRGBColorSpace,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true
        }}
        shadows
        dpr={[1, 2]}
        onCreated={({ camera }) => {
          camera.position.set(0, viewerHeight, minDistance);
          camera.lookAt(0, viewerHeight, 0);
        }}
      >
        {/* Lighting System - 원본 색감 보존 */}
        <ambientLight intensity={1.0} color={ambientLightColor} />
        
        {/* Central Ceiling Light */}
        <pointLight
          position={[0, roomHeight/2 - 5, 0]}
          intensity={1.2}
          distance={600}
          decay={2}
          color={centralLightColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
          shadow-camera-near={10}
          shadow-camera-far={400}
        />
        
        {/* Wall Lights - 원본 색감 보존 */}
        <pointLight 
          position={[0, viewerHeight, -roomDepth/2 + 20]}
          intensity={0.8}
          distance={400}
          decay={2}
          color={wallLightColor}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
          shadow-camera-near={10}
          shadow-camera-far={300}
        />
        <pointLight 
          position={[0, viewerHeight, roomDepth/2 - 20]}
          intensity={0.8}
          distance={400}
          decay={2}
          color={wallLightColor}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
          shadow-camera-near={10}
          shadow-camera-far={300}
        />

        <Controls controlsRef={controlsRef} />
        <Room onWallClick={handleWallClick} />
      </Canvas>
      <ImageModal 
        isOpen={selectedWall !== null}
        imageUrl={selectedWall ? `/images/walls/wall${selectedWall === 'front' ? '1' : selectedWall === 'right' ? '2' : selectedWall === 'back' ? '3' : '4'}${selectedWall === 'front' || selectedWall === 'left' ? '.png' : '.jpg'}` : ''}
        onClose={() => setSelectedWall(null)}
      />
    </>
  );
}
