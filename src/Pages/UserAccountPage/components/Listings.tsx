import React from "react";
import ListingDisplayImage from "../../../stories/ListingDisplayImage/ListingDisplayImage";
import { useNavigate } from "react-router-dom";

interface ListingItem {
  id: string;
  createdTime: string;
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
}

interface ListingsProps {
  listings: ListingItem[];
}

const Listings: React.FC<ListingsProps> = ({ listings }) => {
  const navigate = useNavigate();

  const handleEditListing = (id: string) => {
    navigate(`/listing/${id}/edit`);
  };

  if (!listings || listings.length === 0) {
    return (
      <section className="renting-lending">
        <h2>LISTINGS</h2>
        <div className="empty-state">
          <h3>
            ONCE YOU START LISTING
            <br />
            ALL YOUR ITEMS WILL BE ACCESSIBLE HERE.
          </h3>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="renting-lending">
        <h2>LISTINGS</h2>
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingDisplayImage
              key={listing.id}
              imageUrl={listing.Images?.[0]?.url ?? ""}
              title={listing.Title ?? "Untitled"}
              subtitle={`£${listing.Price?.toFixed(2) ?? "0.00"}`}
              status={listing.Status ?? "Pending"}
              buttonText={"Edit Listing"}
              onButtonClick={() => handleEditListing(listing.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Listings;
