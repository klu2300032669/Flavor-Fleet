import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 60px 0 20px;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d, #ff4081);
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 40px 0 15px;
  }
`;

const Wave = styled.div`
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231a1a1a' fill-opacity='1' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,165.3C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  animation: waveAnimation 10s infinite ease-in-out;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 30px;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const FooterBrand = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterLogo = styled.h3`
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(45deg, #ff8a65, #ff4081, #ffd740);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  animation: float 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const FooterTagline = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: #ffd740;
  opacity: 0.9;
  letter-spacing: 1.5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: #ff8a65;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: #ffd740;
      bottom: -5px;
      left: 0;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #ffd740;
      transform: translateY(-2px);

      &::after {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    gap: 15px;

    a {
      font-size: 14px;
    }
  }
`;

const SocialMedia = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: #fff;
    font-size: 28px;
    transition: all 0.4s ease;
    background: radial-gradient(circle, rgba(255, 64, 129, 0.3), transparent);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

    &:hover {
      color: #ffd740;
      transform: scale(1.2);
      box-shadow: 0 6px 20px rgba(255, 215, 64, 0.5);
    }
  }

  @media (max-width: 768px) {
    gap: 10px;

    a {
      font-size: 24px;
      width: 40px;
      height: 40px;
    }
  }
`;

const FooterCopyright = styled.p`
  font-size: 12px;
  color: #ddd;
  margin-top: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(45deg, #ff4081, #ffd740);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 26px;
  box-shadow: 0 8px 25px rgba(255, 64, 129, 0.5);
  transition: all 0.4s ease;
  z-index: 3;

  &:hover {
    background: linear-gradient(45deg, #ffd740, #ff4081);
    transform: scale(1.15);
    box-shadow: 0 12px 40px rgba(255, 64, 129, 0.7);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 22px;
    bottom: 20px;
    right: 20px;
  }
`;

const DecorativeGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 64, 129, 0.2), transparent);
  border-radius: 50%;
  animation: pulse 5s ease-in-out infinite;
  z-index: 1;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

function Footer() {
  const location = useLocation();
  const excludedPaths = ["/menu", "/contact-us", "/aboutus"];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return !excludedPaths.includes(location.pathname) ? (
    <FooterWrapper>
      <Wave />
      <DecorativeGlow />
      <FloatingButton onClick={scrollToTop} className="glow">
        <i className="fas fa-arrow-up"></i>
      </FloatingButton>
      <FooterContent>
        <FooterBrand>
          <FooterLogo>Flavor Fleet</FooterLogo>
          <FooterTagline>A Culinary Voyage</FooterTagline>
        </FooterBrand>
        <FooterLinks>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Support</a>
        </FooterLinks>
        <SocialMedia>
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </SocialMedia>
      </FooterContent>
      <FooterCopyright>© 2025 Flavor Fleet. Crafted with Love.</FooterCopyright>
    </FooterWrapper>
  ) : null;
}
export default Footer;