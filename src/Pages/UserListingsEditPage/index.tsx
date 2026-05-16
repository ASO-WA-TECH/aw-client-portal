import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HttpService from "../../Services/httpService";
import BackButton from "../../stories/BackButton/BackButton";

import type {
  ListingFormData,
  SizeOption,
  CategoryOption,
  GenderOption,
  StatusOption,
} from "../../listing.types";

import { toast } from "react-toastify";
import "./index.scss";
import InputField from "../../stories/InputField";
import CheckboxGroup from "../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../stories/FormField/InputDropdown";
import Button from "../../stories/Button";
import ImageUploader from "../../Components/ImageUploader";

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
  Colour: [],
};

const UserListingsEditPage = () => {
  const navigate = useNavigate();

  const listingHttpService = useMemo(
    () => new HttpService<ListingFormData>("Listings"),
    [],
  );

  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
  const [initialData, setInitialData] = useState<ListingFormData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const record = await listingHttpService.fetchRecord(id);

        if (record?.fields) {
          const loaded: ListingFormData = {
            ...EMPTY_FORM,
            ...record.fields,
            Price: record.fields.Price ?? "",
            Category: (record.fields.Category ?? []) as CategoryOption[],
            Images: record.fields.Images ?? [],
            Colour: record.fields.Colour
              ? Array.isArray(record.fields.Colour)
                ? record.fields.Colour
                : [record.fields.Colour]
              : [],
          };
          setFormData(loaded);
          setInitialData(loaded);
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
        Images,
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
          Images: Images?.map((img) => ({ url: img.url })),
        },
      });

      setInitialData(JSON.parse(JSON.stringify(formData)));

      toast.success("Listing updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);

      toast.error("Failed to update listing.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;
    setIsDeleting(true);

    try {
      await listingHttpService.deleteRecord(id);
      toast.success("Listing has been deleted successfully!");

      setTimeout(() => navigate("/account"), 1000);
    } catch (err) {
      console.error("Delete failed:", err);

      toast.error("Failed to delete listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasChanged =
    initialData !== null &&
    JSON.stringify(formData) !== JSON.stringify(initialData);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load listing.</p>;

  return (
    <div className="edit-listing-page">
      <div className="edit-listing-page__container">
        {/* LEFT COLUMN */}
        <div className="edit-listing-page__container__left">
          <div className="edit-listing-page__container__header">
            <BackButton
              onClick={() => navigate(-1)}
              className={`back-button`}
              aria-label="Back"
            />
            <h2>
              Edit Listing <span>- {formData.Title}</span>
            </h2>
          </div>
          <p className="edit-listing-page__container__left__hint">
            Changes to images require clicking <strong>Save Changes</strong> to
            finalise.
          </p>
          <ImageUploader
            images={formData.Images}
            onChange={(imgs) => updateField("Images", imgs)}
          />
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
            isDisabled={isSaving || !hasChanged}
            variant="primary"
            text={isSaving ? "Saving..." : "Save Changes"}
            type="button"
          />

          <Button
            handleClick={handleDelete}
            isDisabled={isDeleting}
            variant="secondary"
            text={isDeleting ? "Deleting..." : "Delete Listing"}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default UserListingsEditPage;
