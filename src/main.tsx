import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { AuthProvider } from "./Services/Auth/AuthContext";
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
import ProtectedRoute from "./Components/ProtectedRoute";
import { Routes } from "./Routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={Routes.INITIAL} element={<Layout />}>
        <Route index element={<HomePage />} /> {/* default page at "/" */}
        <Route path={Routes.HOME} element={<HomePage />} />
        <Route path={Routes.LISTING} element={<ListingPage />} />
        <Route path={Routes.LANDING} element={<LandingPage />} />
        <Route path={Routes.AUTHENTICATE} element={<AuthenticationPage />} />
        <Route path={Routes.FAQ} element={<FAQ />} />
        <Route path={Routes.ANYTHING_ELSE} element={<ErrorPage />} />
        <Route
          path={Routes.ACCOUNT}
          element={
            <ProtectedRoute>
              <UserAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.CREATE_ACCOUNT}
          element={
            <ProtectedRoute>
              <UserAccountCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.EDIT_ACCOUNT}
          element={
            <ProtectedRoute>
              <UserAccountEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.ALL_MY_LISTINGS}
          element={
            <ProtectedRoute>
              <AllUserListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.INDIVIDUAL_LISTING}
          element={
            <ProtectedRoute>
              <UserListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.CREATE_LISTINGS}
          element={
            <ProtectedRoute>
              <UserListingsCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.EDIT_LISTINGS}
          element={
            <ProtectedRoute>
              <UserListingsEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.EDIT_LISTINGS_IMAGE_UPLOAD}
          element={
            <ProtectedRoute>
              <ImageUploadPage />
            </ProtectedRoute>
          }
        />
      </Route>
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
