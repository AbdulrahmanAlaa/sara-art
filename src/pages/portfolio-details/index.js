import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolioDetails, meta } from "../../content_option";
import { useParams } from "react-router-dom";

export const PortfolioDetails = () => {
  const { id } = useParams();
  const data = dataportfolioDetails[id];
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleImageClick = (imgSrc) => {
    setFullscreenImage(imgSrc);
  };

  const handleClose = () => {
    setFullscreenImage(null);
  };

  return (
    <HelmetProvider>
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={handleClose}>
          <span className="close-button">&times;</span>
          <img src={fullscreenImage} alt="" className="fullscreen-image" />
        </div>
      )}
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Portfolio | {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-0 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> Portfolio </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho">
          {data.map((data, i) => {
            return (
              <div key={i} className="po_item">
                <img
                  src={data.img}
                  alt=""
                  onClick={() => handleImageClick(data.img)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider>
  );
};
