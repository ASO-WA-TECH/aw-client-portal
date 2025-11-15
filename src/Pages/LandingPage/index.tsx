import { useNavigate } from "react-router-dom";
import { Button, LogoImage } from "../../stories";

import "./index.scss";
import { Routes } from "../../Routes";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h3 className="landing-page__title">Welcome to </h3>
      <LogoImage variant="yellow" customStyle="landing-page__logo" />
      <Button
        type="button"
        text="LOG IN"
        handleClick={() => navigate(`/${Routes.AUTHENTICATE}`)}
        variant="secondary"
      />
      <p className="landing-page__buttons-seperator-text">
        <span className="landing-page__dash">&#8212;</span>
        <strong>OR</strong>
        <span className="landing-page__dash">&#8212;</span>
      </p>
      <Button
        type="button"
        text="REGISTER"
        handleClick={() => navigate(`/${Routes.REGISTER}`)}
        customStyle="landing-page__registerButton"
      />
    </div>
  );
};

export default LandingPage;
