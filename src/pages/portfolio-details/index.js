import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolioDetails, meta } from "../../content_option";
import { useParams } from "react-router-dom";
import { getOptimizedImagePath } from "../../utils/imageHelpers";

export const PortfolioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = dataportfolioDetails[id];
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageClick = (imgSrc) => {
    setFullscreenImage(imgSrc);
  };

  const handleClose = () => {
    setFullscreenImage(null);
  };

  const handleImageLoad = (imgSrc) => {
    setLoadedImages(prev => ({ ...prev, [imgSrc]: true }));
  };

  return (
    <HelmetProvider>
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={handleClose}>
          <span className="close-button">&times;</span>
          <img src={getOptimizedImagePath(fullscreenImage)} alt="" className="fullscreen-image" />
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
            <div className="d-flex align-items-center mb-4">
              <button
                onClick={() => navigate(-1)}
                className="btn ac_btn mr-4"
                style={{ marginRight: '15px' }}
              >
                &larr; Back
              </button>
              <h1 className="display-4"> Portfolio </h1>
            </div>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho">
          {data.map((data, i) => {
            const optimizedSrc = getOptimizedImagePath(data.img);
            return (
              <div key={i} className="po_item">
                {!loadedImages[optimizedSrc] && <div className="image-placeholder" />}
                <img
                  src={optimizedSrc}
                  alt=""
                  loading="lazy"
                  onClick={() => handleImageClick(data.img)}
                  onLoad={() => handleImageLoad(optimizedSrc)}
                  style={{
                    cursor: 'pointer',
                    opacity: loadedImages[optimizedSrc] ? 1 : 0,
                    transition: 'opacity 0.3s'
                  }}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider>
  );
};
