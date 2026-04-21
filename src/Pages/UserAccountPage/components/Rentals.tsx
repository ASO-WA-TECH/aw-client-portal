import React from "react";
import ListingDisplayImage from "../../../stories/ListingDisplayImage/ListingDisplayImage";

interface RentalItem {
  id: string;
  createdTime: string;
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
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
      <div className="listings-grid">
        {rentals.map((rental) => (
          <ListingDisplayImage
            key={rental.id}
            imageUrl={rental.Images?.[0]?.url ?? ""}
            title={rental.Title ?? "Untitled"}
            subtitle={`£${rental.Price?.toFixed(2) ?? "0.00"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Rentals;
