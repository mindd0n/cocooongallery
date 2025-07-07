import React, { useEffect, useState, useRef } from 'react';
import RoomScene from './components/Room';
import IntroScreen from './components/IntroScreen.jsx';
import LoadingScreen from './components/LoadingScreen';
import RightBottomControls from './components/RightBottomControls';
import OrientationGuide from './components/OrientationGuide';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const audioRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  console.log('App 렌더링:', { showIntro, showLoading, loadingProgress });

  // 볼륨 페이드 함수
  const fadeVolume = (targetVolume, duration = 800) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const start = audio.volume;
    const change = targetVolume - start;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVolume = start + change * progress;
      // 볼륨을 0과 1 사이로 제한
      audio.volume = Math.max(0, Math.min(1, newVolume));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 최종 볼륨도 제한
        audio.volume = Math.max(0, Math.min(1, targetVolume));
      }
    }
    requestAnimationFrame(animate);
  };

  // 음악 play 함수 (엔터 버튼 클릭 시에만 호출)
  const playMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/x.waybackhome.mp4');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    // 이미 재생 중이면 중복 재생하지 않음
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      fadeVolume(0.6, 800);
    }
  };

  // 음악 끄기/볼륨 페이드아웃만 관리 (자동재생 제거)
  useEffect(() => {
    if (!audioRef.current) return;
    if (!isMusicOn || showIntro) {
      fadeVolume(0, 800);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, 800);
    } else if (!selectedButton) {
      // 팝업창이 닫혔을 때 음악 재생 복구
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
        fadeVolume(0.6, 800);
      }
    } else if (selectedButton) {
      // 팝업창이 열려있을 때 음악 일시 중단
      fadeVolume(0, 800);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, 800);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isMusicOn, selectedButton, showIntro]);

  useEffect(() => {
    const handlePointerDown = () => {
      document.body.style.cursor = "url('/images/cursor-click.png') 16 20, auto";
    };
    const handlePointerUp = () => {
      document.body.style.cursor = "url('/images/cursor.png') 16 20, auto";
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.body.style.cursor = "url('/images/cursor.png') 16 20, auto";
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleIntroComplete = () => {
    console.log('인트로 완료, 바로 3D 룸으로 전환');
    setShowIntro(false);
    playMusic(); // 엔터 버튼 클릭 시점에만 음악 재생
    // setShowLoading(true);
    // setLoadingProgress(0);
  };

  const handleLoadingComplete = () => {
    console.log('텍스처 로딩 완료, 3D 룸으로 전환');
    setShowLoading(false);
  };

  const handleLoadingProgress = (progress) => {
    setLoadingProgress(progress);
  };

  useEffect(() => {
    function checkOrientation() {
      const next = window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
      setIsMobileLandscape(prev => (prev !== next ? next : prev));
    }
    // 최초 1회만 실행
    checkOrientation();
    // 모바일에서만 이벤트 등록
    if (window.innerWidth <= 1024) {
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);
      return () => {
        window.removeEventListener('resize', checkOrientation);
        window.removeEventListener('orientationchange', checkOrientation);
      };
    }
  }, []);

  if (showIntro) {
    console.log('IntroScreen 렌더링 중...');
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  if (showLoading) {
    console.log('LoadingScreen 렌더링 중...');
    return <LoadingScreen progress={loadingProgress} message="텍스처 로딩 중..." />;
  }

  console.log('RoomScene 렌더링 중...');
  return (
    <>
      <OrientationGuide />
      <div
        style={isMobileLandscape ? {
          minHeight: '100vh',
          height: 'auto',
          width: '100vw',
          position: 'relative',
          overflow: 'visible',
        } : {
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <RoomScene 
          onLoadingProgress={handleLoadingProgress}
          onLoadingComplete={handleLoadingComplete}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
        <RightBottomControls 
          isMusicOn={isMusicOn}
          setIsMusicOn={setIsMusicOn}
          audioRef={audioRef}
        />
      </div>
    </>
  );
}

export default App;
