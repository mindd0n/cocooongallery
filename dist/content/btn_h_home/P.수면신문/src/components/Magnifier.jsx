import React, { useRef, useState, useEffect } from 'react';

const Magnifier = ({ src, width = 1000, zoom = 2.5, lensSize = 180 }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setNaturalSize({ width: img.width, height: img.height });
    };
  }, [src]);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const image = imgRef.current;
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = naturalSize.width / rect.width;
    const scaleY = naturalSize.height / rect.height;
    setLensPosition({
      x: x * scaleX,
      y: y * scaleY,
      screenX: x,
      screenY: y,
    });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // 반응형: 태블릿에서 이미지/렌즈 크기 축소
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
  const responsiveWidth = isTablet ? 600 : width;
  const responsiveLensSize = isTablet ? 120 : lensSize;

  // 커스텀 커서 스타일(돋보기)
  const cursorStyle = {
    cursor: 'none',
  };

  return (
    <div
      ref={containerRef}
      style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 0, 
        height: '100%', 
        width: '100%',
        overflow: 'hidden',
        ...cursorStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt="신문 이미지"
        style={{ 
          display: 'block', 
          margin: 0, 
          padding: 0, 
          width: 'auto',
          height: '90vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          objectFit: 'contain'
        }}
      />
      {showMagnifier && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: `${lensPosition.screenX + window.scrollX - responsiveLensSize / 2}px`,
            top: `${lensPosition.screenY + window.scrollY - responsiveLensSize / 2}px`,
            width: `${responsiveLensSize}px`,
            height: `${responsiveLensSize}px`,
            border: '3px solid #999',
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 10000,
            background: 'rgba(255,255,255,0.1)'
          }}
        >
          <img
            src={src}
            alt="확대 이미지"
            style={{
              position: 'absolute',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              left: `${-lensPosition.x * zoom + responsiveLensSize / 2}px`,
              top: `${-lensPosition.y * zoom + responsiveLensSize / 2}px`,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Magnifier;
