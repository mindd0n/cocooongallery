import * as THREE from 'three';

/**
 * 텍스처를 순차적으로 로드하는 유틸리티
 * @param {string[]} urlArray - 로드할 텍스처 URL 배열
 * @param {Function} onApply - 각 텍스처 로드 완료 시 호출될 콜백 (texture, index) => void
 * @param {number} interval - 로드 간격 (ms), 기본값 1000ms
 * @returns {Promise<void>} 모든 텍스처 로드 완료 시 resolve
 */
export const loadTexturesSequential = (urlArray, onApply, interval = 1000) => {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    let currentIndex = 0;
    const loadedTextures = [];

    const loadNext = () => {
      if (currentIndex >= urlArray.length) {
        // 텍스처 큐 완료 플래그 설정
        if (typeof window !== 'undefined') {
          window.__textureQueueEmpty = true;
        }
        resolve(loadedTextures);
        return;
      }

      const url = urlArray[currentIndex];
      const index = currentIndex;

      textureLoader.load(
        url,
        (texture) => {
          // 텍스처 최적화 설정
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          
          loadedTextures[index] = texture;
          
          // 콜백 호출
          if (onApply) {
            onApply(texture, index);
          }
          
          currentIndex++;
          
          // 다음 텍스처 로드 예약
          setTimeout(loadNext, interval);
        },
        undefined,
        (error) => {
          console.error(`텍스처 로드 실패: ${url}`, error);
          loadedTextures[index] = null;
          currentIndex++;
          setTimeout(loadNext, interval);
        }
      );
    };

    // 첫 번째 텍스처 로드 시작
    loadNext();
  });
};

/**
 * 성능 티어별 텍스처 품질 설정
 * @param {THREE.Texture} texture - 텍스처 객체
 * @param {string} tier - 성능 티어 ('liteA', 'liteB', 'full')
 */
export const applyTierTextureSettings = (texture, tier) => {
  switch (tier) {
    case 'liteA':
      // 최소 품질 설정
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      break;
    case 'liteB':
      // 중간 품질 설정
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      break;
    case 'full':
    default:
      // 최고 품질 설정
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      break;
  }
}; 