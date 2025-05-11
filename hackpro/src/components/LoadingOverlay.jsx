import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUtensils, FaPizzaSlice, FaHamburger, FaIceCream } from 'react-icons/fa';

// Animation for floating particles
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const LoadingContainer = styled.div`
  text-align: center;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const Spinner = styled(FaUtensils)`
  font-size: 5rem;
  animation: spin 1.5s linear infinite, pulse 1s ease-in-out infinite alternate;
  background: linear-gradient(135deg, #ff8a65, #ff4081, #ffd740);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 10;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff4081, #ffd740);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 10;
`;

const Particle = styled.div`
  position: absolute;
  font-size: ${props => props.size || '1.5rem'};
  color: ${props => props.color || '#ff4081'};
  opacity: 0.7;
  animation: ${float} ${props => props.duration || '10s'} linear infinite;
  top: ${props => props.top || '100%'};
  left: ${props => props.left || Math.random() * 100 + '%'};
  animation-delay: ${props => props.delay || '0s'};
  transform-origin: center;
`;

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  // Create an array of food icons for particles
  const foodIcons = [
    { icon: <FaPizzaSlice />, color: '#ff8a65' },
    { icon: <FaHamburger />, color: '#ffd740' },
    { icon: <FaIceCream />, color: '#ff4081' },
    { icon: <FaUtensils />, color: '#ff6f61' },
  ];

  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const randomIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
    return (
      <Particle
        key={i}
        size={`${Math.random() * 2 + 1}rem`}
        color={randomIcon.color}
        duration={`${Math.random() * 10 + 5}s`}
        top={`${Math.random() * 100 + 100}%`}
        left={`${Math.random() * 100}%`}
        delay={`${Math.random() * 5}s`}
      >
        {randomIcon.icon}
      </Particle>
    );
  });

  return (
    <Overlay>
      <LoadingContainer>
        {particles}
        <Spinner />
        <LoadingText>Preparing Your Culinary Voyage...</LoadingText>
      </LoadingContainer>
    </Overlay>
  );
};

export default LoadingOverlay;