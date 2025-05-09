import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";
import { Link } from "react-router-dom";
import { PortfolioItem } from "../../types";

export const Portfolio: React.FC = () => {
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

    const handleImageLoad = (imgSrc: string) => {
        setLoadedImages((prev) => ({ ...prev, [imgSrc]: true }));
    };

    return (
        <HelmetProvider>
            <Container className="About-header">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title> Portfolio | {meta.title} </title>{" "}
                    <meta name="description" content={meta.description} />
                </Helmet>
                <Row className="mb-5 mt-3 pt-md-3">
                    <Col lg="8">
                        <h1 className="display-4 mb-4"> Portfolio </h1>{" "}
                        <hr className="t_border my-4 ml-0 text-left" />
                    </Col>
                </Row>
                <div className="mb-5 po_items_ho">
                    {dataportfolio.map((data: PortfolioItem, i: number) => {
                        return (
                            <div key={i} className="po_item">
                                {!loadedImages[data.img] && (
                                    <div className="image-placeholder">Loading...</div>
                                )}
                                <img
                                    src={data.img}
                                    alt=""
                                    onLoad={() => handleImageLoad(data.img)}
                                    style={{
                                        opacity: loadedImages[data.img] ? 1 : 0,
                                        transition: "opacity 0.3s",
                                    }}
                                />
                                <div className="content">
                                    <p>{data.description}</p>
                                    <Link to={`/portfolio/${data.id}`}> view project</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </HelmetProvider>
    );
};