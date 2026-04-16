import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import HttpService from "../../Services/httpService";
import ListingDisplayImage from "../../ListingDisplayImage/ListingDisplayImage";
import { Routes } from "../../Routes";

interface ListingRecord {
  id: string;
  fields: {
    Title: string;
    Price: number;
    Gender: string;
    Description: string;
    Images?: Array<{ url: string }>;
  };
}

const LandingPage = () => {
  const httpService = useMemo(() => new HttpService("Listings"), []);

  const [listings, setListings] = useState<ListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await httpService.fetchAllRecords();
        setListings(data as ListingRecord[]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [httpService]);

  return (
    <div className="landingWrapper">
      <section className="heroSection">
        <div className="heroContent">
          <h1 className="heroTitle">OWN THE MOMENT</h1>
          <Link to={Routes.LISTING} className="heroBtn">
            RENT NOW
          </Link>
        </div>
      </section>

      <section className="carouselSection">
        <h2 className="sectionHeading">JUST LANDED</h2>
        <div className="carouselContainer">
          <div className="productGrid">
            {listings.length > 0
              ? listings
                  .slice(-3)
                  .map((listing, index) => (
                    <ListingDisplayImage
                      key={listing.id || index}
                      listingId={listing.id}
                      title={listing.fields.Title}
                      subtitle={`£${listing.fields.Price}`}
                      imageUrl={listing.fields.Images?.[0]?.url}
                      darkMode={false}
                    />
                  ))
              : !loading && <p>No listings found.</p>}
          </div>
        </div>
      </section>

      {error && <div className="errorBanner">{error}</div>}
    </div>
  );
};

export default LandingPage;
