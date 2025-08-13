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
  },
} satisfies Meta<typeof ListingDisplayImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightListingDisplayImage: Story = {
  args: {
    imageUrl: "https://placehold.co/600x600",
    title: "Sleeveless Dress",
    subtitle: "£ 40.00 GBP",
  },
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};
