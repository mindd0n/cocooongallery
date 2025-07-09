import React, { useEffect, useState, useRef, useMemo } from 'react';
import PavilionContent from './content/PavilionContent.jsx';

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



// S3 기본 URL
const S3_BASE_URL = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media';

const ContentMap = {
  // Pavilion
  'btn_p_pavilion': { type: 'iframe', src: '/content/btn_p_pavilion/G.영화추천리스트/index.html' },
  'btn_p_note': { type: 'iframe', src: '/content/btn_p_note/dist/index.html' },
  'btn_p_tree': { type: 'iframe', src: '/content/btn_p_tree/index.html' },
  'btn_p_go': { type: 'iframe', src: '/content/btn_p_go/index.html' },

  // Home
  'btn_h_dog': { type: 'iframe', src: '/content/btn_h_dog/S.hoya-story/dist/index.html' },
  'btn_h_star': { type: 'video', src: `${S3_BASE_URL}/S.mp4` },
  'btn_h_ribbon': { type: 'video', src: `${S3_BASE_URL}/R.mp4` },
  'btn_h_home': { type: 'iframe', src: '/content/btn_h_home/index.html' },

  // Bus-stop
  'btn_b_bus': { type: 'video', src: `${S3_BASE_URL}/i.mp4` },
  'btn_b_busstop': { type: 'video', src: `${S3_BASE_URL}/H.mp4` },
  'btn_b_home': { type: 'iframe', src: '/content/btn_b_home/j/index.html' },
  
  // Walk
  'btn_w_walk': { type: 'video', src: `${S3_BASE_URL}/L.mp4` },
  'btn_w_bridge': { type: 'video', src: `${S3_BASE_URL}/M.mp4` },
  'btn_w_sign': { type: 'video', src: `${S3_BASE_URL}/N.mp4` },
  'btn_w_sun': { type: 'iframe', src: '/content/btn_w_sun/index.html' },

  // Ceiling
  'btn_c_lamp': { type: 'iframe', src: '/content/btn_c_lamp/index.html' },
  'btn_c_heart': { type: 'image', src: '/content/btn_c_heart/U.PNG' },

  // Floor
  'btn_f_rug': { type: 'iframe', src: '/content/btn_f_rug/%EC%B0%B8%EC%97%AC%ED%98%95%20%ED%8E%98%EC%9D%B4%EC%A7%80/index.html' },
  'btn_f_phone': { type: 'iframe', src: '/content/btn_f_phone/V.%EB%94%94%EC%A7%80%ED%84%B8%EB%94%94%ED%86%A1%EC%8A%A4/index.html' },
};

const TreeContent = () => {
  // 모바일 가로(landscape) 감지
  const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > window.innerHeight;
  // marginTop을 모바일 가로에서만 -32px로, 그 외는 0
  const topMargin = isMobileLandscape ? '12px' : '0';
  // 모바일 가로에서만 크기 축소 비율
  const scale = isMobileLandscape ? 0.95 : 1;
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
      marginTop: topMargin
    }}>
      <div style={{ 
        flex: '0 0 auto', 
        minHeight: 0, 
        width: `${scale * 100}%`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '0',
        marginBottom: '9px',
        paddingTop: isMobileLandscape ? '20px' : '32px'
      }}>
        <div style={{
          width: isMobileLandscape ? 'min(665px, 86vw)' : 'min(700px, 90vw)',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          borderRadius: '8px',
          overflow: 'hidden',
          maxWidth: isMobileLandscape ? '95%' : '100%',
          maxHeight: isMobileLandscape ? '57vh' : '60vh',
          paddingTop: isMobileLandscape ? '16px' : '32px',
          marginTop: isMobileLandscape ? '12px' : '24px'
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
        marginBottom: isMobileLandscape ? 32 : 52,
        width: isMobileLandscape ? 'min(665px, 86vw)' : 'min(700px, 90vw)',
        maxWidth: isMobileLandscape ? '95%' : '100%',
        maxHeight: isMobileLandscape ? '28.5vh' : '30vh',
        overflow: 'hidden',
        paddingTop: '0'
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
  // 모바일 가로(landscape) 감지
  const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > window.innerHeight;
  const playlistWidth = 400;
  const playlistHeight = isMobileLandscape ? 150 : 152;
  const playlistBottom = isMobileLandscape ? '-70px' : '40px';
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
          bottom: playlistBottom,
          right: isMobileLandscape ? '-35px' : '-80px',
          zIndex: 10,
          width: `${playlistWidth}px`,
          height: `${playlistHeight}px`
        }}
      >
        <iframe 
          className="sun-playlist-iframe"
          style={{borderRadius: '12px', width: `${playlistWidth}px`, height: `${playlistHeight}px`}} 
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

  switch (type) {
    case 'video':
      return (
        <video
          ref={videoRef}
          src={src}
          style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: 'black', borderRadius: 8 }}
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
            background: 'black',
            display: 'block',
            minHeight: '600px'
          }}
          title={`Content for ${buttonId || 'unknown'}`}
          allow="autoplay; fullscreen; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
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

// Go 아이콘 2차팝업 자동 싱잉볼 효과음 재생용 컴포넌트
function PlaySingingBowlSoundOnce() {
  useEffect(() => {
    const audio = new window.Audio('/content/btn_p_go/싱잉볼효과음.m4a');
    audio.volume = 0.5;
    audio.play();
  }, []);
  return null;
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
      if (iconId.startsWith('icon_')) {
        // btn_h_home 아이콘들
        homeImageDataRef.current[iconId] = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;
      } else {
        // btn_p_go 아이콘들 - 사용하지 않으므로 제거
      }
    } catch (e) {
      if (iconId.startsWith('icon_')) {
        homeImageDataRef.current[iconId] = null;
      }
    }
  };

  const [singingBowlAudio, setSingingBowlAudio] = useState(null);
  const [isSingingBowlPlaying, setIsSingingBowlPlaying] = useState(false);

  // btn_h_home 관련
  const [selectedHomeContent, setSelectedHomeContent] = useState(null);
  const [homeZIndexOrder, setHomeZIndexOrder] = useState({ icon_o: 2, icon_p: 3, icon_q: 4 });
  const homeImageDataRef = useRef({});
  const homeIconRef_o = useRef(null);
  const homeIconRef_p = useRef(null);
  const homeIconRef_q = useRef(null);
  const homeIconRefs = useMemo(() => ({
    icon_o: homeIconRef_o,
    icon_p: homeIconRef_p,
    icon_q: homeIconRef_q,
  }), []);
  useEffect(() => {
    Object.entries(homeIconRefs).forEach(([id, ref]) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      if (!ref.current) return;
      img.src = ref.current.src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          homeImageDataRef.current[id] = ctx.getImageData(0, 0, img.width, img.height).data;
        } catch (e) {
          homeImageDataRef.current[id] = null;
        }
      };
    });
  }, [homeIconRefs]);

  useEffect(() => {
    console.log('ContentDisplay useEffect:', { buttonId, contentInfo });
    if (buttonId && contentInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [buttonId, contentInfo]);

  // 호야스토리(강아지) 팝업 자동 닫힘 메시지 처리
  useEffect(() => {
    const handleMessage = (event) => {
      if (buttonId === 'btn_h_dog' && event.data && event.data.type === 'CLOSE_HOYA_STORY') {
        console.log('호야스토리 종료 메시지 수신');
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [buttonId, onClose]);

  
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

  // 팝업/iframe src 상태 관리
  const [iframeSrc, setIframeSrc] = useState(null);

  useEffect(() => {
    // 팝업이 열릴 때만 src 할당, 닫힐 때는 해제
    if (buttonId && ContentMap[buttonId] && ContentMap[buttonId].type === 'iframe') {
      setIframeSrc(ContentMap[buttonId].src);
    } else {
      setIframeSrc(null);
    }
  }, [buttonId]);

  // 팝업 닫기 시 src 해제
  const handleClose = () => {
    setIframeSrc(null);
    if (onClose) onClose();
  };

  if (!show || !contentInfo) {
    console.log('ContentDisplay not showing:', { show, contentInfo });
    return null;
  }

  console.log('ContentDisplay rendering:', { buttonId, contentInfo });

  if (buttonId === 'btn_p_go') {
    return (
      <>
        <PlaySingingBowlSoundOnce />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
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
          {/* 싱잉볼 클릭 오버레이 */}
          <div
            style={{
              position: 'absolute',
              left: '70%',
              top: '40%',
              width: '15%',
              height: '30%',
              cursor: 'pointer',
              zIndex: 10,
              // background: 'rgba(255,0,0,0.2)' // 개발 중 위치 확인용
            }}
            onClick={e => {
              e.stopPropagation();
              if (isSingingBowlPlaying && singingBowlAudio) {
                singingBowlAudio.pause();
                singingBowlAudio.currentTime = 0;
                setIsSingingBowlPlaying(false);
              } else {
                const audio = new Audio('https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/%EC%8B%B1%EC%9E%89%EB%B3%BC%ED%9A%A8%EA%B3%BC%EC%9D%8C.m4a');
                audio.volume = 0.5;
                audio.play();
                setSingingBowlAudio(audio);
                setIsSingingBowlPlaying(true);
                // 재생이 끝나면 상태 초기화
                audio.onended = () => {
                  setIsSingingBowlPlaying(false);
                  setSingingBowlAudio(null);
                };
              }
            }}
          />
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
              zIndex: selectedHomeContent === 'icon_p' ? 1 : 3
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
                const imgAX = Math.round((x) * (iconA.naturalWidth / rect.width));
                const imgAY = Math.round((y) * (iconA.naturalHeight / rect.height));
                
                if (isImagePixelOpaque(iconA, imgAX, imgAY)) {
                  console.log('Icon A click accepted');
                  setShowGoVideo(true);
                  return;
                }
              }
              
              if (iconB) {
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
                  width: 'min(800px,68vw)',
                  aspectRatio: '16/9',
                  maxHeight: '68vh',
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
                  width: 'min(800px,68vw)',
                  aspectRatio: '16/9',
                  maxHeight: '68vh',
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
      </>
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
          background: 'rgba(0,0,0,0.85)',
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
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
            title="b_home"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (buttonId === 'btn_h_home') {
    // btn_p_go와 동일한 방식으로 투명영역 판정
    const isHomeIconPixelOpaque = (img, x, y) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      return pixel[3] >= 10; // 알파값 10 이상만 클릭 허용
    };
    
    // 2차 팝업 렌더링
    const renderDetailContent = () => {
      if (!selectedHomeContent) return null;
      if (selectedHomeContent === 'icon_o') {
        // 모바일 조건
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
        const videoStyle = isMobile
          ? {
              width: '60vw',
              height: 'auto',
              maxHeight: '100vh',
              objectFit: 'contain',
              display: 'block',
              background: 'black',
              borderRadius: 8,
            }
          : {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              background: 'black',
              borderRadius: 8,
            };
        return (
          <video
            src={`${S3_BASE_URL}/O.mp4`}
            style={videoStyle}
            playsInline
            controls
            controlsList="nodownload"
          />
        );
      }
      if (selectedHomeContent === 'icon_q') {
        // 모바일 조건
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
        const videoStyle = isMobile
          ? {
              width: '60vw',
              height: 'auto',
              maxHeight: '100vh',
              objectFit: 'contain',
              display: 'block',
              background: 'black',
              borderRadius: 8,
            }
          : {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              background: 'black',
              borderRadius: 8,
            };
        return (
          <video
            src={`${S3_BASE_URL}/Q.mp4`}
            style={videoStyle}
            playsInline
            controls
            controlsList="nodownload"
          />
        );
      }
      if (selectedHomeContent === 'icon_p') {
        // 모바일 조건
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
        const imgStyle = isMobile
          ? {
              width: '58vw',
              height: 'auto',
              maxHeight: '88vh',
              objectFit: 'contain',
              display: 'block',
              background: 'white',
              borderRadius: 8,
            }
          : {
              width: '100%',
              height: 'auto',
              maxHeight: '95vh',
              objectFit: 'contain',
              display: 'block',
              background: 'white',
              borderRadius: 8,
            };
        return (
          <MagnifierImage
            src={"/content/btn_h_home/P.sleep-newspaper/dist/assets/IMG_0853-BEy-fzvc.PNG"}
            alt="신문 이미지"
            style={imgStyle}
          />
        );
      }
      switch (selectedHomeContent) {
        case 'icon_p':
          return (
            <iframe 
              key="iframe_p" 
              src="/content/btn_h_home/P.sleep-newspaper/dist/index.html" 
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none', 
                minHeight: '600px',
                background: 'white'
              }} 
              title="수면신문"
              onLoad={() => console.log('수면신문 iframe 로드 완료')}
              onError={(e) => console.error('수면신문 iframe 로드 실패:', e)}
            />
          );
        case 'icon_q':
          return <GenericContent type="video" src={`${S3_BASE_URL}/Q.mp4`} />;
        default: return null;
      }
    };
    
    // 팝업 반응형 크기 계산 함수
    function getSleepNewspaperPopupStyle(selectedHomeContent) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
      if (selectedHomeContent === 'icon_o' || selectedHomeContent === 'icon_q') {
        return {
          width: isMobile ? '60vw' : 'min(900px,90vw)',
          height: 'auto',
          maxHeight: isMobile ? '100vh' : '90vh',
          background: 'transparent', // 하얀 배경 제거
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
        };
      }
      if (selectedHomeContent === 'icon_p') {
        return {
          width: isMobile ? '60vw' : 'min(1000px,80vw)',
          height: 'auto',
          maxHeight: isMobile ? '90vh' : '95vh',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
        };
      }
      const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
      const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
      if (selectedHomeContent === 'icon_p') {
        if (isMobileLandscape) {
          return {
            width: '60vw',
            height: 'auto',
            aspectRatio: '1191/842', // 신문 이미지 비율
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            maxHeight: '100vh',
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        } else if (isTablet) {
          return {
            width: 'min(98vw, 600px)',
            height: 'min(70vh, 500px)',
            aspectRatio: 'auto',
            background: 'white',
            borderRadius: '12px',
            overflow: 'auto',
            overflowY: 'auto',
            maxHeight: '100vh',
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        } else {
          return {
            width: 'min(1400px,98vw)',
            height: 'min(800px,90vh)',
            aspectRatio: 'auto',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        }
      } else {
        return {
          width: 'min(900px,90vw)',
          aspectRatio: '16/9',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      }
    }

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
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
            background: `url('/content/btn_h_home/btn_h_home_bg.png') center/contain no-repeat`,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'block',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 아이콘들 - btn_p_go와 동일한 통합 클릭 처리 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: selectedHomeContent === 'icon_p' ? 1 : 3
            }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // icon_o, icon_p, icon_q 모두 확인 (z-index 순서대로)
              const sortedIcons = Object.keys(homeIconRefs).sort((a, b) => homeZIndexOrder[b] - homeZIndexOrder[a]);
              
              for (const iconId of sortedIcons) {
                const iconElement = homeIconRefs[iconId].current;
                if (!iconElement) continue;
                
                const imgX = Math.round((x) * (iconElement.naturalWidth / rect.width));
                const imgY = Math.round((y) * (iconElement.naturalHeight / rect.height));
                
                if (isHomeIconPixelOpaque(iconElement, imgX, imgY)) {
                  setHoveredIcon(iconId);
                  return; // 색이 있는 영역을 찾으면 호버 설정하고 종료
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
              
              // icon_o, icon_p, icon_q 모두 확인 (z-index 순서대로)
              const sortedIcons = Object.keys(homeIconRefs).sort((a, b) => homeZIndexOrder[b] - homeZIndexOrder[a]);
              
              for (const iconId of sortedIcons) {
                const iconElement = homeIconRefs[iconId].current;
                if (!iconElement) continue;
                
                const imgX = Math.round((x) * (iconElement.naturalWidth / rect.width));
                const imgY = Math.round((y) * (iconElement.naturalHeight / rect.height));
                
                if (isHomeIconPixelOpaque(iconElement, imgX, imgY)) {
                  console.log(`${iconId} 아이콘 클릭 성공!`);
                  setSelectedHomeContent(iconId);
                  const maxZIndex = Math.max(...Object.values(homeZIndexOrder));
                  setHomeZIndexOrder(prev => ({ ...prev, [iconId]: maxZIndex + 1 }));
                  return; // 첫 번째로 감지된 아이콘만 처리하고 종료
                }
              }
              
              console.log('클릭된 아이콘이 없음 - 모든 아이콘이 투명 영역');
            }}
          >
            <img
              src="/content/btn_h_home/icon_o.png"
              alt="Icon O"
              ref={homeIconRef_o}
              style={{
                position: 'absolute',
                top: '5%',
                left: '-5%',
                width: '90%',
                height: '90%',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: homeZIndexOrder.icon_o,
                transition: 'transform 0.2s ease-in-out',
                transform: hoveredIcon === 'icon_o' ? 'scale(1.05)' : 'scale(1)'
              }}
                             onLoad={() => handleGoIconLoad('icon_o', homeIconRef_o)}
            />
            <img
              src="/content/btn_h_home/icon_p.png"
              alt="Icon P"
              ref={homeIconRef_p}
              style={{
                position: 'absolute',
                top: '5%',
                left: '5%',
                width: '90%',
                height: '90%',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: homeZIndexOrder.icon_p,
                transition: 'transform 0.2s ease-in-out',
                transform: hoveredIcon === 'icon_p' ? 'scale(1.05)' : 'scale(1)'
              }}
                             onLoad={() => handleGoIconLoad('icon_p', homeIconRef_p)}
            />
            <img
              src="/content/btn_h_home/icon_q.png"
              alt="Icon Q"
              ref={homeIconRef_q}
              style={{
                position: 'absolute',
                top: '5%',
                left: '15%',
                width: '90%',
                height: '90%',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: homeZIndexOrder.icon_q,
                transition: 'transform 0.2s ease-in-out',
                transform: hoveredIcon === 'icon_q' ? 'scale(1.05)' : 'scale(1)'
              }}
                             onLoad={() => handleGoIconLoad('icon_q', homeIconRef_q)}
            />
          </div>
          {/* 2차 팝업창 */}
          {selectedHomeContent && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} onClick={() => setSelectedHomeContent(null)}>
              <div style={getSleepNewspaperPopupStyle(selectedHomeContent)} onClick={e => e.stopPropagation()}>
                {renderDetailContent()}
                {selectedHomeContent !== 'icon_p' && (
                  <button onClick={() => setSelectedHomeContent(null)} style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer' }}>X</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (buttonId === 'btn_c_lamp') {
    return null;
  }

  if (buttonId === 'btn_p_note') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '1180px',
            height: '800px',
            maxWidth: '100vw',
            maxHeight: '100vh',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={e => e.stopPropagation()}
        >
          <iframe
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
            title={buttonId}
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
              fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 && window.innerHeight <= 500 && window.innerWidth > window.innerHeight ? 14 : 18,
              color: '#222',
              background: 'rgba(255,255,255,0.85)',
              padding: '6px 18px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              userSelect: 'none',
              letterSpacing: '-0.5px',
            }}
            onClick={onClose}
          >
            {'< 돌아가기'}
          </div>
          <iframe
            src={iframeSrc}
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
              // 커스텀 팝업으로 처리하므로 여기서는 아무것도 반환하지 않음
              return null;
            } else if (buttonId === 'btn_p_tree') {
              return <TreeContent />;
            } else if (buttonId === 'btn_h_star') {
              return <StarContent />;
            } else if (buttonId === 'btn_w_sun') {
              return <SunContent />;
            } else if (buttonId === 'btn_p_note') {
              return (
                <div
                    style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 3000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={onClose}
                >
                  <div
                    style={getDiaryPopupStyle()}
                    onClick={e => e.stopPropagation()}
                  >
                    <iframe
                      src={iframeSrc}
                      style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
                      title={buttonId}
                  />
                  </div>
                </div>
              );
            } else if (buttonId === 'btn_h_dog') {
              // 강아지 버튼은 iframe으로 연결
              console.log('btn_h_dog iframe src:', iframeSrc);
              return (
                <iframe
                  src={iframeSrc}
                  style={{ width: '100%', height: '100%', border: 'none', background: 'black' }}
                  title="hoya-story"
                  allow="autoplay; fullscreen; microphone; camera"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  onLoad={() => console.log('btn_h_dog iframe loaded successfully')}
                  onError={e => { alert('팝업 로드에 실패했습니다.'); handleClose(); }}
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
                  {/* 모바일 가로(landscape) 감지 */}
                  {(() => {
                    const isMobileLandscape = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > window.innerHeight;
                    const width = isMobileLandscape ? '60vw' : '80vw';
                    const height = isMobileLandscape ? '40vh' : '60vh';
                    return (
                      <div style={{
                        width,
                        height,
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3001
                      }}>
                  <iframe
                    src={iframeSrc}
                          style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
                    title={buttonId}
                  />
                      </div>
                    );
                  })()}
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
              // image 타입은 ContentMap에서 직접 src를 받아야 함
              return <img src={ContentMap[buttonId].src} alt="하트" style={{ width: '100vw', height: '100vh', objectFit: 'contain', display: 'block', marginTop: '6vh' }} />;
            } else {
              return <GenericContent type={contentInfo.type} src={iframeSrc} onClose={onClose} buttonId={buttonId} />;
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

// btn_p_note 팝업 스타일 함수 추가/수정
function getDiaryPopupStyle() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
  return {
    width: isMobile ? '70vw' : 'min(98vw, 900px)',
    height: 'auto',
    aspectRatio: '1189/842', // 일기장 원본 비율
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '98vh',
  };
}

// 신문 팝업 돋보기 이미지 컴포넌트
function MagnifierImage({ src, alt, style }) {
  const [showLens, setShowLens] = React.useState(false);
  const [lensPos, setLensPos] = React.useState({ x: 0, y: 0 });
  const imgRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
  const lensSize = 120; // 렌즈 지름(px)
  const zoom = 2.2; // 확대 배율

  // 이미지 크기 계산
  const [imgDims, setImgDims] = React.useState({ width: 1, height: 1 });
  React.useEffect(() => {
    if (imgRef.current) {
      setImgDims({
        width: imgRef.current.offsetWidth,
        height: imgRef.current.offsetHeight,
      });
    }
  }, [imgRef.current, style.width, style.height]);

  // 렌즈 위치 계산
  const handleMouseMove = e => {
    if (isMobile) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
  };

  // 렌즈가 이미지 영역을 벗어나지 않게 제한
  const lensLeft = Math.max(0, Math.min(lensPos.x - lensSize / 2, imgDims.width - lensSize));
  const lensTop = Math.max(0, Math.min(lensPos.y - lensSize / 2, imgDims.height - lensSize));

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-block',
        position: 'relative',
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: style.borderRadius,
          background: style.background,
          objectFit: style.objectFit,
          userSelect: 'none',
          pointerEvents: 'auto',
          cursor: !isMobile ? 'none' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={e => { if (!isMobile) { setShowLens(true); handleMouseMove(e); }}}
        onMouseLeave={() => setShowLens(false)}
        draggable={false}
      />
      {/* 돋보기 렌즈 */}
      {!isMobile && showLens && (
        <div
          style={{
            position: 'absolute',
            left: lensLeft,
            top: lensTop,
            width: lensSize,
            height: lensSize,
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            border: '2.5px solid #fff',
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgDims.width * zoom}px ${imgDims.height * zoom}px`,
            backgroundPosition: `-${(lensPos.x * zoom) - lensSize / 2}px -${(lensPos.y * zoom) - lensSize / 2}px`,
            zIndex: 20,
            cursor: 'none',
          }}
        />
      )}
    </div>
  );
}

export { GenericContent };
export default ContentDisplay;