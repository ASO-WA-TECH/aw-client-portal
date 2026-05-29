import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ListingFields } from "../ListingPage/types";
import HttpService, { type AirtableRecord } from "../../Services/httpService";
import { toast } from "react-toastify";
import Button from "../../stories/Button";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../Services/Auth/AuthContext";
import InputField from "../../stories/InputField";
import { Routes } from "../../Routes";
import howItWorksContent from "../../Content/how-it-works.json";
import InfoTabs from "../../Components/InfoTabs";

type DetailsProps = {
  listing: ListingFields;
  ownerEmail: string;
  ownerName?: string;
};

interface UserFields {
  [key: string]: unknown;
  auth_uid: string;
}

interface RentalFields {
  [key: string]: unknown;
  Rentee?: string[];
  Listing?: string[];
}

const listingHttpService = new HttpService<ListingFields>("Listings");
const rentalHttpService = new HttpService<RentalFields>("Rentals");
const userHttpService = new HttpService<UserFields>("Users");

const Details = ({ listing, ownerEmail, ownerName }: DetailsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState(listing.Status);
  const [error, setError] = useState<string | null>(null);
  const [dateNeeded, setDateNeeded] = useState("");
  const [numDays, setNumDays] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid || !listing.Owner?.length) return;

    const checkOwner = async () => {
      try {
        const allUsers = await userHttpService.fetchAllRecords();
        const airtableUser = allUsers.find(
          (user: AirtableRecord<UserFields>) =>
            user.fields.auth_uid === currentUser.uid,
        );
        if (airtableUser && listing.Owner.includes(airtableUser.id)) {
          setIsOwner(true);
        }
      } catch (err) {
        toast.error("Failed to check owner status");
        console.error(err);
      }
    };

    checkOwner();
  }, [currentUser, listing.Owner]);

  const handleInterestClick = async (listingId: string) => {
    if (!currentUser?.uid) return;

    try {
      const [existingRentals, allUsers] = await Promise.all([
        rentalHttpService.fetchAllRecords(),
        userHttpService.fetchAllRecords(),
      ]);

      // 2. ADDED TYPES TO FIX IMPLICIT 'ANY' ERRORS
      const airtableUser = allUsers.find(
        (user: AirtableRecord<UserFields>) =>
          user.fields.auth_uid === currentUser.uid,
      );

      if (!airtableUser) return;

      const alreadyInterested = existingRentals.some(
        (r: AirtableRecord<RentalFields>) =>
          r.fields.Rentee?.[0] === airtableUser.id &&
          r.fields.Listing?.[0] === listingId,
      );

      if (alreadyInterested) return;

      handleRent();
    } catch {
      setError("Failed to check interest status.");
    }
  };

  const handleRent = async () => {
    if (!id || !currentUser?.uid) return;
    try {
      const allUsers = await userHttpService.fetchAllRecords();
      const airtableUser = allUsers.find(
        (user: AirtableRecord<UserFields>) =>
          user.fields.auth_uid === currentUser.uid,
      );

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

      const formattedDate = dateNeeded
        ? dateNeeded.split("-").reverse().join("-")
        : "";
      const mailtoUrl = `mailto:${ownerEmail}?bcc=hello@aso-wa.com&subject=ASO WA Rental request: ${listing.Title}&body=Hello,%0D%0A%0D%0AI would like to rent: ${listing.Title}%0D%0APrice: £${listing.Price?.toFixed(2)}%0D%0A%0D%0AI'd need it for ${formattedDate} and would like to rent it for ${numDays} days%0D%0A%0D%0APlease let me know how you'd like to proceed in terms of payment and delivery.%0D%0A%0D%0AThanks,%0D%0A%0D%0A-----------%0D%0AASO WA`;
      const a = document.createElement("a");
      a.href = mailtoUrl;
      a.click();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process rental request",
      );
    }
  };

  const renderStatus = () => {
    if (status === "pending" || status === "unavailable") {
      return <h2>This item is currently being rented.</h2>;
    }
    if (error) {
      return <p>Error: {error}</p>;
    }

    return currentUser ? (
      <div className="individual-listing-page__details__rental-form">
        <InputField
          label="Date needed"
          type="date"
          value={dateNeeded}
          handleChange={(e) => setDateNeeded(e.target.value)}
          customStyle={{ marginBottom: 16 }}
          required
        />
        <InputField
          label="Number of days"
          type="number"
          value={numDays}
          handleChange={(e) => setNumDays(e.target.value)}
          customStyle={{ marginBottom: 16 }}
          required
        />
        <button
          className="individual-listing-page__details__enquiry-button"
          onClick={() => handleInterestClick(id!)}
          disabled={!dateNeeded || !numDays}
        >
          <h2>Enquire Now</h2>
        </button>
      </div>
    ) : (
      <div className="rental-card">
        <p>Please log in or sign up to express interest in this listing.</p>
        <Button
          type="button"
          text="Login/ Sign up"
          handleClick={() =>
            navigate(Routes.AUTHENTICATE, { state: { from: location } })
          }
        />
      </div>
    );
  };

  return (
    <div className="individual-listing-page__details">
      <div className="rental-card">
        {isOwner && (
          <div className="individual-listing-page__details__owner-banner">
            <p>This is your listing</p>
          </div>
        )}
        <span className="individual-listing-page__details__brand">
          ASO WA {listing.Gender === "Man" ? "Men" : "Women"}
        </span>
        <h1>{listing.Title?.toUpperCase()}</h1>
        <div className="rental-price">
          <span>Rent from £{listing.Price?.toFixed(2)} per day</span>
        </div>
        <h2>Description</h2>
        <p>{listing.Description}</p>
        <h2>Size & Fit</h2>
        <p>{listing.Size}</p>
        {listing.Colour && listing.Colour.length > 0 && (
          <>
            <h2>Colour</h2>
            <p>{listing.Colour.join(", ")}</p>
          </>
        )}
        {ownerName && (
          <>
            <h2>Owner</h2>
            <p>{ownerName}</p>
          </>
        )}
        {listing.ModelHeight && (
          <div>
            <h2>Model Height</h2>
            <p>{listing.ModelHeight}</p>
          </div>
        )}
        {!isOwner && renderStatus()}
        {!isOwner && <InfoTabs content={howItWorksContent} />}
      </div>
    </div>
  );
};

export default Details;
