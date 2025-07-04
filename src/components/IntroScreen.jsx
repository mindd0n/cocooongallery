import React, { useState, useRef, useEffect } from 'react';

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

    // 상태 로그
    console.log('IntroScreen 렌더링:', { isPlaying, showPlay, orientation });

    // 반응형 이미지/비디오 소스 설정
    const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    let videoSrc;
    if (!isMobile) {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_pc.MP4';
    } else if (orientation === 'landscape') {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_pc.MP4';
    } else {
        videoSrc = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media/intro_m.MP4';
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

    // 포스터 이미지 경로
    let posterSrc;
    if (!isMobile) {
        posterSrc = '/images/intro/jpg_intro_pc.jpg';
    } else if (orientation === 'landscape') {
        posterSrc = '/images/intro/jpg_intro_pc.jpg'; // 모바일 가로도 데스크탑용 사용
    } else {
        posterSrc = '/images/intro/jpg_intro_m.jpg';
    }
    const playBtnSrc = '/images/intro/btn_play.png';

    // ENTER 버튼 크기(반응형)
    let enterBtnWidth;
    if (!isMobile) {
        enterBtnWidth = '540px';
    } else if (orientation === 'landscape') {
        enterBtnWidth = '540px';
    } else {
        enterBtnWidth = '220px';
    }

    // play 버튼 크기(enter 버튼보다 더 작게)
    let playBtnSize;
    if (!isMobile) {
        playBtnSize = '288px'; // 기존 240px → 20% 증가
    } else if (orientation === 'landscape') {
        playBtnSize = '288px';
    } else {
        playBtnSize = '116px'; // 기존 96px → 20% 증가
    }

    // play 버튼 클릭 시
    const handlePlayClick = (e) => {
        e.stopPropagation();
        console.log('play 클릭됨', { isPlaying, videoSrc, videoRef: videoRef.current });
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
                console.log('영상 play() 성공');
            }).catch((err) => {
                setIsPlaying(false);
                alert('영상 재생에 실패했습니다. 다시 시도해 주세요.');
                console.error('영상 재생 실패:', err);
            });
        }
    }, [isPlaying]);

    // 영상 재생 완료 시
    const handleVideoEnded = () => {
        onComplete();
    };

    // 스킵 버튼 클릭 시
    const handleSkipClick = (e) => {
        e.stopPropagation();
        onComplete();
    };

    // ENTER 버튼 핸들러
    const handleEnterClick = (e) => {
        e.stopPropagation();
        onComplete();
    };

    // 영상 시간 추적
    const handleTimeUpdate = () => {
        if (videoRef.current && videoDuration) {
            const remain = videoDuration - videoRef.current.currentTime;
            if (remain <= 16 && !showEnter) {
                setShowEnter(true);
            }
        }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

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

    // 스킵 버튼 크기 및 위치(반응형, 각 모드별 완전 분리)
    let skipBtnWidth, skipBtnHeight, skipBtnRight, skipBtnBottom;
    if (!isMobile) {
        // 데스크탑
        skipBtnWidth = 960;
        skipBtnHeight = 240;
        skipBtnRight = -700;
        skipBtnBottom = -60;
    } else if (orientation === 'landscape') {
        // 모바일 가로
        skipBtnWidth = 120;
        skipBtnHeight = 36;
        skipBtnRight = -90;
        skipBtnBottom = -9;
    } else {
        // 모바일 세로
        skipBtnWidth = 213;
        skipBtnHeight = 107;
        skipBtnRight = -106;
        skipBtnBottom = -27;
    }

    // ENTER 버튼 위치(반응형)
    let enterBtnTop;
    if (!isMobile) {
        enterBtnTop = '45%';
    } else if (orientation === 'landscape') {
        enterBtnTop = '45%';
    } else {
        enterBtnTop = '47%';
    }

    // 영상 재생 3초 후 스킵 버튼 fade-in
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setTimeout(() => setShowSkip(true), 3000);
        } else {
            setShowSkip(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying]);

    return (
        <div 
            style={{ 
                position: 'relative', 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: '#000',
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
                />
            )}

            {/* 비디오 - 항상 렌더링, isPlaying일 때만 보임 */}
            <video
                ref={videoRef}
                playsInline
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    display: isPlaying ? 'block' : 'none'
                }}
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
                />
            )}

            {/* 스킵 버튼 - 반응형 크기/위치, 영상 재생 3초 후 fade-in */}
            <div
                onClick={handleSkipClick}
                style={{
                    position: 'absolute',
                    bottom: skipBtnBottom + 'px',
                    right: skipBtnRight + 'px',
                    cursor: 'pointer',
                    width: skipBtnWidth + 'px',
                    height: skipBtnHeight + 'px',
                    backgroundImage: `url('/images/intro/btn_skip.png')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 10,
                    opacity: showSkip ? 1 : 0,
                    transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)'
                }}
            />
        </div>
    );
};

export default IntroScreen; 