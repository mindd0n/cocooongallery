import React from 'react';

const LittleForest = ({ onClick }) => (
  <svg width="200" height="300" viewBox="0 0 200 300" style={{ cursor: 'pointer' }}>
    {/* SVG Path 데이터가 여기에 들어갑니다. */}
    {/* 예시: <path d="..." fill="..." onClick={() => onClick('little-forest')} /> */}
    <rect width="200" height="300" fill="lightblue" onDoubleClick={() => onClick({
      id: 1,
      title: "리틀 포레스트",
      poster: "/assets/content/btn_p_pavilion/G.영화추천리스트/리틀포레스트.png",
      description: "/assets/content/btn_p_pavilion/G.영화추천리스트/리틀포레스트 설명파일.png",
    })} />
    <text x="50" y="150" fill="black">리틀 포레스트</text>
  </svg>
);

export default LittleForest; 