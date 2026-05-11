import { Routes } from "../Routes";
import { useNavigate } from "react-router-dom";
import { Button } from "../stories";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Button
        type="button"
        text=" Browse Listings"
        handleClick={() => navigate(Routes.LISTING)}
      />
    </div>
  );
};

export default ErrorPage;
