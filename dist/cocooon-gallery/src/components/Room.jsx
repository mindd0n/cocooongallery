import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import ceiling from "/images/ceiling.png";
import floor from "/images/floor.png";
import wall1 from "/images/walls/wall1.png";
import wall2 from "/images/walls/wall2.png";
import wall3 from "/images/walls/wall3.png";
import wall4 from "/images/walls/wall4.png";

const roomWidth = 50;
const roomDepth = 50;
const roomHeight = 40;

function Room() {
  const loader = new THREE.TextureLoader();

  const loadTexture = (src) => {
    const texture = loader.load(src);
    texture.encoding = THREE.sRGBEncoding;
    return texture;
  };

  const floorTexture = loadTexture(floor);
  const ceilingTexture = loadTexture(ceiling);
  const wall1Texture = loadTexture(wall1);
  const wall2Texture = loadTexture(wall2);
  const wall3Texture = loadTexture(wall3);
  const wall4Texture = loadTexture(wall4);

  return (
    <group>
      <mesh position={[0, -roomHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshBasicMaterial map={floorTexture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, roomHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshBasicMaterial map={ceilingTexture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -roomDepth / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshBasicMaterial map={wall1Texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshBasicMaterial map={wall2Texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-roomWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshBasicMaterial map={wall3Texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[roomWidth / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshBasicMaterial map={wall4Texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Controls() {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => controls.current?.update());

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      rotateSpeed={0.6}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
    />
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/audio/bgm.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audio.play();
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }} style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Controls />
        <Room />
      </Canvas>

      {/* 아이콘 클릭 버튼 */}
      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 9999,
          width: "64px", // 이미지 크기에 맞게 조절
          height: "64px",
        }}
      >
        <img
          src={isPlaying ? "/icons/music-on.png" : "/icons/music-off.png"}
          alt="음악 아이콘"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none", // 이미지 자체에 이벤트 전달 방지
          }}
        />
      </button>
    </>
  );
} 