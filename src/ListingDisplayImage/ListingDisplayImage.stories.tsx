import type { Meta, StoryObj } from "@storybook/react-vite";
import ListingDisplayImage from "./ListingDisplayImage";
import "./ListingDisplayImage.scss";

const meta = {
  title: "Components/ListingDisplayImage",
  component: ListingDisplayImage,
  tags: ["autodocs"],
  argTypes: {
    imageUrl: { control: "text" },
    title: { control: "text" },
    subtitle: { control: "text" },
    listingId: { control: "text" },
    darkMode: { control: "boolean" },
  },
} satisfies Meta<typeof ListingDisplayImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightListingDisplayImage: Story = {
  args: {
    imageUrl: "https://placehold.co/600x600",
    title: "Sleeveless Dress",
    subtitle: "40.00",
    darkMode: false,
    listingId: "sleeveless-dress-123",
  },
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};

export const DarkListingDisplayImage: Story = {
  args: {
    ...LightListingDisplayImage.args,
    darkMode: true,
    listingId: "sleeveless-dress-dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
