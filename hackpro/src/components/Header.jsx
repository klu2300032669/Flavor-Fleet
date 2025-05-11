import React, { useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaUtensils, FaGift, FaInfoCircle, FaPhone, FaUser, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../components/AuthContext";

const HeaderWrapper = styled.header`
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &.hidden {
    transform: translateY(-100%);
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(255, 64, 129, 0.2));
    box-shadow: 0 4px 30px rgba(255, 64, 129, 0.5);
    height: 70px;
    border-bottom: 1px solid rgba(255, 64, 129, 0.3);
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    max-width: 65%;
  }
`;

const LogoText = styled.span`
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #ff8a65, #ff4081, #ffd740);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 28px;
    line-height: 1.1;
  }
`;

const LogoSubtext = styled.span`
  font-size: 12px;
  font-weight: 300;
  color: #ffd740;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 11px;
    color: rgba(255, 215, 64, 0.9);
    letter-spacing: 2.5px;
    margin-top: 3px;
    text-shadow: 0 0 5px rgba(255, 215, 64, 0.5);
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
  }

  li {
    margin: 0 20px;
  }

  a.nav-link, .nav-link {
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    position: relative;
    padding: 6px 10px;
    transition: all 0.3s ease;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #ff4081, #ffd740);
      bottom: 0;
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
    display: none;
  }
`;

const BottomNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.75);
    padding: 5px 0;
    box-shadow: 0 -2px 15px rgba(255, 64, 129, 0.2);
    z-index: 1001;
    border-top: 1px solid rgba(255, 64, 129, 0.3);
    transition: transform 0.3s ease;

    &.hidden {
      transform: translateY(100%);
    }
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  padding: 5px 8px;
  transition: all 0.3s ease;

  &:hover, &.active {
    color: #ff4081;
    transform: scale(1.1);
  }

  svg {
    font-size: 20px;
    margin-bottom: 3px;
    transition: transform 0.3s ease;
    background: linear-gradient(135deg, #ff8a65, #ff4081, #ffd740);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:hover svg {
    transform: scale(1.15);
  }
`;

const LoginButton = styled(Link)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    padding: 8px 12px;
    background: linear-gradient(135deg, #ff4081, #ffd740);
    border-radius: 30px;
    box-shadow: 0 5px 20px rgba(255, 64, 129, 0.7);
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    overflow: hidden;
    border: 1px solid rgba(255, 215, 64, 0.5);

    svg {
      font-size: 18px;
      margin-right: 5px;
      color: #fff;
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7));
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: all 0.6s ease;
    }

    &:hover {
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 8px 25px rgba(255, 64, 129, 0.9);
      background: linear-gradient(135deg, #ffd740, #ff4081);
    }

    &:hover:before {
      left: 100%;
    }

    &:active {
      transform: translateY(-50%) scale(0.97);
    }
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 10px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #ffd740;
    transform: translateY(-2px);
  }

  svg:first-child {
    margin-right: 8px;
    font-size: 20px;
    background: linear-gradient(135deg, #ff8a65, #ff4081, #ffd740);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  svg:last-child {
    margin-left: 5px;
    transition: transform 0.3s ease;
  }

  &.open svg:last-child {
    transform: rotate(180deg);
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid rgba(255, 215, 64, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid rgba(0, 0, 0, 0.9);
  }
`;

const DropdownItem = styled(Link)`
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background-color: rgba(255, 215, 64, 0.1);
    color: #ffd740;
  }

  svg {
    margin-right: 10px;
    font-size: 16px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 14px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 64, 129, 0.2);
    color: #ff4081;
  }

  svg {
    margin-right: 10px;
    font-size: 16px;
  }
`;

const MobileProfileButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    padding: 8px 12px;
    background: linear-gradient(135deg, #ff4081, #ffd740);
    border-radius: 30px;
    box-shadow: 0 5px 20px rgba(255, 64, 129, 0.7);
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    overflow: hidden;
    border: 1px solid rgba(255, 215, 64, 0.5);
    border: none;
    cursor: pointer;

    svg {
      font-size: 18px;
      margin-right: 5px;
      color: #fff;
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7));
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: all 0.6s ease;
    }

    &:hover {
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 8px 25px rgba(255, 64, 129, 0.9);
      background: linear-gradient(135deg, #ffd740, #ff4081);
    }

    &:hover:before {
      left: 100%;
    }

    &:active {
      transform: translateY(-50%) scale(0.97);
    }
  }
`;

const Header = ({ onOffersClick = () => {} }) => {
  const { user, logout } = useAuth();
  const isAboutPage = useMatch("/aboutus");
  const [headerHidden, setHeaderHidden] = useState(false);
  const [bottomNavHidden, setBottomNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAboutPage) {
      const handleScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.getElementById("header");
        const bottomNav = document.getElementById("bottom-nav");

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          header.classList.add("hidden");
          bottomNav.classList.add("hidden");
          setHeaderHidden(true);
          setBottomNavHidden(true);
        } else if (currentScrollY < lastScrollY) {
          header.classList.remove("hidden");
          bottomNav.classList.remove("hidden");
          setHeaderHidden(false);
          setBottomNavHidden(false);
        }

        setLastScrollY(currentScrollY);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isAboutPage, lastScrollY]);

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleOffersClickLocal = () => {
    navigate("/menu");
    onOffersClick();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return !isAboutPage ? (
    <>
      <HeaderWrapper id="header" className={headerHidden ? "hidden" : ""}>
        <Logo onClick={handleLogoClick}>
          <LogoText>Flavor Fleet</LogoText>
          <LogoSubtext>A Culinary Voyage</LogoSubtext>
        </Logo>
        <Nav>
          <ul className="d-flex list-unstyled mb-0">
            <li><Link to="/" className="nav-link"><i className="fas fa-home"></i> Home</Link></li>
            <li><Link to="/menu" className="nav-link"><i className="fas fa-utensils"></i> Menu</Link></li>
            <li><span className="nav-link" onClick={handleOffersClickLocal}><i className="fas fa-gift"></i> Offers</span></li>
            <li><Link to="/aboutus" className="nav-link"><i className="fas fa-info-circle"></i> About</Link></li>
            <li><Link to="/contact-us" className="nav-link"><i className="fas fa-phone-alt"></i> Contact</Link></li>
            {user ? (
              <li>
                <ProfileDropdown>
                  <ProfileButton onClick={toggleDropdown} className={dropdownOpen ? "open" : ""}>
                    <FaUserCircle />
                    Profile
                    <FaChevronDown />
                  </ProfileButton>
                  <DropdownContent isOpen={dropdownOpen}>
                    <DropdownItem to="/profile">
                      <FaUser /> My Profile
                    </DropdownItem>
                    <DropdownItem to="/orders">
                      <FaUtensils /> My Orders
                    </DropdownItem>
                    <LogoutButton onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </LogoutButton>
                  </DropdownContent>
                </ProfileDropdown>
              </li>
            ) : (
              <li><Link to="#" className="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal"><i className="fas fa-user"></i> Login</Link></li>
            )}
          </ul>
        </Nav>
        {user ? (
          <MobileProfileButton onClick={toggleDropdown}>
            <FaUserCircle /> Profile
          </MobileProfileButton>
        ) : (
          <LoginButton to="#" data-bs-toggle="modal" data-bs-target="#loginModal">
            <FaUser /> Login
          </LoginButton>
        )}
      </HeaderWrapper>
      <BottomNav id="bottom-nav" className={bottomNavHidden ? "hidden" : ""}>
        <NavItem to="/"><FaHome /> Home</NavItem>
        <NavItem to="/menu"><FaUtensils /> Menu</NavItem>
        <NavItem to="/offers" onClick={handleOffersClickLocal}><FaGift /> Offers</NavItem>
        <NavItem to="/aboutus"><FaInfoCircle /> About</NavItem>
        <NavItem to="/contact-us"><FaPhone /> Contact</NavItem>
      </BottomNav>
    </>
  ) : null;
};

export default Header;