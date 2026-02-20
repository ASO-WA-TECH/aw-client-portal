import React, { useState } from "react";
import "./index.scss";
import Button from "../../stories/Button/";

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState("RENTING & LENDING");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = ["MY ACCOUNT", "RENTALS", "LISTINGS"];

  return (
    <div className="account-container">
      {/* Mobile Header Toggle */}
      <div
        className="mobile-header"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span>{activeTab}</span>
        <i className={`arrow ${isMobileMenuOpen ? "up" : "down"}`}></i>
      </div>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="profile-section">
            <div className="profile-header">
              <div className="avatar-circle"></div>
              <div className="user-info">
                <h3>Buki T.</h3>
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

        {/* Main Content */}
        <main className="main-content">
          {activeTab === "MY ACCOUNT" && <AccountDetails />}
          {activeTab === "RENTALS" && <Rentals />}
          {activeTab === "LISTINGS" && <Listings />}
        </main>
      </div>
    </div>
  );
};

const AccountDetails = () => (
  <section className="card-section">
    <h2>ACCOUNT DETAILS</h2>
    <div className="form-group row">
      <div className="text-info">
        Upload your own photo to personalize your account.
      </div>
      <a href="#" className="link-action">
        Upload my own
      </a>
    </div>
    <hr />
    <div className="form-grid">
      <div className="input-field">
        <label>FIRST NAME*</label>
        <input type="text" defaultValue="Buki" />
      </div>
      <div className="input-field">
        <label>LAST NAME*</label>
        <input type="text" defaultValue="Thomp" />
      </div>
      <div className="input-field full-width">
        <label>EMAIL ADDRESS</label>
        <input type="email" defaultValue="bukithompson@hotmail.co.uk" />
        <small>Please enter a valid Email address.</small>
      </div>
    </div>
    <br />
    <div className="password-section">
      <h3>CHANGE PASSWORD</h3>
      <div className="form-grid">
        <div className="input-field full-width">
          <label>CURRENT PASSWORD</label>
          <input type="password" />
        </div>
        <div className="input-field">
          <label>NEW PASSWORD</label>
          <input type="password" />
        </div>
        <div className="input-field">
          <label>CONFIRM NEW PASSWORD</label>
          <input type="password" />
        </div>
      </div>
      <Button
        customStyle="btn-save"
        type="submit"
        text="Save"
        variant="primary"
        handleClick={() => {}}
      />
    </div>
  </section>
);

const Rentals = () => (
  <section className="renting-lending">
    RENTALSS
    <div className="empty-state">
      <h3>
        ONCE YOU START renting
        <br /> ALL YOUR ORDERS WILL BE ACCESSIBLE HERE.
      </h3>
    </div>
  </section>
);

const Listings = () => (
  <section className="renting-lending">
    LISTINGS
    <div className="empty-state">
      <h3>
        ONCE YOU START LISTING
        <br /> ALL YOUR ORDERS WILL BE ACCESSIBLE HERE.
      </h3>
    </div>
  </section>
);

export default UserAccountPage;
