import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HttpService from "../../Services/httpService";
import { useAuth } from "../../Services/Auth/AuthContext";
import "./index.scss";
import InputField from "../../stories/InputField";
import CheckboxGroup from "../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../stories/FormField/InputDropdown";
import Button from "../../stories/Button";
import ImageUploader from "../../Components/ImageUploader";
import {
  SIZE_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  MODEL_HEIGHT_OPTIONS,
  COLOUR_OPTIONS,
  createEmptyForm,
} from "../../Constants/Listing/listing.constants.tsx";
import type {
  ListingFormData,
  SizeOption,
  CategoryOption,
  GenderOption,
  StatusOption,
  ModelHeightOption,
  ColourOption,
  Image,
} from "../../Constants/Listing/listing.constants";

interface UserFields {
  [key: string]: unknown;
  auth_uid: string;
}

const AddListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const listingHttpService = useMemo(
    () => new HttpService<ListingFormData>("Listings"),
    [],
  );

  const usersHttpService = useMemo(
    () => new HttpService<UserFields>("Users"),
    [],
  );

  const [formData, setFormData] = useState<ListingFormData>(createEmptyForm());
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K],
  ) => {
    setFormData((prev: ListingFormData) => ({ ...prev, [field]: value }));
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
      Colour,
      Images,
    } = formData;

    return (
      Title &&
      Description &&
      Size &&
      Category.length > 0 &&
      Gender &&
      Status &&
      Location &&
      Price !== "" &&
      Colour.length > 0 &&
      Images.length > 0
    );
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    if (formData.Title.length > 21) {
      toast.error("Title must be 21 characters or less");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSaving(true);

    try {
      const allUsers = await usersHttpService.fetchAllRecords();

      const userRecord = allUsers.find(
        (item) => item.fields.auth_uid === currentUser?.uid,
      );

      if (!userRecord) {
        toast.error("User record not found.");
        setIsSaving(false);
        return;
      }

      const payload = {
        ...formData,
        Owner: [userRecord.id],
        Images: formData.Images.map((img: Image) => ({
          url: img.url,
        })),
        Colour: Array.isArray(formData.Colour)
          ? formData.Colour
          : [formData.Colour].filter(Boolean),
      };
      await listingHttpService.createRecords(payload);

      toast.success("Listing created successfully!");

      setTimeout(() => navigate("/listings"), 1000);
    } catch {
      toast.error("Failed to create listing.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-listing-page">
      <div className="create-listing-page__container">
        <h2>Create a Listing</h2>

        <ImageUploader
          images={formData.Images}
          onChange={(imgs: Image[]) => updateField("Images", imgs)}
        />
        <p>You can upload up to 2 images. Supported formats: JPG, PNG.</p>
        <div className="create-listing-page__form">
          <InputField
            label="Title"
            value={formData.Title}
            handleChange={(e) => updateField("Title", e.target.value)}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            value={formData.Description}
            handleChange={(e) => updateField("Description", e.target.value)}
            required
          />

          <InputDropdown
            label="Size"
            value={String(formData.Size)}
            options={SIZE_OPTIONS}
            handleChange={(e) =>
              updateField("Size", e.target.value as SizeOption)
            }
            required
          />

          <InputDropdown
            label="Model Height (optional)"
            value={formData.ModelHeight ?? " "}
            options={MODEL_HEIGHT_OPTIONS}
            handleChange={(e) =>
              updateField("ModelHeight", e.target.value as ModelHeightOption)
            }
          />

          <CheckboxGroup
            label="Colour"
            values={formData.Colour}
            options={COLOUR_OPTIONS}
            handleChange={(values) =>
              updateField("Colour", values as ColourOption[])
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
            customStyle="category-group"
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
            handleChange={(e) => updateField("Location", e.target.value)}
            required
          />

          <InputField
            label="Price (£) per day"
            type="number"
            value={formData.Price.toString()}
            handleChange={(e) =>
              updateField(
                "Price",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            required
          />

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
