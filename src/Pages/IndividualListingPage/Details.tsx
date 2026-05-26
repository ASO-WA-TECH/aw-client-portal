import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ListingFields } from "../ListingPage/types";
import HttpService, { type AirtableRecord } from "../../Services/httpService";
import { useAuth } from "../../Services/Auth/AuthContext";
import { InputField } from "../../stories/InputField";
import { Button } from "../../stories";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../Routes";
import howItWorksContent from "../../Content/how-it-works.json";
import InfoTabs from "../../Components/InfoTabs";

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
  const navigate = useNavigate();
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
      const allUsers = await userHttpService.fetchAllRecords();
      const airtableUser = (
        allUsers as unknown as AirtableRecord<UserFields>[]
      ).find((user) => user.fields.auth_uid === currentUser.uid);
      if (airtableUser && listing.Owner.includes(airtableUser.id)) {
        setIsOwner(true);
      }
    };

    checkOwner();
  }, [currentUser, listing.Owner]);

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
      const mailtoUrl = `mailto:${ownerEmail}?bcc=hello@aso-wa.com&subject=Rental Request: ${listing.Title}&body=Hello,%0D%0A%0D%0AI would like to rent: ${listing.Title}%0D%0APrice: £${listing.Price?.toFixed(2)}%0D%0A%0D%0AI'd need it for ${formattedDate} and would like to rent it for ${numDays} days%0D%0A%0D%0APlease let me know how you'd like to proceed in terms of payment and delivery.%0D%0A%0D%0AThanks`;
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
          <h2>RENT NOW</h2>
        </button>
      </div>
    );
  };

  return (
    <div className="individual-listing-page__details">
      {currentUser ? (
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
          {!isOwner && renderStatus()}
          {!isOwner && <InfoTabs content={howItWorksContent} />}
        </div>
      ) : (
        <div className="rental-card">
          <p>Please log in or sign up to express interest in this listing.</p>
          <Button
            type="button"
            text="Login/ Sign up"
            handleClick={() => navigate(Routes.AUTHENTICATE)}
          />
        </div>
      )}
    </div>
  );
};

export default Details;
