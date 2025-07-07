import React from 'react';
import HTMLFlipBook from 'react-pageflip';

const diaryImages = Array.from({ length: 16 }, (_, i) => `./images/${i + 1}.jpg`);

export default function DiaryModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      <button style={styles.backButton} onClick={onClose}>Back</button>

      <HTMLFlipBook
        width={600}
        height={800}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        drawShadow={true}
        flippingTime={600}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={false}
        mobileScrollSupport={true}
        singlePage={true}
        style={{
          boxShadow: '0 0 30px rgba(0,0,0,0.6)',
          gap: '0px', // ✅ 간격 제거
        }}
      >
        {diaryImages.map((src, i) => (
          <div key={i} style={styles.page}>
            <img
              src={src}
              alt={`diary-${i + 1}`}
              style={styles.image}
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}

const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > window.innerHeight;
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: '3%',
    right: '3%',
    background: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    zIndex: 10000,
  },
  page: {
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,          // ✅ 혹시 모를 내부 여백 제거
    padding: 0,
  },
  image: {
    maxWidth: isMobileLandscape ? '80%' : '100%',
    maxHeight: isMobileLandscape ? '80%' : '100%',
    objectFit: 'contain',
    margin: 0,          // ✅ 이미지 간격도 없애기
    padding: 0,
  },
};
