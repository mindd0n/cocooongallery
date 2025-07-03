import React, { useRef, useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import './styles.css';
import { useButtonImageData } from '../hooks/useButtonImageData';
import ContentDisplay from './ContentDisplay.jsx';
import gsap from 'gsap';

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
  polygonOffsetUnits
}) {
  const isHovered = hoveredObject === buttonKey;
  const [size, texture, image, canvas, ready] = useButtonImageData(isHovered ? hoverSrc : src, wallType);
  const meshRef = useRef();
  
  const handleDoubleClick = useCallback((e) => {
    // 모든 벽면 버튼 더블클릭 시 로그
    console.log(`벽면 버튼 더블클릭: ${buttonKey}`);
    if (!image || !texture || !canvas) return;
    const uv = e.uv;
    if (!uv) return;
    const x = Math.floor(uv.x * image.naturalWidth);
    const y = Math.floor((1 - uv.y) * image.naturalHeight);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const alpha = ctx.getImageData(x, y, 1, 1).data[3] / 255;
    if (alpha > 0.05) {
      e.stopPropagation();
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
  }, [position, image, texture, canvas, buttonKey, wallType, animateCamera, setHoveredObject, setSelectedButton]);

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
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, 0, 0]}
      renderOrder={10}
      onDoubleClick={handleDoubleClick}
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
  animateCamera
}) => {
  // useLoader로 벽 텍스처 로딩
  const frontTex = useLoader(THREE.TextureLoader, wallTexturePaths.front);
  const backTex = useLoader(THREE.TextureLoader, wallTexturePaths.back);
  const leftTex = useLoader(THREE.TextureLoader, wallTexturePaths.left);
  const rightTex = useLoader(THREE.TextureLoader, wallTexturePaths.right);
  const ceilingTex = useLoader(THREE.TextureLoader, wallTexturePaths.ceiling);
  const floorTex = useLoader(THREE.TextureLoader, wallTexturePaths.floor);
  
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

  // 텍스처 로딩 완료 시 상태 업데이트
  useEffect(() => {
    const checkTextureLoaded = (texture, key) => {
      console.log(`체크 중: ${key}`, texture);
      if (texture && texture.isTexture && texture.image) {
        console.log(`${key} 텍스처 이미지:`, texture.image.src, 'complete:', texture.image.complete);
        
        // 이미지가 완전히 로딩되었거나 로딩 중인 경우
        if (texture.image.complete && texture.image.naturalWidth > 0) {
          setTexturesLoaded(prev => {
            const newState = { ...prev, [key]: true };
            console.log(`${key} 텍스처 로딩 완료 - 상태 업데이트:`, newState);
            return newState;
          });
        } else {
          // 이미지 로딩 완료 이벤트 리스너 추가
          texture.image.onload = () => {
            console.log(`${key} 텍스처 onload 이벤트 발생`);
            setTexturesLoaded(prev => {
              const newState = { ...prev, [key]: true };
              console.log(`${key} 텍스처 로딩 완료 (onload) - 상태 업데이트:`, newState);
              return newState;
            });
          };
        }
      }
    };

    checkTextureLoaded(frontTex, 'front');
    checkTextureLoaded(backTex, 'back');
    checkTextureLoaded(leftTex, 'left');
    checkTextureLoaded(rightTex, 'right');
    checkTextureLoaded(ceilingTex, 'ceiling');
    checkTextureLoaded(floorTex, 'floor');
  }, [frontTex, backTex, leftTex, rightTex, ceilingTex, floorTex]);

  // wallButtonData를 로컬 경로로 변경
  const wallButtonData = {
    'front': [
      { key: 'btn_p_tree',     src: '/images/buttons/wall_photo_btn/btn_p_tree.png',     hoverSrc: '/images/buttons/wall_photo_btn/btn_p_tree_hover.png' },
      { key: 'btn_p_pavilion', src: '/images/buttons/wall_photo_btn/btn_p_pavilion.png', hoverSrc: '/images/buttons/wall_photo_btn/btn_p_pavilion_hover.png' },
      { key: 'btn_p_go',       src: '/images/buttons/wall_photo_btn/btn_p_go.png',       hoverSrc: '/images/buttons/wall_photo_btn/btn_p_go_hover.png' },
      { key: 'btn_p_note',     src: '/images/buttons/wall_photo_btn/btn_p_note.png',     hoverSrc: '/images/buttons/wall_photo_btn/btn_p_note_hover.png' }
    ],
    'back': [
      { key: 'btn_w_sun',    src: '/images/buttons/wall_walk_btn/btn_w_sun.png',    hoverSrc: '/images/buttons/wall_walk_btn/btn_w_sun_hover.png' },
      { key: 'btn_w_bridge', src: '/images/buttons/wall_walk_btn/btn_w_bridge.png', hoverSrc: '/images/buttons/wall_walk_btn/btn_w_bridge_hover.png' },
      { key: 'btn_w_walk',   src: '/images/buttons/wall_walk_btn/btn_w_walk.png',   hoverSrc: '/images/buttons/wall_walk_btn/btn_w_walk_hover.png' },
      { key: 'btn_w_sign',   src: '/images/buttons/wall_walk_btn/btn_w_sign.png',   hoverSrc: '/images/buttons/wall_walk_btn/btn_w_sign_hover.png' },
    ],
    'left': [
      { key: 'btn_b_home',    src: '/images/buttons/wall_bus-stop_btn/btn_b_home.png',    hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_home_hover.png' },
      { key: 'btn_b_busstop', src: '/images/buttons/wall_bus-stop_btn/btn_b_busstop.png', hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_busstop_hover.png' },
      { key: 'btn_b_bus',     src: '/images/buttons/wall_bus-stop_btn/btn_b_bus.png',     hoverSrc: '/images/buttons/wall_bus-stop_btn/btn_b_bus_hover.png' },
    ],
    'right': [
      { key: 'btn_h_star',   src: '/images/buttons/wall_home_btn/btn_h_star.png',   hoverSrc: '/images/buttons/wall_home_btn/btn_h_star_hover.png' },
      { key: 'btn_h_home',   src: '/images/buttons/wall_home_btn/btn_h_home.png',   hoverSrc: '/images/buttons/wall_home_btn/btn_h_home_hover.png' },
      { key: 'btn_h_dog',    src: '/images/buttons/wall_home_btn/btn_h_dog.png',    hoverSrc: '/images/buttons/wall_home_btn/btn_h_dog_hover.png' },
      { key: 'btn_h_ribbon', src: '/images/buttons/wall_home_btn/btn_h_ribbon.png', hoverSrc: '/images/buttons/wall_home_btn/btn_h_ribbon_hover.png' },
    ],
    'ceiling': [
      { key: 'btn_c_lamp',   src: '/images/buttons/wall_ceiling_btn/btn_c_lamp.png',   hoverSrc: '/images/buttons/wall_ceiling_btn/btn_c_lamp_hover.png', left: '38%', top: '18%', width: '8%', height: '8%' },
      { key: 'btn_c_heart',  src: '/images/buttons/wall_ceiling_btn/btn_c_heart.png',  hoverSrc: '/images/buttons/wall_ceiling_btn/btn_c_heart_hover.png', left: '60%', top: '28%', width: '10%', height: '10%' },
    ],
    'floor': [
      { key: 'btn_f_rug',    src: '/images/buttons/wall_floor_btn/btn_f_rug.png',    hoverSrc: '/images/buttons/wall_floor_btn/btn_f_rug_hover.png' },
      { key: 'btn_f_phone',  src: '/images/buttons/wall_floor_btn/btn_f_phone.png',  hoverSrc: '/images/buttons/wall_floor_btn/btn_f_phone_hover.png' },
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
      {/* 조명 추가 */}
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
          return (
            <group key={i} position={wall.pos} rotation={wall.rot}>
              <mesh
                name={`wall-${wall.type}`}
                visible={true}
                renderOrder={0}
                onPointerDown={() => console.log('벽 mesh 클릭됨', wall.type)}
              >
                <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
                <primitive object={material} />
              </mesh>
              {/* 벽 중앙에 버튼 추가: 반드시 wallButtonData[wall.type] 배열 map만 사용! */}
              {Array.isArray(wallButtonData[wall.type]) && wallButtonData[wall.type].map((btn, idx) => {
                let pos = [0, 0, 0.02];
                return (
                  <Button
                    key={btn.key}
                    type={`${wall.type}_btn_${idx}`}
                    buttonKey={btn.key}
                    position={pos}
                    src={btn.src}
                    hoverSrc={btn.src.replace(/\.png$/, '_hover.png')}
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
                  hoverSrc={btn.src.replace(/\.png$/, '_hover.png')}
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
                  hoverSrc={btn.src.replace(/\.png$/, '_hover.png')}
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
                />
              );
            })}
          </group>
        )}
      </group>
    </>
  );
};

export default function RoomScene({ onLoadingProgress, onLoadingComplete }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef();
  // const [outlineReady, setOutlineReady] = useState(false);
  // const [cursor, setCursor] = useState(`url(/images/cursor.png) 16 44, auto`);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const controlsRef = useRef();
  const [restoreView, setRestoreView] = useState(null);
  // const [texturesLoaded, setTexturesLoaded] = useState(false);

  // 기기별 성능 최적화 설정
  const isMobile = window.innerWidth < 768;
  const devicePixelRatio = isMobile ? [1, 1.5] : [1, 2];

  // 텍스처 로딩 상태 추적
  useEffect(() => {
    if (onLoadingProgress) {
      // 간단한 로딩 시뮬레이션 (실제로는 텍스처 로딩 상태를 추적해야 함)
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // setTexturesLoaded(true);
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
  }, [selectedButton, restoreView, animateCamera]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleRestore();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRestore]);

  // const handleOverlayClick = handleRestore;

  useEffect(() => {
    if (isHovered && buttonRef.current && buttonRef.current.parent) {
      // setOutlineReady(true);
    } else {
      // setOutlineReady(false);
    }
  }, [isHovered]);

  // 텍스처가 로딩되지 않았으면 아무것도 렌더링하지 않음
  // if (!texturesLoaded) {
  //   return null;
  // }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div
        className="canvas-container"
        style={{
          width: '100%',
          height: '100%',
          cursor: isHovered ? `url(/images/cursor-click.png) 16 44, auto` : `url(/images/cursor.png) 16 44, auto`,
          position: 'relative',
          zIndex: 1,
          pointerEvents: selectedButton ? 'none' : 'auto',
        }}
      >
        <Canvas
          dpr={devicePixelRatio}
          shadows="soft"
          gl={{
            antialias: !isMobile,
            powerPreference: 'high-performance',
            clearColor: [0.1, 0.1, 0.1, 1],
            alpha: false,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false
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
            if (isMobile) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }
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
          <Suspense fallback={null}>
            <Room
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              buttonRef={buttonRef}
              setHoveredObject={setHoveredObject}
              hoveredObject={hoveredObject}
              setSelectedButton={setSelectedButton}
              animateCamera={animateCamera}
            />
          </Suspense>
          {hoveredObject && buttonRef.current && buttonRef.current.getObjectByName(hoveredObject) && (
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
    </div>
  );
}