import React, { useState } from 'react';
import { movies } from './movieData';
import './App.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBackClick = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-app">
      {!selectedMovie ? (
        // 1단계: 영화 포스터 목록
        <div className="movie-list">
          <h1 className="movie-title">영화 추천 리스트</h1>
          <div className="poster-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-poster"
                onClick={() => handleMovieClick(movie)}
              >
                <img src={movie.poster} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.year} • {movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 2단계: 선택된 영화 상세 정보
        <div className="movie-detail">
          <button className="back-button" onClick={handleBackClick}>
            ← 뒤로 가기
          </button>
          <div className="detail-content">
            <div className="poster-section">
              <img src={selectedMovie.poster} alt={selectedMovie.title} />
            </div>
            <div className="description-section">
              <img src={selectedMovie.description} alt="영화 설명" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 