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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User list</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.fields.Name}</li>
        ))}
      </ul>

      <input type="button" value="Create new" />
    </div>
  );
};

export default DataRequests;
