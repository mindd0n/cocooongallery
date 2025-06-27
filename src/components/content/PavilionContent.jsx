import React, { useState } from 'react';
import './PavilionContent.css';
// 다른 SVG 컴포넌트 import
// import ForrestGump from './svg/ForrestGump';
// import KamomeKitchen from './svg/KamomeKitchen';
// import PerfectDays from './svg/PerfectDays';
// import AdultKim from './svg/AdultKim';

const movies = [
  { name: '리틀포레스트', poster: '리틀포레스트.png', detail: '리틀포레스트 설명파일.png' },
  { name: '카모메식당', poster: '카모메식당.png', detail: '카모메식당 설명파일.png' },
  { name: '어른 김장한', poster: '어른 김장한.png', detail: '어른 김장한 설명파일.png' },
  { name: '포레스트검프', poster: '포레스트검프.png', detail: '포레스트검프 설명파일.png' },
  { name: '퍼펙트데이즈', poster: '퍼펙트데이즈.png', detail: '퍼펙트데이즈 설명파일.png' },
];

const BASE_PATH = '/assets/content/btn_p_pavilion/G.영화추천리스트/';

const PavilionContent = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handlePosterClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="pavilion-container" style={{ backgroundImage: `url(${BASE_PATH}pavilion_bg_list.png)` }}>
      <div className="poster-list">
        {movies.map((movie) => (
          <button key={movie.name} className="poster-button" onClick={() => handlePosterClick(movie)}>
            <img src={`${BASE_PATH}${movie.poster}`} alt={movie.name} />
          </button>
        ))}
      </div>

      {selectedMovie && (
        <div className="detail-popup-overlay" onClick={handleCloseDetail}>
          <div className="detail-popup-content" onClick={(e) => e.stopPropagation()}>
            
            <img 
              src={`${BASE_PATH}pavilion_bg_detail.png`} 
              className="detail-bg-image" 
              alt="" 
            />

            <div className="detail-image-wrapper">
              <img 
                src={`${BASE_PATH}${selectedMovie.detail}`} 
                alt={`${selectedMovie.name} 설명`} 
                className="detail-image"
              />
            </div>

            <button onClick={handleCloseDetail} className="close-detail-button">X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PavilionContent; 