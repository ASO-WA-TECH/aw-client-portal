import React from "react";
import ListingDisplayImage from "../../../stories/ListingDisplayImage/ListingDisplayImage";

interface RentalItem {
  id: string;
  createdTime: string;
  RentalId?: number;
  Status?: string;
  Listing?: string[];
  Rentee?: string[];
  "Created At"?: string;
  listingDetails?: {
    id: string;
    Images?: { url: string }[];
    Title?: string;
    Price?: number;
    Status?: string;
  } | null;
}
interface RentalsProps {
  rentals: RentalItem[];
}

const Rentals: React.FC<RentalsProps> = ({ rentals }) => {
  if (!rentals || rentals.length === 0) {
    return (
      <section className="renting-lending">
        <h2>RENTALS</h2>
        <div className="empty-state">
          <h3>
            ONCE YOU START RENTING
            <br />
            ALL YOUR ORDERS WILL BE ACCESSIBLE HERE.
          </h3>
        </div>
      </section>
    );
  }

  return (
    <section className="renting-lending">
      <h2>RENTALS</h2>
      <p>
        View all the items you’re currently renting, have rented in the past, or
        have shown interest in.{" "}
      </p>
      <div className="listings-grid">
        {rentals.map((rental) => (
          <ListingDisplayImage
            key={rental.id}
            imageUrl={rental.listingDetails?.Images?.[0]?.url ?? ""}
            title={rental.listingDetails?.Title ?? "Untitled"}
            subtitle={`£${rental.listingDetails?.Price?.toFixed(2) ?? "0.00"}`}
            status={rental.listingDetails?.Status ?? "Unknown"}
          />
        ))}
      </div>
    </section>
  );
};

export default Rentals;
