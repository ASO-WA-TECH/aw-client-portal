import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { AuthProvider } from "./Services/Auth/AuthContext"; // Add this import
import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/Homepage";
import FAQ from "./Pages/FAQPage";
import ImageUploadPage from "./Pages/ImageUploadPage";
import LandingPage from "./Pages/LandingPage";
import ListingPage from "./Pages/ListingPage";
import AuthenticationPage from "./Pages/AuthenticationPage";
import UserAccountPage from "./Pages/UserAccountPage";
import UserAccountEditPage from "./Pages/UserAccountEditPage";
import UserAccountCreatePage from "./Pages/UserAccountCreatePage";
import AllUserListingsPage from "./Pages/AllUserListingsPage";
import UserListingsEditPage from "./Pages/UserListingsEditPage";
import UserListingsCreatePage from "./Pages/UserListingsCreatePage";
import UserListingPage from "./Pages/UserListingPage";
import { Routes } from "./Routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={Routes.INITIAL} element={<Layout />}>
        <Route index element={<HomePage />} /> {/* default page at "/" */}
        <Route path={Routes.HOME} element={<HomePage />} />
        <Route path={Routes.LISTING} element={<ListingPage />} />
        <Route path={Routes.ACCOUNT} element={<UserAccountPage />} />
        <Route
          path={Routes.CREATE_ACCOUNT}
          element={<UserAccountCreatePage />}
        />
        <Route path={Routes.EDIT_ACCOUNT} element={<UserAccountEditPage />} />
        <Route
          path={Routes.ALL_MY_LISTINGS}
          element={<AllUserListingsPage />}
        />
        <Route path={Routes.MY_LISTINGS} element={<UserListingPage />} />
        <Route
          path={Routes.CREATE_LISTINGS}
          element={<UserListingsCreatePage />}
        />
        <Route path={Routes.EDIT_LISTINGS} element={<UserListingsEditPage />} />
        <Route
          path={Routes.EDIT_LISTINGS_IMAGE_UPLOAD}
          element={<ImageUploadPage />}
        />
      </Route>
      <Route path={Routes.LANDING} element={<LandingPage />} />
      <Route path={Routes.AUTHENTICATE} element={<AuthenticationPage />} />
      <Route path={Routes.FAQ} element={<FAQ />} />
      <Route path={Routes.ANYTHING_ELSE} element={<ErrorPage />} />
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
