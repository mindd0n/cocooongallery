# Cocooon Gallery - 3D Interactive Exhibition

3D 웹 갤러리 프로젝트로, React와 Three.js를 기반으로 한 인터랙티브 전시 공간입니다.

## 성능 최적화 시스템

이 프로젝트는 3-Tier 성능 최적화 시스템을 구현하여 다양한 기기에서 최적의 성능을 제공합니다:

- **liteA**: 저사양 모바일 (≤1GB RAM)
- **liteB**: 중간 사양 모바일 (1~2GB RAM)  
- **full**: 고사양 기기 (>2GB RAM)

### 최종 QA 절차

배포 전 성능 검증을 위한 QA 절차입니다:

1. **빌드 및 프리뷰**
   ```bash
   npm run build && npm run preview
   ```

2. **자동 QA 테스트 실행**
   ```bash
   npm run qa
   ```
   - 각 티어별 성능 측정 (FPS, Draw Calls)
   - WebGL Context Lost 감지
   - 텍스처 큐 완료 확인
   - QA 스크립트는 자동으로 VITE_DEBUG_PERF=true로 빌드합니다

3. **중복 코드 검사**
   ```bash
   npm run check-dup
   ```
   - WebGL context lost 핸들러 중복 검사
   - 렌더러 리셋 중복 검사
   - useFrame/setState 중복 검사

3. **실기기 테스트**
   - Netlify branch URL에서 모바일/WiFi 실테스트
   - 실제 기기에서 성능 확인

### QA 기준

| 항목 | liteA | liteB | full |
|------|-------|-------|------|
| FPS | ≥ 25 | ≥ 30 | ≥ 50 |
| Draw Calls | ≤ 150 | ≤ 150 | ≤ 150 |
| Context Lost | ❌ 발생 안함 | ❌ 발생 안함 | ❌ 발생 안함 |
| 텍스처 큐 | ✅ 완료 | ✅ 완료 | ✅ 완료 |

### 디버그 모드

성능 모니터링을 위한 디버그 기능:

```bash
# Perf 위젯 표시
VITE_DEBUG_PERF=true npm start

# 디버그 모드 활성화
VITE_DEBUG_MODE=true npm start
```

## Available Scripts

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
  
 
 