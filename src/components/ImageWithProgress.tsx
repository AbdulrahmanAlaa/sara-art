import React, { useEffect, useState } from "react";

interface ImageWithProgressProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

const ImageWithProgress: React.FC<ImageWithProgressProps> = ({ src, ...props }) => {
    const [progress, setProgress] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", src, true);
        xhr.responseType = "blob";

        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        };

        xhr.onload = () => {
            const url = URL.createObjectURL(xhr.response);
            setImageUrl(url);
            setLoaded(true);
        };

        xhr.onerror = () => {
            setProgress(100); // fail-safe
            setLoaded(true);
        };

        xhr.send();

        return () => {
            xhr.abort();
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [src]);

    if (!loaded) {
        return (
            <div style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#111",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}>
                <div style={{ color: "#fff", marginBottom: "10px" }}>{progress}%</div>
                <div style={{
                    width: "80%",
                    height: "10px",
                    backgroundColor: "#444",
                    borderRadius: "5px",
                    overflow: "hidden",
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: "#0f0",
                        transition: "width 0.3s ease",
                    }} />
                </div>
            </div>
        );
    }

    return <img src={imageUrl} {...props} />;
};

export default ImageWithProgress;
