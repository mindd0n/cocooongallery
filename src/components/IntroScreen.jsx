import React, { useState, useEffect } from 'react';

// S3 기본 URL
const S3_BASE_URL = 'https://rest-exhibition.s3.ap-northeast-2.amazonaws.com/deploy_media';

const IntroScreen = ({ onComplete }) => {
    const [videoSrc, setVideoSrc] = useState('');
    const [posterSrc, setPosterSrc] = useState('');
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        setVideoSrc(isMobile ? `${S3_BASE_URL}/intro_m.mp4` : `${S3_BASE_URL}/intro_pc.MP4`);
        setPosterSrc(isMobile ? `${S3_BASE_URL}/jpg_intro_m.jpg` : `${S3_BASE_URL}/jpg_intro_pc.jpg`);
    }, []);

    const handleVideoError = () => {
        console.error('인트로 비디오 로딩 실패');
        setVideoError(true);
        // 비디오 로딩 실패 시 3초 후 자동으로 다음 화면으로 이동
        setTimeout(() => {
            onComplete();
        }, 3000);
    };

    const handleSkipClick = () => {
        onComplete();
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000' }}>
            {!videoError ? (
                <video
                    key={videoSrc}
                    autoPlay
                    muted
                    playsInline
                    onEnded={onComplete}
                    onError={handleVideoError}
                    poster={posterSrc}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '18px'
                }}>
                    <p>인트로 영상을 불러올 수 없습니다.</p>
                    <p>잠시 후 자동으로 다음 화면으로 이동합니다.</p>
                </div>
            )}
            <div
                onClick={handleSkipClick}
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '5%',
                    cursor: 'pointer',
                    width: '100px',
                    height: '50px',
                    backgroundImage: `url('${S3_BASE_URL}/btn_skip.png')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </div>
    );
};

export default IntroScreen; 