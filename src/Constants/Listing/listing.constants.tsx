// listing.constants.ts — derives everything, no imports needed

export const SIZE_OPTIONS = [
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
] as const;
export const CATEGORY_OPTIONS = [
  "Agbada",
  "Gele",
  "Iro and Buba",
  "Dress",
  "Top",
  "Skirt",
  "Corset",
  "Fila",
  "Kente",
  "Boubou",
  "Kaftan",
  "Kaba & Slit",
  "Kitenge",
  "Habesha",
] as const;
export const GENDER_OPTIONS = [
  "Woman",
  "Man",
  "Boy",
  "Girl",
  "Unisex",
] as const;
export const STATUS_OPTIONS = ["available", "unavailable", "pending"] as const;
export const COLOUR_OPTIONS = [
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
] as const;
export const MODEL_HEIGHT_OPTIONS = [
  " ",
  "1.50 m (4 ft 11 in)",
  "1.55 m (5 ft 1 in)",
  "1.60 m (5 ft 3 in)",
  "1.65 m (5 ft 5 in)",
  "1.70 m (5 ft 7 in)",
  "1.75 m (5 ft 9 in)",
  "1.80 m (5 ft 11 in)",
  "1.85 m (6 ft 1 in)",
  "1.90 m (6 ft 3 in)",
] as const;

export type SizeOption = (typeof SIZE_OPTIONS)[number];
export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
export type GenderOption = (typeof GENDER_OPTIONS)[number];
export type StatusOption = (typeof STATUS_OPTIONS)[number];
export type ColourOption = (typeof COLOUR_OPTIONS)[number];
export type ModelHeightOption = (typeof MODEL_HEIGHT_OPTIONS)[number];

export interface Image {
  url: string;
  public_id?: string;
}

export interface ListingFormData {
  [key: string]: unknown;
  Title: string;
  Description: string;
  Size: SizeOption | "";
  Category: CategoryOption[];
  Gender: GenderOption | "";
  Status: StatusOption | "";
  Location: string;
  Price: number | "";
  Images: Image[];
  Colour: ColourOption[];
  ModelHeight: ModelHeightOption | "";
  "Creation Date": "";
}

export const createEmptyForm = (): ListingFormData => ({
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
  ModelHeight: "",
  "Creation Date": "",
});
