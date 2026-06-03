import type {
  SizeOption,
  CategoryOption,
  GenderOption,
  StatusOption,
  ColourOption,
  ModelHeightOption,
} from "../../Constants/Listing/listing.constants";

export type ListingRecord = {
  id: string;
  createdTime: string;
  fields: ListingFields;
};

export type ListingFields = {
  "Listing ID": number;
  Owner: string[];
  Title: string;
  Description: string;
  Gender: GenderOption;
  Size: SizeOption;
  Price: number;
  Images: Image[];
  Colour: ColourOption[];
  Category?: CategoryOption[];
  Status: StatusOption;
  Location: string;
  "Rental Interest"?: string[];
  ModelHeight?: ModelHeightOption;
};

export type Image = {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: Thumbnail;
    large: Thumbnail;
    full: Thumbnail;
  };
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type FlattenedListing = Omit<ListingFields, "Gender"> & {
  Gender: string;
  id: string;
  createdTime: string;
};

export type GroupedByGender = {
  [gender: string]: FlattenedListing[];
};
