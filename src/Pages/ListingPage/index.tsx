import { useEffect, useMemo, useState } from "react";
import HttpService from "../../Services/httpService";

import './index.scss'
import type { FlattenedListing, ListingRecord } from "./types";
import groupByKeyValue from "./utils/groupByKeyValue";
import ListingDisplayImage from "../../ListingDisplayImage/ListingDisplayImage";

const ListingPage = () => {
    const httpService = useMemo(() => new HttpService("Listings"), [])
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [listingData, setListingData] = useState<FlattenedListing[]>([]);
    const [isDataError, setIsDataError] = useState(false);
    const [filteredData, setFilteredData] = useState<FlattenedListing[]>([])
    const [activeFilter, setActiveFilter] = useState('Man')

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoadingData(true)
            try {
                const data: ListingRecord[] = await httpService.fetchAllRecords();
                const flattenedData = data.map(({ id, createdTime, fields }) => ({
                    ...fields,
                    id,
                    createdTime,
                }))

                setListingData(flattenedData)
                const defaultFilter = groupByKeyValue(flattenedData, "Gender", activeFilter)

                setFilteredData(defaultFilter)
                setIsLoadingData(false)
            } catch (error) {
                console.error(error)
                setIsDataError(true)
            } finally {
                setIsLoadingData(false)
            }
        };
        fetchListings();
    }, [httpService]);

    const handleGenderFiltering = (gender: string) => {
        const data = groupByKeyValue(listingData, "Gender", gender)
        setFilteredData(data)
        setActiveFilter(gender)
    }

    if (isLoadingData) {
        return <p>Loading</p> //TODO: replace with a spinner
    }

    if (isDataError) {
        return <p>Unable to load listings at the moment. Please try again later or contact us if problem persists</p>
    }

    return (<div className="listing-page">
        <div className="listing-page__container">
            <div className="listing-page__container__filters">
                <button className="listing-page__container__filters__option" onClick={() => handleGenderFiltering('Man')} data-testid="men-filter-btn">
                    <p className={`listing-page__container__filters__option__name ${activeFilter === 'Man' ? 'active' : ''}`}>
                        Mens
                    </p>
                </button>
                <button className="listing-page__container__filters__option" onClick={() => {
                    handleGenderFiltering('Woman')
                }} data-testid="women-filter-btn">
                    <p className={`listing-page__container__filters__option__name ${activeFilter === 'Woman' ? 'active' : ''}`}>
                        Womens
                    </p>
                </button>
            </div>
            <div className="listing-page__container__listings">
                {filteredData.map(data => (
                    <ListingDisplayImage imageUrl={data.Images[0].url} title={data.Title} subtitle={`£${data.Price.toFixed(2)}`} listingId={data.id} />
                ))}
            </div>

        </div>
    </div >)
};

export default ListingPage;
