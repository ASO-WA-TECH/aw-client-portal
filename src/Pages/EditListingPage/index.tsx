import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import HttpService from "../../Services/httpService";


import type {
    ListingFormData,
    SizeOption,
    CategoryOption,
    GenderOption,
    StatusOption,
} from "./listing.types";

import "./index.scss";
import InputField from "../../stories/InputField";
import CheckboxGroup from "../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../stories/FormField/InputDropdown";

const SIZE_OPTIONS: SizeOption[] = ["XS", "S", "M", "L", "XL", "XXL"];

const CATEGORY_OPTIONS: CategoryOption[] = [
    "Agbada",
    "Gele",
    "Iro and Buba",
    "Dress",
    "Top",
    "Skirt",
    "Corset",
    "Fila",
];

const GENDER_OPTIONS: GenderOption[] = [
    "Male",
    "Female",
    "Unisex",
    "Boy",
    "Girl",
];

const STATUS_OPTIONS: StatusOption[] = [
    "Available for Rent",
    "Unavailable for Rent",
];

const EMPTY_FORM: ListingFormData = {
    Title: "",
    Description: "",
    Size: "",
    Category: [],
    Gender: "",
    Status: "",
    Location: "",
    Price: "",
};

const EditListingPage = () => {
    const listingHttpService = useMemo(() => new HttpService<ListingFormData>("Listings"), []);

    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<ListingFormData>({
        Title: "",
        Description: "",
        Size: "",
        Category: [],
        Gender: "",
        Status: "",
        Location: "",
        Price: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const record = await listingHttpService.fetchRecord(id);
                if (record?.fields) setFormData(record.fields);
            } catch (err) {
                console.error(err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id, listingHttpService]);

    const updateField = <K extends keyof ListingFormData>(
        field: K,
        value: ListingFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!id) return;

        try {
            const updated = await listingHttpService.updateRecord({
                id,
                fields: formData,
            }, [
                "Title",
                "Description",
                "Size",
                "Category",
                "Gender",
                "Status",
                "Location",
                "Price",
            ]); // only editable fields
            console.log("Successfully updated:", updated);
            alert("Listing updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update listing.");
        }
    };


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Failed to load listing.</p>;

    return (
        <div className="edit-listing-page">
            <div className="edit-listing-page__container">

                {/* LEFT COLUMN */}
                <div className="edit-listing-page__container__left">
                    <div className="edit-listing-page__container__header">
                        <button className="edit-listing-page__container__header__back">
                            ←
                        </button>
                        <h2 className="edit-listing-page__container__header__title">
                            Edit Listing <span>- {formData.Title}</span>
                        </h2>
                    </div>

                    {formData.Images?.[0]?.url && (
                        <div
                            className="edit-listing-page__container__cover"
                            style={{
                                backgroundImage: `url(${formData.Images[0].url})`
                            }}
                        />
                    )}
                </div>

                {/* RIGHT COLUMN (FORM) */}
                <div className="edit-listing-page__container__form">

                    <InputField
                        label="Title"
                        value={formData.Title}
                        handleChange={e => updateField("Title", e.target.value)}
                        required
                    />

                    <InputField
                        label="Description"
                        value={formData.Description}
                        handleChange={e => updateField("Description", e.target.value)}
                    />

                    <InputDropdown
                        label="Size"
                        value={formData.Size}
                        options={SIZE_OPTIONS}
                        handleChange={e =>
                            updateField("Size", e.target.value as SizeOption)
                        }
                        required
                    />

                    <CheckboxGroup
                        label="Category"
                        values={formData.Category}
                        options={CATEGORY_OPTIONS}
                        handleChange={values =>
                            updateField("Category", values)
                        }
                        required
                    />

                    <InputDropdown
                        label="Gender"
                        value={formData.Gender}
                        options={GENDER_OPTIONS}
                        handleChange={e =>
                            updateField("Gender", e.target.value as GenderOption)
                        }
                        required
                    />

                    <InputDropdown
                        label="Status"
                        value={formData.Status}
                        options={STATUS_OPTIONS}
                        handleChange={e =>
                            updateField("Status", e.target.value as StatusOption)
                        }
                    />

                    <InputField
                        label="Location"
                        value={formData.Location}
                        handleChange={e =>
                            updateField("Location", e.target.value)
                        }
                    />

                    <InputField
                        label="Price (£)"
                        type="number"
                        value={formData.Price.toString()}
                        handleChange={e =>
                            updateField(
                                "Price",
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        validate={value =>
                            Number(value) < 0 ? "Price cannot be negative" : null
                        }
                    />

                    <button
                        className="edit-listing-page__container__form__submit"
                        onClick={handleSave}
                    >
                        Save Listing
                    </button>

                </div>
            </div>
        </div>
    )
};

export default EditListingPage;
