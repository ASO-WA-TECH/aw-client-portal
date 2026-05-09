import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HttpService from "../../Services/httpService";

import type {
  ListingFormData,
  SizeOption,
  CategoryOption,
  GenderOption,
  StatusOption,
} from "../../listing.types";

import "./index.scss";
import InputField from "../../stories/InputField";
import CheckboxGroup from "../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../stories/FormField/InputDropdown";
import Button from "../../stories/Button";

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
  "Man",
  "Woman",
  "Unisex",
  "Boy",
  "Girl",
];

const STATUS_OPTIONS: StatusOption[] = ["available", "unavailable"];

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

const UserListingsEditPage = () => {
    const navigate = useNavigate();

    const listingHttpService = useMemo(
        () => new HttpService<ListingFormData>("Listings"),
        []
    );

    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] =
        useState<ListingFormData>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const record = await listingHttpService.fetchRecord(id);

                if (record?.fields) {
                    setFormData((prev) => ({
                        ...prev,
                        ...record.fields,
                        Price: record.fields.Price ?? "",
                        Category: (record.fields.Category ?? []) as CategoryOption[],
                        Images: record.fields.Images ?? [],
                        Colour: record.fields.Colour
                            ? Array.isArray(record.fields.Colour)
                                ? record.fields.Colour
                                : [record.fields.Colour]
                            : [],
                    }));
                }
            } catch (err) {
                console.error(err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id, listingHttpService]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const updateField = <K extends keyof ListingFormData>(
        field: K,
        value: ListingFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!id || isSaving) return;

        setIsSaving(true);

        try {
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

            await listingHttpService.updateRecord({
                id,
                fields: {
                    Title,
                    Description,
                    Size,
                    Category,
                    Gender,
                    Status,
                    Location,
                    Price,
                },
            });

            setToast({
                message: "Listing updated successfully!",
                type: "success",
            });

            setTimeout(() => navigate("/listings"), 1000);

        } catch (err) {
            console.error("Update failed:", err);

            setToast({
                message: "Failed to update listing.",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, listingHttpService]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateField = <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id || isSaving) return;

    setIsSaving(true);

    try {
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

      await listingHttpService.updateRecord({
        id,
        fields: {
          Title,
          Description,
          Size,
          Category,
          Gender,
          Status,
          Location,
          Price,
        },
      });

      setToast({
        message: "Listing updated successfully!",
        type: "success",
      });

      setTimeout(() => navigate("/listings"), 1000);
    } catch (err) {
      console.error("Update failed:", err);

      setToast({
        message: "Failed to update listing.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load listing.</p>;

  const imageUrl = formData.Images?.[0]?.url;

  return (
    <div className="edit-listing-page">
      <div className="edit-listing-page__container">
        {toast && (
          <div className={`toast toast--${toast.type}`}>{toast.message}</div>
        )}

        {/* LEFT COLUMN */}
        <div className="edit-listing-page__container__left">
          <div className="edit-listing-page__container__header">
            <button onClick={() => navigate(-1)}>←</button>

            <h2>
              Edit Listing <span>- {formData.Title}</span>
            </h2>
          </div>

          {imageUrl && (
            <div
              className="edit-listing-page__container__cover"
              style={{
                backgroundImage: `url(${imageUrl})`,
              }}
            />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="edit-listing-page__container__form">
          <InputField
            label="Title"
            value={formData.Title}
            handleChange={(e) => updateField("Title", e.target.value)}
            required
          />

          <InputField
            label="Description"
            value={formData.Description}
            handleChange={(e) => updateField("Description", e.target.value)}
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
          />

          <InputField
            label="Location"
            value={formData.Location}
            handleChange={(e) => updateField("Location", e.target.value)}
          />

          <InputField
            label="Price (£)"
            type="number"
            value={formData.Price.toString()}
            handleChange={(e) =>
              updateField(
                "Price",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />

          <Button
            handleClick={handleSave}
            isDisabled={isSaving}
            variant="primary"
            text={isSaving ? "Saving..." : "Save Changes"}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default UserListingsEditPage;
