import React, { useEffect, useState } from "react";

const DriveImage = ({ fileId, style }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const url = `https://drive.google.com/uc?export=view&id=${fileId}`;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        setSrc(
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='gray'/><text x='50%' y='50%' fill='white' font-size='20' text-anchor='middle' dy='.3em'>Image failed</text></svg>"
        );
      });
  }, [fileId]);

  if (!src) return <p>Loading...</p>;

  return <img src={src} style={style} alt="gallery" />;
};

export default DriveImage;