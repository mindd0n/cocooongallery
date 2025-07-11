import React, { useState, useEffect, useRef } from 'react';
import './RightBottomControls.css';

// S3 기본 URL
const S3_BASE_URL = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media';

const RightBottomControls = ({ isMusicOn, setIsMusicOn, audioRef }) => {
    const [showMap, setShowMap] = useState(false);
    const [showRestPopup, setShowRestPopup] = useState(false);

    // 클릭 위치 저장용 ref
    const clickStart = useRef({});

    useEffect(() => {
        const imageInfos = {
            'out_button': `${S3_BASE_URL}/icon_out.png`,
            'map_button': `${S3_BASE_URL}/icon_map.png`
        };

        // 이미지 프리로드
        Object.values(imageInfos).forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicOn) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
        setIsMusicOn(!isMusicOn);
    };

    const toggleMap = (e) => {
        if (e && isPixelTransparent(e.clientX, e.clientY, 'map_button', e.target)) return;
        setShowMap(prev => !prev);
    };

    const handleExit = () => {
        setShowRestPopup(true);
    };

    const isPixelTransparent = (x, y, buttonType, target) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const rect = target.getBoundingClientRect();
            const pixelX = Math.floor((x - rect.left) * (img.width / rect.width));
            const pixelY = Math.floor((y - rect.top) * (img.height / rect.height));
            
            try {
                const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
                return pixelData[3] < 128; // 알파값이 128 미만이면 투명
            } catch (e) {
                console.warn('cross-origin 이미지로 인해 픽셀 분석 불가:', img.src);
                return false; // 항상 불투명(클릭 가능) 처리
            }
        };
        
        img.src = target.src;
        return false;
    };

    // 음악 버튼 클릭
    const handleMusicPointerDown = (e) => {
        clickStart.current.music = { x: e.clientX, y: e.clientY };
    };
    const handleMusicPointerUp = (e) => {
        const start = clickStart.current.music;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.sqrt(dx*dx + dy*dy) < 5) {
            toggleMusic();
        }
        clickStart.current.music = null;
    };

    // 지도 버튼 클릭
    const handleMapPointerDown = (e) => {
        clickStart.current.map = { x: e.clientX, y: e.clientY };
    };
    const handleMapPointerUp = (e) => {
        const start = clickStart.current.map;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.sqrt(dx*dx + dy*dy) < 5) {
            toggleMap(e);
        }
        clickStart.current.map = null;
    };

    // 나가기 버튼 클릭
    const handleExitPointerDown = (e) => {
        clickStart.current.exit = { x: e.clientX, y: e.clientY };
    };
    const handleExitPointerUp = (e) => {
        const start = clickStart.current.exit;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.sqrt(dx*dx + dy*dy) < 5) {
            handleExit();
        }
        clickStart.current.exit = null;
    };

    return (
        <>
            <div className="controls-container">
                <button className="base-button out-button">
                    <img
                        className="out-button-img"
                        src={`${S3_BASE_URL}/icon_out.png`}
                        alt="Exit"
                        onPointerDown={handleExitPointerDown}
                        onPointerUp={handleExitPointerUp}
                        onMouseEnter={(e) => e.currentTarget.src = `${S3_BASE_URL}/icon_out_hover.png`}
                        onMouseLeave={(e) => e.currentTarget.src = `${S3_BASE_URL}/icon_out.png`}
                    />
                </button>

                <button className="base-button map-button">
                    <img
                        id="map_button"
                        className="map-button-img"
                        src={`${S3_BASE_URL}/icon_map.png`}
                        alt="Map"
                        onPointerDown={handleMapPointerDown}
                        onPointerUp={handleMapPointerUp}
                    />
                </button>

                <button className="base-button music-button">
                    <img
                        className="music-button-img"
                        src={isMusicOn ? `${S3_BASE_URL}/music-on.png` : `${S3_BASE_URL}/music-off.png`}
                        alt="Music Toggle"
                        onPointerDown={handleMusicPointerDown}
                        onPointerUp={handleMusicPointerUp}
                    />
                </button>
            </div>

            {showMap && (
                <div className="map-popup-overlay" onClick={toggleMap}>
                    <img
                        className="map-popup-image"
                        src={`${S3_BASE_URL}/icon_map_inner.png`}
                        alt="Map Inner"
                    />
                </div>
            )}

            {showRestPopup && (
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
                    onClick={() => setShowRestPopup(false)}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '80vw',
                            height: 'auto',
                            maxWidth: '1920px',
                            maxHeight: '80vh',
                            aspectRatio: '16 / 9',
                            background: `url('/exit-page/image/bg.png') center/cover no-repeat`,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowRestPopup(false)}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                fontSize: 22,
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            aria-label="닫기"
                        >
                            ×
                        </button>
                        <iframe
                            src="/exit-page/index.html"
                            title="쉼 카드 팝업"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                background: 'transparent',
                                display: 'block',
                                position: 'relative',
                                zIndex: 1,
                            }}
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default RightBottomControls; 