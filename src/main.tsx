import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/Homepage";
import FAQ from "./Pages/FAQPage";
import ImageUploadPage from "./Pages/ImageUploadPage";
import LandingPage from "./Pages/LandingPage";
import ListingPage from "./Pages/ListingPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import UserAccountPage from "./Pages/UserAccountPage";
import UserAccountEditPage from "./Pages/UserAccountEditPage";
import UserAccountCreatePage from "./Pages/UserAccountCreatePage";
import AllUserListingsPage from "./Pages/AllUserListingsPage";
import UserListingsEditPage from "./Pages/UserListingsEditPage";
import UserListingsCreatePage from "./Pages/UserListingsCreatePage";
import UserListingPage from "./Pages/UserListingPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} /> {/* default page at "/" */}
        <Route path="home" element={<HomePage />} />
        <Route path="home/listing" element={<ListingPage />} />
        <Route path="account" element={<UserAccountPage />} />
        <Route path="create-account" element={<UserAccountCreatePage />} />
        <Route path="account/edit" element={<UserAccountEditPage />} />
        <Route
          path="account/all-my-listings"
          element={<AllUserListingsPage />}
        />
        <Route path="account/my-listing" element={<UserListingPage />} />
        <Route path="create-listing" element={<UserListingsCreatePage />} />
        <Route
          path="account/my-listings/edit"
          element={<UserListingsEditPage />}
        />
        <Route
          path="account/my-listings/edit/image-upload"
          element={<ImageUploadPage />}
        />
      </Route>
      <Route path="landing" element={<LandingPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="FAQ" element={<FAQ />} />
      <Route path="*" element={<ErrorPage />} />
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
