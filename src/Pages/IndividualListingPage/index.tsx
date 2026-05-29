import { useEffect, useMemo, useState } from "react";
import HttpService from "../../Services/httpService";
import type { ListingFields } from "../ListingPage/types";
import { useParams } from "react-router-dom";
import Image from "./Image";
import Details from "./Details";
import "./index.scss";
import LoadingListing from "./LoadingListing";
import { toast } from "react-toastify";

const ASO_WA_EMAIL = import.meta.env.VITE_ASO_WA_EMAIL;

const IndividualListingPage = () => {
  const listingHttpService = useMemo(
    () => new HttpService<ListingFields>("Listings"),
    [],
  );
  const ownerHttpService = useMemo(
    () => new HttpService<{ Email?: string; Name?: string; FullName?: string }>("Users"),
    [],
  );
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [listingData, setListingData] = useState<ListingFields>();
  const [isDataError, setIsDataError] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string>();
  const [ownerName, setOwnerName] = useState<string>();
  const urlParams = useParams();

  useEffect(() => {
    if (!urlParams.id) return;

    const fetchListingAndOwner = async () => {
      setIsLoadingData(true);

      try {
        // Fetch listing
        const listing = await listingHttpService.fetchRecord(urlParams.id!);
        if (!listing?.fields) throw new Error("Invalid listing");

        setListingData(listing.fields);

        // Fetch owner (if exists)
        const ownerIds = listing.fields.Owner;
        if (ownerIds && ownerIds.length > 0) {
          const ownerRecord = await ownerHttpService.fetchRecord(ownerIds[0]);

          if (!ownerRecord.fields.Email) {
            toast.error("Owner email not found");
            setIsDataError(true);
            return;
          }

          setOwnerEmail(ownerRecord.fields.Email);
          const name = ownerRecord.fields.Name || ownerRecord.fields.FullName || "";
          setOwnerName(name);
        }
      } catch {
        toast.error("Failed to fetch listing or owner data");
        setIsDataError(true);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchListingAndOwner();
  }, [urlParams.id, listingHttpService, ownerHttpService]);

  if (isLoadingData) return <LoadingListing />;

  if (isDataError || !listingData)
    return (
      <p>
        Unable to load listing at the moment. Please try again later or contact
        us if problem persists
      </p>
    );

  return (
    <div className="individual-listing-page">
      {listingData.Images && listingData.Images.length > 0 && (
        <Image images={listingData.Images} title={listingData.Title} />
      )}
      <Details listing={listingData} ownerEmail={ownerEmail || ASO_WA_EMAIL} ownerName={ownerName} />
    </div>
  );
};

export default IndividualListingPage;
