import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Services/Auth/AuthContext";
import { Routes } from "../../Routes";
import { toast } from "react-toastify";
import "./index.scss";

interface LogoutLinkProps {
  className?: string;
}

function LogoutLink({ className }: LogoutLinkProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Logged out");
    try {
      await logout();
      navigate(Routes.INITIAL);
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <a className={`link ${className || ""}`} onClick={handleLogout} href="#">
      Log out
    </a>
  );
}

export default LogoutLink;
