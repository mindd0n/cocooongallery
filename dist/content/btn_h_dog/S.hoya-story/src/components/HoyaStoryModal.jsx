import React, { useEffect, useRef, useState } from 'react';

const hoyaStories = [
  { type: 'video', src: './stories/1.MOV' },
  { type: 'video', src: './stories/2.MOV' },
  { type: 'image', src: './stories/3.jpg' },
  { type: 'video', src: './stories/4.MOV' },
  { type: 'image', src: './stories/5.jpg' },
  { type: 'video', src: './stories/6.MOV' },
  { type: 'video', src: './stories/7.MOV' },
];

export default function HoyaStoryModal({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(10000); // 기본 이미지 10초
  const progressRef = useRef([]);
  const timeoutRef = useRef(null);
  const videoRef = useRef(null);

  const current = hoyaStories[currentIndex];

  useEffect(() => {
    // reset progress animation
    progressRef.current.forEach((bar, i) => {
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = i < currentIndex ? '100%' : '0%';
        if (i === currentIndex) {
          requestAnimationFrame(() => {
            bar.style.transition = `width ${duration}ms linear`;
            bar.style.width = '100%';
          });
        }
      }
    });

    // 이미지일 경우: 10초 후 다음
    if (current.type === 'image') {
      setDuration(10000);
      timeoutRef.current = setTimeout(() => goNext(), 10000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, duration]);

  useEffect(() => {
    if (current.type === 'video' && videoRef.current) {
      const video = videoRef.current;

      const handleLoaded = () => {
        const videoDuration = video.duration * 1000;
        setDuration(videoDuration);
        timeoutRef.current = setTimeout(() => goNext(), videoDuration);
      };

      const handleEnded = () => goNext();

      video.addEventListener('loadedmetadata', handleLoaded);
      video.addEventListener('ended', handleEnded);

      video.play().catch(() => {}); // autoplay

      return () => {
        video.removeEventListener('loadedmetadata', handleLoaded);
        video.removeEventListener('ended', handleEnded);
        clearTimeout(timeoutRef.current);
      };
    }
  }, [currentIndex]);

  const goNext = () => {
    setCurrentIndex((prev) => {
      if (prev < hoyaStories.length - 1) {
        return prev + 1;
      } else {
        // 마지막 스토리일 때 부모 창에 메시지 전송
        if (window.parent) {
          window.parent.postMessage({ type: 'CLOSE_HOYA_STORY' }, '*');
        }
        return prev;
      }
    });
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.header}>
        <span style={styles.title}>호야와의 시간</span>
      </div>

      <div style={styles.progressBarWrapper}>
        {hoyaStories.map((_, idx) => (
          <div key={idx} style={styles.progressSegment}>
            <div
              ref={(el) => (progressRef.current[idx] = el)}
              style={styles.progressFill}
            />
          </div>
        ))}
      </div>

      <div style={styles.contentWrapper}>
        <div style={styles.clickLeft} onClick={goPrev} />
        <div style={styles.clickRight} onClick={goNext} />

        {current.type === 'image' ? (
          <img src={current.src} alt="hoya" style={styles.media} />
        ) : (
          <video
            ref={videoRef}
            src={current.src}
            style={styles.media}
            autoPlay
            playsInline
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 9999,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
    zIndex: 10,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  progressBarWrapper: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    height: 4,
    display: 'flex',
    gap: 4,
    zIndex: 10,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: '#444',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#fff',
    transition: 'width 0s',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  clickLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: 5,
    cursor: 'pointer',
  },
  clickRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: 5,
    cursor: 'pointer',
  },
};
