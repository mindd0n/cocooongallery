import React, { useEffect, useState, useRef, useMemo } from 'react';
import PavilionContent from './content/PavilionContent.jsx';
import HomeContent from './content/HomeContent.jsx';

// 투명 영역 클릭 방지: 클릭 위치 알파값 체크 함수 (항상 최상단)
function isImagePixelOpaque(img, x, y) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return pixel[3] >= 10; // 알파값 10 이상만 클릭 허용
}

function handleIconClick(e, iconId) {
  e.stopPropagation();
  const img = e.target;
  const rect = img.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) * (img.naturalWidth / rect.width));
  const y = Math.round((e.clientY - rect.top) * (img.naturalHeight / rect.height));
  if (!isImagePixelOpaque(img, x, y)) return;
  alert(`${iconId} 버튼 클릭!`);
}

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
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      overflow: 'hidden',
      background: 'transparent',
      maxHeight: '100%',
      justifyContent: 'flex-start',
    }}>
      <div style={{ 
        flex: '0 0 auto', 
        minHeight: 0, 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '0',
        marginBottom: '9px',
        paddingTop: '32px',
      }}>
        <div style={{
          width: 'min(700px, 90vw)',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          borderRadius: '8px',
          overflow: 'hidden',
          maxWidth: '100%',
          maxHeight: '60vh',
          paddingTop: '32px',
          marginTop: '24px',
        }}>
          <GenericContent 
            type='video' 
            src={`${S3_BASE_URL}/C.mp4`}
          />
        </div>
      </div>
      <div style={{ 
        flex: '0 0 auto', 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '1px', 
        minHeight: 0, 
        marginBottom: 52,
        width: 'min(700px, 90vw)',
        maxWidth: '100%',
        maxHeight: '30vh',
        overflow: 'hidden',
        paddingTop: '0',
      }}>
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
      backgroundColor: 'white',
      color: 'black',
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
              maxHeight: '60vh',
              height: 'auto',
              borderRadius: '6px',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              objectFit: 'contain',
              zIndex: 17,
              position: 'relative',
              overflow: 'hidden',
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
      
      {/* Spotify 플레이리스트 - 위치 조정: bottom/right 값 변경 */}
      <div 
        className="sun-playlist-container"
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '-40px',
          zIndex: 10,
          width: '300px',
          height: '152px'
        }}
      >
        <iframe 
          className="sun-playlist-iframe"
          style={{borderRadius: '12px', width: '300px', height: '152px'}} 
          src="https://open.spotify.com/embed/playlist/5jngExT7M9drt4yVZvrzQu?utm_source=generator" 
          width="100%" 
          height="100%" 
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
          bottom: 40px;
          right: -40px;
          zIndex: 10;
          width: 300px;
          height: 152px;
        }
        
        .sun-playlist-iframe {
          border-radius: 12px;
          width: 300px;
          height: 152px;
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

  // 커스텀 비디오 컨트롤 상태
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => setCurrent(video.currentTime);
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', () => setDuration(video.duration));
    return () => {
      video.removeEventListener('timeupdate', update);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const formatTime = (t) => {
    if (!t) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  switch (type) {
    case 'video':
      return (
        <video
          ref={videoRef}
          src={src}
          style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: 'black', borderRadius: 8 }}
          loop
          playsInline
          controls
          controlsList="nodownload"
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
        <img src={src} style={{ ...baseStyle, objectFit: objectFit, maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', overflow: 'hidden' }} alt="content" />
      );
    default:
      return <div>Unsupported content type</div>;
  }
};

// icon_a, icon_b 픽셀 데이터 저장용 ref
const goImageDataRef = { current: { icon_a: null, icon_b: null } };

// icon_a, icon_b 클릭 polygon (1000x1000 기준, 임의 근사)
const iconARegion = [
  [180,180],[400,120],[600,180],[750,350],[750,600],[600,800],[400,880],[180,800],[120,600],[120,350]
];
const iconBRegion = [
  [600,200],[800,120],[950,400],[900,800],[700,900],[600,700],[550,500],[600,300]
];

// 점이 polygon 내부에 있는지 판정 (ray-casting 알고리즘)
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const ContentDisplay = ({ buttonId, onClose }) => {
  const [show, setShow] = useState(false);
  const [showGoVideo, setShowGoVideo] = useState(false);
  const [showBVideo, setShowBVideo] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const contentInfo = ContentMap[buttonId];
  // go 팝업 아이콘 ref는 항상 선언
  const iconARef = useRef(null);
  const iconBRef = useRef(null);
  // 이미지 onLoad 시 픽셀 데이터 추출 함수도 항상 선언
  const handleGoIconLoad = (iconId, ref) => {
    const img = ref.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
      goImageDataRef.current[iconId] = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;
    } catch (e) {
      goImageDataRef.current[iconId] = null;
    }
  };



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
    // 정자 팝업일 때는 바깥 클릭 시 바로 닫기 (popup_bg 중첩 방지)
    if (e.target === e.currentTarget) {
      if (buttonId === 'btn_p_pavilion') {
        onClose();
      } else {
        onClose();
      }
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

  if (buttonId === 'btn_p_go') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            width: '80vw',
            aspectRatio: '16/9',
            maxWidth: '1200px',
            maxHeight: '80vh',
            background: `url('/content/btn_p_go/배경.png') center/contain no-repeat`,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'block',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 아이콘들 - 통합 클릭 처리 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 3
            }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // icon_a와 icon_b 모두 확인
              const iconA = iconARef.current;
              const iconB = iconBRef.current;
              
              if (iconA) {
                const imgAX = Math.round((x) * (iconA.naturalWidth / rect.width));
                const imgAY = Math.round((y) * (iconA.naturalHeight / rect.height));
                
                if (isImagePixelOpaque(iconA, imgAX, imgAY)) {
                  setHoveredIcon('icon_a');
                  return;
                }
              }
              
              if (iconB) {
                const imgBX = Math.round((x) * (iconB.naturalWidth / rect.width));
                const imgBY = Math.round((y) * (iconB.naturalHeight / rect.height));
                
                if (isImagePixelOpaque(iconB, imgBX, imgBY)) {
                  setHoveredIcon('icon_b');
                  return;
                }
              }
              
              setHoveredIcon(null);
            }}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={e => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // icon_a와 icon_b 모두 확인
              const iconA = iconARef.current;
              const iconB = iconBRef.current;
              
              if (iconA) {
                const imgARect = iconA.getBoundingClientRect();
                const imgAX = Math.round((x) * (iconA.naturalWidth / rect.width));
                const imgAY = Math.round((y) * (iconA.naturalHeight / rect.height));
                
                if (isImagePixelOpaque(iconA, imgAX, imgAY)) {
                  console.log('Icon A click accepted');
                  setShowGoVideo(true);
                  return;
                }
              }
              
              if (iconB) {
                const imgBRect = iconB.getBoundingClientRect();
                const imgBX = Math.round((x) * (iconB.naturalWidth / rect.width));
                const imgBY = Math.round((y) * (iconB.naturalHeight / rect.height));
                
                if (isImagePixelOpaque(iconB, imgBX, imgBY)) {
                  console.log('Icon B click accepted');
                  setShowBVideo(true);
                  return;
                }
              }
              
              console.log('Click rejected - transparent pixel on both icons');
            }}
          >
            <img
              src={'/content/btn_p_go/icon_a.png'}
              alt="A 버튼"
              ref={iconARef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: 1,
                transition: 'transform 0.2s ease-in-out',
                transform: hoveredIcon === 'icon_a' ? 'scale(1.1)' : 'scale(1)'
              }}
              onLoad={() => handleGoIconLoad('icon_a', iconARef)}
            />
            <img
              src={'/content/btn_p_go/icon_b.png'}
              alt="B 버튼"
              ref={iconBRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: 2,
                transition: 'transform 0.2s ease-in-out',
                transform: hoveredIcon === 'icon_b' ? 'scale(1.1)' : 'scale(1)'
              }}
              onLoad={() => handleGoIconLoad('icon_b', iconBRef)}
            />
          </div>
          {/* icon_a 클릭 시 A 영상 오버레이 */}
          {showGoVideo && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.85)',
                zIndex: 4000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowGoVideo(false)}
            >
              <div
                style={{
                  position: 'relative',
                  width: 'min(900px,80vw)',
                  aspectRatio: '16/9',
                  background: 'black',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={e => e.stopPropagation()}
              >
                <GenericContent type="video" src={`${S3_BASE_URL}/A.mp4`} />
              </div>
            </div>
          )}
          
          {/* icon_b 클릭 시 B 영상 오버레이 */}
          {showBVideo && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.85)',
                zIndex: 4000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowBVideo(false)}
            >
              <div
                style={{
                  position: 'relative',
                  width: 'min(900px,80vw)',
                  aspectRatio: '16/9',
                  background: 'black',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={e => e.stopPropagation()}
              >
                <GenericContent type="video" src={`${S3_BASE_URL}/B.mp4`} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (buttonId === 'btn_b_home') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '88vw',
            height: '85vh',
            maxWidth: '1500px',
            maxHeight: '950px',
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
          onClick={e => e.stopPropagation()}
        >
          <iframe
            src={ContentMap[buttonId].src}
            style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
            title="b_home"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="content-display"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          backgroundColor: buttonId === 'btn_p_note' ? 'transparent' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? 'rgba(0, 0, 0, 0.95)' : 'transparent'),
          backgroundImage: (buttonId === 'btn_p_note' && buttonId !== 'btn_b_home') ? 'url(/content/popup/popup_bg.png)' : undefined,
          backgroundSize: (buttonId === 'btn_p_note' && buttonId !== 'btn_b_home') ? 'cover' : undefined,
          backgroundPosition: (buttonId === 'btn_p_note' && buttonId !== 'btn_b_home') ? 'center' : undefined,
          borderRadius: buttonId === 'btn_p_note' ? '8px' : (buttonId === 'btn_h_dog' || buttonId === 'btn_h_star' ? '8px' : '0'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
            if (buttonId === 'btn_p_pavilion') {
              return <PavilionContent onClose={onClose} noImageStyle />;
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
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
                </div>
              );
            } else if (buttonId === 'btn_h_dog') {
              // 강아지 버튼은 iframe으로 연결
              return (
                <iframe
                  src={ContentMap[buttonId].src}
                  style={{ width: '100%', height: '100%', border: 'none', background: 'black' }}
                  title="hoya-story"
                  allowFullScreen
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
            } else if (buttonId === 'btn_h_ribbon') {
              // 리본(R.mp4) 영상: 팝업창의 63% 크기, 영상 약간 아래로(marginTop)
              return (
                <video
                  src={ContentMap[buttonId].src}
                  style={{ width: '63vw', height: '63vh', maxWidth: '63vw', maxHeight: '63vh', objectFit: 'contain', display: 'block', background: 'none', borderRadius: 8, marginTop: '4vh' }}
                  loop
                  playsInline
                  controls
                  controlsList="nodownload"
                />
              );
            } else if (buttonId === 'btn_w_bridge') {
              // 다리 아이콘: 영상 위치를 조금 더 아래로(marginTop: 8vh)
              return (
                <video
                  src={ContentMap[buttonId].src}
                  style={{ width: '55vw', height: '55vh', maxWidth: '55vw', maxHeight: '55vh', objectFit: 'contain', display: 'block', background: 'none', borderRadius: 8, marginTop: '8vh' }}
                  loop
                  playsInline
                  controls
                  controlsList="nodownload"
                />
              );
            } else if (buttonId === 'btn_w_walk' || buttonId === 'btn_w_sign') {
              // 산책, 표지판 아이콘: 다리 아이콘과 동일한 영상 스타일 적용
              return (
                <video
                  src={ContentMap[buttonId].src}
                  style={{ width: '55vw', height: '55vh', maxWidth: '55vw', maxHeight: '55vh', objectFit: 'contain', display: 'block', background: 'none', borderRadius: 8, marginTop: '8vh' }}
                  loop
                  playsInline
                  controls
                  controlsList="nodownload"
                />
              );
            } else if (buttonId === 'btn_b_bus' || buttonId === 'btn_b_busstop') {
              // 버스, 버스정류장 아이콘: 다리/산책/표지판과 동일한 영상 스타일 적용
              return (
                <video
                  src={ContentMap[buttonId].src}
                  style={{ width: '55vw', height: '55vh', maxWidth: '55vw', maxHeight: '55vh', objectFit: 'contain', display: 'block', background: 'none', borderRadius: 8, marginTop: '8vh' }}
                  loop
                  playsInline
                  controls
                  controlsList="nodownload"
                />
              );
            } else if (buttonId === 'btn_c_heart') {
              return <img src={ContentMap[buttonId].src} alt="하트" style={{ width: '100vw', height: '100vh', objectFit: 'contain', display: 'block', marginTop: '6vh' }} />;
            } else {
              return <GenericContent type={contentInfo.type} src={contentInfo.src} onClose={onClose} buttonId={buttonId} />;
            }
          })()}
        </div>
        {/* btn_b_home일 때는 popup_bg.png 중첩 이미지도 절대 렌더링 X */}
        {buttonId !== 'btn_p_note' && buttonId !== 'btn_h_star' && buttonId !== 'btn_h_dog' && buttonId !== 'btn_p_go' && buttonId !== 'btn_b_home' && (
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
      </div>
      )}
    </div>
  );
};

function CustomVideoPlayerDefaultLike({ src }) {
  const videoRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => setCurrent(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', onLoaded);
    return () => {
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolume = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const v = parseFloat(e.target.value);
    video.volume = v;
    setVolume(v);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!fullscreen) {
      if (video.requestFullscreen) video.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 유튜브 스타일: hover 시만 재생바 보이게
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseMove={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <video
        ref={videoRef}
        src={src}
        style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: 'none', borderRadius: 8 }}
        loop
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls={false}
      />
      {/* 유튜브 스타일 커스텀 재생바 */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: 56,
        background: hover ? 'linear-gradient(to top, rgba(33,33,33,0.95) 80%, rgba(33,33,33,0.0) 100%)' : 'transparent',
        zIndex: 20,
        display: hover ? 'flex' : 'none',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        boxSizing: 'border-box',
        width: '100%',
        userSelect: 'none',
        transition: 'background 0.2s',
      }}>
        {/* Play/Pause */}
        <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', fontSize: 28, marginRight: 8, cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center' }}>{playing ? (
          <svg width="28" height="28" viewBox="0 0 28 28"><rect x="6" y="5" width="5" height="18" rx="2" fill="#fff"/><rect x="17" y="5" width="5" height="18" rx="2" fill="#fff"/></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="7,5 23,14 7,23" fill="#fff"/></svg>
        )}</button>
        {/* Seekbar */}
        <div onClick={handleSeek} style={{ flex: 1, height: 6, background: '#606060', borderRadius: 3, marginRight: 8, cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: duration ? `${(current/duration)*100}%` : '0%', height: '100%', background: '#f00', borderRadius: 3, position: 'absolute', left: 0, top: 0 }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', position: 'absolute', left: duration ? `calc(${(current/duration)*100}% - 6px)` : '-6px', top: '-3px', boxShadow: '0 0 4px #f00', border: '2px solid #f00', display: duration ? 'block' : 'none' }} />
        </div>
        {/* Time */}
        <span style={{ color: '#fff', fontSize: 15, minWidth: 70, textAlign: 'right', fontFamily: 'Roboto, Arial, sans-serif', letterSpacing: '0.5px' }}>{formatTime(current)} / {formatTime(duration)}</span>
        {/* Volume */}
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ marginLeft: 8, marginRight: 2 }}><path fill="#fff" d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.74 2.5-2.26 2.5-4.02z"/></svg>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume} style={{ width: 70, accentColor: '#fff', background: 'transparent' }} />
        {/* Fullscreen */}
        <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, marginLeft: 8, cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#fff" d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 7h-3v2h5v-5h-2v3zm0-12h-5v2h3v3h2V5z"/></svg>
        </button>
      </div>
    </div>
  );
}

export { GenericContent };
export default ContentDisplay;