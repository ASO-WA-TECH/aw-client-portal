import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../Services/Auth/AuthContext";
import "./index.scss";
import HttpService from "../../Services/httpService";
import AccountDetails from "./components/AccountDetails";
import Rentals from "./components/Rentals";
import Listings from "./components/Listings";
import AddListing from "./components/AddListing";
import LoadingAccount from "./LoadingAccount";
import "./index.scss";

interface Response<T> {
  id: string;
  createdTime: string;
  fields: T;
}

interface UserData {
  [key: string]: unknown;
  id: string;
  auth_uid: string;
  createdTime: string;
  Name: string;
  Lastname: string;
  Email: string;
  Rentals?: string[];
  Listings?: string[];
}

interface RentalData {
  [key: string]: unknown;
  id: string;
  createdTime: string;
  Listing?: string[];
  Rentee?: string[];
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
}

interface ListingData {
  [key: string]: unknown;
  id: string;
  createdTime: string;
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
}

const UserAccountPage = () => {
  const { currentUser } = useAuth();
  const usersHttpService = useMemo(() => new HttpService("Users"), []);
  const rentalHttpService = useMemo(() => new HttpService("Rentals"), []);
  const listingsHttpService = useMemo(() => new HttpService("Listings"), []);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "my-account";

  const [user, setUser] = useState<UserData | null>(null);
  const [rentals, setRentals] = useState<RentalData[]>([]);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    { label: "MY ACCOUNT", key: "my-account" },
    { label: "RENTALS", key: "rentals" },
    { label: "LISTINGS", key: "listings" },
    { label: "ADD LISTING", key: "add-listing" },
  ];

  useEffect(() => {
    if (!currentUser?.email) {
      setError("No authenticated user");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);

        const allUsers = await usersHttpService.fetchAllRecords();

        const typedUsers = allUsers as unknown as Response<UserData>[];

        const userData = typedUsers
          .filter((item) => item.fields.auth_uid === currentUser.uid)
          .map(({ id, createdTime, fields }) => ({
            ...fields,
            id,
            createdTime,
          }))[0];

        if (!userData) throw new Error("User not found");

        setUser(userData as UserData);

        const rentalIds: string[] = (userData as UserData).Rentals || [];
        if (rentalIds.length > 0) {
          const rentalResults = await Promise.all(
            rentalIds.map((id) => rentalHttpService.fetchRecord(id)),
          );

          const flatRentals = (
            rentalResults.filter(Boolean) as unknown as Response<RentalData>[]
          ).map((data) => ({
            ...data.fields,
            id: data.id,
            createdTime: data.createdTime,
          }));

          setRentals(flatRentals);
        }

        const listingIds: string[] = (userData as UserData).Listings || [];
        if (listingIds.length > 0) {
          const listingResults = await Promise.all(
            listingIds.map((id) => listingsHttpService.fetchRecord(id)),
          );

          const flatListings = (
            listingResults.filter(Boolean) as unknown as Response<ListingData>[]
          ).map((data) => ({
            ...data.fields,
            id: data.id,
            createdTime: data.createdTime,
          }));

          setListings(flatListings);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [usersHttpService, rentalHttpService, listingsHttpService]);

  if (loading) return <LoadingAccount />;
  if (error) return <p>Error: {error}</p>;

  const activeLabel =
    menuItems.find((item) => item.key === activeTab)?.label || "MY ACCOUNT";

  return (
    <div className="account-container">
      <div
        className="mobile-header"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span>{activeLabel}</span>
        <i className={`arrow ${isMobileMenuOpen ? "up" : "down"}`}></i>
      </div>

      <div className="layout-body">
        <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="profile-section">
            <div className="profile-header">
              <div className="avatar-circle"></div>
              <div className="user-info">
                <h3>
                  {user?.Name} {user?.Lastname?.[0]}.
                </h3>
              </div>
            </div>
          </div>

          <nav className="side-nav">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={activeTab === item.key ? "active" : ""}
                onClick={() => {
                  setSearchParams({ tab: item.key });
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === "my-account" && user && (
            <AccountDetails userData={user} />
          )}

          {activeTab === "rentals" && <Rentals rentals={rentals} />}

          {activeTab === "listings" && <Listings listings={listings} />}

          {activeTab === "add-listing" && <AddListing />}
        </main>
      </div>
    </div>
  );
};

export default UserAccountPage;
