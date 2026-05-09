import { useState, useMemo, type FormEvent } from "react";
import { useAuth } from "../../Services/Auth/AuthContext";
import InputField from "../../stories/InputField/";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.scss";
import Button from "../../stories/Button/";
import { Routes } from "../../Routes";
import HttpService from "../../Services/httpService";

interface UserFields {
  [key: string]: unknown;
  Name: string;
  Email: string;
  Password?: string;
  auth_uid?: string;
}

interface UserRecord {
  fields: UserFields;
  id: string;
}

function AuthenticationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { signup, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const httpService = useMemo(() => new HttpService<UserFields>("Users"), []);
  const fromPreviousPath = location.state?.from?.pathname || Routes.INITIAL;

  async function checkIfUsernameAlreadyExists(username: string) {
    const data = (await httpService.fetchAllRecords()) as UserRecord[];
    const userFound = data.some((user) => user.fields.Name === username);
    if (userFound) {
      setError("Username already exists");
      throw new Error("Username already exists");
    }
  }

  async function createUserWithGuards(
    email: string,
    password: string,
    username: string,
  ) {
    setError("");
    setLoading(true);

    try {
      await checkIfUsernameAlreadyExists(username);
      const userCredential = await signup(email, password);

      const uid = userCredential?.user?.uid;

      if (!uid) {
        throw new Error("Firebase signup failed - no UID returned");
      }

      try {
        await httpService.createRecords({
          Name: username,
          Email: email,
          auth_uid: uid,
        });
      } catch (err) {
        await userCredential.user.delete();
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to create account",
        );
      }

      navigate(fromPreviousPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSigningUp) {
      await createUserWithGuards(email, password, username);
    } else {
      try {
        setError("");
        setLoading(true);

        await login(email, password);

        navigate(fromPreviousPath, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to login");
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
              isSigningUp ? "formSignUpContainer" : "formLoginContainer"
            }
          >
            <h1>Hi Friend!</h1>

            <div className={"formContent"}>
              {/* SIGN UP */}
              {isSigningUp && (
                <form onSubmit={handleSubmit}>
                  {error && <div className="input-error-message">{error}</div>}

                  <InputField
                    value={username}
                    handleChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Username"
                    required
                  />

                  <br />
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
                    type={showPassword ? "text" : "password"}
                    handleChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Password..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="show-password-button"
                  >
                    {showPassword ? "Hide Password " : "Show Password"}
                  </button>
                  <br />
                  <br />

                  {/* TERMS ONLY ON SIGNUP */}
                  <div className="isApprovedSection">
                    <input
                      type="checkbox"
                      id="isApproved"
                      checked={isApproved}
                      onChange={(e) => setIsApproved(e.target.checked)}
                    />

                    <label htmlFor="isApproved" className="paragraph">
                      By joining I agree to our{" "}
                      <a href="#">Terms and Conditions</a>
                    </label>

                    <br />
                    <br />

                    <Button
                      type="submit"
                      isDisabled={!isApproved || loading}
                      text={loading ? "Signing up..." : "Sign Up"}
                      variant="primary"
                      handleClick={() => {}}
                    />
                  </div>
                </form>
              )}

              {/* LOGIN */}
              {!isSigningUp && (
                <form onSubmit={handleSubmit}>
                  {error && <div className="input-error-message">{error}</div>}

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
                    type={showPassword ? "text" : "password"}
                    handleChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    darkMode={false}
                    isReadOnly={false}
                    placeholder="Password..."
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="show-password-button"
                  >
                    {showPassword ? "Hide Password " : "Show Password"}
                  </button>
                  <br />
                  <br />

                  <Button
                    type="submit"
                    isDisabled={loading}
                    text={loading ? "Logging in..." : "Login"}
                    variant="primary"
                    handleClick={() => {}}
                  />
                </form>
              )}
            </div>

            <p>
              <a
                onClick={() => setIsSigningUp((prev) => !prev)}
                className="toggleLink"
              >
                {isSigningUp
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
