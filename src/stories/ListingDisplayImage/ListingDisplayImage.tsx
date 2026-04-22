import React from "react";
import "./ListingDisplayImage.scss";

import Button from "../Button/index";

interface ListingDisplayImageProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  status?: string;
  darkMode?: boolean;
  buttonText?: string;
  buttonVariant?: "primary";
  onButtonClick?: () => void;
  listingId?: string;
}

const ListingDisplayImage: React.FC<ListingDisplayImageProps> = ({
  imageUrl,
  title,
  subtitle,
  status,
  darkMode,
  buttonText,
  onButtonClick,
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
          Price: <span className="bold-text">{subtitle}</span>/ per day
          {status && (
            <span>
              <br />
              Status: <span className="bold-text">{status}</span>
            </span>
          )}
        </p>
        {buttonText && ( // only renders if passed in
          <div className="listing-display-image__button">
            <Button
              text={buttonText}
              variant="primary"
              type="button"
              handleClick={onButtonClick ?? (() => {})}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDisplayImage;
