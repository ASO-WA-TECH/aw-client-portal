import React, { useMemo, useState } from "react";
import Button from "../../../stories/Button/";
import HttpService from "../../../Services/httpService";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../../Routes";

interface UserData {
  id: string;
  Name: string;
  FullName: string;
  Email: string;
}
interface AccountDetailsProps {
  userData: UserData;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ userData }) => {
  const usersHttpService = useMemo(() => new HttpService("Users"), []);

  const [firstName, setFirstName] = useState(userData?.Name ?? "");
  const [fullName, setFullName] = useState(userData?.FullName ?? "");
  const [email, setEmail] = useState(userData?.Email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(Routes.ADD_LISTING);
  };

  if (!userData) return null;

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setSaveError("Please enter your current password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSaveError("New passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setSaveError("New password must be at least 6 characters.");
        return;
      }
    }

    try {
      setSaving(true);

      const updatedFields: Record<string, string> = {
        Name: firstName,
        FullName: fullName,
        Email: email,
      };

      if (newPassword) {
        updatedFields.Password = newPassword;
      }

      await usersHttpService.updateRecord({
        id: userData.id,
        fields: updatedFields,
      });

      setSaveSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Error saving changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card-section">
      <h2>ACCOUNT DETAILS</h2>
      <hr />
      <div className="form-grid">
        <div className="input-field">
          <label>USER NAME*</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>FULL NAME*</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="input-field full-width">
          <label>EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small>Please enter a valid Email address.</small>
        </div>
      </div>
      <br />
      <div className="password-section">
        <h3>CHANGE PASSWORD</h3>
        <div className="form-grid">
          <div className="input-field full-width">
            <label>CURRENT PASSWORD</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>NEW PASSWORD</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {saveError && (
          <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
        )}
        {saveSuccess && (
          <p style={{ color: "green", marginTop: "8px" }}>
            Changes saved successfully!
          </p>
        )}

        <div className="button-group">
          <Button
            customStyle="btn-save"
            type="submit"
            text={saving ? "Saving..." : "Save"}
            variant="primary"
            handleClick={handleSave}
          />

          <Button
            customStyle="btn-save"
            type="button"
            text="Create a listing"
            variant="primary"
            color="mustardYellow"
            handleClick={handleRedirect}
          />
        </div>
      </div>
    </section>
  );
};

export default AccountDetails;
