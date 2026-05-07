import type { Meta, StoryObj } from "@storybook/react-vite";
import ListingDisplayImage from "./ListingDisplayImage";
import "./ListingDisplayImage.scss";

const meta = {
  title: "Components/ListingDisplayImage",
  component: ListingDisplayImage, // ← only one component
  tags: ["autodocs"],
  argTypes: {
    imageUrl: { control: "text" },
    title: { control: "text" },
    subtitle: { control: "text" },
    status: { control: "text" },
    buttonText: { control: "text" },
    buttonVariant: { control: "select", options: ["primary", "secondary"] },
    onButtonClick: { action: "clicked" },
  },
} satisfies Meta<typeof ListingDisplayImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightListingDisplayImage: Story = {
  args: {
    imageUrl: "https://placehold.co/600x600",
    title: "Sleeveless Dress",
    subtitle: "£ 40.00 GBP",
    status: "available",
    darkMode: false,
    buttonText: "Edit Listing",
    onButtonClick: () => {},
  },
  render: (args) => (
    <div>
      <ListingDisplayImage {...args} />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};
