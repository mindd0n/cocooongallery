import React, { useState } from 'react';
import HoyaStoryModal from './components/HoyaStoryModal';

function App() {
  const [showStory, setShowStory] = useState(false);

  return (
    <>
      <img
        src="/icons/hoya-icon.png"
        alt="호야 아이콘"
        onClick={() => setShowStory(true)}
        style={{
          position: 'absolute',
          top: '60%',
          left: '30%',
          width: '80px',
          cursor: 'pointer',
        }}
      />
      {showStory && <HoyaStoryModal onClose={() => setShowStory(false)} />}
    </>
  );
}

export default App;
