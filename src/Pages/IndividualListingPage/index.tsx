import { useEffect, useMemo, useState } from 'react';
import HttpService from '../../Services/httpService';
import type { ListingFields } from '../ListingPage/types';
import { useParams } from 'react-router-dom';
import Image from './Image';
import Details from './Details';
import "./index.scss";

const IndividualListingPage = () => {
    const httpService = useMemo(() => new HttpService("Listings"), []);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [listingData, setListingData] = useState<ListingFields>();
    const [isDataError, setIsDataError] = useState(false);
    const urlParams = useParams();

    useEffect(() => {
        if (!urlParams.id) return;

        const fetchListing = async () => {
            setIsLoadingData(true);

            try {
                const data = await httpService.fetchRecord(urlParams.id!);
                if (!data || !data.fields) {
                    console.error("Data missing fields:", data);
                    setIsDataError(true);
                    return;
                }

                setListingData(data.fields);
            } catch (error) {
                console.error(error);
                setIsDataError(true);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchListing();
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
            <Details listing={listingData} />
        </div>
    );
};

export default IndividualListingPage;
