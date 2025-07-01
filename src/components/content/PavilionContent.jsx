import React, { useState } from 'react';
import './PavilionContent.css';
// 다른 SVG 컴포넌트 import
// import ForrestGump from './svg/ForrestGump';
// import KamomeKitchen from './svg/KamomeKitchen';
// import PerfectDays from './svg/PerfectDays';
// import AdultKim from './svg/AdultKim';

const BASE_PATH = '/assets/content/btn_p_pavilion/G.영화추천리스트/';

const movies = [
  { name: '리틀포레스트', poster: '리틀포레스트.png', detail: '리틀포레스트 설명파일.png' },
  { name: '카모메식당', poster: '카모메식당.png', detail: '카모메식당 설명파일.png' },
  { name: '어른 김장한', poster: '어른 김장한.png', detail: '어른 김장한 설명파일.png' },
  { name: '포레스트검프', poster: '포레스트검프.png', detail: '포레스트검프 설명파일.png' },
  { name: '퍼펙트데이즈', poster: '퍼펙트데이즈.png', detail: '퍼펙트데이즈 설명파일.png' },
];

const PavilionContent = ({ onClose, noImageStyle }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handlePosterClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleOverlayClick}
    >
      <div
        className="pavilion-container"
        style={noImageStyle ? {
          backgroundImage: `url(${BASE_PATH}pavilion_bg_list.png)` ,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          maxWidth: '1100px',
          maxHeight: '90vh',
          width: '90vw',
          height: 'auto',
          minHeight: '600px',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        } : {
          backgroundImage: `url(${BASE_PATH}pavilion_bg_list.png)` ,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '24px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
          maxWidth: '1100px',
          maxHeight: '90vh',
          width: '90vw',
          height: 'auto',
          minHeight: '600px',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="poster-list">
          {movies.map((movie) => (
            <button key={movie.name} className="poster-button" onDoubleClick={() => handlePosterClick(movie)}>
              <img src={`${BASE_PATH}${movie.poster}`} alt={movie.name} />
            </button>
          ))}
        </div>

        {selectedMovie && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2100,
            background: 'none',
          }}>
            <img
              src={`${BASE_PATH}${selectedMovie.detail}`}
              alt={`${selectedMovie.name} 설명`}
              className="detail-image"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                borderRadius: '12px',
              }}
              onClick={handleCloseDetail}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PavilionContent; 