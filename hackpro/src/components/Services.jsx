  import React from "react";
  import styled from "styled-components";

  const ServicesSection = styled.section`
    padding: 100px 0;
    background: rgba(0, 0, 0, 0.75);

    @media (max-width: 768px) {
      padding: 60px 0;
    }
  `;

  const ServicesTitle = styled.h2`
    font-size: 50px;
    font-weight: 800;
    margin-bottom: 60px;
    background: linear-gradient(45deg, #ff8a65, #ff4081, #ffd740);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      font-size: 36px;
      margin-bottom: 40px;
    }
  `;

  const ServiceCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 40px 20px;
    color: #fff;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    transition: all 0.5s ease;
    border: 1px solid rgba(255, 64, 129, 0.2);

    &:hover {
      transform: translateY(-15px) scale(1.02);
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 40px rgba(255, 64, 129, 0.3);
    }

    i {
      font-size: 60px;
      margin-bottom: 25px;
      color: #ff4081;
      text-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
    }

    &:hover i {
      transform: scale(1.1);
    }

    h5 {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #ffd740;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: #ddd;
    }

    @media (max-width: 768px) {
      padding: 30px 15px;

      i {
        font-size: 50px;
        margin-bottom: 20px;
      }

      h5 {
        font-size: 22px;
      }

      p {
        font-size: 14px;
      }
    }
  `;

  const Services = () => {
    return (
      <ServicesSection className="py-5 text-center">
        <div className="container">
          <ServicesTitle>Our Signature Services</ServicesTitle>
          <div className="row">
            <div className="col-md-4 mb-4">
              <ServiceCard>
                <i className="fas fa-truck"></i>
                <h5>Swift Delivery</h5>
                <p>Delectable meals arrive hot and fresh, right on time.</p>
              </ServiceCard>
            </div>
            <div className="col-md-4 mb-4">
              <ServiceCard>
                <i className="fas fa-leaf"></i>
                <h5>Green Commitment</h5>
                <p>Sustainable packaging for a tastier, cleaner world.</p>
              </ServiceCard>
            </div>
            <div className="col-md-4 mb-4">
              <ServiceCard>
                <i className="fas fa-gift"></i>
                <h5>Elite Offers</h5>
                <p>Unwrap exclusive deals for a delightful experience.</p>
              </ServiceCard>
            </div>
          </div>
        </div>
      </ServicesSection>
    );
  };

  export default Services;