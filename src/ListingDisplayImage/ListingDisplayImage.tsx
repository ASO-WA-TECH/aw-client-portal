import React from "react";
import "./ListingDisplayImage.scss";

interface ListingDisplayImageProps {
  imageUrl: string; //Url of image
  title: string; // Title of image card
  subtitle: string; //subtitle or description of image card
  darkMode?: boolean;
  listingId: string;
}

const ListingDisplayImage: React.FC<ListingDisplayImageProps> = ({
  imageUrl,
  title,
  subtitle,
  darkMode,
  listingId
}) => {
  const cardClasses = `listing-display-image ${darkMode ? "dark-mode" : ""}`;

  return (
    <div className={cardClasses}>
      <a href={`listing/${listingId}`} className="listing-display-image__link">
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
            <span className="price">{subtitle} GBP</span>
            <span className="per-day">Per Day</span>
          </p>
        </div>
      </a>
    </div>
  );
};

export default ListingDisplayImage;
