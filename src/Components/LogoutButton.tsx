import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../stories/Button";
import { useAuth } from "../Services/Auth/AuthContext";
import { Routes } from "../Routes";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(Routes.HOME); // or Routes.AUTHENTICATE, depending on where you want to redirect
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Button
      type="button"
      text="Log Out"
      handleClick={handleLogout}
      variant="secondary"
    />
  );
}

export default LogoutButton;
