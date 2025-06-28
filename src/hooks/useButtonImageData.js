import { useState, useEffect } from 'react';
import * as THREE from 'three';

// 벽/천장/바닥별 plane 전체를 꽉 채우는 크기 반환 (Room.jsx와 동일하게 맞춤)
const WALL_SIZES = {
  front:  [166.68, 150],   // roomWidth, roomHeight
  back:   [166.68, 150],   // roomWidth, roomHeight
  left:   [166.68, 150],   // roomWidth, roomHeight
  right:  [166.68, 150],   // roomWidth, roomHeight
};

// 로컬 경로를 S3 경로로 변환하는 함수
// const convertToS3Path = (localPath) => {
//   if (localPath.startsWith('http')) {
//     return localPath; // 이미 URL인 경우 그대로 반환
//   }
//   
//   // 로컬 경로에서 파일명 추출
//   const fileName = localPath.split('/').pop();
//   return `${S3_BASE_URL}/${fileName}`;
// };

export const useButtonImageData = (src, wallType) => {
  const [size, setSize] = useState([1, 1]);
  const [texture, setTexture] = useState(null);
  const [image, setImage] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // 로컬 경로 그대로 사용
    img.src = src;
    
    img.onload = () => {
      // plane 전체를 꽉 채우는 크기
      const size = WALL_SIZES[wallType] || [166.68, 150];
      setSize(size);
      // 텍스처 생성 (onError 핸들러 추가)
      const loader = new THREE.TextureLoader();
      loader.load(
        src,
        (newTexture) => {
          newTexture.minFilter = THREE.LinearFilter;
          newTexture.magFilter = THREE.LinearFilter;
          setTexture(newTexture);
        },
        undefined,
        (err) => {
          setTexture(null);
          console.error('THREE.TextureLoader 로딩 실패:', src, err);
        }
      );
      // 캔버스 생성
      const newCanvas = document.createElement('canvas');
      newCanvas.width = img.width;
      newCanvas.height = img.height;
      const ctx = newCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setCanvas(newCanvas);
      setImage(img);
      setReady(true);
    };

    img.onerror = () => {
      // 이미지 로딩 실패 시 안전하게 처리
      setReady(false);
      setTexture(null);
      setImage(null);
      setCanvas(null);
      console.error('이미지 로딩 실패:', src);
    };
  }, [src, wallType]);

  return [size, texture, image, canvas, ready];
}; 