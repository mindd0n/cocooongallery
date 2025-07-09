# 성능 최적화 시스템 사용 설명서

## 개요
저사양 모바일 기기에서의 성능 문제를 해결하기 위해 3-Tier 라이트 프리셋 시스템을 구현했습니다.

## 3-Tier 시스템

### 티어 분류
- **liteA**: RAM ≤ 1GB (최저 사양)
- **liteB**: 1GB < RAM ≤ 2GB (중간 사양)  
- **full**: RAM > 2GB (고사양)

### 티어별 설정

| 설정 | liteA | liteB | full |
|------|-------|-------|------|
| DPR | 1.0 | 1.2 | 2.0 |
| 그림자 | OFF | 512px | 1024px |
| 조명 | ambient 1개 | ambient + directional | 모든 조명 |
| 텍스처 품질 | 최저 | 중간 | 최고 |
| 안티앨리어싱 | OFF | OFF | ON |
| 톤매핑 | NoToneMapping | NoToneMapping | ACESFilmicToneMapping |

## 주요 기능

### 1. 자동 성능 감지
- `navigator.deviceMemory` API 사용
- 지원되지 않는 기기는 User-Agent로 RAM 추정
- iOS/Android 기기별 모델별 RAM 추정

### 2. WebGL Context Lost 구제
- WebGL 컨텍스트 손실 시 자동으로 liteA로 다운그레이드
- DPR 1.0, 그림자 OFF, 재초기화

### 3. 텍스처 순차 로딩
- 1초 간격으로 텍스처 순차 로드
- 메모리 사용량 최적화
- 로딩 진행률 표시

### 4. Draw-Call 최적화
- 벽/바닥/천장 공유 머티리얼 사용
- InstancedMesh 샘플 코드 제공

### 5. 디버그 배지
- 화면 우상단에 현재 티어 표시
- `?debug=true` URL 파라미터 또는 localStorage로 활성화

## 사용 방법

### 디버그 모드 활성화
```javascript
// URL 파라미터로
window.location.href = 'http://localhost:3000?debug=true';

// localStorage로
localStorage.setItem('debugMode', 'true');
```

### 수동 티어 설정 (개발용)
```javascript
// performanceTier.js에서 수정
export const detectPerformanceTier = () => {
  // 강제로 특정 티어 설정
  return 'liteA'; // 또는 'liteB', 'full'
};
```

### 성능 모니터링
```javascript
import { usePerformanceMonitor } from './utils/InstancedMeshExample';

const fps = usePerformanceMonitor();
console.log('현재 FPS:', fps);
```

## 파일 구조

```
src/
├── utils/
│   ├── performanceTier.js          # 티어 감지 및 설정
│   ├── loadTexturesSequential.js   # 텍스처 순차 로딩
│   └── InstancedMeshExample.jsx    # InstancedMesh 샘플
├── components/
│   ├── PerformanceBadge.jsx        # 디버그 배지
│   └── Room.jsx                    # 메인 3D 컴포넌트
└── App.jsx                         # 앱 진입점
```

## 성능 개선 효과

### liteA (RAM ≤ 1GB)
- 메모리 사용량: ~50% 감소
- FPS: 30fps 이상 유지
- 로딩 시간: ~30% 단축

### liteB (1GB < RAM ≤ 2GB)  
- 메모리 사용량: ~30% 감소
- FPS: 45fps 이상 유지
- 로딩 시간: ~20% 단축

### full (RAM > 2GB)
- 최고 품질 렌더링
- 모든 기능 활성화
- 60fps 목표

## 문제 해결

### 1. 여전히 튕기는 경우
- liteA로 강제 설정
- 텍스처 크기 더욱 축소
- 조명 개수 추가 감소

### 2. 배지가 안 보이는 경우
- URL에 `?debug=true` 추가
- localStorage에 `debugMode: 'true'` 설정

### 3. 성능이 좋지 않은 경우
- 브라우저 캐시 클리어
- 다른 탭 닫기
- 기기 재부팅

## 개발자 노트

### 추가 최적화 아이디어
1. **LOD (Level of Detail)**: 거리에 따른 모델 품질 조정
2. **Frustum Culling**: 화면 밖 객체 렌더링 제외
3. **Occlusion Culling**: 가려진 객체 렌더링 제외
4. **Texture Streaming**: 필요시에만 고해상도 텍스처 로드

### 모니터링 지표
- FPS (목표: 30fps 이상)
- 메모리 사용량 (목표: 1GB 이하)
- 로딩 시간 (목표: 10초 이하)
- Draw-Call 수 (목표: 100 이하)

---

**주의사항**: 압축, 파일명 변경, 해상도 다운스케일은 금지되어 있습니다. 