import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpService from "../../../Services/httpService";

import type {
    ListingFormData,
    SizeOption,
    CategoryOption,
    GenderOption,
    StatusOption,
} from "../../../listing.types";

import "../index.scss";
import InputField from "../../../stories/InputField";
import CheckboxGroup from "../../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../../stories/FormField/InputDropdown";
import Button from "../../../stories/Button";

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
    Images: [],
};

const AddListing = () => {
    const navigate = useNavigate();

    const listingHttpService = useMemo(
        () => new HttpService<ListingFormData>("Listings"),
        []
    );

    const [formData, setFormData] =
        useState<ListingFormData>(EMPTY_FORM);

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const updateField = <K extends keyof ListingFormData>(
        field: K,
        value: ListingFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // OPTIONAL IMAGE (preview only for now)
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result as string;

            updateField("Images", [
                {
                    url: base64, // ⚠️ preview only (not sent to Airtable) - NEED TO IMPLEMENT PROPER UPLOAD IN THE FUTURE
                },
            ]);
        };

        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const {
            Title,
            Description,
            Size,
            Category,
            Gender,
            Status,
            Location,
            Price,
        } = formData;

        return (
            Title &&
            Description &&
            Size &&
            Category.length > 0 &&
            Gender &&
            Status &&
            Location &&
            Price !== ""
        );
    };

    const handleSubmit = async () => {
        if (isSaving) return;

        if (!validateForm()) {
            setToast({
                message: "Please fill all required fields.",
                type: "error",
            });
            return;
        }

        setIsSaving(true);

        try {
            const payload: Partial<ListingFormData> = {
                ...formData,
            };
            // IMAGE HANDLING: if the image is a base64 preview, don't send it to Airtable (since we don't have upload functionality yet)
            if (
                !formData.Images?.length ||
                formData.Images[0].url.startsWith("data:")
            ) {
                delete payload.Images;
            }

            await listingHttpService.createRecord(
                payload as ListingFormData
            );

            setToast({
                message: "Listing created successfully!",
                type: "success",
            });

            setTimeout(() => navigate("/listings"), 1000);

        } catch (err) {
            console.error(err);

            setToast({
                message: "Failed to create listing.",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };
    // TODO: implement proper image upload flow in the future (currently just a base64 preview that isn't sent to Airtable)
    const imagePreview = formData.Images?.[0]?.url;

    return (
        <div className="create-listing-page">
            <div className="create-listing-page__container">

                <h2>Create Listing</h2>

                {imagePreview && (
                    <div
                        className="create-listing-page__image-preview"
                        style={{
                            backgroundImage: `url(${imagePreview})`,
                        }}
                    />
                )}

                <div className="create-listing-page__form">

                    <InputField
                        label="Title"
                        value={formData.Title}
                        handleChange={(e) =>
                            updateField("Title", e.target.value)
                        }
                        required
                    />

                    <InputField
                        label="Description"
                        value={formData.Description}
                        handleChange={(e) =>
                            updateField("Description", e.target.value)
                        }
                        required
                    />

                    <InputDropdown
                        label="Size"
                        value={formData.Size}
                        options={SIZE_OPTIONS}
                        handleChange={(e) =>
                            updateField("Size", e.target.value as SizeOption)
                        }
                        required
                    />

                    <CheckboxGroup
                        label="Category"
                        values={formData.Category}
                        options={CATEGORY_OPTIONS}
                        handleChange={(values) =>
                            updateField("Category", values as CategoryOption[])
                        }
                        required
                    />

                    <InputDropdown
                        label="Gender"
                        value={formData.Gender}
                        options={GENDER_OPTIONS}
                        handleChange={(e) =>
                            updateField("Gender", e.target.value as GenderOption)
                        }
                        required
                    />

                    <InputDropdown
                        label="Status"
                        value={formData.Status}
                        options={STATUS_OPTIONS}
                        handleChange={(e) =>
                            updateField("Status", e.target.value as StatusOption)
                        }
                        required
                    />

                    <InputField
                        label="Location"
                        value={formData.Location}
                        handleChange={(e) =>
                            updateField("Location", e.target.value)
                        }
                        required
                    />

                    <InputField
                        label="Price (£)"
                        type="number"
                        value={formData.Price.toString()}
                        handleChange={(e) =>
                            updateField(
                                "Price",
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                        required
                    />

                    {/* OPTIONAL IMAGE */}
                    <label>Upload Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {toast && (
                        <div className={`toast toast--${toast.type}`}>
                            {toast.message}
                        </div>
                    )}

                    <Button
                        handleClick={handleSubmit}
                        isDisabled={isSaving}
                        variant="primary"
                        text={isSaving ? "Creating..." : "Create Listing"}
                        type="button"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddListing;