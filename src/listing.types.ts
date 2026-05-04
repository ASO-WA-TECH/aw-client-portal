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
  | "Fila";

// TODO: confirm which values are predefined on airtabele and update accordingly
export type GenderOption = "Woman" | "Man" | "Boy" | "Girl" | "Unisex";

export type StatusOption = "available" | "unavailable";

export interface Image {
  url: string;
  public_id?: string;
}

export interface ListingFormData {
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
}
