import React, { useState } from "react";
import InputField from "/src/stories/InputField";

function FieldForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div>
      <InputField
        value={username}
        handleChange={(e) => setUsername(e.target.value)}
        label="Username"
        darkMode={false}
        isReadOnly={false}
        placeholder="Test"
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
    </div>
  );
}

export default FieldForm;
