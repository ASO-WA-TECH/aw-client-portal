import { useEffect, useState } from 'react';
import {
    MdOutlineMailOutline,
    MdCheckCircleOutline,
} from "react-icons/md";
import type { ListingFields } from '../ListingPage/types';

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
            setHasEnquired(stored === 'true');
        };

        checkStoredValue();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === storageKey) {
                setHasEnquired(event.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [storageKey]);

    const emailSubject = encodeURIComponent(`Order Request: ${listing.Title}`);

    const emailBody = encodeURIComponent(
        `Hello,

I would like to order the following item:

Product: ${listing.Title}
Price: £${listing.Price.toFixed(2)} GBP

Thank you.`
    );

    const handleEnquiryClick = () => {
        localStorage.setItem(storageKey, 'true');
        setHasEnquired(true); // same-tab update
    };

    return (
        <div className="individual-listing-page__details">
            <span className="individual-listing-page__details__brand">
                ASO WA {listing.Gender === 'Man' ? 'Men' : 'Women'}
            </span>

            <div className="individual-listing-page__details__price">
                <h3 className="individual-listing-page__details__price__text">
                    {listing.Title.toUpperCase()}
                </h3>
                <span className="individual-listing-page__details__price__number">
                    £{listing.Price.toFixed(2)} <small>GBP</small>
                </span>
            </div>

            <h4 className="individual-listing-page__details__description-title">
                Description
            </h4>
            <p className="individual-listing-page__details__description-data">
                {listing.Description}
            </p>

            {hasEnquired ? (
                <button
                    className="individual-listing-page__details__enquiry-button is-disabled"
                    disabled
                >
                    <MdCheckCircleOutline className="individual-listing-page__details__icon" />
                    Enquiry sent
                </button>
            ) : (
                <a
                    className="individual-listing-page__details__enquiry-button"
                    href={`mailto:${ownerEmail}?cc=aso.wa.uk@gmail.com&subject=${emailSubject}&body=${emailBody}`}
                    onClick={handleEnquiryClick}
                >
                    <MdOutlineMailOutline className="individual-listing-page__details__icon" />
                    Make an enquiry
                </a>
            )}
        </div>
    );
};

export default Details;
