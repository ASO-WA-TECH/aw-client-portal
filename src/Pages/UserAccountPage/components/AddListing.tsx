import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import HttpService from "../../../Services/httpService";
import { useAuth } from "../../../Services/Auth/AuthContext";

import type {
  ListingFormData,
  SizeOption,
  CategoryOption,
  GenderOption,
  StatusOption,
  Image,
} from "../../../listing.types";

interface UserFields {
  [key: string]: unknown;
  auth_uid: string;
}

import "../index.scss";

import InputField from "../../../stories/InputField";
import CheckboxGroup from "../../../stories/FormField/CheckboxGroup";
import InputDropdown from "../../../stories/FormField/InputDropdown";
import Button from "../../../stories/Button";
import ImageUploader from "../../../Components/ImageUploader";

const COLOUR_OPTIONS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Silver",
  "Gold",
  "Cream",
];

const SIZE_OPTIONS: SizeOption[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  20,
];

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
  "Boy",
  "Girl",
  "Unisex",
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

  const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      Colour.length > 0
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
        Images: formData.Images.map((img) => ({
          url: img.url,
        })),
        Colour: Array.isArray(formData.Colour)
          ? formData.Colour
          : [formData.Colour].filter(Boolean),
      };
      await listingHttpService.createRecords(payload);

      toast.success("Listing created successfully!");

      setTimeout(() => navigate("/listings"), 1000);
    } catch (err) {
      console.error(err);
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

          <CheckboxGroup
            label="Colour"
            values={formData.Colour}
            options={COLOUR_OPTIONS}
            handleChange={(values) => updateField("Colour", values)}
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
