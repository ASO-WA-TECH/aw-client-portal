import { useState } from "react";
import { useParams } from "react-router-dom";
import type { ListingFields } from "../ListingPage/types";
import HttpService, { type AirtableRecord } from "../../Services/httpService";
import { useAuth } from "../../Services/Auth/AuthContext";

type DetailsProps = {
  listing: ListingFields;
  ownerEmail: string;
};

interface UserFields {
  [key: string]: unknown;
  auth_uid: string;
}

interface RentalFields {
  Rentee?: string[];
  Listing?: string[];
}

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

    const airtableUser = (
      allUsers as unknown as AirtableRecord<UserFields>[]
    ).find((user) => user.fields.auth_uid === currentUser.uid);

    if (!airtableUser) return;

    const alreadyInterested = (
      existingRentals as unknown as AirtableRecord<RentalFields>[]
    ).some(
      (r) =>
        r.fields.Rentee?.[0] === airtableUser.id &&
        r.fields.Listing?.[0] === listingId,
    );

    if (alreadyInterested) return;

    handleRent();
  };

  const handleRent = async () => {
    if (!id || !currentUser?.uid) return;
    try {
      const allUsers = await userHttpService.fetchAllRecords();
      const airtableUser = (
        allUsers as unknown as AirtableRecord<UserFields>[]
      ).find((user) => user.fields.auth_uid === currentUser.uid);

      if (!airtableUser) {
        console.error(
          "No matching Airtable user found for uid:",
          currentUser.uid,
        );
        return;
      }

      const rentalPayload = {
        Listing: [id],
        Rentee: [airtableUser.id],
        Status: "pending",
      };

      try {
        await rentalHttpService.createRecords(rentalPayload);
      } catch (err) {
        console.error("Full error object:", err);
        const axiosError = err as { response?: { data?: unknown } };
        console.error("Error response data:", axiosError?.response?.data);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to process rental request",
        );
        return;
      }

      await listingHttpService.updateRecord({
        id,
        fields: {
          Status: "pending",
        },
      });
      setStatus("pending");

      window.location.href = `mailto:${ownerEmail}?subject=Rental Request: ${listing.Title}&body=Hello,%0D%0A%0D%0AI would like to rent: ${listing.Title}%0D%0APrice: £${listing.Price?.toFixed(2)}%0D%0A%0D%0AThank you.`;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process rental request",
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
