  import React, { useState } from "react";
  import styled from "styled-components";
  import { Link, useNavigate } from "react-router-dom";

  const HeroSection = styled.section`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 40px;
    position: relative;
    overflow: hidden;
    z-index: 2;
    background: url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600') no-repeat center center/cover;
    background-attachment: fixed;

    @media (max-width: 768px) {
      padding: 0 20px;
    }
  `;

  const HeroOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7));
    z-index: 1;
  `;

  const ParticlesContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
  `;

  const Particle = styled.div`
    position: absolute;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #ff8a65, transparent);
    border-radius: 50%;
    opacity: 0.85;
    animation: twinkle 4s infinite ease-in-out;

    @media (max-width: 768px) {
      width: 8px;
      height: 8px;
    }
  `;

  const HeroContent = styled.div`
    position: relative;
    z-index: 3;
    max-width: 1100px;
    padding: 20px;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  `;

  const HeroTitle = styled.h1`
    font-size: 80px;
    font-weight: 700;
    letter-spacing: -2.5px;
    background: linear-gradient(45deg, #ff8a65, #ff4081, #ffd740);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: float 3s ease-in-out infinite;
    margin-bottom: 30px; /* Added spacing */

    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }

    @media (max-width: 768px) {
      font-size: 50px; /* Slightly larger for impact */
      letter-spacing: -1.5px;
      margin-bottom: 25px;
    }
  `;

  const HeroSubtitle = styled.p`
    font-size: 28px;
    font-weight: 400;
    margin: 25px 0 45px;
    color: #fff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.8px;

    @media (max-width: 768px) {
      font-size: 20px;
      margin: 20px 0 40px;
    }
  `;

  const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media (max-width: 768px) {
      gap: 20px;
    }
  `;

  const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    max-width: 700px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 60px;
    padding: 15px 25px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 64, 129, 0.4);
    transition: all 0.5s ease;

    &:hover {
      border-color: #ffd740;
      box-shadow: 0 15px 50px rgba(255, 64, 129, 0.3);
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
      max-width: 95%;
      padding: 20px;
    }
  `;

  const Input = styled.input`
    background: transparent;
    color: #fff;
    padding: 16px 30px;
    font-size: 18px;
    border-radius: 50px;
    border: none;
    width: 100%;
    max-width: 450px;
    transition: all 0.4s ease;
    font-family: "Poppins", sans-serif;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
    }

    &:focus {
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 25px rgba(255, 215, 64, 0.5);
      outline: none;
    }

    @media (max-width: 768px) {
      max-width: 100%;
      padding: 16px 30px;
      font-size: 18px;
    }
  `;

  const Button = styled.button`
    background: linear-gradient(45deg, #ff4081, #ffd740);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border-radius: 50px;
    border: none;
    padding: 16px 35px;
    box-shadow: 0 8px 25px rgba(255, 64, 129, 0.5);
    transition: all 0.4s ease;
    font-family: "Poppins", sans-serif;
    cursor: pointer;

    &:hover {
      background: linear-gradient(45deg, #ffd740, #ff4081);
      transform: scale(1.08);
      box-shadow: 0 12px 35px rgba(255, 64, 129, 0.7);
    }

    @media (max-width: 768px) {
      padding: 16px 35px;
      font-size: 18px;
    }
  `;

  const CtaButton = styled(Link)`
    display: inline-block;
    margin-top: 50px;
    padding: 18px 50px;
    background: linear-gradient(135deg, #ff4081, #ffd740, #ff8a65);
    background-size: 200% 200%;
    color: #fff;
    text-decoration: none;
    font-size: 22px;
    font-weight: 700;
    border-radius: 50px;
    box-shadow: 0 10px 35px rgba(255, 64, 129, 0.6);
    transition: all 0.4s ease;
    animation: gradientAnimation 5s ease infinite;
    font-family: "Poppins", sans-serif;

    &:hover {
      transform: scale(1.12);
      box-shadow: 0 15px 45px rgba(255, 64, 129, 0.8);
      color: #fff;
    }

    @media (max-width: 768px) {
      margin-top: 50px;
      padding: 16px 40px;
      font-size: 20px;
    }
  `;

  const Hero = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
      if (searchTerm.trim()) {
        navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate("/menu");
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <HeroSection className="parallax">
        <HeroOverlay />
        <ParticlesContainer>
          {[...Array(50)].map((_, i) => (
            <Particle
              key={i}
              style={{
                animationDelay: `${i * 0.08}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </ParticlesContainer>
        <HeroContent>
          <HeroTitle>Bringing You The Best Bites!</HeroTitle>
          <HeroSubtitle>Discover new tastes, fresh meals, and exclusive offers at your fingertips.</HeroSubtitle>
          <InputGroup>
            <SearchBar>
              <Input
                type="text"
                className="form-control"
                placeholder="Search exquisite dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button className="btn-explore" onClick={handleSearch}>
                <i className="fas fa-search"></i> Discover
              </Button>
            </SearchBar>
          </InputGroup>
          <CtaButton to="/menu" className="glow">
            Order Your Feast
          </CtaButton>
        </HeroContent>
      </HeroSection>
    );
  };

  export default Hero;