import React, { useEffect, useRef } from 'react';
import Magnifier from './Magnifier';
import newspaperImage from '../assets/IMG_0853.PNG';

const SleepNewspaperModal = ({ onClose }) => {
  const handleClose = () => {
    // 부모 창에 메시지 전송
    if (window.parent) {
      window.parent.postMessage('closeNewspaper', '*');
    }
    // 기존 onClose도 호출 (안전장치)
    if (onClose) {
      onClose();
    }
  };

  // 반응형: 태블릿에서 이미지/렌즈 크기 축소
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;

  // 모바일 가로모드 감지
  const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth > window.innerHeight && window.innerWidth <= 1024;

  // 모바일 세로모드 감지
  const isMobilePortrait = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerHeight >= window.innerWidth;

  const containerRef = useRef(null);

  // 태블릿에서 마운트 시 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (isTablet && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isTablet]);

  useEffect(() => {
    if (isMobileLandscape && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isMobileLandscape]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        overflow: 'hidden', // 스크롤 완전 제거
        maxHeight: '100vh',
        padding: 0,
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div style={{
        position: 'relative',
        height: isMobileLandscape ? '100vh' : '100vh',
        width: isMobileLandscape ? '100vw' : '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}>
        <Magnifier src={newspaperImage} width={isMobileLandscape ? window.innerWidth : 1000} lensSize={isMobileLandscape ? 90 : 180} />
      </div>
    </div>
  );
};

export default SleepNewspaperModal;
