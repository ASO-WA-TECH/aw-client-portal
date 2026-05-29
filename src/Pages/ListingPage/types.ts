import type { SizeOption, CategoryOption } from "../../listing.types";

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
  Gender: "Woman" | "Man";
  Size: SizeOption;
  Price: number;
  Images: Image[];
  Colour: string[];
  Category?: CategoryOption[];
  Status: "available" | "pending" | "unavailable";
  "Creation Date": string;
  Location: string;
  "Rental Interest"?: string[];
  Colour?: string[];
  ModelHeight?: string;
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
