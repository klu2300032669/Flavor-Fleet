import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";

const HomeWrapper = styled.div`
  padding-bottom: 0px; /* Reduced padding for smaller BottomNav */

  @media (min-width: 769px) {
    padding-bottom: 0; /* No padding on desktop */
  }
`;

const Home = () => {
  const handleOffersClick = () => {
    window.scrollTo({ top: document.querySelector("#services")?.offsetTop || 0, behavior: "smooth" });
  };

  return (
    <HomeWrapper>
      <Header onOffersClick={handleOffersClick} />
      <Hero />
      <Services />
    </HomeWrapper>
  );
};

export default Home;