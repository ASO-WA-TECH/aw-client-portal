import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputField from "/src/stories/InputField/";
import Button from "/src/stories/Button/";
import "./index.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  return (
    <div class="flex-container">
      <div class="background">1</div>
      <div class="form">
        <div class="formContainer">
          <h2>JOIN US TODAY</h2>
          <div className="formContent">
            <InputField
              value={fullname}
              handleChange={(e) => setFullname(e.target.value)}
              label="Full Name"
              darkMode={false}
              isReadOnly={false}
              placeholder="Fullname"
            />
            <br />
            <InputField
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              label="Email"
              darkMode={false}
              isReadOnly={false}
              placeholder="Test email"
            />
            <br />
            <InputField
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
              label="password"
              darkMode={false}
              isReadOnly={false}
              placeholder="Test password"
            />
            <br />
            <InputField
              value={passwordConfirmation}
              handleChange={(e) => setPasswordConfirmation(e.target.value)}
              label="password"
              darkMode={false}
              isReadOnly={false}
              placeholder="Test password"
            />
            <br />
            <div className="emailApprovalSection">
              <input
                type="checkbox"
                id="emailApproval"
                name="emailApproval"
                value="emailApproval"
              />
              <label for="emailApproval">
                By Joining I agree to recieve email from ASO WA
              </label>
              <br />
              <br />
              <Button
                text="LOG IN"
                handleClick={() => navigate(`/${Routes.HOME}`)}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
