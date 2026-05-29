import type { FlattenedListing } from "./types";
import ListingDisplayImage from "../../stories/ListingDisplayImage/ListingDisplayImage";

interface ListingGridProps {
  listings: FlattenedListing[];
  onItemClick: (id: string) => void;
}

const ListingGrid = ({ listings, onItemClick }: ListingGridProps) => {
  if (listings.length === 0) {
    return (
      <p className="listing-page__no-results">
        No listings match your filters.
      </p>
    );
  }

  return (
    <div className="listing-page__container__listings">
      {listings.map((data) => (
        <div
          key={data.id}
          onClick={() => onItemClick(data.id)}
          style={{ cursor: "pointer" }}
        >
          <ListingDisplayImage
            imageUrl={data.Images?.[0]?.url}
            title={data.Title}
            subtitle={`£${data.Price ? Number(data.Price).toFixed(2) : "0.00"}`}
            listingId={data.id}
          />
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
