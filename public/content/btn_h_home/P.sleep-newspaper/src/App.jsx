import React from 'react';
import SleepNewspaperModal from './components/SleepNewspaperModal';

function App() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <SleepNewspaperModal onClose={() => {}} />
    </div>
  );
}

export default App;
