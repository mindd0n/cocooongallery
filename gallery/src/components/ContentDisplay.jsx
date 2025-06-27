import React, { useEffect, useState } from 'react';
import PavilionContent from './content/PavilionContent.jsx';
import HomeContent from './content/HomeContent.jsx';
import './ContentDisplay.css';
import { Canvas } from '@react-three/fiber';
import InteractiveGoButton from './InteractiveGoButton.jsx';

// 비디오 팝업 컴포넌트
const VideoPopup = ({ videoSrc, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '80vw',
          height: '80vh',
          maxWidth: '1200px',
          maxHeight: '800px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            background: 'white',
            color: 'black',
            border: '2px solid #333',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 2001,
          }}
        >
          X
        </button>
        <video
          src={videoSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          controls
          loop
          playsInline
        />
      </div>
    </div>
  );
};

const ContentMap = {
  // Pavilion
  'btn_p_pavilion': { type: 'custom' },
  'btn_p_note': { type: 'iframe', src: '/content/btn_p_note/dist/index.html' },
  'btn_p_tree': { type: 'custom' },
  'btn_p_go': { type: 'custom' },

  // Home
  'btn_h_dog': { type: 'iframe', src: '/content/btn_h_dog/S.hoya-story/dist/index.html' },
  'btn_h_star': { type: 'custom' },
  'btn_h_ribbon': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/R.mp4' },
  'btn_h_home': { type: 'custom' },

  // Bus-stop
  'btn_b_bus': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/i.mp4' },
  'btn_b_busstop': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/H.mp4' },
  'btn_b_home': { type: 'iframe', src: '/content/btn_b_home/j/index.html' },
  
  // Walk
  'btn_w_walk': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/L.mp4' },
  'btn_w_bridge': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/M.mp4' },
  'btn_w_sign': { type: 'video', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/N.mp4' },
  'btn_w_sun': { type: 'custom' },

  // Ceiling
  'btn_c_lamp': { type: 'iframe', src: null },
  'btn_c_heart': { type: 'image', src: 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/U.PNG' },

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
          src='https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/C.mp4' 
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '1px', minHeight: 0 }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <GenericContent 
            type='image'
            src='https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/D.JPG'
            objectFit='cover'
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <GenericContent 
            type='image'
            src='https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/E.JPG'
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
    "https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/1.jpeg",
    "https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/2.JPEG",
    "https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/3.JPEG",
    "https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/4.JPEG",
    "https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/5.JPEG",
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

const GenericContent = ({ type, src, onClose, objectFit = 'contain' }) => {
  const baseStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
  };

  switch (type) {
    case 'video':
      return (
        <video 
          src={src} 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain' 
          }} 
          controls loop playsInline 
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
            minHeight: '500px',
            backgroundColor: 'transparent',
            zIndex: 15,
            position: 'relative'
          }} 
          title="Content" 
        />
      );
    case 'image':
      return (
        <img src={src} style={{ ...baseStyle, objectFit: objectFit }} alt="Content" />
      );
    default:
      return <div>Unsupported content type</div>;
  }
};

const ContentDisplay = ({ buttonId, onClose }) => {
  const [show, setShow] = useState(false);
  const [showVideoA, setShowVideoA] = useState(false);
  const [showVideoB, setShowVideoB] = useState(false);
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
      e.stopPropagation();
      handleClose(e);
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
    <>
      <div 
        onClick={handleWrapperClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          cursor: 'default',
        }}
      >
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
                  <Canvas style={{ width: '100%', height: '100%', background: 'transparent' }} camera={{ position: [0, 0, 15], fov: 50 }}>
                    <ambientLight intensity={1.2} />
                    <InteractiveGoButton 
                      position={[0, 0, 0]} 
                      onVideoAOpen={() => setShowVideoA(true)}
                      onVideoBOpen={() => setShowVideoB(true)}
                    />
                  </Canvas>
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
              } else if (buttonId === 'btn_f_rug') {
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
                        top: '24px',
                        left: '24px',
                        zIndex: 3100,
                        background: 'none',
                        color: '#191F28',
                        border: 'none',
                        borderRadius: 0,
                        fontSize: '18px',
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
                    <style jsx>{`
                      @media (max-width: 768px) {
                        button {
                          top: 16px !important;
                          left: 16px !important;
                          font-size: 16px !important;
                        }
                      }
                      @media (max-width: 480px) {
                        button {
                          top: 12px !important;
                          left: 12px !important;
                          font-size: 14px !important;
                        }
                      }
                      @media (min-width: 1024px) {
                        button {
                          top: 32px !important;
                          left: 32px !important;
                          font-size: 20px !important;
                        }
                      }
                    `}</style>
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
                        top: '24px',
                        left: '24px',
                        zIndex: 3100,
                        background: 'none',
                        color: '#191F28',
                        border: 'none',
                        borderRadius: 0,
                        fontSize: '18px',
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
                    <style jsx>{`
                      @media (max-width: 768px) {
                        button {
                          top: 16px !important;
                          left: 16px !important;
                          font-size: 16px !important;
                        }
                      }
                      @media (max-width: 480px) {
                        button {
                          top: 12px !important;
                          left: 12px !important;
                          font-size: 14px !important;
                        }
                      }
                      @media (min-width: 1024px) {
                        button {
                          top: 32px !important;
                          left: 32px !important;
                          font-size: 20px !important;
                        }
                      }
                    `}</style>
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
                return <GenericContent type={contentInfo.type} src={contentInfo.src} onClose={onClose} />;
              }
            })()}
          </div>
          <img 
            src="/content/popup/btn_back.png" 
            alt="Back button"
            className="back-button"
            style={{
              position:'absolute', 
              right:'1%',
              bottom:'8%',
              width:'100px',
              height:'auto', 
              cursor:'pointer',
              zIndex: 2,
            }}
            onClick={handleClose}
          />
          
          <style jsx>{`
            .back-button {
              position: absolute;
              right: 1%;
              bottom: 8%;
              width: 100px;
              height: auto;
              cursor: pointer;
              z-index: 2;
            }
            
            @media (max-width: 1024px) {
              .back-button {
                width: 80px;
                right: 2%;
                bottom: 6%;
              }
            }
            
            @media (max-width: 768px) {
              .back-button {
                width: 60px;
                right: 3%;
                bottom: 4%;
              }
            }
          `}</style>
        </div>
      </div>
      
      {/* 비디오 팝업들 */}
      {showVideoA && (
        <VideoPopup
          videoSrc="https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/A.mp4"
          onClose={() => setShowVideoA(false)}
        />
      )}
      {showVideoB && (
        <VideoPopup
          videoSrc="https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/B.mp4"
          onClose={() => setShowVideoB(false)}
        />
      )}
    </>
  );
};

export default ContentDisplay;