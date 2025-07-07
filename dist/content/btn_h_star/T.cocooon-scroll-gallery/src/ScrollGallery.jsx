import React, { useEffect } from "react";

const ScrollGallery = () => {
  useEffect(() => {
    // 컴포넌트가 마운트되면 바로 갤러리 준비
    setTimeout(() => {
      const section = document.getElementById("gallery");
      section?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const images = [
    "/content/btn_h_star/T.cocooon-scroll-gallery/dist/1.jpeg",
    "/content/btn_h_star/T.cocooon-scroll-gallery/dist/2.JPEG",
    "/content/btn_h_star/T.cocooon-scroll-gallery/dist/3.JPEG",
    "/content/btn_h_star/T.cocooon-scroll-gallery/dist/4.JPEG",
    "/content/btn_h_star/T.cocooon-scroll-gallery/dist/5.JPEG",
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div id="gallery" className="mt-10 space-y-8 px-4 pb-32 w-full">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`사진 ${index + 1}`}
            className="w-full max-w-4xl mx-auto rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollGallery;
