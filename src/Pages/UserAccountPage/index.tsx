import { useEffect, useMemo, useState } from "react";
import "./index.scss";
import HttpService from "../../Services/httpService";
import { useAuth } from "../../Services/Auth/AuthContext";
import AccountDetails from "./components/AccountDetails";
import Rentals from "./components/Rentals";
import Listings from "./components/Listings";

interface Response {
  id: string;
  createdTime: string;
  fields: T;
}

interface UserData {
  id: string;
  createdTime: string;
  Name: string;
  Lastname: string;
  Email: string;
  Rentals?: string[];
  Listings?: string[];
}

interface RentalData {
  id: string;
  createdTime: string;
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
}

interface ListingData {
  id: string;
  createdTime: string;
  Images?: { url: string }[];
  Title?: string;
  Price?: number;
  Status?: string;
}

const UserAccountPage = () => {
  const usersHttpService = useMemo(() => new HttpService("Users"), []);
  const rentalHttpService = useMemo(() => new HttpService("Rentals"), []);
  const listingsHttpService = useMemo(() => new HttpService("Listings"), []);

  const [user, setUser] = useState<UserData | null>(null);
  const [rentals, setRentals] = useState<RentalData[]>([]);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [activeTab, setActiveTab] = useState("MY ACCOUNT");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const menuItems = ["MY ACCOUNT", "RENTALS", "LISTINGS"];
  const userId = currentUser?.uid;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const allUsers = await usersHttpService.fetchAllRecords();
        const userData = allUsers
          .filter(
            (item: Response<{ UserId: number }>) =>
              item.fields.auth_uid === userId,
          )
          .map(({ id, createdTime, fields }: Response<{ UserId: number }>) => ({
            ...fields,
            id,
            createdTime,
          }))[0];

        if (!userData) throw new Error("User not found");
        setUser(userData);

        const rentalIds: string[] = userData.Rentals || [];
        if (rentalIds.length > 0) {
          const rentalResults = await Promise.all(
            rentalIds.map((id) => rentalHttpService.fetchRecord(id)),
          );
          const flatRentals = rentalResults
            .filter(Boolean)
            .map((data: Response) => ({
              ...data.fields,
              id: data.id,
              createdTime: data.createdTime,
            }));
          setRentals(flatRentals);
        }

        const listingIds: string[] = userData.Listings || [];
        if (listingIds.length > 0) {
          const listingResults = await Promise.all(
            listingIds.map((id) => listingsHttpService.fetchRecord(id)),
          );
          const flatListings = listingResults
            .filter(Boolean)
            .map((data: Response) => ({
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="account-container">
      <div
        className="mobile-header"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span>{activeTab}</span>
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
                key={item}
                className={activeTab === item ? "active" : ""}
                onClick={() => {
                  setActiveTab(item);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === "MY ACCOUNT" && user && (
            <AccountDetails userData={user} />
          )}
          {activeTab === "RENTALS" && rentals && <Rentals rentals={rentals} />}
          {activeTab === "LISTINGS" && listings && (
            <Listings listings={listings} />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserAccountPage;
