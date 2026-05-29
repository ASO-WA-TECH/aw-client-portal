export type SizeOption =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 18
  | 20;

export type CategoryOption =
  | "Agbada"
  | "Gele"
  | "Iro and Buba"
  | "Dress"
  | "Top"
  | "Skirt"
  | "Corset"
  | "Fila"
  | "Kente"
  | "Boubou"
  | "Kaftan"
  | "Kaba & Slit"
  | "Kitenge"
  | "Habesha";

// TODO: confirm which values are predefined on airtabele and update accordingly
export type GenderOption = "Woman" | "Man" | "Boy" | "Girl" | "Unisex";

export type StatusOption = "available" | "unavailable";

export interface Image {
  url: string;
  public_id?: string;
}

export type ModelHeightOption =
  | " "
  | "1.50 m (4 ft 11 in)"
  | "1.55 m (5 ft 1 in)"
  | "1.60 m (5 ft 3 in)"
  | "1.65 m (5 ft 5 in)"
  | "1.70 m (5 ft 7 in)"
  | "1.75 m (5 ft 9 in)"
  | "1.80 m (5 ft 11 in)"
  | "1.85 m (6 ft 1 in)"
  | "1.90 m (6 ft 3 in)";

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
  Colour: string[];
  ModelHeight?: string;
}
