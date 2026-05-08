import { useState, type FormEvent } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../Services/Auth/firebase";
import { useSearchParams, useNavigate } from "react-router-dom";

import InputField from "../../stories/InputField";
import Button from "../../stories/Button";
import { Routes } from "../../Routes";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  function validatePassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    return passwordRegex.test(password);
  }

  function getFirebaseErrorMessage(error: unknown) {
    if (!(error instanceof Error)) {
      return "Something went wrong";
    }

    switch (error.message) {
      case "Firebase: Error (auth/expired-action-code).":
        return "This reset link has expired.";

      case "Firebase: Error (auth/invalid-action-code).":
        return "This reset link is invalid.";

      case "Firebase: Error (auth/weak-password).":
        return "Password is too weak.";

      default:
        return error.message;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!oobCode) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase and a number.",
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      await verifyPasswordResetCode(auth, oobCode);

      await confirmPasswordReset(auth, oobCode, password);

      setSuccess("Password updated successfully. Redirecting to login...");

      setTimeout(() => {
        navigate(Routes.AUTHENTICATE);
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-container">
      <div className="background"></div>

      <div className="form">
        <div className="formLoginContainer">
          <h1>Create New Password</h1>

          <div className="formContent">
            <p className="paragraph">Please enter your new password below.</p>

            {error && <div className="input-error-message">{error}</div>}

            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <InputField
                value={password}
                type={showPassword ? "text" : "password"}
                handleChange={(e) => setPassword(e.target.value)}
                label="New Password"
                darkMode={false}
                isReadOnly={loading}
                placeholder="New password"
                required
              />

              <br />

              <InputField
                value={confirmPassword}
                type={showPassword ? "text" : "password"}
                handleChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                darkMode={false}
                isReadOnly={loading}
                placeholder="Confirm password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="show-password-button"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              <br />
              <br />

              <Button
                type="submit"
                isDisabled={loading}
                text={loading ? "Updating Password..." : "Update Password"}
                variant="primary"
                handleClick={() => {}}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
