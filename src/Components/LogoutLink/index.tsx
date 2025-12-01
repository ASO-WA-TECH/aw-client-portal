import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Services/Auth/AuthContext";
import { Routes } from "../../Routes";
import "./index.scss";

function LogoutLink() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("logged out");
    try {
      await logout();
      navigate(Routes.INITIAL);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <a className="link" onClick={handleLogout}>
      Log out
    </a>
  );
}

export default LogoutLink;
