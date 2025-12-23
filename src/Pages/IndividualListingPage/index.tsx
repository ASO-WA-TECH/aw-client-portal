import { useEffect, useMemo, useState } from 'react';
import HttpService from '../../Services/httpService';
import type { ListingFields } from '../ListingPage/types';
import { useParams } from 'react-router-dom';
import Image from './Image';
import Details from './Details';
import "./index.scss";


const ASO_WA_EMAIL = import.meta.env.VITE_ASO_WA_EMAIL;

const IndividualListingPage = () => {
    const listingHttpService = useMemo(() => new HttpService("Listings"), []);
    const ownerHttpService = useMemo(() => new HttpService("Users"), []);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [listingData, setListingData] = useState<ListingFields>();
    const [isDataError, setIsDataError] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState<string>();
    const urlParams = useParams();

    useEffect(() => {
        if (!urlParams.id) return;

        const fetchListingAndOwner = async () => {
            setIsLoadingData(true);

            try {
                // Fetch listing
                const listing = await listingHttpService.fetchRecord(urlParams.id!);
                if (!listing?.fields) throw new Error('Invalid listing');

                setListingData(listing.fields);

                // Fetch owner (if exists)
                const ownerIds = listing.fields.Owner;
                if (ownerIds && ownerIds.length > 0) {
                    const ownerRecord = await ownerHttpService.fetchRecord(
                        ownerIds[0]
                    );

                    if (!ownerRecord.fields.Email) {
                        console.error("Owner email not found");
                        setIsDataError(true);
                        return;
                    }

                    setOwnerEmail(ownerRecord.fields.Email);
                }
            } catch (error) {
                console.error(error);
                setIsDataError(true);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchListingAndOwner();
    }, [urlParams.id]);


    if (isLoadingData) return <p>Loading...</p>;

    if (isDataError || !listingData)
        return (
            <p>
                Unable to load listing at the moment. Please try again later or contact us if problem persists
            </p>
        );

    return (
        <div className="individual-listing-page">
            {listingData.Images?.[0]?.url && (
                <Image imageUrl={listingData.Images[0].url} title={listingData.Title} />
            )}
            <Details listing={listingData} ownerEmail={ownerEmail || ASO_WA_EMAIL} />
        </div>
    );
};

export default IndividualListingPage;
