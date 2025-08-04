import React from "react";
import HeroHeader from "./HeroHeader";

export default {
  title: "Components/HeroHeader",
  component: HeroHeader,
  parameters: {
    layout: "fullscreen",
  },

  argTypes: {
    pageType: {
      control: { type: "select" },
      options: ["login", "register"],
    },
  },
};

const Template = (args) => <HeroHeader {...args} />;

export const LoginPage = Template.bind({});
LoginPage.args = {
  pageType: "login",
};

export const RegisterPage = Template.bind({});
RegisterPage.args = {
  pageType: "register",
};
