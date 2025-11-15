import { useState, useMemo, type FormEvent } from "react";
import { useAuth } from "../../Services/Auth/AuthContext";
import InputField from "../../stories/InputField/";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Button from "../../stories/Button/";
import { Routes } from "../../Routes";
import HttpService from "../../Services/httpService";

interface UserRecord {
  fields: {
    Name: string;
    Email: string;
    Password: string;
  };
  id: string;
}

function AuthenticationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [isAlreadyRegistered, setisAlreadyRegistered] =
    useState<boolean>(false);

  const httpService = useMemo(() => new HttpService("Users"), []);

  async function createUsers(
    email: string,
    password: string,
    username: string
  ) {
    const userDetails = {
      Name: username,
      Email: email,
      Password: password,
    };
    try {
      await httpService.createRecords(userDetails);
      console.log("POST successful");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }

  async function checkIfUsernameAlreadyExists(
    email: string,
    password: string,
    username: string
  ) {
    const data = await httpService.fetchAllRecords();
    const userFound = data.some(
      (user: UserRecord) => user.fields.Name === username
    );

    if (userFound) {
      setError("Username Already exists");
      throw new Error("Username Already exists");
    }
    await signup(email, password);
    await createUsers(email, password, username);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isAlreadyRegistered === true) {
      if (password === passwordConfirmation) {
        try {
          setError("");
          setLoading(true);
          await checkIfUsernameAlreadyExists(email, password, username);
          navigate(`/${Routes.HOME}`);
        } catch (err) {
          if (err instanceof Error) {
            setError(`Failed to create account: ", ${err.message}`);
          } else {
            setError("Failed to create account");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError("Passwords do not match");
      }
    } else {
      try {
        setError("");
        setLoading(true);
        await login(email, password);
        navigate(`/${Routes.HOME}`);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to create account: ${err.message}`);
        } else {
          setError("Failed to login");
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <div className="flex-container">
        <div className="background"></div>
        <div className="form">
          <div
            className={
              isAlreadyRegistered ? "formSignUpContainer" : "formLoginContainer"
            }
          >
            <h1>Hi Friend!</h1>
            <div className={"formContent"}>
              {isAlreadyRegistered && (
                <form onSubmit={handleSubmit}>
                  {error && <div className="input-error-message">{error}</div>}
                  <InputField
                    value={username}
                    handleChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Username"
                    required={true}
                  />
                  <br />
                  <InputField
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Email"
                    required={true}
                  />
                  <br />
                  <InputField
                    value={password}
                    type="text"
                    handleChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Password..."
                    required={true}
                  />
                  <br />
                  <InputField
                    value={passwordConfirmation}
                    type="text"
                    handleChange={(e) =>
                      setPasswordConfirmation(e.target.value)
                    }
                    label="Confirm Password"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Confirm Password..."
                    required={true}
                  />
                  <br />
                  <div className="isApprovedSection">
                    <input
                      type="checkbox"
                      id="isApproved"
                      name="isApproved"
                      checked={isApproved}
                      onChange={(e) => setIsApproved(e.target.checked)}
                    />
                    <label htmlFor="isApproved" className="paragraph">
                      By Joining I agree to our{" "}
                      <a href="http://"> Terms and Conditions</a>
                    </label>
                    <br />
                    <br />
                    <Button
                      type="submit"
                      isDisabled={!isApproved}
                      text={loading ? "Signing up..." : "Sign Up"}
                      variant="primary"
                      handleClick={() => {}}
                    />
                  </div>
                </form>
              )}
              {!isAlreadyRegistered && (
                <form onSubmit={handleSubmit}>
                  {error && <div className="error">{error}</div>}
                  <InputField
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Email"
                    required
                  />
                  <br />
                  <InputField
                    value={password}
                    type="password"
                    handleChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Password..."
                    required
                  />
                  <br />
                  <br />

                  <div className="isApprovedSection">
                    <input
                      type="checkbox"
                      id="isApproved"
                      name="isApproved"
                      checked={isApproved}
                      onChange={(e) => setIsApproved(e.target.checked)}
                    />
                    <label htmlFor="isApproved" className="paragraph">
                      By Joining I agree to our{" "}
                      <a href="http://"> Terms and Conditions</a>
                    </label>
                    <br />
                    <br />
                    <Button
                      type="submit"
                      isDisabled={!isApproved}
                      text={loading ? "Loggin in..." : "Login"}
                      variant="primary"
                      handleClick={() => {}}
                    />
                  </div>
                </form>
              )}
            </div>
            <p>
              <a
                onClick={() => setisAlreadyRegistered((prev) => !prev)}
                className="toggleLink"
              >
                {isAlreadyRegistered
                  ? "Already a user? Login here"
                  : "New Account? Sign up here"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthenticationPage;
