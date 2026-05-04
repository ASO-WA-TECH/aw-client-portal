import { useState } from "react";
import { useParams } from "react-router-dom";
import type { ListingFields } from "../ListingPage/types";
import HttpService from "../../Services/httpService";
import { useAuth } from "../../Services/Auth/AuthContext";

type DetailsProps = {
  listing: ListingFields;
  ownerEmail: string;
};

const listingHttpService = new HttpService("Listings");
const rentalHttpService = new HttpService("Rentals");
const userHttpService = new HttpService("Users");

const Details = ({ listing, ownerEmail }: DetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState(listing.Status);
  const [error, setError] = useState<string | null>(null);

  const handleInterestClick = async (listingId: string) => {
    if (!currentUser?.uid) return;

    const [existingRentals, allUsers] = await Promise.all([
      rentalHttpService.fetchAllRecords(),
      userHttpService.fetchAllRecords(),
    ]);

    const airtableUser = allUsers.find(
      (user: { id: string; fields: { auth_uid: string } }) =>
        user.fields.auth_uid === currentUser.uid,
    );

    if (!airtableUser) return;

    const alreadyInterested = existingRentals.some(
      (r: { fields: { Rentee?: string[]; Listing?: string[] } }) =>
        r.fields.Rentee?.[0] === airtableUser.id &&
        r.fields.Listing?.[0] === listingId,
    );

    if (alreadyInterested) return;

    handleRent();
  };

  const handleRent = async () => {
    if (!id || !currentUser?.uid) return; // we need to create a toast modal to show this error to the user instead of just silently failing
    try {
      // 1. Find the Airtable User record matching the Firebase UID
      const allUsers = await userHttpService.fetchAllRecords();
      const airtableUser = allUsers.find(
        (user: { id: string; fields: { auth_uid: string } }) =>
          user.fields.auth_uid === currentUser.uid,
      );

      if (!airtableUser) {
        console.error(
          "No matching Airtable user found for uid:",
          currentUser.uid,
        );
        return;
      }

      // 2. Create Rental record
      const rentalPayload = {
        Listing: [id],
        Rentee: [airtableUser.id],
        Status: "pending",
      };
      try {
        await rentalHttpService.createRecords(rentalPayload);
      } catch (error) {
        console.error("Full error object:", error);
        console.error("Error response data:", error?.response?.data);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to process rental request",
        );
        return;
      }

      // 3. Update Listing status — only reached if rental succeeded
      await listingHttpService.updateRecord({
        id,
        fields: {
          Status: "pending",
        },
      });
      setStatus("pending");

      // 4. Open mailto — only reached if everything succeeded
      window.location.href = `mailto:${ownerEmail}?subject=Rental Request: ${listing.Title}&body=Hello,%0D%0A%0D%0AI would like to rent: ${listing.Title}%0D%0APrice: £${listing.Price?.toFixed(2)}%0D%0A%0D%0AThank you.`;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process rental request",
      );
    }
  };

  const renderStatus = () => {
    if (status === "pending") {
      return <h2>This item is currently pending</h2>;
    }
    if (status === "unavailable") {
      return <h2>This item is currently unavailable</h2>;
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    return (
      <button
        className="individual-listing-page__details__enquiry-button"
        onClick={() => handleInterestClick(id!)}
      >
        <h2>RENT NOW</h2>
      </button>
    );
  };

  return (
    <div className="individual-listing-page__details">
      <div className="rental-card">
        <span className="individual-listing-page__details__brand">
          ASO WA {listing.Gender === "Man" ? "Men" : "Women"}
        </span>
        <h1>{listing.Title?.toUpperCase()}</h1>
        <div className="rental-price">
          <span>Rent from £{listing.Price?.toFixed(2)} per day</span>
        </div>
        <h2>Description</h2>
        <p>{listing.Description}</p>
        {renderStatus()}
      </div>
    </div>
  );
};

export default Details;
