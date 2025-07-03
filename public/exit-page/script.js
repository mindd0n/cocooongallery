document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const popupMainTitle = document.getElementById("popupMainTitle");
  const popupImage = document.getElementById("popupImage");
  const popupDesc = document.getElementById("popupDesc");
  const sliderTrack = document.getElementById("sliderTrack");

  let currentIndex = 0;

  const cardTitles = {
    1: "[ 육체적 쉼 Physical Rest ]",
    2: "[ 정신적 쉼 Mental Rest ]",
    3: "[ 감정적 쉼 Emotional Rest ]",
    4: "[ 사회적 쉼 Social Rest ]",
    5: "[ 창의적 쉼 Creative Rest ]",
    6: "[ 감각적 쉼 Sensory Rest ]",
    7: "[ 영적 쉼 Spiritual Rest ]"
  };

  const cardDescriptions = {
    1: "몸의 피로를 회복하는 쉼",
    2: "과도한 생각과 집중을 멈추고 머릿속을 비워내는 쉼",
    3: "감정 소비로 인한 탈진을 회복하는 쉼",
    4: "사람들과의 관계, 대화에서 오는 피로를 덜어내는 쉼",
    5: "상상력과 영감을 회복하는 쉼",
    6: "불필요한 시각,청각적 자극으로부터 벗어나는 쉼",
    7: "자신보다 더 큰 의미와 연결되는 쉼"
  };

  const cardImages = {
    1: "image/rest1.png",
    2: "image/rest2.png",
    3: "image/rest3.png",
    4: "image/rest4.png",
    5: "image/rest5.png",
    6: "image/rest6.png",
    7: "image/rest7.png"
  };

  const slideData = {
    1: [
      { img: "image/P.png", text: "잘 자기" },
      { img: "image/Q.JPG", text: "잘 챙겨 먹기" },
      { img: "image/M.JPG", text: "가벼운 유산소 운동하기" }
    ],
    2: [
      { img: "image/AB.png", text: "명상하기" },
      { img: "image/CDE.png", text: "자연 속에서 시간 보내기" },
      { img: "image/K.png", text: "차분한 음악 듣기" },
      { img: "image/G.JPG", text: "영화보기" }
    ],
    3: [
      { img: "image/F.png", text: "일기쓰기" },
      { img: "image/H.png", text: "감정을 나만의 방식으로 표현해보기" },
      { img: "image/O.JPG", text: "자기 확언 하기" },
      { img: "image/J.JPG", text: "긍정적인 사회적 관계 맺기" }
    ],
    4: [
      { img: "image/S.JPG", text: "동물과 함께 시간 보내기" },
      { img: "image/K(2).png", text: "차분한 음악 듣기" },
      { img: "image/L.JPG", text: "산책하며 사색하기" },
      { img: "image/CDE(2).png", text: "자연 속에서 시간 보내기" }
    ],
    5: [
      { img: "image/I.JPG", text: "어디론가 훌쩍 떠나기" },
      { img: "image/NR.png", text: "좋아하는 음악에 춤추기" },
      { img: "image/T.JPEG", text: "글쓰기" }
    ],
    6: [
      { img: "image/AB(2).png", text: "명상하기" },
      { img: "image/CDE(3).png", text: "자연 속에서 시간 보내기" },
      { img: "image/K(3).png", text: "차분한 음악 듣기" }
    ],
    7: [
      { img: "image/AB(3).png", text: "명상하기" },
      { img: "image/O(2).JPG", text: "자기확언 하기" },
      { img: "image/F(2).png", text: "일기쓰기" },
      { img: "image/G(2).JPG", text: "영화보기" }
    ]
  };

  function updateSlide() {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function generateSlides(cardNum) {
    sliderTrack.innerHTML = "";
    const slides = slideData[cardNum] || [];
    slides.forEach(item => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <img src="${item.img}" alt="슬라이드 이미지" />
        <p>${item.text}</p>
      `;
      sliderTrack.appendChild(slide);
    });
  }

  function nextSlide() {
    const slides = sliderTrack.querySelectorAll(".slide");
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  }

  function prevSlide() {
    const slides = sliderTrack.querySelectorAll(".slide");
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  }

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  function closePopup() {
    popup.classList.add("hidden");
  }

  window.closePopup = closePopup;

  document.querySelectorAll(".click-area").forEach(area => {
    area.addEventListener("click", e => {
      e.preventDefault();
      const cardNum = area.dataset.card;

      popupMainTitle.textContent = cardTitles[cardNum] || "";
      popupImage.src = cardImages[cardNum] || "";
      popupImage.alt = `쉼 이미지 ${cardNum}`;
      popupDesc.textContent = cardDescriptions[cardNum] || "";

      currentIndex = 0;
      generateSlides(cardNum);
      updateSlide();

      popup.classList.remove("hidden");
    });
  });

  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  let current = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  document.querySelector('.slider-btn.prev').onclick = function() {
    if (current > 0) {
      current--;
      updateSlider();
    }
  };

  document.querySelector('.slider-btn.next').onclick = function() {
    if (current < slides.length - 1) {
      current++;
      updateSlider();
    }
  };

  // 초기화
  updateSlider();
});
