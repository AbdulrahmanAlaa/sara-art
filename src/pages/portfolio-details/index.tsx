import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolioDetails, meta } from "../../content_option";
import { useParams } from "react-router-dom";

interface LoadedImages {
    [key: string]: boolean;
}

export const PortfolioDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const data = id ? dataportfolioDetails[id] : [];
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [fullscreenLoaded, setFullscreenLoaded] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<LoadedImages>({});

    const handleImageClick = (highResSrc: string) => {
        setFullscreenImage(highResSrc);
        setFullscreenLoaded(false); // Reset the loaded state for the fullscreen image
    };

    const handleClose = () => {
        setFullscreenImage(null);
        setFullscreenLoaded(false);
    };

    const handleImageLoad = (imgSrc: string) => {
        setLoadedImages((prev) => ({ ...prev, [imgSrc]: true }));
    };

    const handleFullscreenImageLoad = () => {
        setFullscreenLoaded(true); // Mark the fullscreen image as loaded
    };

    return (
        <HelmetProvider>
            {fullscreenImage && (
                <div className="fullscreen-overlay" onClick={handleClose}>
                    <span className="close-button" onClick={handleClose}>
                        &times;
                    </span>
                    {!fullscreenLoaded && <div className="fullscreen-placeholder">Loading...</div>}
                    <img
                        src={fullscreenImage}
                        alt="High Resolution"
                        className="fullscreen-image"
                        style={{ display: fullscreenLoaded ? "block" : "none" }}
                        onLoad={handleFullscreenImageLoad}
                    />
                </div>
            )}
            <Container className="About-header">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title> Portfolio | {meta.title} </title>
                    <meta name="description" content={meta.description} />
                </Helmet>
                <Row className="mb-0 mt-3 pt-md-3">
                    <Col lg="8">
                        <div className="d-flex align-items-center mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn ac_btn mr-4"
                                style={{ marginRight: "15px" }}
                            >
                                &larr; Back
                            </button>
                            <h1 className="display-4"> Portfolio </h1>
                        </div>
                        <hr className="t_border my-4 ml-0 text-left" />
                    </Col>
                </Row>
                <div className="mb-5 po_items_ho">
                    {data.map((data, i) => (
                        <div key={i} className="po_item">
                            {!loadedImages[data.img] && <div className="image-placeholder" />}
                            <img
                                src={data.img}
                                alt=""
                                onClick={() => handleImageClick(data.highRes || data.img)}
                                onLoad={() => handleImageLoad(data.img)}
                                style={{
                                    cursor: "pointer",
                                    opacity: loadedImages[data.img] ? 1 : 0,
                                    transition: "opacity 0.3s",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </HelmetProvider>
    );
};