import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import HttpService from "../../Services/httpService";
import ListingDisplayImage from "../../stories/ListingDisplayImage/ListingDisplayImage";

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
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await httpService.fetchAllRecords();
        const records: ListingRecord[] = data.map((record) => ({
          id: record.id,
          fields: record.fields as ListingRecord["fields"],
        }));
        setListings(records);
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
    <div>
      <section className="heroSection"></section>
      <section className="carouselSection">
        <h2 className="sectionHeading">JUST LANDED</h2>
        <div className="carouselContainer">
          <div className="productGrid">
            {listings.length > 0
              ? listings.slice(-3).map((listing, index) => (
                  <div
                    key={listing.id || index}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <ListingDisplayImage
                      listingId={listing.id}
                      title={listing.fields.Title}
                      subtitle={`£${listing.fields.Price}`}
                      imageUrl={listing.fields.Images?.[0]?.url ?? ""}
                      darkMode={false}
                    />
                  </div>
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
