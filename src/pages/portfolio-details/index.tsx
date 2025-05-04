import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { dataportfolioDetails, meta } from "../../content_option";
import { useParams } from "react-router-dom";
import { VscClose } from "react-icons/vsc"; // Import the close icon
import ImageWithProgress from "../../components/ImageWithProgress";

interface LoadedImages {
    [key: string]: boolean;
}

export const PortfolioDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const data = id ? dataportfolioDetails[id] : [];
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<LoadedImages>({});

    const handleImageClick = (highResSrc: string) => {
        setFullscreenImage(highResSrc);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    const handleImageLoad = (imgSrc: string) => {
        setLoadedImages((prev) => ({ ...prev, [imgSrc]: true }));
    };
    const CloseIcon = VscClose as unknown as React.FC;

    return (
        <HelmetProvider>
            <Modal
                show={!!fullscreenImage}
                onHide={handleCloseFullscreen}
                centered
                fullscreen
                className="fullscreen-modal"
            >
                <Modal.Body className="p-0">
                    <button className="close-icon" onClick={handleCloseFullscreen}>
                        <CloseIcon />
                    </button>
                    {fullscreenImage && (
                        <ImageWithProgress
                            src={fullscreenImage}
                            alt="High Resolution"
                            className="w-100"
                            style={{ height: "100vh", objectFit: "contain" }}
                        />
                    )}
                </Modal.Body>
            </Modal>

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