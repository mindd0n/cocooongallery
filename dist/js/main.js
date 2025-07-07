// DOM 요소 가져오기
const introImage = document.getElementById('intro-image');
const introImageMobile = document.getElementById('intro-image-mobile');
const introVideo = document.getElementById('intro-video');
const introVideoMobile = document.getElementById('intro-video-mobile');
const playButton = document.getElementById('play-button');
const enterButton = document.getElementById('enter-button');
const testButton = document.getElementById('test-button');
const skipButton = document.getElementById('skip-button');

// 디바이스 타입 확인
const isMobile = window.innerWidth <= 768;

// 초기 상태 설정
function initialize() {
    console.log('초기화 실행');
    playButton.classList.remove('hidden');
    enterButton.classList.add('hidden');
    skipButton.classList.add('hidden');
}

// 비디오 재생 함수
function playVideo() {
    console.log('비디오 재생 시작');
    if (isMobile) {
        introImageMobile.classList.add('hidden');
        introVideoMobile.classList.remove('hidden');
        introVideoMobile.play().catch(error => {
            console.error('모바일 비디오 재생 실패:', error);
        });
    } else {
        introImage.classList.add('hidden');
        introVideo.classList.remove('hidden');
        introVideo.play().catch(error => {
            console.error('PC 비디오 재생 실패:', error);
        });
    }
    playButton.classList.add('hidden');
    
    // 2.5초 후에 스킵 버튼 표시
    setTimeout(() => {
        skipButton.classList.remove('hidden');
        skipButton.classList.add('visible');
    }, 2500);
}

// 비디오 종료 시 이벤트 처리
function handleVideoEnd() {
    console.log('비디오 종료됨');
    enterButton.classList.remove('hidden');
    enterButton.style.display = 'block';
    enterButton.style.opacity = '1';
    skipButton.classList.add('hidden');
}

// 비디오 진행 시간 체크
function checkVideoTime(video) {
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 16) { // 비디오 종료 16초 전
        enterButton.classList.remove('hidden');
        enterButton.style.display = 'block';
        enterButton.style.opacity = '1';
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드됨');
    initialize();
    
    // 비디오 이벤트 리스너 등록
    if (isMobile) {
        introVideoMobile.addEventListener('ended', handleVideoEnd);
        introVideoMobile.addEventListener('timeupdate', () => {
            checkVideoTime(introVideoMobile);
        });
    } else {
        introVideo.addEventListener('ended', handleVideoEnd);
        introVideo.addEventListener('timeupdate', () => {
            checkVideoTime(introVideo);
        });
    }
});

playButton.addEventListener('click', playVideo);

// 입장 버튼 클릭 시
enterButton.addEventListener('click', () => {
    console.log('입장 버튼 클릭됨');
    window.location.href = './index.html';
});

// 스킵 버튼 클릭 시
skipButton.addEventListener('click', () => {
    console.log('스킵 버튼 클릭됨');
    if (isMobile) {
        introVideoMobile.pause();
    } else {
        introVideo.pause();
    }
    window.location.href = './index.html';
});

// 테스트 버튼 클릭 시
testButton.addEventListener('click', () => {
    const video = isMobile ? introVideoMobile : introVideo;
    if (video.duration) {
        video.currentTime = video.duration - 18; // 영상 끝나기 18초 전으로 이동
    }
}); 