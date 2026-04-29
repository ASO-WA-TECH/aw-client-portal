import React, { useState } from "react";

type ImageProps = {
  images: { url: string }[];
  title: string;
};

const Image: React.FC<ImageProps> = ({ images = [], title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="individual-listing-page__image-wrapper">
      {hasImages ? (
        <img
          src={images[currentIndex]?.url}
          alt={title}
          className="individual-listing-page__image-wrapper__image"
        />
      ) : (
        <div className="individual-listing-page__image-wrapper__placeholder">
          No Image
        </div>
      )}

      {/* Back button */}
      <button className="individual-listing-page__image-wrapper__back-btn">
        <a href="/listings">←</a>
      </button>

      {/* Carousel Controls */}
      {hasMultiple && (
        <>
          <button
            className="individual-listing-page__image-wrapper__nav individual-listing-page__image-wrapper__nav--left"
            onClick={prevImage}
          >
            ‹
          </button>

          <button
            className="individual-listing-page__image-wrapper__nav individual-listing-page__image-wrapper__nav--right"
            onClick={nextImage}
          >
            ›
          </button>

          <div className="individual-listing-page__image-wrapper__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`individual-listing-page__image-wrapper__dot ${
                  i === currentIndex
                    ? "individual-listing-page__image-wrapper__dot--active"
                    : ""
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Image;
