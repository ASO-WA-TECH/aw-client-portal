import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Pages/Layout.tsx";
import ErrorPage from "./Pages/ErrorPage.tsx";
import HomePage from "./Pages/HomePage.tsx";
import FAQ from "./Pages/FAQPage.tsx";
import ImageUploadPage from "./Pages/ImageUploadPage.tsx";
import LandingPage from "./Pages/LandingPage.tsx";
import ListingPage from "./Pages/ListingPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import UserAccountPage from "./Pages/UserAccountPage.tsx";
import UserAccountEditPage from "./Pages/UserAccountEditPage.tsx";
import UserAccountCreatePage from "./Pages/UserAccountCreatePage.tsx";
import AllUserListingsPage from "./Pages/AllUserListingsPage.tsx";
import UserListingsEditPage from "./Pages/UserListingsEditPage.tsx";
import UserListingsCreatePage from "./Pages/UserListingsCreatePage.tsx";
import UserListingPage from "./Pages/UserListingPage.tsx";

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
