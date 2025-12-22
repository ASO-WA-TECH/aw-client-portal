import React from 'react';
import type { ListingFields } from '../ListingPage/types';

type DetailsProps = {
    listing: ListingFields;
};

const Details: React.FC<DetailsProps> = ({ listing }) => {
    const emailSubject = encodeURIComponent(`Order Request: ${listing.Title}`);

    const emailBody = encodeURIComponent(
        `Hello,

I would like to order the following item:

Product: ${listing.Title}
Price: £${listing.Price.toFixed(2)} GBP

Please reply to this email with the following details:
- Size:
- Quantity:
- Delivery address:
- Phone number:

Thank you.`
    );

    const handleAddToCartClick = () => {
        const mailtoLink = `mailto:orders@asowa.com?cc=sales@asowa.com&subject=${emailSubject}&body=${emailBody}`;
        window.location.href = mailtoLink; // Forces browser to open mail client
    };


    return (
        <div className="individual-listing-page__details">
            <span className="individual-listing-page__details__brand">ASO WA Mens</span>

            <div className="individual-listing-page__details__price">
                <h3 className="individual-listing-page__details__price__text">{listing.Title}</h3>
                <span className="individual-listing-page__details__price__number">
                    £{listing.Price.toFixed(2)} <small>GBP</small>
                </span>
            </div>

            <h4 className="individual-listing-page__details__description-title">Description</h4>
            <p className="individual-listing-page__details__description-data">{listing.Description}</p>

            <a
                className="individual-listing-page__details__enquiry-button"
                href={`mailto:orders@asowa.com?cc=sales@asowa.com&subject=${emailSubject}&body=${emailBody}`}
            >
                🛒 ADD TO CART
            </a>
        </div>
    );
};

export default Details;
