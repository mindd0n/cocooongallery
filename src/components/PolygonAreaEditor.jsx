import React, { useState } from 'react';

// 임시: icon_a, icon_b 중 하나를 props로 지정
// 사용법: <PolygonAreaEditor imgSrc="/content/btn_p_go/icon_a.png" width={1000} height={1000} />
const PolygonAreaEditor = ({ imgSrc, width = 1000, height = 1000 }) => {
  const [points, setPoints] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleSvgClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setPoints([...points, [x, y]]);
    setCopied(false);
  };

  const handleCopy = () => {
    const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');
    navigator.clipboard.writeText(pointsStr);
    setCopied(true);
  };

  const handleReset = () => {
    setPoints([]);
    setCopied(false);
  };

  return (
    <div style={{ position: 'relative', width, height, margin: '40px auto', border: '2px solid #aaa', background: '#222' }}>
      <svg
        width={width}
        height={height}
        style={{ display: 'block', background: `url(${imgSrc}) center/contain no-repeat` }}
        onClick={handleSvgClick}
      >
        {/* 다각형 미리보기 */}
        {points.length > 1 && (
          <polygon
            points={points.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="rgba(0,200,255,0.2)"
            stroke="#00bfff"
            strokeWidth={2}
          />
        )}
        {/* 점 표시 */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill="#fff" stroke="#00bfff" strokeWidth={2} />
        ))}
      </svg>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={handleCopy} disabled={points.length < 3} style={{ padding: '6px 16px', fontSize: 16 }}>
          좌표 복사{copied ? '됨!' : ''}
        </button>
        <button onClick={handleReset} style={{ padding: '6px 16px', fontSize: 16 }}>리셋</button>
      </div>
      <div style={{ marginTop: 8, color: '#fff', fontSize: 14 }}>
        클릭해서 점을 찍으세요. (최소 3개)
      </div>
      <div style={{ marginTop: 8, color: '#fff', fontSize: 12 }}>
        points: {points.map(([x, y]) => `${x},${y}`).join(' ')}
      </div>
    </div>
  );
};

export default PolygonAreaEditor; 