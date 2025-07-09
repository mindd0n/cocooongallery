import React, { useRef, useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import './styles.css';
import { useButtonImageData } from '../hooks/useButtonImageData';
import ContentDisplay from './ContentDisplay.jsx';
import gsap from 'gsap';
import { detectPerformanceTier, getCurrentTierSettings } from '../utils/performanceTier';
import { loadTexturesSequential, applyTierTextureSettings } from '../utils/loadTexturesSequential';

// 로컬 기본 URL (public 폴더 기준)
// const LOCAL_BASE_URL = '';

// 버튼 위치 계산 함수 (예시)
// function getButtonPosition(wallType, buttonKey, index, total) {
//   const gap = 20;
//   
//   // 기존 벽면들은 현재 방식 유지
//   const baseY = 0;
//   const baseZ = 0.1;
//   return [index * gap - (total - 1) * gap / 2, baseY, baseZ];
// }

// Room dimensions
const roomHeight = 150;
const roomWidth = 166.68; // 150 * 10 / 9
const roomDepth = 166.68;
const viewerHeight = 45;

// Lighting configuration
// const ambientLightIntensity = 1.5;
// const ambientLightColor = "#fff0e6";
// const centralLightIntensity = 1.8;
// const centralLightColor = "#ffe4cc";
// const wallLightIntensity = 1.2;
// const wallLightColor = "#fff0e6";

const minDistance = 0.5;
// 초기 카메라 상태를 상수로 정의
const INITIAL_CAMERA_POSITION = new THREE.Vector3(0, viewerHeight, roomDepth / 2 + 10);
const INITIAL_CAMERA_LOOKAT = new THREE.Vector3(0, 0, 0);

// 벽 텍스처 경로를 객체로 관리 (로컬 경로로 임시 변경)
const wallTexturePaths = {
  front: '/images/walls/wall_photo.png',
  back: '/images/walls/wall_walk.png',
  left: '/images/walls/wall_bus-stop.png',
  right: '/images/walls/wall_home.png',
  ceiling: '/images/walls/wall_ceiling.png',
  floor: '/images/walls/wall_floor.png',
};

// 공유 머티리얼 (Draw-Call 최적화)
const sharedMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 1,
  alphaTest: 0.1,
  depthTest: true,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// 버튼 centroid 픽셀 좌표 (이미지 크기: 2000x1800)
// const buttonCentroids = {
//   sun:    { x: 424.06,  y: 588.15 },
//   path:   { x: 1069.95, y: 1367.17 },
//   sign:   { x: 1813.97, y: 945.93 },
//   bridge: { x: 416.34,  y: 1056.21 },
// };

// 버튼 bounding box 위치 및 크기 (픽셀)
// const buttonBBoxes = {
//   sun:    { min_x: 0,    min_y: 268,  width: 895,  height: 589 },
//   path:   { min_x: 0,    min_y: 419,  width: 1827, height: 1381 },
//   sign:   { min_x: 1580, min_y: 619,  width: 420,  height: 818 },
//   bridge: { min_x: 0,    min_y: 857,  width: 964,  height: 443 },
// };

// 벽별 normal 벡터 정의
// const wallNormals = {
//   front: [0, 0, 1],
//   back: [0, 0, -1],
//   left: [1, 0, 0],
//   right: [-1, 0, 0],
// };

// 3D 중심 좌표 변환 함수
// function bboxCenterTo3D({min_x, min_y, width, height}) {
//   const center_x = min_x + width / 2;
//   const center_y = min_y + height / 2;
//   const left = center_x / 2000;
//   const top = center_y / 1800;
//   const posX = (left - 0.5) * roomWidth;
//   const posY = (0.5 - top) * roomHeight;
//   return [posX, posY];
// }

// 3D 크기 변환 함수 (벽/천장/바닥별로 plane 크기 맞춤)
// function bboxTo3DByWall({width, height}, wallType) {
//   // 모든 벽은 기존과 동일
//   return [width / 2000 * roomWidth, height / 1800 * roomHeight];
// }

// UV repeat/offset 계산 함수
// function getUVTransform({min_x, min_y, width, height}) {
//   const repeatX = width / 2000;
//   const repeatY = height / 1800;
//   const offsetX = min_x / 2000;
//   const offsetY = 1 - (min_y + height) / 1800;
//   return { repeat: [repeatX, repeatY], offset: [offsetX, offsetY] };
// }

// 카메라가 1번 레이어도 렌더링하도록 설정
// function EnableLayer1OnCamera() {
//   const { camera } = useThree();
//   useEffect(() => {
//     camera.layers.enable(1);
//   }, [camera]);
//   return null;
// }

// Glow Ring ShaderMaterial 생성 함수 (useRef + useFrame)
// function useGlowRingMaterial() {
//   const materialRef = useRef();
//   useFrame(() => {
//     if (materialRef.current) {
//       materialRef.current.uniforms.opacity.value = 0.7;
//     }
//   });
//   if (!materialRef.current) {
//     materialRef.current = new THREE.ShaderMaterial({
//       uniforms: {
//         color: { value: new THREE.Color(0x00ff00) },
//         radius: { value: 0.35 },
//         width: { value: 0.3 },
//         opacity: { value: 1 }
//       },
//       transparent: true,
//       depthWrite: false,
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform vec3 color;
//         uniform float radius;
//         uniform float width;
//         uniform float opacity;
//         varying vec2 vUv;
//         void main() {
//           float dist = distance(vUv, vec2(0.5, 0.5));
//           float edge0 = radius;
//           float edge1 = radius + width;
//           float glow = smoothstep(edge1, edge0, dist);
//           gl_FragColor = vec4(color, glow * opacity);
//         }
//       `
//     });
//   }
//   return materialRef.current;
// }

// 알파마스크 기반 Glow ShaderMaterial 생성 함수
// function useAlphaGlowMaterial(texture) {
//   return useMemo(() => new THREE.ShaderMaterial({
//     uniforms: {
//       map: { value: texture },
//       color: { value: new THREE.Color(0x00ff00) },
//       opacity: { value: 1 }
//     },
//     transparent: true,
//     depthWrite: false,
//     vertexShader: `
//       varying vec2 vUv;
//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform sampler2D map;
//       uniform vec3 color;
//       uniform float opacity;
//       varying vec2 vUv;
//       void main() {
//         float a = texture2D(map, vUv).a;
//         float edge = smoothstep(0.45, 0.55, a); // 알파 경계에서만 빛나게
//         gl_FragColor = vec4(color, edge * opacity);
//       }
//     `
//   }), [texture]);
// }

// Radial gradient texture 생성 함수
function useRadialGlowTexture(size = 256, color = '#ffe066') {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const r = size / 2;
    const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color + '80'); // 중간은 반투명
    gradient.addColorStop(1, 'rgba(255,224,102,0)'); // 바깥은 완전 투명
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [size, color]);
}

// 조명 효과음 재생 함수
function playLampSound() {
  const audio = new window.Audio('/sounds/light-switch.mp3');
  audio.volume = 0.5;
  audio.play();
}

// Button 컴포넌트 수정
const Button = React.memo(function Button({ 
  type, 
  position, 
  src, 
  wallType, 
  hoveredObject, 
  setHoveredObject, 
  buttonKey, 
  hoverSrc, 
  controlsRef,
  setSelectedButton,
  animateCamera,
  btnIdx,
  btnTotal,
  forceVisible,
  polygonOffset,
  polygonOffsetFactor,
  polygonOffsetUnits,
  setIsLampOverlay,
  handleButtonClick,
  isLampOverlay = false
}) {
  const isHovered = hoveredObject === buttonKey;
  const [size, texture, image, canvas, ready] = useButtonImageData(isHovered ? hoverSrc : src, wallType);
  const meshRef = useRef();
  const clickStart = useRef(null);
  
  // 노란 Glow radial gradient 텍스처
  const glowTexture = useRadialGlowTexture(256, '#ffe066');

  const handlePointerDown = useCallback((e) => {
    // 클릭 시작 위치 저장
    clickStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!clickStart.current) return;
    const dx = e.clientX - clickStart.current.x;
    const dy = e.clientY - clickStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) { // 5px 이하 이동만 클릭으로 인정
      if (!image || !texture || !canvas) return;
      const uv = e.uv;
      if (!uv) return;
      const x = Math.floor(uv.x * image.naturalWidth);
      const y = Math.floor((1 - uv.y) * image.naturalHeight);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const alpha = ctx.getImageData(x, y, 1, 1).data[3] / 255;
      if (alpha > 0.05) {
        e.stopPropagation();
        // 램프(조명) 아이콘은 카메라 확대/팝업 없이 오버레이만 토글
        if (buttonKey === 'btn_c_lamp') {
          playLampSound();
          setIsLampOverlay(v => !v);
          setHoveredObject(null);
          clickStart.current = null;
          return;
        }
        // 디지털디톡스 버튼은 handleButtonClick 호출
        if (buttonKey === 'btn_f_phone') {
          handleButtonClick && handleButtonClick('btn_f_phone');
          setHoveredObject(null);
          clickStart.current = null;
          return;
        }
        const zoomTarget = getZoomTargetForButton(position, wallType);
        animateCamera(
          {
            position: zoomTarget.position,
            target: zoomTarget.target,
            fov: 45
          },
          1.5,
          () => setSelectedButton(buttonKey)
        );
        setHoveredObject(null);
      }
    }
    clickStart.current = null;
  }, [position, image, texture, canvas, buttonKey, wallType, animateCamera, setHoveredObject, setSelectedButton, setIsLampOverlay, handleButtonClick]);

  const handlePointerMove = useCallback((e) => {
    if (!image || !texture || !canvas) return;
    const uv = e.uv;
    if (!uv) return;
    const x = Math.floor(uv.x * image.naturalWidth);
    const y = Math.floor((1 - uv.y) * image.naturalHeight);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const alpha = ctx.getImageData(x, y, 1, 1).data[3] / 255;
    if (alpha > 0.05 && hoveredObject !== buttonKey) {
      e.stopPropagation(); // 그림 부분만 stopPropagation
      setHoveredObject(buttonKey);
    } else if (alpha <= 0.05 && hoveredObject === buttonKey) {
      setHoveredObject(null);
    }
  }, [image, texture, canvas, hoveredObject, buttonKey, setHoveredObject]);

  const handlePointerOut = useCallback(() => {
    if (hoveredObject === buttonKey) {
      setHoveredObject(null);
    }
  }, [hoveredObject, buttonKey, setHoveredObject]);

  if (!ready) return null;

  return (
    <group position={position}>
      {/* 램프아이콘 뒤 Glow 원 (radial gradient) */}
      {buttonKey === 'btn_c_lamp' && !isLampOverlay && (
        <mesh position={[0, 9.6, -0.01]}>
          <planeGeometry args={[size[0] * 0.2, size[0] * 0.2]} />
          <meshStandardMaterial 
            map={glowTexture}
            transparent={true}
            opacity={1}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        renderOrder={10}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        visible={forceVisible}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          opacity={1}
          alphaTest={0.1}
          depthTest={true}
          depthWrite={false}
          side={THREE.DoubleSide}
          ref={ref => {
            if (!ref) return;
            console.log(`[${wallType}_btn_${btnIdx}] material 연결됨`, ref, 'map:', ref.map, 'visible:', ref.visible);
          }}
          polygonOffset={polygonOffset}
          polygonOffsetFactor={polygonOffsetFactor}
          polygonOffsetUnits={polygonOffsetUnits}
        />
      </mesh>
    </group>
  );
});

// 각 벽별 버튼 파일명 명시적으로 관리
// const wallButtonFiles = {
//   front: [
//     'btn_p_go.png', 'btn_p_tree.png', 'btn_p_note.png', 'btn_p_pavilion.png'
//   ],
//   right: [
//     'btn_h_home.png', 'btn_h_star.png', 'btn_h_dog.png', 'btn_h_ribbon.png'
//   ],
//   back: [
//     'btn_w_bridge.png', 'btn_w_sign.png', 'btn_w_sun.png', 'btn_w_walk.png'
//   ],
//   left: [
//     'btn_b_busstop.png', 'btn_b_bus.png', 'btn_b_home.png'
//   ]
// };
// const wallButtonFolders = {
//   front: 'wall_photo_btn',
//   right: 'wall_home_btn',
//   back: 'wall_walk_btn',
//   left: 'wall_bus-stop_btn',
// };

// getZoomTargetForButton 함수를 일반 함수로 변경
const getZoomTargetForButton = (position, wallType) => {
  const [x, y, z] = position;
  const distance = minDistance; // 더욱 강한 줌인
  let cameraPos, target;
  target = new THREE.Vector3(x, y, z);
  switch (wallType) {
    case 'front': cameraPos = new THREE.Vector3(x, y, z + distance); break;
    case 'back': cameraPos = new THREE.Vector3(x, y, z - distance); break;
    case 'left': cameraPos = new THREE.Vector3(x + distance, y, z); break;
    case 'right': cameraPos = new THREE.Vector3(x - distance, y, z); break;
    case 'ceiling': cameraPos = new THREE.Vector3(x, y - distance, z); break;
    case 'floor': cameraPos = new THREE.Vector3(x, y + distance, z); break;
    default: cameraPos = new THREE.Vector3(x, y, z + distance);
  }
  return { position: cameraPos, target };
};

// Room 컴포넌트를 별도로 분리
const Room = ({ 
  isHovered, 
  setIsHovered, 
  buttonRef, 
  setHoveredObject, 
  hoveredObject, 
  setSelectedButton,
  animateCamera,
  setIsLampOverlay,
  handleButtonClick,
  isLampOverlay
}) => {
  // useLoader로 벽 텍스처 로딩
  const frontTex = useLoader(THREE.TextureLoader, wallTexturePaths.front);
  const backTex = useLoader(THREE.TextureLoader, wallTexturePaths.back);
  const leftTex = useLoader(THREE.TextureLoader, wallTexturePaths.left);
  const rightTex = useLoader(THREE.TextureLoader, wallTexturePaths.right);
  const ceilingTex = useLoader(THREE.TextureLoader, wallTexturePaths.ceiling);
  const floorTex = useLoader(THREE.TextureLoader, wallTexturePaths.floor);
  
  // 텍스처 색공간을 sRGB로 명시
  [frontTex, backTex, leftTex, rightTex, ceilingTex, floorTex].forEach(tex => {
    if (tex) tex.colorSpace = THREE.SRGBColorSpace;
  });
  
  // 텍스처 로딩 상태 추적 - 한 번 로딩되면 계속 유지
  const [texturesLoaded, setTexturesLoaded] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
    ceiling: false,
    floor: false
  });

  // Material을 useMemo로 캐싱하여 안정적으로 재사용
  const materials = useMemo(() => {
    const mats = {};
    
    if (texturesLoaded.front && frontTex) {
      mats.front = new THREE.MeshStandardMaterial({
        map: frontTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Front material 생성됨:', mats.front, 'map:', mats.front.map);
    }
    
    if (texturesLoaded.back && backTex) {
      mats.back = new THREE.MeshStandardMaterial({
        map: backTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Back material 생성됨:', mats.back, 'map:', mats.back.map);
    }
    
    if (texturesLoaded.left && leftTex) {
      mats.left = new THREE.MeshStandardMaterial({
        map: leftTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Left material 생성됨:', mats.left, 'map:', mats.left.map);
    }
    
    if (texturesLoaded.right && rightTex) {
      mats.right = new THREE.MeshStandardMaterial({
        map: rightTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Right material 생성됨:', mats.right, 'map:', mats.right.map);
    }
    
    if (texturesLoaded.ceiling && ceilingTex) {
      mats.ceiling = new THREE.MeshStandardMaterial({
        map: ceilingTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Ceiling material 생성됨:', mats.ceiling, 'map:', mats.ceiling.map, 'texture image:', ceilingTex?.image?.src);
    }
    
    if (texturesLoaded.floor && floorTex) {
      mats.floor = new THREE.MeshStandardMaterial({
        map: floorTex,
        color: "#ffffff",
        roughness: 0.7,
        metalness: 0.12,
        side: THREE.FrontSide
      });
      console.log('Floor material 생성됨:', mats.floor, 'map:', mats.floor.map, 'texture image:', floorTex?.image?.src);
    }
    
    console.log('Material 캐싱 완료:', Object.keys(mats));
    return mats;
  }, [texturesLoaded, frontTex, backTex, leftTex, rightTex, ceilingTex, floorTex]);

  // 디버깅용 로그 - 텍스처 상태 변화 추적
  useEffect(() => {
    console.log('=== 텍스처 로딩 상태 ===', texturesLoaded);
    console.log('=== 실제 텍스처 객체 ===', {
      front: frontTex?.image?.src,
      back: backTex?.image?.src,
      left: leftTex?.image?.src,
      right: rightTex?.image?.src,
      ceiling: ceilingTex?.image?.src,
      floor: floorTex?.image?.src
    });
    
    // 천장과 바닥 텍스처 상태 별도 확인
    console.log('=== 천장 텍스처 상세 정보 ===');
    console.log('ceilingTex:', ceilingTex);
    console.log('ceilingTex.isTexture:', ceilingTex?.isTexture);
    console.log('ceilingTex.image:', ceilingTex?.image);
    console.log('ceilingTex.image.complete:', ceilingTex?.image?.complete);
    console.log('ceilingTex.image.naturalWidth:', ceilingTex?.image?.naturalWidth);
    console.log('texturesLoaded.ceiling:', texturesLoaded.ceiling);
    
    console.log('=== 바닥 텍스처 상세 정보 ===');
    console.log('floorTex:', floorTex);
    console.log('floorTex.isTexture:', floorTex?.isTexture);
    console.log('floorTex.image:', floorTex?.image);
    console.log('floorTex.image.complete:', floorTex?.image?.complete);
    console.log('floorTex.image.naturalWidth:', floorTex?.image?.naturalWidth);
    console.log('texturesLoaded.floor:', texturesLoaded.floor);
    
    // Room 렌더링 디버깅
    console.log('=== Room 렌더링 상태 ===');
    console.log('texturesLoaded 상태:', texturesLoaded);
    console.log('조명 설정 확인:', 'ambientLight intensity=3.0');
    console.log('벽 위치 확인:', [
      { pos: [0, 0, -roomDepth / 2], type: 'front' },
      { pos: [0, 0, roomDepth / 2], type: 'back' },
      { pos: [-roomWidth / 2, 0, 0], type: 'left' },
      { pos: [roomWidth / 2, 0, 0], type: 'right' },
      { pos: [0, roomHeight / 2, 0], type: 'ceiling' },
      { pos: [0, -roomHeight / 2, 0], type: 'floor' }
    ]);
  }, [texturesLoaded, frontTex, backTex, leftTex, rightTex, ceilingTex, floorTex]);

  // 텍스처 로딩 완료 시 상태 업데이트 (안전한 방식)
  useEffect(() => {
    const checkAndSetTextureLoaded = () => {
      const newState = {
        front: !!(frontTex && frontTex.image && frontTex.image.complete),
        back: !!(backTex && backTex.image && backTex.image.complete),
        left: !!(leftTex && leftTex.image && leftTex.image.complete),
        right: !!(rightTex && rightTex.image && rightTex.image.complete),
        ceiling: !!(ceilingTex && ceilingTex.image && ceilingTex.image.complete),
        floor: !!(floorTex && floorTex.image && floorTex.image.complete)
      };
      
      setTexturesLoaded(newState);
      console.log('텍스처 로딩 상태 업데이트:', newState);
    };

    // 즉시 체크
    checkAndSetTextureLoaded();
    
    // 1초 후 다시 체크 (이미지가 늦게 로드되는 경우 대비)
    const timer = setTimeout(checkAndSetTextureLoaded, 1000);
    
    return () => clearTimeout(timer);
  }, [frontTex, backTex, leftTex, rightTex, ceilingTex, floorTex]);

  // wallButtonData를 로컬 경로로 변경
  const wallButtonData = {
    'front': [
      { key: 'btn_p_tree',     src: '/images/buttons/wall_photo_btn/btn_p_tree.png',     hoverSrc: '/images/buttons/wall_photo_btn/btn_p_tree.png' },
      { key: 'btn_p_pavilion', src: '/images/buttons/wall_photo_btn/btn_p_pavilion.png', hoverSrc: '/images/buttons/wall_photo_btn/btn_p_pavilion.png' },
      { key: 'btn_p_go',       src: '/images/buttons/wall_photo_btn/btn_p_go.png',       hoverSrc: '/images/buttons/wall_photo_btn/btn_p_go.png' },
      { key: 'btn_p_note',     src: '/images/buttons/wall_photo_btn/btn_p_note.png',     hoverSrc: '/images/buttons/wall_photo_btn/btn_p_note.png' }
    ],
    'back': [
      { key: 'btn_w_sun',    src: '/images/buttons/wall_walk_btn/btn_w_sun.png',    hoverSrc: '/images/buttons/wall_walk_btn/btn_w_sun.png' },
      { key: 'btn_w_bridge', src: '/images/buttons/wall_walk_btn/btn_w_bridge.png', hoverSrc: '/images/buttons/wall_walk_btn/btn_w_bridge.png' },
      { key: 'btn_w_walk',   src: '/images/buttons/wall_walk_btn/btn_w_walk.png',   hoverSrc: '/images/buttons/wall_walk_btn/btn_w_walk.png' },
      { key: 'btn_w_sign',   src: '/images/buttons/wall_walk_btn/btn_w_sign.png',   hoverSrc: '/images/buttons/wall_walk_btn/btn_w_sign.png' },
    ],
    'left': [
      { key: 'btn_b_home',    src: '/images/buttons/wall_bus-stop_btn/btn_b_home.png',    hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_home.png' },
      { key: 'btn_b_busstop', src: '/images/buttons/wall_bus-stop_btn/btn_b_busstop.png', hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_busstop.png' },
      { key: 'btn_b_bus',     src: '/images/buttons/wall_bus-stop_btn/btn_b_bus.png',     hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_bus.png' },
    ],
    'right': [
      { key: 'btn_h_star',   src: '/images/buttons/wall_home_btn/btn_h_star.png',   hoverSrc: '/images/buttons/wall_home_btn/btn_h_star.png' },
      { key: 'btn_h_home',   src: '/images/buttons/wall_home_btn/btn_h_home.png',   hoverSrc: '/images/buttons/wall_home_btn/btn_h_home.png' },
      { key: 'btn_h_dog',    src: '/images/buttons/wall_home_btn/btn_h_dog.png',    hoverSrc: '/images/buttons/wall_home_btn/btn_h_dog.png' },
      { key: 'btn_h_ribbon', src: '/images/buttons/wall_home_btn/btn_h_ribbon.png', hoverSrc: '/images/buttons/wall_home_btn/btn_h_ribbon.png' },
    ],
    'ceiling': [
      { key: 'btn_c_lamp',   src: '/images/buttons/wall_ceiling_btn/btn_c_lamp.png',   hoverSrc: '/images/buttons/wall_ceiling_btn/btn_c_lamp.png', left: '38%', top: '18%', width: '8%', height: '8%' },
      { key: 'btn_c_heart',  src: '/images/buttons/wall_ceiling_btn/btn_c_heart.png',  hoverSrc: '/images/buttons/wall_ceiling_btn/btn_c_heart_hover.png', left: '60%', top: '28%', width: '10%', height: '10%' },
    ],
    'floor': [
      { key: 'btn_f_rug',    src: '/images/buttons/wall_floor_btn/btn_f_rug.png',    hoverSrc: '/images/buttons/wall_floor_btn/btn_f_rug.png' },
      { key: 'btn_f_phone',  src: '/images/buttons/wall_floor_btn/btn_f_phone.png',  hoverSrc: '/images/buttons/wall_floor_btn/btn_f_phone.png' },
    ],
  };

  // const buttons = useMemo(() => {
  //   return Object.entries(wallButtonData).flatMap(([wallType, wallButtons]) => 
  //     wallButtons.map((btn, index) => {
  //       const position = getButtonPosition(wallType, btn.key, index, wallButtons.length);
  //       return { ...btn, wallType, position, btnIdx: index, btnTotal: wallButtons.length };
  //     })
  //   );
  // }, [wallButtonData]);

  return (
    <>
      {/* 조명 복구 */}
      <ambientLight intensity={3.0} color="#ffffff" />
      <directionalLight 
        position={[0, 100, 0]} 
        intensity={2.0} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <directionalLight 
        position={[0, -100, 0]} 
        intensity={1.0} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={300}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight 
        position={[100, 0, 0]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={300}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight 
        position={[-100, 0, 0]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={300}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {/* 벽과 기본 구조 */}
      <group ref={buttonRef}>
        {/* 벽들 */}
        {[
          { pos: [0, 0, -roomDepth / 2], rot: [0, 0, 0], type: 'front' },
          { pos: [0, 0, roomDepth / 2], rot: [0, Math.PI, 0], type: 'back' },
          { pos: [-roomWidth / 2, 0, 0], rot: [0, Math.PI / 2, 0], type: 'left' },
          { pos: [roomWidth / 2, 0, 0], rot: [0, -Math.PI / 2, 0], type: 'right' },
        ].map((wall, i) => {
          const isLoaded = texturesLoaded[wall.type];
          const material = materials[wall.type];
          if (!isLoaded || !material) return null;
          
          // 공유 머티리얼에 텍스처 적용
          const wallMaterial = sharedMaterial.clone();
          wallMaterial.map = material.map;
          
          return (
            <group key={i} position={wall.pos} rotation={wall.rot}>
              <mesh
                name={`wall-${wall.type}`}
                visible={true}
                renderOrder={0}
                onPointerDown={() => console.log('벽 mesh 클릭됨', wall.type)}
              >
                <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
                <primitive object={wallMaterial} />
              </mesh>
              {/* 벽 중앙에 버튼 추가: 반드시 wallButtonData[wall.type] 배열 map만 사용! */}
              {Array.isArray(wallButtonData[wall.type]) && wallButtonData[wall.type].map((btn, idx) => {
                let pos = [0, 0, (wall.type === 'left' && btn.key === 'btn_b_bus') ? 0.03 : 0.02];
                return (
                  <Button
                    key={btn.key}
                    type={`${wall.type}_btn_${idx}`}
                    buttonKey={btn.key}
                    position={pos}
                    src={btn.src}
                    hoverSrc={btn.key === 'btn_c_lamp' ? btn.src : btn.src.replace(/\.png$/, '_hover.png')}
                    wallType={wall.type}
                    setHoveredObject={setHoveredObject}
                    hoveredObject={hoveredObject}
                    controlsRef={buttonRef}
                    setSelectedButton={setSelectedButton}
                    animateCamera={animateCamera}
                    forceVisible={true}
                    polygonOffset={true}
                    polygonOffsetFactor={-2}
                    polygonOffsetUnits={-2}
                    setIsLampOverlay={setIsLampOverlay}
                    handleButtonClick={handleButtonClick}
                    isLampOverlay={isLampOverlay}
                  />
                );
              })}
            </group>
          );
        })}
        
        {/* 천장 - 완전히 독립적인 컴포넌트 */}
        {texturesLoaded.ceiling && materials.ceiling && (
          <group key="ceiling-group" position={[0, roomHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              name="ceiling"
              visible={true}
              renderOrder={0}
              onPointerDown={() => console.log('천장 mesh 클릭됨')}
              ref={(ref) => {
                if (ref) {
                  console.log('천장 mesh 생성됨:', ref);
                  console.log('천장 mesh material:', ref.material);
                  console.log('천장 mesh visible:', ref.visible);
                  console.log('천장 mesh position:', ref.position);
                  console.log('천장 mesh rotation:', ref.rotation);
                }
              }}
            >
              <planeGeometry args={[roomWidth, roomDepth]} />
              <primitive object={materials.ceiling} />
            </mesh>
            {/* 천장 버튼 */}
            {wallButtonData.ceiling?.map((btn, idx) => {
              let pos = [0, 0, 0.02];
              return (
                <Button
                  key={btn.key}
                  type={`ceiling_btn_${idx}`}
                  buttonKey={btn.key}
                  position={pos}
                  src={btn.src}
                  hoverSrc={btn.key === 'btn_c_lamp' ? btn.src : btn.src.replace(/\.png$/, '_hover.png')}
                  wallType="ceiling"
                  setHoveredObject={setHoveredObject}
                  hoveredObject={hoveredObject}
                  controlsRef={buttonRef}
                  setSelectedButton={setSelectedButton}
                  animateCamera={animateCamera}
                  forceVisible={true}
                  polygonOffset={true}
                  polygonOffsetFactor={-2}
                  polygonOffsetUnits={-2}
                  setIsLampOverlay={setIsLampOverlay}
                  handleButtonClick={handleButtonClick}
                  isLampOverlay={isLampOverlay}
                />
              );
            })}
          </group>
        )}
        
        {/* 바닥 - 완전히 독립적인 컴포넌트 */}
        {texturesLoaded.floor && materials.floor && (
          <group key="floor-group" position={[0, -roomHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              name="floor"
              visible={true}
              renderOrder={0}
              onPointerDown={() => console.log('바닥 mesh 클릭됨')}
              ref={(ref) => {
                if (ref) {
                  console.log('바닥 mesh 생성됨:', ref);
                  console.log('바닥 mesh material:', ref.material);
                  console.log('바닥 mesh visible:', ref.visible);
                  console.log('바닥 mesh position:', ref.position);
                  console.log('바닥 mesh rotation:', ref.rotation);
                }
              }}
            >
              <planeGeometry args={[roomWidth, roomDepth]} />
              <primitive object={materials.floor} />
            </mesh>
            {/* 바닥 버튼 */}
            {wallButtonData.floor?.map((btn, idx) => {
              let pos = [0, 0, 0.02];
              return (
                <Button
                  key={btn.key}
                  type={`floor_btn_${idx}`}
                  buttonKey={btn.key}
                  position={pos}
                  src={btn.src}
                  hoverSrc={btn.key === 'btn_c_lamp' ? btn.src : btn.src.replace(/\.png$/, '_hover.png')}
                  wallType="floor"
                  setHoveredObject={setHoveredObject}
                  hoveredObject={hoveredObject}
                  controlsRef={buttonRef}
                  setSelectedButton={setSelectedButton}
                  animateCamera={animateCamera}
                  forceVisible={true}
                  polygonOffset={true}
                  polygonOffsetFactor={-2}
                  polygonOffsetUnits={-2}
                  setIsLampOverlay={setIsLampOverlay}
                  handleButtonClick={handleButtonClick}
                  isLampOverlay={isLampOverlay}
                />
              );
            })}
          </group>
        )}
      </group>
    </>
  );
};

export default function RoomScene({ onLoadingProgress, onLoadingComplete, selectedButton, setSelectedButton }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef();
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const controlsRef = useRef();
  const [restoreView, setRestoreView] = useState(null);
  const [isLampOverlay, setIsLampOverlay] = useState(false);
  const [currentTier, setCurrentTier] = useState('full');
  const [isContextLost, setIsContextLost] = useState(false);
  const [isHardDowngraded, setIsHardDowngraded] = useState(false);
  
  // 메모리 누수 방지를 위한 ref들
  const renderTargetsRef = useRef([]);
  const videoTexturesRef = useRef([]);
  const rendererRef = useRef(null);
  
  // 디지털디톡스 효과 상태
  const [phoneEffect, setPhoneEffect] = useState({
    active: false,
    showStupid: false,
    showText: false,
    flash: false,
    flashCount: 0
  });
  const phoneEffectTimeouts = useRef([]);

  // 성능 티어 감지 및 설정
  useEffect(() => {
    const tier = detectPerformanceTier();
    setCurrentTier(tier);
    console.log(`성능 티어 감지: ${tier}`);
  }, []);

  // WebGL Context Lost 처리 (개선된 버전)
  useEffect(() => {
    let hardDowngraded = false;
    
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('WebGL Context Lost - 성능 다운그레이드');
      
      if (hardDowngraded) return;
      hardDowngraded = true;
      setIsHardDowngraded(true);
      
      // Sentry 로깅 (Sentry가 설정된 경우)
      if (window.Sentry) {
        window.Sentry.captureMessage('WebGL Context Lost', { 
          level: 'warning',
          tags: { tier: currentTier },
          extra: { 
            deviceMemory: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency
          }
        });
      }
      
      // 강제 다운그레이드
      downgradeToLiteA();
      setTimeout(restartScene, 100);
    };

    const handleContextRestored = () => {
      console.log('WebGL Context Restored');
      setIsContextLost(false);
    };

    // Canvas 요소에 이벤트 리스너 추가
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, [currentTier]);

  // 강제 다운그레이드 함수
  const downgradeToLiteA = useCallback(() => {
    console.log('🔴 강제 다운그레이드: LiteA 모드');
    setCurrentTier('liteA');
    setIsContextLost(true);
    
    // 렌더러 정보 리셋
    if (rendererRef.current) {
      rendererRef.current.info.reset();
    }
  }, []);

  // 씬 재시작 함수
  const restartScene = useCallback(() => {
    console.log('🔄 씬 재시작');
    // 메모리 정리
    cleanupMemory();
  }, []);

  // 메모리 정리 함수
  const cleanupMemory = useCallback(() => {
    // RenderTarget 정리
    renderTargetsRef.current.forEach(rt => {
      if (rt && rt.dispose) {
        rt.dispose();
      }
    });
    renderTargetsRef.current = [];

    // 비디오 텍스처 정리
    videoTexturesRef.current.forEach(vt => {
      if (vt && vt.dispose) {
        vt.dispose();
      }
    });
    videoTexturesRef.current = [];

    // 렌더러 정보 리셋
    if (rendererRef.current) {
      rendererRef.current.info.reset();
    }
  }, []);

  // 현재 티어 설정 가져오기 (메모이제이션)
  const tierSettings = useMemo(() => getCurrentTierSettings(), [currentTier]);
  const isMobile = window.innerWidth < 768 && window.innerHeight > window.innerWidth;

  // 텍스처 순차 로딩 및 진행률 추적 (임시 비활성화)
  useEffect(() => {
    if (onLoadingProgress) {
      // 간단한 로딩 시뮬레이션 (기존 방식으로 복원)
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          if (onLoadingComplete) onLoadingComplete();
        }
        if (onLoadingProgress) onLoadingProgress(progress);
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [onLoadingProgress, onLoadingComplete]);

  // OrbitControls 기반 카메라 애니메이션
  const animateCamera = useCallback((to, duration = 1.5, onComplete) => {
    setIsAnimating(true);
    gsap.to(controlsRef.current.object.position, {
      x: to.position.x,
      y: to.position.y,
      z: to.position.z,
      duration,
      ease: "power2.inOut"
    });
    gsap.to(controlsRef.current.target, {
      x: to.target.x,
      y: to.target.y,
      z: to.target.z,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        controlsRef.current.update();
      },
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    });
  }, []);

  // 복귀 시 항상 restoreView로 animateCamera, 복귀 후 restoreView는 null로 초기화
  const handleRestore = useCallback(() => {
    if (!selectedButton) return;
    const view = restoreView || {
      position: controlsRef.current.object.position.clone(),
      target: controlsRef.current.target.clone()
    };

    // restoreView의 target 방향으로 maxDistance만큼 떨어진 위치 계산
    const dir = new THREE.Vector3()
      .subVectors(view.position, view.target)
      .normalize();
    const zoomedOutPos = view.target.clone().add(dir.multiplyScalar(roomDepth / 2 - 1)); // maxDistance

    animateCamera(
      {
        position: zoomedOutPos,
        target: view.target.clone()
      },
      1.5,
      () => {
        setSelectedButton(null);
        setRestoreView(null);
      }
    );
  }, [selectedButton, restoreView, animateCamera, setSelectedButton]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleRestore();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRestore]);

  useEffect(() => {
    if (isHovered && buttonRef.current && buttonRef.current.parent) {
      // setOutlineReady(true);
    } else {
      // setOutlineReady(false);
    }
  }, [isHovered]);

  // 디지털디톡스 효과 트리거 함수
  const triggerPhoneEffect = useCallback(() => {
    if (phoneEffect.active) return; // 중복 방지
    setPhoneEffect({ active: true, showStupid: false, showText: true, flash: true, flashCount: 1 });
    // 경고음
    const sound = new window.Audio('/content/btn_f_phone/V.디지털디톡스/alert-sound.mp3');
    sound.play();
    // stay away 텍스트 6초간 노출
    phoneEffectTimeouts.current.push(setTimeout(() => setPhoneEffect(pe => ({ ...pe, showText: false })), 6000));
    // 붉은 플래시 3회
    for (let i = 1; i <= 3; i++) {
      phoneEffectTimeouts.current.push(setTimeout(() => setPhoneEffect(pe => ({ ...pe, flash: true, flashCount: i })), (i-1)*2000));
      phoneEffectTimeouts.current.push(setTimeout(() => setPhoneEffect(pe => ({ ...pe, flash: false })), (i-1)*2000+1000));
    }
    // 3초 후 StupidPhone 등장
    phoneEffectTimeouts.current.push(setTimeout(() => setPhoneEffect(pe => ({ ...pe, showStupid: true })), 3000));
    // 6초 후 리셋
    phoneEffectTimeouts.current.push(setTimeout(() => setPhoneEffect({ active: false, showStupid: false, showText: false, flash: false, flashCount: 0 }), 6000));
  }, [phoneEffect.active]);

  // btn_f_phone 클릭 핸들러에서 팝업 대신 triggerPhoneEffect 호출
  const handleButtonClick = useCallback((key) => {
    if (key === 'btn_c_lamp') {
      setIsLampOverlay(v => !v);
      return;
    }
    if (key === 'btn_f_phone') {
      triggerPhoneEffect();
      return;
    }
    setSelectedButton(key);
  }, [setSelectedButton, setIsLampOverlay, triggerPhoneEffect]);

  // 컴포넌트 언마운트 시 타임아웃 정리 및 메모리 정리
  React.useEffect(() => {
    return () => { 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const timeoutsRef = phoneEffectTimeouts.current;
      if (timeoutsRef && Array.isArray(timeoutsRef)) {
        timeoutsRef.forEach(clearTimeout);
        timeoutsRef.length = 0;
      }
      
      // 메모리 정리
      cleanupMemory();
    };
  }, [cleanupMemory]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div
        className="canvas-container"
        style={{
          width: '100vw',
          height: '100vh',
          cursor: isHovered ? `url(/images/cursor-click.png) 16 20, auto` : `url(/images/cursor.png) 16 20, auto`,
          position: 'relative',
          zIndex: 1,
          pointerEvents: selectedButton ? 'none' : 'auto',
        }}
      >
        <Canvas
          style={{
            width: '100vw',
            height: '100vh',
            display: 'block'
          }}
          dpr={tierSettings.dpr}
          shadows={tierSettings.shadows ? "soft" : false}
          gl={{
            antialias: tierSettings.antialias,
            powerPreference: 'low-power',
            clearColor: [0.1, 0.1, 0.1, 1],
            alpha: tierSettings.alpha,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false,
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE[tierSettings.toneMapping],
            toneMappingExposure: 1.0
          }}
          camera={{
            position: INITIAL_CAMERA_POSITION,
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          onCreated={({ camera, gl }) => {
            camera.lookAt(INITIAL_CAMERA_LOOKAT);
            camera.layers.enable(1);
            gl.setClearColor(0x1a1a1a, 1);
            
            // 렌더러 참조 저장
            rendererRef.current = gl;
            
            // 티어별 렌더러 설정 (안전한 방식으로)
            if (tierSettings.shadowMapSize > 0) {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              // setSize가 없는 경우를 대비한 안전한 처리
              if (gl.shadowMap.setSize) {
                gl.shadowMap.setSize(tierSettings.shadowMapSize, tierSettings.shadowMapSize);
              }
            } else {
              gl.shadowMap.enabled = false;
            }
            
            // 실시간 메모리 로그 (3초 간격)
            setInterval(() => {
              if (gl.info) {
                console.log(`📊 Memory [${currentTier}]: textures=${gl.info.memory.textures}, geometries=${gl.info.memory.geometries}, programs=${gl.info.programs}`);
              }
            }, 3000);
          }}
        >
          <OrbitControls
            ref={controlsRef}
            enableZoom={!isAnimating}
            enablePan={!isAnimating}
            enableRotate={!isAnimating}
            minDistance={10}
            maxDistance={roomWidth / 2 - 5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            target={INITIAL_CAMERA_LOOKAT}
            enableDamping={!isMobile}
            dampingFactor={0.05}
            rotateSpeed={isMobile ? -0.2 : -0.3}
            zoomSpeed={isMobile ? 0.8 : 1.0}
          />
          
          {/* 티어별 조명 시스템 */}
          {tierSettings.lighting.ambient && (
            <ambientLight intensity={1.5} color="#fff0e6" />
          )}
          
          {tierSettings.lighting.directional && (
            <directionalLight
              position={[0, roomHeight/2, 0]}
              intensity={1.8}
              color="#ffe4cc"
              castShadow={tierSettings.shadows}
            />
          )}
          
          {tierSettings.lighting.point && (
            <>
              <pointLight 
                position={[0, viewerHeight, -roomDepth/2 + 20]}
                intensity={1.5}
                distance={400}
                decay={2}
                color="#fff0e6"
                castShadow={tierSettings.shadows}
              />
              <pointLight 
                position={[0, viewerHeight, roomDepth/2 - 20]}
                intensity={1.5}
                distance={400}
                decay={2}
                color="#fff0e6"
                castShadow={tierSettings.shadows}
              />
            </>
          )}
          <Suspense fallback={null}>
            <Room
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              buttonRef={buttonRef}
              setHoveredObject={setHoveredObject}
              hoveredObject={hoveredObject}
              setSelectedButton={setSelectedButton}
              animateCamera={animateCamera}
              setIsLampOverlay={setIsLampOverlay}
              handleButtonClick={handleButtonClick}
              isLampOverlay={isLampOverlay}
            />
          </Suspense>
          {tierSettings.postProcessing && hoveredObject && buttonRef.current && buttonRef.current.getObjectByName(hoveredObject) && (
            <EffectComposer>
              <Outline
                selection={[buttonRef.current.getObjectByName(hoveredObject)]}
                edgeStrength={100}
                visibleEdgeColor={0x00ff00}
                hiddenEdgeColor={0x00ff00}
                blur
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>

      {selectedButton && (
        <ContentDisplay 
          buttonId={selectedButton}
          onClose={handleRestore}
        />
      )}

      {/* 디지털디톡스 효과 오버레이 */}
      {phoneEffect.active && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          pointerEvents: 'none',
        }}>
          {/* 휴대폰 아이콘 */}
          <img src="/content/btn_f_phone/V.디지털디톡스/phone-icon.png" alt="phone" style={{ position: 'absolute', top: phoneEffect.active ? '50%' : '80%', left: phoneEffect.active ? '50%' : '70%', width: phoneEffect.active ? (window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 210 : 300) : (window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 56 : 80), transform: 'translate(-50%, -50%) scale(' + (phoneEffect.active ? (window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 1.4 : 2) : (window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 0.7 : 1)) + ')', transition: 'top 1s, left 1s, transform 1s', zIndex: 2 }} />
          {/* StupidPhone */}
          <img src="/content/btn_f_phone/V.디지털디톡스/stupid-phone.png" alt="stupid" style={{ position: 'absolute', top: '50%', left: '50%', width: window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 210 : 300, transform: 'translate(-50%, -50%) scale(' + (window.innerWidth <= 900 && window.innerWidth > window.innerHeight ? 1.4 : 2) + ')', opacity: phoneEffect.showStupid ? 1 : 0, transition: 'opacity 1s', zIndex: 3 }} />
          {/* Stay Away 텍스트 */}
          <img src="/content/btn_f_phone/V.디지털디톡스/Stay away.png" alt="stay away" style={{ position: 'absolute', top: '50%', left: '50%', width: '60vw', transform: 'translate(-50%, -50%)', opacity: phoneEffect.showText ? 1 : 0, transition: 'opacity 0.5s', zIndex: 4 }} />
          {/* 붉은 플래시 */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', background: phoneEffect.flash ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,0)', transition: 'background 0.5s', zIndex: 5 }} />
        </div>
      )}
      {/* 조명 오버레이: 검정색 60% */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          opacity: isLampOverlay ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.4s',
          zIndex: 9999
        }}
      />
    </div>
  );
}