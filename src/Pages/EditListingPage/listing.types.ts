export type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type CategoryOption =
    | "Agbada"
    | "Gele"
    | "Iro and Buba"
    | "Dress"
    | "Top"
    | "Skirt"
    | "Corset"
    | "Fila";

export type GenderOption =
    | "Male"
    | "Female"
    | "Unisex"
    | "Boy"
    | "Girl";

export type StatusOption =
    | "Available for Rent"
    | "Unavailable for Rent";

/**
 * This is the FORM shape (not Airtable record shape)
 */
export interface ListingFormData {
    Title: string;
    Description: string;
    Size: SizeOption | "";
    Category: CategoryOption[];
    Gender: GenderOption | "";
    Status: StatusOption | "";
    Location: string;
    Price: number | "";
    Images?: { url: string }[];
}
