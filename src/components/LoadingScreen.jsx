import React from 'react';

const LoadingScreen = ({ progress, message }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white',
            zIndex: 1000,
        }}>
            <h2>Loading...</h2>
            <p>{message}</p>
            <div style={{
                width: '50%',
                backgroundColor: '#555',
                borderRadius: '5px',
                marginTop: '10px'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '20px',
                    backgroundColor: '#4caf50',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease-in-out'
                }}></div>
            </div>
            <p>{Math.round(progress)}%</p>
        </div>
    );
};

export default LoadingScreen; 