import React, { useEffect, useState } from 'react';
import PavilionContent from './content/PavilionContent.jsx';
import HomeContent from './content/HomeContent.jsx';

// S3 기본 URL
const S3_BASE_URL = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media';

const ContentMap = {
  // Pavilion
  'btn_p_pavilion': { type: 'custom' },
  'btn_p_note': { type: 'iframe', src: '/content/btn_p_note/dist/index.html' },
  'btn_p_tree': { type: 'custom' },
  'btn_p_go': { type: 'custom' },

  // Home
  'btn_h_dog': { type: 'iframe', src: '/content/btn_h_dog/S.hoya-story/dist/index.html' },
  'btn_h_star': { type: 'custom' },
  'btn_h_ribbon': { type: 'video', src: `${S3_BASE_URL}/R.mp4` },
  'btn_h_home': { type: 'custom' },

  // Bus-stop
  'btn_b_bus': { type: 'video', src: `${S3_BASE_URL}/i.mp4` },
  'btn_b_busstop': { type: 'video', src: `${S3_BASE_URL}/H.mp4` },
  'btn_b_home': { type: 'iframe', src: '/content/btn_b_home/j/index.html' },
  
  // Walk
  'btn_w_walk': { type: 'video', src: `${S3_BASE_URL}/L.mp4` },
  'btn_w_bridge': { type: 'video', src: `${S3_BASE_URL}/M.mp4` },
  'btn_w_sign': { type: 'video', src: `${S3_BASE_URL}/N.mp4` },
  'btn_w_sun': { type: 'custom' },

  // Ceiling
  'btn_c_lamp': { type: 'iframe', src: null },
  'btn_c_heart': { type: 'image', src: `${S3_BASE_URL}/U.PNG` },

  // Floor
  'btn_f_rug': { type: 'iframe', src: '/content/btn_f_rug/%EC%B0%B8%EC%97%AC%ED%98%95%20%ED%8E%98%EC%9D%B4%EC%A7%80/index.html' },
  'btn_f_phone': { type: 'iframe', src: '/content/btn_f_phone/V.%EB%94%94%EC%A7%80%ED%84%B8%EB%94%94%ED%86%A1%EC%8A%A4/index.html' },
};

const TreeContent = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ flex: 2, minHeight: 0 }}>
        <GenericContent 
          type='video' 
          src={`${S3_BASE_URL}/C.mp4`}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '1px', minHeight: 0 }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <GenericContent 
            type='image'
            src={`${S3_BASE_URL}/D.JPG`}
            objectFit='cover'
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <GenericContent 
            type='image'
            src={`${S3_BASE_URL}/E.JPG`}
            objectFit='cover'
          />
        </div>
      </div>
    </div>
  );
};

const StarContent = () => {
  console.log('StarContent rendering');
  
  useEffect(() => {
    // 컴포넌트가 마운트되면 바로 갤러리 준비
    setTimeout(() => {
      const section = document.getElementById("gallery");
      section?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const images = [
    `${S3_BASE_URL}/1.jpeg`,
    `${S3_BASE_URL}/2.JPEG`,
    `${S3_BASE_URL}/3.JPEG`,
    `${S3_BASE_URL}/4.JPEG`,
    `${S3_BASE_URL}/5.JPEG`,
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto',
      padding: '30px',
      zIndex: 15,
      position: 'relative'
    }}>
      <div id="gallery" style={{ 
        marginTop: '20px', 
        padding: '0 12px 50px 12px', 
        width: '100%',
        maxWidth: '500px',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        zIndex: 16,
        position: 'relative'
      }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`사진 ${index + 1}`}
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '6px',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              objectFit: 'contain',
              zIndex: 17,
              position: 'relative'
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SunContent = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 메인 이미지 */}
      <img 
        src="/content/btn_w_sun/k.PNG" 
        alt="Sun"
        className="sun-main-image"
        style={{
          width: '120%',
          height: '120%',
          objectFit: 'contain',
          position: 'absolute',
          top: '-40px',
          left: '-10%'
        }}
      />
      
      {/* Spotify 플레이리스트 - 후측 하단 */}
      <div 
        className="sun-playlist-container"
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '-20px',
          zIndex: 10,
          width: '300px',
          height: '152px'
        }}
      >
        <iframe 
          className="sun-playlist-iframe"
          style={{borderRadius: '12px'}} 
          src="https://open.spotify.com/embed/playlist/5jngExT7M9drt4yVZvrzQu?utm_source=generator" 
          width="100%" 
          height="152" 
          frameBorder="0" 
          allowFullScreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Playlist"
        />
      </div>
      
      <style jsx>{`
        .sun-main-image {
          width: 120%;
          height: 120%;
          object-fit: contain;
          position: absolute;
          top: -40px;
          left: -10%;
        }
        
        .sun-playlist-container {
          position: absolute;
          bottom: 100px;
          right: -20px;
          z-index: 10;
          width: 300px;
          height: 152px;
        }
        
        .sun-playlist-iframe {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

const GenericContent = ({ type, src, onClose, objectFit = 'contain', buttonId }) => {
  const baseStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    display: 'block'
  };

  switch (type) {
    case 'video':
      return (
        <video
          src={src}
          style={baseStyle}
          controls
          loop
          playsInline
        />
      );
    case 'iframe':
      return (
        <iframe
          src={src}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            minHeight: '600px'
          }}
          title={`Content for ${buttonId || 'unknown'}`}
        />
      );
    case 'image':
      return (
        <img src={src} style={{ ...baseStyle, objectFit: objectFit }} alt="content" />
      );
    default:
      return <div>Unsupported content type</div>;
  }
};

const ContentDisplay = ({ buttonId, onClose }) => {
  const [show, setShow] = useState(false);
  const contentInfo = ContentMap[buttonId];

  useEffect(() => {
    console.log('ContentDisplay useEffect:', { buttonId, contentInfo });
    if (buttonId && contentInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [buttonId, contentInfo]);

  const handleClose = (e) => {
    e.stopPropagation();
    setShow(false);
    onClose();
  };
  
  const handleWrapperClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!show || !contentInfo) {
    console.log('ContentDisplay not showing:', { show, contentInfo });
    return null;
  }

  console.log('ContentDisplay rendering:', { buttonId, contentInfo });

  return (
    <div 
      className="content-display"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleWrapperClick}
    >
      {/* btn_f_rug 전체화면 + 돌아가기 버튼 */}
      {buttonId === 'btn_f_rug' ? (
        <div style={{position:'relative',width:'100vw',height:'100vh',background:'transparent'}}>
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 32,
              zIndex: 1001,
              fontFamily: 'Pretendard, sans-serif',
              fontSize: 18,
              color: '#fff',
              background: 'rgba(0,0,0,0.0)',
              cursor: 'pointer',
              userSelect: 'none',
              letterSpacing: '-0.5px',
            }}
            onClick={onClose}
          >
            {'< 돌아가기'}
          </div>
          <iframe
            src={ContentMap[buttonId].src}
            style={{
              width: '100vw',
              height: '100vh',
              border: 'none',
              zIndex: 1000,
              background: 'transparent',
              display: 'block',
            }}
            title={buttonId}
            allowFullScreen
          />
        </div>
      ) : (
      <div
        onClick={handleContentClick}
        style={{
          position: 'relative',
          width: buttonId === 'btn_p_note' ? 'min(1200px, 99vw)' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '90vw' : 'auto'),
          height: buttonId === 'btn_p_note' ? 'min(800px, 90vh)' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '80vh' : 'auto'),
          maxWidth: buttonId === 'btn_p_note' ? undefined : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '1200px' : '98vw'),
          maxHeight: buttonId === 'btn_p_note' ? undefined : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '800px' : '98vh'),
          backgroundColor: buttonId === 'btn_p_note' ? 'transparent' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? 'rgba(0, 0, 0, 0.95)' : 'transparent'),
          backgroundImage: buttonId === 'btn_p_note' ? 'url(/content/popup/popup_bg.png)' : undefined,
          backgroundSize: buttonId === 'btn_p_note' ? 'cover' : undefined,
          backgroundPosition: buttonId === 'btn_p_note' ? 'center' : undefined,
          borderRadius: buttonId === 'btn_p_note' ? '8px' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '8px' : '0'),
        }}
      >
        {buttonId !== 'btn_p_note' && buttonId !== 'btn_h_star' && buttonId !== 'btn_h_dog' && (
          <img 
            src="/content/popup/popup_bg.png" 
            alt="Popup UI" 
            style={{ 
              display: 'block',
              width: 'auto',
              maxWidth: '98vw',
              maxHeight: '98vh',
              filter: 'brightness(1.3)' 
            }}
          />
        )}
        {buttonId !== 'btn_p_note' && buttonId !== 'btn_h_star' && buttonId !== 'btn_h_dog' && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.10)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: buttonId === 'btn_p_note' ? '0' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '0' : '2% 10% 10% 10%'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? 10 : 3,
            backgroundColor: 'transparent',
          }}
        >
          {(() => {
            if (buttonId === 'btn_p_go') {
              return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem' }}>
                  Go 버튼 인터랙티브 콘텐츠는 현재 지원되지 않습니다.
                </div>
              );
            } else if (buttonId === 'btn_p_pavilion') {
              return <PavilionContent />;
            } else if (buttonId === 'btn_h_home') {
              return <HomeContent />;
            } else if (buttonId === 'btn_p_tree') {
              return <TreeContent />;
            } else if (buttonId === 'btn_h_star') {
              return <StarContent />;
            } else if (buttonId === 'btn_w_sun') {
              return <SunContent />;
            } else if (buttonId === 'btn_p_note') {
              return (
                <iframe
                  src={ContentMap[buttonId].src}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    zIndex: 10,
                    position: 'relative',
                    background: 'transparent'
                  }}
                  title="diary"
                />
              );
            } else if (buttonId === 'btn_f_phone') {
              return (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 3000,
                  background: 'black',
                }}>
                  <button
                    onClick={onClose}
                    style={{
                      position: 'absolute',
                      top: window.innerWidth <= 768 ? '16px' : window.innerWidth >= 1024 ? '32px' : '24px',
                      left: window.innerWidth <= 768 ? '16px' : window.innerWidth >= 1024 ? '32px' : '24px',
                      zIndex: 3100,
                      background: 'none',
                      color: '#191F28',
                      border: 'none',
                      borderRadius: 0,
                      fontSize: window.innerWidth <= 480 ? '14px' : window.innerWidth <= 768 ? '16px' : window.innerWidth >= 1024 ? '20px' : '18px',
                      fontFamily: 'Pretendard, sans-serif',
                      fontWeight: 300,
                      padding: 0,
                      boxShadow: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      lineHeight: 1,
                    }}
                    aria-label="돌아가기"
                  >
                    〈 돌아가기
                  </button>
                  <iframe
                    src={ContentMap[buttonId].src}
                    style={{
                      width: '100vw',
                      height: '100vh',
                      border: 'none',
                      background: 'white',
                      zIndex: 3001,
                      display: 'block',
                    }}
                    title={buttonId}
                  />
                </div>
              );
            } else {
              return <GenericContent type={contentInfo.type} src={contentInfo.src} onClose={onClose} buttonId={buttonId} />;
            }
          })()}
        </div>
        <img 
          src="/content/popup/btn_back.png" 
          alt="Back button"
          className="back-button"
          style={{
            position:'absolute', 
            right: window.innerWidth <= 768 ? '3%' : window.innerWidth <= 1024 ? '2%' : '1%',
            bottom: window.innerWidth <= 768 ? '4%' : window.innerWidth <= 1024 ? '6%' : '8%',
            width: window.innerWidth <= 768 ? '60px' : window.innerWidth <= 1024 ? '80px' : '100px',
            height:'auto', 
            cursor:'pointer',
            zIndex: 2,
          }}
          onClick={handleClose}
        />
      </div>
      )}
    </div>
  );
};

export default ContentDisplay;