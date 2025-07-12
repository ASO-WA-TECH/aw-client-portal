import React, { useEffect, useState } from "react";
import axios from "axios";

const DataRequests = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "https://api.airtable.com/v0/",
  });

  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE;
  const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`${BASE_ID}/${TABLE_NAME}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        console.log(response.data.records);
        setUsers(response.data.records);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, email);
    try {
      const response = await api.post(
        `${BASE_ID}/${TABLE_NAME}`,
        {
          fields: {
            Name: name,
            Email: email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("POST successful:", response.data.records);
    } catch (err) {
      console.log("ERROR", err.response?.data);
    }
  };

  const handleUpdate = async () => {
    if (!userId) {
      alert("Please eneter a valid id");
      return;
    }

    try {
      const response = await api.patch(
        `${BASE_ID}/${TABLE_NAME}/${userId}`,
        {
          fields: {
            Name: name,
            Email: email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update success:", response.data.fields);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        <h2>User list</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.fields.Name}</li>
          ))}
        </ul>
      </div>

      <form className="p-4" onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1 m-2 required"
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-1 m-2 required"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            {" "}
            Send
          </button>
        </div>
      </form>

      <form action="" onSubmit={handleUpdate}>
        <h2> Update Record </h2>
        <label htmlFor="">
          userId:
          <input value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <br />
        <label htmlFor="">
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label htmlFor="">
          Email:
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default DataRequests;
