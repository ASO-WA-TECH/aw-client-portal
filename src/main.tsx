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
import LandingPage from "./Pages/LandingPage";
import ListingPage from "./Pages/ListingPage";
import AuthenticationPage from "./Pages/AuthenticationPage";
import UserAccountPage from "./Pages/UserAccountPage/index";
import UserListingsEditPage from "./Pages/UserListingsEditPage";
import IndividualListingPage from "./Pages/IndividualListingPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import AboutUsPage from "./Pages/AboutUsPage";
import CareersPage from "./Pages/Careers";
import FAQ from "./Pages/Policies/FAQPage";
import CommunityGuidelinesPage from "./Pages/Policies/CommunityGuidelinesPage";
import CookiePolicyPage from "./Pages/Policies/CookiePolicyPage";
import TermsAndConditionsPage from "./Pages/Policies/TermsAndConditionsPage";
import MobileTermsOfUsePage from "./Pages/Policies/MobileTermsOfUsePage";
import PrivacyPolicyPage from "./Pages/Policies/PrivacyPolicyPage";

import { Routes } from "./Routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={Routes.AUTHENTICATE} element={<AuthenticationPage />} />
      <Route path={Routes.INITIAL} element={<Layout />}>
        <Route index element={<HomePage />} /> {/* default page at "/" */}
        <Route path={Routes.HOME} element={<HomePage />} />
        <Route path={Routes.LISTING} element={<ListingPage />} />
        <Route path={Routes.LANDING} element={<LandingPage />} />
        <Route path={Routes.FAQ} element={<FAQ />} />
        <Route path={Routes.ANYTHING_ELSE} element={<ErrorPage />} />
        <Route
          path={Routes.COMMUNITY_GUIDELINES}
          element={<CommunityGuidelinesPage />}
        />
        <Route path={Routes.COOKIE_POLICY} element={<CookiePolicyPage />} />
        <Route
          path={Routes.MOBILE_TERMS_OF_USE}
          element={<MobileTermsOfUsePage />}
        />
        <Route
          path={Routes.TERMS_AND_CONDITIONS}
          element={<TermsAndConditionsPage />}
        />
        <Route path={Routes.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route path={Routes.ABOUT_US} element={<AboutUsPage />} />
        <Route path={Routes.CAREERS} element={<CareersPage />} />
        <Route
          path={Routes.ACCOUNT}
          element={
            <ProtectedRoute>
              <UserAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.INDIVIDUAL_LISTING}
          element={
            <ProtectedRoute>
              <IndividualListingPage />
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
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
