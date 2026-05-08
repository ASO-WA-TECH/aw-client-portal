import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Services/Auth/firebase";
import InputField from "../../stories/InputField";
import Button from "../../stories/Button";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../Routes";
import "./index.scss";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);

      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}/reset-password`,
      });

      setSuccessMessage(
        "If an account exists for this email, a reset link has been sent.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to send password reset email",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-container">
      <div className="background"></div>

      <div className="form">
        <div className="formLoginContainer">
          <h1>Reset Password</h1>

          <div className="formContent">
            <p className="paragraph">
              Enter your email address and we’ll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit}>
              {error && <div className="input-error-message">{error}</div>}

              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}

              <InputField
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                label="Email"
                darkMode={false}
                isReadOnly={loading}
                placeholder="Enter your email"
                required
              />

              <br />
              <br />

              <Button
                type="submit"
                isDisabled={loading}
                text={loading ? "Sending reset email..." : "Send Reset Email"}
                variant="primary"
                handleClick={() => {}}
              />
            </form>

            <br />

            <p>
              <a
                className="login-link"
                onClick={() => {
                  if (!loading) {
                    navigate(Routes.AUTHENTICATE);
                  }
                }}
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
