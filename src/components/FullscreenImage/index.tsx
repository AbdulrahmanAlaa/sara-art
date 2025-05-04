import React, { useEffect } from "react";
import "./style.css";

interface FullscreenImageProps {
    imageSrc: string;
    onClose: () => void;
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({ imageSrc, onClose }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);

    useEffect(() => {
        setIsLoaded(false); // Reset loaded state when imageSrc changes
    }, [imageSrc]);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="fullscreen-overlay" onClick={onClose}>
            <span className="close-button" onClick={onClose}>
                &times;
            </span>
            {!isLoaded && (
                <div
                    className="fullscreen-placeholder"
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundColor: "#000",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    Loading...
                </div>
            )}
            <img
                src={imageSrc}
                alt="High Resolution"
                className="fullscreen-image"
                style={{ display: isLoaded ? "block" : "none" }}
                onLoad={handleImageLoad}
            />
        </div>
    );
};
