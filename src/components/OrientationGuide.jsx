import React, { useEffect, useState, useRef } from 'react';

const SWIPE_UP_ICON = (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="38" r="4" fill="#fff"/>
    <circle cx="30" cy="48" r="4" fill="#fff"/>
    <rect x="27" y="18" width="6" height="20" rx="3" fill="#fff"/>
    <path d="M30 10L38 18H22L30 10Z" fill="#fff"/>
  </svg>
);

export default function OrientationGuide() {
  const [orientation, setOrientation] = useState('landscape');
  const [showSwipeUp, setShowSwipeUp] = useState(false);
  const touchStartY = useRef(null);
  const touchMoved = useRef(false);

  useEffect(() => {
    function checkOrientation() {
      if (window.innerWidth > window.innerHeight) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    }
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // 가로모드 진입 시 Swipe Up 오버레이 1회 노출
  useEffect(() => {
    if (orientation === 'landscape') {
      setShowSwipeUp(true);
    }
  }, [orientation]);

  // 실제 스와이프 업(아래→위) 동작 감지
  function handleTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
      touchMoved.current = false;
    }
  }
  function handleTouchMove(e) {
    if (e.touches && e.touches.length === 1 && touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (deltaY > 50) {
        touchMoved.current = true;
      }
    }
  }
  function handleTouchEnd() {
    if (touchMoved.current) {
      setShowSwipeUp(false);
      // 주소창 숨기기 위해 실제 스크롤 발생
      document.body.style.minHeight = '200vh';
      window.scrollTo({ top: 100, behavior: 'smooth' });
      setTimeout(() => {
        document.body.style.minHeight = '100vh';
      }, 500);
    }
    touchStartY.current = null;
    touchMoved.current = false;
  }

  // 모바일 환경에서만 동작 (1024px 이하)
  if (window.innerWidth > 1024) return null;

  // 세로모드: 가로로 돌려달라는 오버레이
  if (orientation === 'portrait') {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.96)', color: '#fff', zIndex: 99999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, fontWeight: 'bold', textAlign: 'center',
      }}>
        <div style={{marginBottom: 24}}>더 넓은 화면을 위해<br/>휴대폰을 가로로 돌려주세요</div>
      </div>
    );
  }

  return null;
} 