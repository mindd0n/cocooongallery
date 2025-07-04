import React, { useEffect, useState, useRef, useCallback } from 'react';
import RoomScene from './components/Room';
import IntroScreen from './components/IntroScreen.jsx';
import LoadingScreen from './components/LoadingScreen';
import RightBottomControls from './components/RightBottomControls';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const audioRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState(null);

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
      audio.volume = start + change * progress;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        audio.volume = targetVolume;
      }
    }
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/x.waybackhome.mp4');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    if (isMusicOn && !selectedButton) {
      audioRef.current.play().catch(() => {});
      fadeVolume(0.6, 800); // 페이드인
    } else {
      fadeVolume(0, 800); // 페이드아웃
      setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, 800);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isMusicOn, selectedButton]);

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
    // setShowLoading(true);
    // setLoadingProgress(0);
  };

  // 인트로 종료 후 음악 자동 재생
  useEffect(() => {
    if (!showIntro && isMusicOn && audioRef.current) {
      audioRef.current.play().catch(() => {});
      fadeVolume(0.6, 800); // 인트로 끝나고도 페이드인
    }
  }, [showIntro, isMusicOn]);

  const handleLoadingComplete = () => {
    console.log('텍스처 로딩 완료, 3D 룸으로 전환');
    setShowLoading(false);
  };

  const handleLoadingProgress = (progress) => {
    setLoadingProgress(progress);
  };

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
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
  );
}

export default App;
