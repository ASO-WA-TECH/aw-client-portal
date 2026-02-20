import React, { useState } from "react";
import "./index.scss";

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState("RENTING & LENDING");
  const [rentalSubTab, setRentalSubTab] = useState("LENDING");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    //"DASHBOARD",
    "MY ACCOUNT",
    "RENTING & LENDING",
    "BUYING & SELLING",
  ];

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
          {activeTab === "RENTING & LENDING" && (
            <RentingLending subTab={rentalSubTab} setSubTab={setRentalSubTab} />
          )}
        </main>
      </div>

      {/* Floating Help Button */}
      <div className="floating-help">?</div>
    </div>
  );
};

const AccountDetails = () => (
  <section className="card-section">
    <div className="header-links">
      <a href="#">DELIVERY DETAILS</a>
      <a href="#">CARD DETAILS</a>
    </div>
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
        <label>PHONE NUMBER*</label>
        <input type="text" />
        <small>
          Please enter a valid phone number only using numeric values.
        </small>
      </div>
    </div>
    <button className="btn-save">SAVE</button>

    <div className="email-section">
      <div className="input-field">
        <label>EMAIL ADDRESS</label>
        <div className="flex-row">
          <input type="email" defaultValue="bukithompson@hotmail.co.uk" />
          <a href="#" className="link-action">
            CHANGE
          </a>
        </div>
        <small>
          Your new email address will only be active after confirming the email
          that we sent.
        </small>
      </div>
    </div>

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
      <button className="btn-save">SAVE</button>
    </div>
  </section>
);

const RentingLending = ({ subTab, setSubTab }) => (
  <section className="renting-lending">
    <div className="tab-switcher">
      <button
        className={subTab === "LENDING" ? "active" : ""}
        onClick={() => setSubTab("LENDING")}
      >
        LENDING
      </button>
      <button
        className={subTab === "RENTING" ? "active" : ""}
        onClick={() => setSubTab("RENTING")}
      >
        RENTING
      </button>
    </div>

    <div className="empty-state">
      <h3>
        ONCE YOU START {subTab},<br /> ALL YOUR ORDERS WILL BE ACCESSIBLE HERE.
      </h3>
      <button className="btn-black-large">VIEW NEW ARRIVALS</button>
    </div>
  </section>
);

export default UserAccountPage;
