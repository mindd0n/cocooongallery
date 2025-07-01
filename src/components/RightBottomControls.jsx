import React, { useState, useEffect, useRef } from 'react';
import './RightBottomControls.css';

// S3 기본 URL
const S3_BASE_URL = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media';

const RightBottomControls = () => {
    const [isMusicOn, setIsMusicOn] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [showRestPopup, setShowRestPopup] = useState(false);
    const audioRef = useRef(null);

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

    useEffect(() => {
        // BGM 오디오 파일 로드
        audioRef.current = new Audio(`${S3_BASE_URL}/bgm.mp3`);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        if (isMusicOn) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isMusicOn]);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicOn) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsMusicOn(!isMusicOn);
        }
    };

    const toggleMap = (e) => {
        if (e && isPixelTransparent(e.clientX, e.clientY, 'map_button', e.target)) return;
        setShowMap(!showMap);
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
            
            const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
            return pixelData[3] < 128; // 알파값이 128 미만이면 투명
        };
        
        img.src = target.src;
        return false;
    };

    return (
        <>
            <div className="controls-container">
                <button className="base-button out-button">
                    <img
                        className="out-button-img"
                        src={`${S3_BASE_URL}/icon_out.png`}
                        alt="Exit"
                        onClick={handleExit}
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
                        onClick={toggleMap}
                    />
                </button>

                <button className="base-button music-button" onClick={toggleMusic}>
                    <img
                        className="music-button-img"
                        src={isMusicOn ? `${S3_BASE_URL}/music-on.png` : `${S3_BASE_URL}/music-off.png`}
                        alt="Music Toggle"
                    />
                </button>
            </div>

            {showMap && (
                <div className="map-popup-overlay" onClick={() => setShowMap(false)}>
                    <img
                        className="map-popup-image"
                        src={`${S3_BASE_URL}/icon_map_inner.png`}
                        alt="Map Inner"
                        onClick={(e) => e.stopPropagation()}
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
                            width: '100vw',
                            height: '100vh',
                            background: 'transparent',
                            boxShadow: 'none',
                            borderRadius: 0,
                            overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowRestPopup(false)}
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 28,
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 44,
                                height: 44,
                                fontSize: 28,
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
                                width: '100vw',
                                height: '100vh',
                                border: 'none',
                                borderRadius: 0,
                                background: 'white',
                                display: 'block',
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