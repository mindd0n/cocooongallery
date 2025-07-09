import React, { useState, useEffect } from 'react';
import { detectPerformanceTier, isDebugMode } from '../utils/performanceTier';

const PerformanceBadge = () => {
  const [tier, setTier] = useState(detectPerformanceTier());
  const [isHardDowngraded, setIsHardDowngraded] = useState(false);
  const isDebug = isDebugMode();
  
  // 실시간 티어 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setTier(detectPerformanceTier());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isDebug) return null;
  
  const getTierColor = () => {
    if (isHardDowngraded) return '#ff0000'; // 빨간색 (SAFE MODE)
    
    switch (tier) {
      case 'liteA': return '#ff4444';
      case 'liteB': return '#ffaa00';
      case 'full': return '#44ff44';
      default: return '#888888';
    }
  };
  
  const getTierText = () => {
    if (isHardDowngraded) return 'SAFE MODE';
    
    switch (tier) {
      case 'liteA': return 'LITE A';
      case 'liteB': return 'LITE B';
      case 'full': return 'FULL';
      default: return 'UNKNOWN';
    }
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: getTierColor(),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 10000,
        fontFamily: 'monospace',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    >
      {getTierText()} MODE
    </div>
  );
};

export default PerformanceBadge; 