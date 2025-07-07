function isValidImage(src) {
  if (!src || src.trim() === "" || src === "about:blank") return false;
  if (src.startsWith("data:image")) return false;
  if (src.endsWith(".svg") || src.endsWith("empty.png") || src.includes("투명")) return false;
  if (src.trim() === window.location.href) return false;
  return true;
}

function initTextPopupTriggers() {
  document.querySelectorAll(".popup-trigger").forEach(item => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      const popupOverlay = document.getElementById("popupOverlay");
      const popupContent = document.getElementById("popupContent");

      popupOverlay.classList.remove("hidden");

      if (type === "text") {
        const title = item.querySelector("h3")?.innerText || "제목 없음";
        const rawBody = item.querySelector("p")?.innerText || "";
        const body = rawBody.replace(/\n/g, "<br>");
        const thumbImage = item.querySelector("img.text-image")?.src || "";
        const imageList = item.dataset.images?.split(",") || [];
        let imagesHTML = "";

        if (isValidImage(thumbImage)) {
          imagesHTML += `<img src="${thumbImage}" style="max-height: 80vh; width: auto; margin-top: 3rem; display: block; margin-left: auto; margin-right: auto;" />`;
        }

        imageList.forEach(src => {
          const trimmed = src.trim();
          if (trimmed && trimmed !== thumbImage && isValidImage(trimmed)) {
            imagesHTML += `<img src="${trimmed}" style="max-height: 80vh; width: auto; margin-top: 3rem; display: block; margin-left: auto; margin-right: auto;" />`;
          }
        });

        popupContent.innerHTML = `
          <div style="max-width: 90%; max-height: 90vh; overflow-y: auto; margin: 0 auto; padding: 2rem; text-align: left; line-height: 1.6; font-size: 0.9rem; box-sizing: border-box; background-color: white; border: 1px solid #333;">
            <h3 style="margin-bottom: 1rem;">${title}</h3>
            <p style="white-space: pre-line; text-align: left;">${body}</p>
            ${imagesHTML}
          </div>
        `;
      } else if (type === "image") {
        const src = item.getAttribute("src");
        const title = item.dataset.title || "제목 없음";
        const body = (item.dataset.body || "설명이 없습니다.").replace(/\n/g, "<br>");
        const imageList = item.dataset.images?.split(",") || [];
        let imagesHTML = "";

        if (isValidImage(src)) {
          imagesHTML += `<img src="${src}" style="max-height: 80vh; width: auto; margin-top: 3rem; display: block; margin-left: auto; margin-right: auto;" />`;
        }

        imageList.forEach(imgSrc => {
          const trimmed = imgSrc.trim();
          if (trimmed && trimmed !== src && isValidImage(trimmed)) {
            imagesHTML += `<img src="${trimmed}" style="max-height: 80vh; width: auto; margin-top: 3rem; display: block; margin-left: auto; margin-right: auto;" />`;
          }
        });

        popupContent.innerHTML = `
          <div style="max-width: 90%; max-height: 90vh; overflow-y: auto; margin: 0 auto; padding: 2rem; text-align: left; line-height: 1.6; font-size: 0.9rem; box-sizing: border-box; background-color: white; border: 1px solid #333;">
            <h3 style="margin-bottom: 1rem;">${title}</h3>
            <p style="white-space: pre-line; text-align: left;">${body}</p>
            ${imagesHTML}
          </div>
        `;
      }
    });
  });
}

document.getElementById("popupOverlay").addEventListener("click", () => {
  document.getElementById("popupOverlay").classList.add("hidden");
});

window.addEventListener("DOMContentLoaded", () => {
  const carpet = document.getElementById("carpetClick");
  const popup = document.getElementById("popup");
  const closed = document.getElementById("envelopeClosed");
  const open = document.getElementById("envelopeOpen");
  const typingText = document.getElementById("typing-text");
  const typingBox = document.getElementById("typingBox");
  const typingBoxFinal = document.getElementById("typingBoxFinal");
  const finalLayout = document.getElementById("finalLayout");
  const galleryIcon = document.getElementById("galleryIcon");
  const textIcon = document.getElementById("textIcon");
  const galleryView = document.getElementById("galleryView");
  const textView = document.getElementById("textView");
  const formBtn = document.getElementById("openFormBtn");

  const message = `숨가쁘게 달리다 멈추어 문득 ‘쉬고 있다’고 느낀 순간이 있었나요?

누군가에겐 할 일을 미뤄도 불안하지 않은 저녁이었을지도,
말없이 함께 앉아 있던 친구와의 시간이었을지도,
아니면, 아무 이유 없이 흘러나온 노래 한 곡이었을지도 모르겠어요.

말이 되지 않아도 괜찮고, 남기지 않아도 괜찮아요.
단지, 마음이 움직인다면—
당신만의 방식으로, 쉼의 순간을 공유해주세요.

무엇이든. Anything!`;

  let typingIndex = 0;
  let typingFinished = false;
  let typingTimeout;
  let readyToMove = false;

  popup.classList.add("hidden");
  typingBox.classList.add("hidden");
  finalLayout.classList.add("hidden");
  initTextPopupTriggers();

  carpet.addEventListener("click", () => {
    popup.classList.remove("hidden");
    closed.classList.remove("hidden");
    open.classList.add("hidden");

    setTimeout(() => {
      closed.classList.add("hidden");
      open.classList.remove("hidden");

      setTimeout(() => {
        typingBox.classList.remove("hidden");
        typeWriter();
      }, 500);
    }, 800);
  });

  function typeWriter() {
    const speed = 30;
    typingTimeout = setTimeout(function type() {
      if (typingIndex < message.length) {
        typingText.innerHTML += message.charAt(typingIndex);
        typingIndex++;
        typingTimeout = setTimeout(type, speed);
      } else {
        typingFinished = true;
        readyToMove = true;
      }
    }, speed);
  }

  typingText.addEventListener("click", () => {
    if (!typingFinished) {
      clearTimeout(typingTimeout);
      typingText.innerHTML = message;
      typingFinished = true;
      readyToMove = true;
    } else if (readyToMove) {
      popup.classList.add("fade-out");

      setTimeout(() => {
        popup.classList.add("hidden");
        finalLayout.classList.remove("hidden");

        typingBoxFinal.classList.remove("hidden");
        typingBoxFinal.classList.add("move-left");

        const finalText = document.getElementById("final-text");
        finalText.classList.remove("hidden");

        formBtn.classList.remove("hidden");

        galleryView.classList.remove("hidden");
        textView.classList.add("hidden");
        galleryIcon.src = "btn_photo-click.png";
        textIcon.src = "btn_text.png";

        readyToMove = false;
      }, 800);
    }
  });

  galleryIcon.addEventListener("click", () => {
    galleryView.classList.remove("hidden");
    textView.classList.add("hidden");
    galleryIcon.src = "btn_photo-click.png";
    textIcon.src = "btn_text.png";
  });

  textIcon.addEventListener("click", () => {
    galleryView.classList.add("hidden");
    textView.classList.remove("hidden");
    galleryIcon.src = "btn_photo.png";
    textIcon.src = "btn_text-click.png";
  });

  formBtn.addEventListener("click", () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdOFQ_g8Pnt2--kFEVbOteAEDDKF060c42s4ck0L8oT76Bx0Q/viewform", "_blank");
  });
});
