import React, { useState } from "react";
import InputField from "../stories/InputField";

function FieldForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div>
      <InputField
        value={username}
        handleChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(event.target.value)
        }
        label="Username"
        darkMode={false}
        isReadOnly={false}
        placeholder="Test"
      />
      <br />
      <InputField
        value={email}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        label="Email"
        darkMode={false}
        isReadOnly={false}
        placeholder="Test email"
      />
    </div>
  );
}

export default FieldForm;
