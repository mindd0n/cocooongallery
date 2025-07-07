import React, { useState } from 'react';
import DiaryModal from './DiaryModal';

function App() {
  const [showDiary, setShowDiary] = useState(false);

  return (
    <div style={{ background: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button onClick={() => setShowDiary(true)} style={{ fontSize: '20px', padding: '10px 20px' }}>
        일기 보기
      </button>
      {showDiary && <DiaryModal onClose={() => setShowDiary(false)} />}
    </div>
  );
}

export default App;
