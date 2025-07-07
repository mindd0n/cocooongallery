import React, { useState, useRef, useEffect } from 'react';

// 상수화: magic number, 색상 등
const BG_COLOR = '#fff'; // 인트로 전체 배경색
const MOBILE_LANDSCAPE_MAX_WIDTH = 1024;
const MOBILE_MAX_WIDTH = 768;
const SKIP_BTN_SIZE_MOBILE = { width: 320, height: 160, right: -150, bottom: 80 }; // 최신값 반영
const SKIP_BTN_SIZE_MOBILE_LANDSCAPE = { width: 120, height: 36, right: -90, bottom: -9 };
const SKIP_BTN_SIZE_PC = { width: 960, height: 240, right: -700, bottom: -60 };
const ENTER_BTN_TOP_MOBILE = '40%';
const ENTER_BTN_TOP_PC = '45%';

const IntroScreen = ({ onComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlay, setShowPlay] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [orientation, setOrientation] = useState('portrait');
    const videoRef = useRef(null);
    const [showEnter, setShowEnter] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const [enterHovered, setEnterHovered] = useState(false);
    const [showSkip, setShowSkip] = useState(false);

    // 반응형 디바이스/방향 체크
    const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH && window.innerHeight > window.innerWidth;
    const isMobileLandscape = window.innerWidth <= MOBILE_LANDSCAPE_MAX_WIDTH && window.innerWidth > window.innerHeight;

    // 비디오/포스터 소스 분기
    let videoSrc;
    if (!isMobile) {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_pc.MP4';
    } else if (orientation === 'landscape') {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_pc.MP4';
    } else {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_m.MP4';
    }
    let posterSrc;
    if (!isMobile) {
        posterSrc = '/images/intro/jpg_intro_pc.jpg';
    } else if (orientation === 'landscape') {
        posterSrc = '/images/intro/jpg_intro_pc.jpg';
    } else {
        posterSrc = '/images/intro/jpg_intro_m.jpg';
    }
    const playBtnSrc = '/images/intro/btn_play.png';

    // 버튼 크기/위치 분기 함수
    function getSkipBtnStyle() {
        if (!isMobile) return SKIP_BTN_SIZE_PC;
        if (orientation === 'landscape') return SKIP_BTN_SIZE_MOBILE_LANDSCAPE;
        return SKIP_BTN_SIZE_MOBILE;
    }
    function getEnterBtnTop() {
        if (!isMobile || orientation === 'landscape') return ENTER_BTN_TOP_PC;
        return ENTER_BTN_TOP_MOBILE;
    }
    // play/enter 버튼 크기
    let playBtnSize;
    if (window.innerWidth <= MOBILE_MAX_WIDTH && orientation === 'landscape') {
        playBtnSize = '150px';
    } else if (window.innerWidth <= MOBILE_MAX_WIDTH && orientation === 'portrait') {
        playBtnSize = '116px';
    } else {
        playBtnSize = '288px';
    }
    let enterBtnWidth;
    if (!isMobile) {
        enterBtnWidth = '540px';
    } else if (orientation === 'landscape') {
        enterBtnWidth = '540px';
    } else {
        enterBtnWidth = '220px';
    }

    // 방향 감지 (모바일 가로/세로)
    useEffect(() => {
        function updateOrientation() {
            if (window.innerWidth > window.innerHeight) {
                setOrientation('landscape');
            } else {
                setOrientation('portrait');
            }
        }
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    // play 버튼 클릭 시
    const handlePlayClick = (e) => {
        e.stopPropagation();
        setIsPlaying(true);
    };
    // isPlaying이 true가 되면 video play 시도
    useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.volume = 0.6;
            videoRef.current.muted = false;
            videoRef.current.playsInline = true;
            videoRef.current.play().then(() => {
                setShowPlay(false);
            }).catch(() => {
                setIsPlaying(false);
                alert('영상 재생에 실패했습니다. 다시 시도해 주세요.');
            });
        }
    }, [isPlaying]);
    // 영상 재생 완료 시
    const handleVideoEnded = () => onComplete();
    // 스킵 버튼 클릭 시
    const handleSkipClick = (e) => { e.stopPropagation(); onComplete(); };
    // ENTER 버튼 핸들러
    const handleEnterClick = (e) => { e.stopPropagation(); onComplete(); };
    // 영상 시간 추적
    const handleTimeUpdate = () => {
        if (videoRef.current && videoDuration) {
            const remain = videoDuration - videoRef.current.currentTime;
            if (remain <= 16 && !showEnter) setShowEnter(true);
        }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) setVideoDuration(videoRef.current.duration);
    };
    // 영상 재생 3초 후 스킵 버튼 fade-in
    useEffect(() => {
        let timer;
        if (isPlaying) timer = setTimeout(() => setShowSkip(true), 3000);
        else setShowSkip(false);
        return () => clearTimeout(timer);
    }, [isPlaying]);

    // 비디오 스타일 분기
    const videoStyle = isMobileLandscape
      ? {
          position: 'absolute',
          top: 0,
          left: '-5vw',
          width: '110vw',
          height: 'auto',
          maxHeight: '110vh',
          objectFit: 'contain',
          transform: 'none',
          zIndex: 3,
          display: isPlaying ? 'block' : 'none'
        }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          transform: 'none',
          zIndex: 3,
          display: isPlaying ? 'block' : 'none'
        };
    // 스킵 버튼 스타일
    const skipBtn = getSkipBtnStyle();
    const skipBtnStyle = {
        position: 'absolute',
        bottom: skipBtn.bottom + 'px',
        right: skipBtn.right + 'px',
        cursor: 'pointer',
        width: skipBtn.width + 'px',
        height: skipBtn.height + 'px',
        backgroundImage: `url('/images/intro/btn_skip.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        zIndex: 10,
        opacity: showSkip ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)'
    };
    // ENTER 버튼 스타일
    const enterBtnTop = getEnterBtnTop();
    // play 버튼 스타일
    const playBtnStyle = {
        position: 'absolute',
        top: '45%',
        left: '50%',
        width: playBtnSize,
        height: playBtnSize,
        transform: `translate(-50%, -50%) scale(${isHovered ? 1.08 : 1})`,
        zIndex: 2,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
        transition: 'transform 0.18s cubic-bezier(0.4,0,0.2,1)',
        outline: 'none',
        background: 'none',
        border: 'none',
        pointerEvents: 'auto',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
    };

    return (
        <div 
            style={{ 
                position: 'relative', 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: BG_COLOR,
                overflow: 'hidden',
                cursor: showPlay ? 'pointer' : 'default'
            }}
        >
            {/* 포스터 이미지 - 항상 화면에 꽉 차게 */}
            {showPlay && (
                <img
                    src={posterSrc}
                    alt="인트로 포스터"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            )}
            {/* play 버튼 - 반응형 크기, 호버 효과 */}
            {showPlay && (
                <img
                    src={playBtnSrc}
                    alt="play"
                    onClick={handlePlayClick}
                    style={playBtnStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    draggable={false}
                    aria-label="인트로 애니메이션 재생"
                />
            )}
            {/* 비디오 - 항상 렌더링, isPlaying일 때만 보임 */}
            <video
                ref={videoRef}
                playsInline
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={videoStyle}
                aria-label="인트로 애니메이션"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
            {/* ENTER 버튼 - 영상 끝나기 16초 전에 중앙에 표시 */}
            {showEnter && isPlaying && (
                <img
                    src="/images/intro/btn_enter.png"
                    alt="ENTER"
                    onClick={handleEnterClick}
                    onMouseEnter={() => setEnterHovered(true)}
                    onMouseLeave={() => setEnterHovered(false)}
                    style={{
                        position: 'absolute',
                        top: enterBtnTop,
                        left: '50%',
                        width: enterBtnWidth,
                        height: 'auto',
                        transform: `translate(-50%, -50%) scale(${enterHovered ? 1.08 : 1})`,
                        zIndex: 1001,
                        cursor: 'pointer',
                        userSelect: 'none',
                        touchAction: 'manipulation',
                        background: 'none',
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        pointerEvents: 'auto',
                        transition: 'transform 0.18s cubic-bezier(0.4,0,0.2,1)'
                    }}
                    aria-label="전시장 바로 들어가기"
                />
            )}
            {/* 스킵 버튼 - 반응형 크기/위치, 영상 재생 3초 후 fade-in */}
            <div
                onClick={handleSkipClick}
                style={skipBtnStyle}
                aria-label="인트로 스킵"
            />
        </div>
    );
};

export default IntroScreen; 