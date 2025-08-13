import React from "react";
import "./ListingDisplayImage.scss";

interface ListingDisplayImageProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  darkMode?: boolean;
}

const ListingDisplayImage: React.FC<ListingDisplayImageProps> = ({
  imageUrl,
  title,
  subtitle,
  darkMode,
}) => {
  const cardClasses = `listing-display-image ${darkMode ? "dark-mode" : ""}`;

  return (
    <div className={cardClasses}>
      <div className="listing-display-image__image-container">
        <img
          src={imageUrl}
          alt={title}
          className="listing-display-image__image"
        />
      </div>
      <div className="listing-display-image__details">
        <h3 className="listing-display-image__title">{title}</h3>
        <p className="listing-display-image__subtitle">
          <span className="price">{subtitle}</span>
          <span className="per-day">Per Day</span>
        </p>
      </div>
    </div>
  );
};

export default ListingDisplayImage;
