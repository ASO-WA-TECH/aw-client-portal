import { useEffect, useState } from "react";
import type { ListingFields } from "../ListingPage/types";

type DetailsProps = {
  listing: ListingFields;
  ownerEmail: string;
};

const Details = ({ listing, ownerEmail }: DetailsProps) => {
  const storageKey = `enquiry:${listing.Title}`;
  const [hasEnquired, setHasEnquired] = useState(false);

  useEffect(() => {
    const checkStoredValue = () => {
      const stored = localStorage.getItem(storageKey);
      setHasEnquired(stored === "true");
    };

    checkStoredValue();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setHasEnquired(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [storageKey]);

  const emailSubject = encodeURIComponent(
    `ASO WA - RENTAL REQUEST: ${listing.Title}`
  );

  const emailBody = encodeURIComponent(
    `Hello,

  I would like to rent the following item:

  Product: ${listing.Title}
  Price: £${listing.Price.toFixed(2)} GBP

  Thank you.`
  );

  const handleEnquiryClick = () => {
    localStorage.setItem(storageKey, "true");
    setHasEnquired(true); // same-tab update
  };

  return (
    <>
      <div className="individual-listing-page__details ">
        <div className="rental-card">
          <span className="individual-listing-page__details__brand">
            ASO WA {listing.Gender === "Man" ? "Men" : "Women"}
          </span>

          <div>
            <h1>{listing.Title?.toUpperCase()}</h1>
            <div className="rental-price">
              <span>Rent from £{listing.Price?.toFixed(2)} per day</span>
            </div>
          </div>
          <h2>Description</h2>
          <p>{listing.Description}</p>

          {hasEnquired ? (
            <button
              className="individual-listing-page__details__enquiry-button is-disabled"
              disabled
            >
              <h2>Enquiry sent</h2>
            </button>
          ) : (
            <a
              className="individual-listing-page__details__enquiry-button"
              href={`mailto:${ownerEmail}?bcc=aso.wa.uk@gmail.com&subject=${emailSubject}&body=${emailBody}`}
              onClick={handleEnquiryClick}
            >
              <h2> RENT NOW</h2>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default Details;
