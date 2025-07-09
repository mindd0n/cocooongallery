/**
 * 성능 티어 감지 및 설정 유틸리티
 */

// RAM 정보를 가져오는 함수 (대략적인 추정)
const getEstimatedRAM = () => {
  // navigator.deviceMemory가 지원되는 경우 사용
  if (navigator.deviceMemory) {
    return navigator.deviceMemory;
  }
  
  // 지원되지 않는 경우 기기 정보로 추정
  const userAgent = navigator.userAgent.toLowerCase();
  
  // iOS 기기 추정
  if (/iphone|ipad|ipod/.test(userAgent)) {
    if (/iphone/.test(userAgent)) {
      // iPhone 모델별 RAM 추정
      if (/iphone.*os 17|iphone.*os 18/.test(userAgent)) return 6; // iPhone 15
      if (/iphone.*os 16/.test(userAgent)) return 4; // iPhone 14
      if (/iphone.*os 15/.test(userAgent)) return 4; // iPhone 13
      if (/iphone.*os 14/.test(userAgent)) return 3; // iPhone 12
      return 2; // 기본값
    }
    if (/ipad/.test(userAgent)) {
      return 4; // iPad는 보통 4GB 이상
    }
  }
  
  // Android 기기 추정
  if (/android/.test(userAgent)) {
    // 고급 기기
    if (/samsung.*galaxy.*s2[0-9]|samsung.*galaxy.*note.*2[0-9]/.test(userAgent)) return 8;
    if (/samsung.*galaxy.*s1[0-9]|samsung.*galaxy.*note.*1[0-9]/.test(userAgent)) return 6;
    if (/samsung.*galaxy.*s[0-9]|samsung.*galaxy.*note.*[0-9]/.test(userAgent)) return 4;
    
    // 중급 기기
    if (/xiaomi|huawei|oppo|vivo/.test(userAgent)) return 4;
    
    // 저급 기기
    return 2;
  }
  
  // 데스크탑/노트북
  if (!/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
    return 8; // 데스크탑은 보통 8GB 이상
  }
  
  return 2; // 기본값
};

/**
 * 성능 티어 결정
 * @returns {string} 'liteA', 'liteB', 또는 'full'
 */
export const detectPerformanceTier = () => {
  const ram = getEstimatedRAM();
  
  // iOS 특화 경량 옵션
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  if (isIOS && ram <= 2) {
    console.log('🍎 iOS 경량 모드 활성화');
    return 'liteA'; // iOS 저사양 기기는 무조건 liteA
  }
  
  if (ram <= 1) {
    return 'liteA';
  } else if (ram <= 2) {
    return 'liteB';
  } else {
    return 'full';
  }
};

/**
 * 티어별 설정 객체
 */
export const tierSettings = {
  liteA: {
    dpr: [1.0, 1.2],
    shadows: false,
    shadowMapSize: 0,
    antialias: false,
    toneMapping: 'NoToneMapping',
    alpha: false,
    postProcessing: false, // Post-processing 비활성화
    lighting: {
      ambient: true,
      directional: false,
      point: false,
      count: 1
    },
    textureQuality: 'lowest',
    maxTextureSize: 512
  },
  liteB: {
    dpr: [1.0, 1.5],
    shadows: true,
    shadowMapSize: 512,
    antialias: false,
    toneMapping: 'NoToneMapping',
    alpha: false,
    postProcessing: false, // Post-processing 비활성화
    lighting: {
      ambient: true,
      directional: true,
      point: false,
      count: 2
    },
    textureQuality: 'medium',
    maxTextureSize: 1024
  },
  full: {
    dpr: [1.0, 2.0],
    shadows: true,
    shadowMapSize: 1024,
    antialias: true,
    toneMapping: 'NoToneMapping',
    alpha: false,
    postProcessing: true, // Post-processing 활성화
    lighting: {
      ambient: true,
      directional: true,
      point: true,
      count: 4
    },
    textureQuality: 'high',
    maxTextureSize: 2048
  }
};

/**
 * 현재 티어 설정 가져오기
 * @returns {Object} 현재 티어의 설정 객체
 */
export const getCurrentTierSettings = () => {
  const tier = detectPerformanceTier();
  return { ...tierSettings[tier] }; // 객체 복사로 안정성 보장
};

/**
 * 디버그 모드 확인
 * @returns {boolean} 디버그 모드 여부
 */
export const isDebugMode = () => {
  return localStorage.getItem('debugMode') === 'true' || 
         window.location.search.includes('debug=true');
}; 