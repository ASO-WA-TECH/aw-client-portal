import React, { useEffect, useState } from "react";
import HttpService from "../Services/httpService";

const UserRequests = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const httpService = new HttpService();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await httpService.fetchRecords();
        setUsers(data);
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
    const userDetails = {
      Name: name,
      Email: email,
    };
    try {
      await httpService.createRecords(userDetails);
      console.log("POST successful");
    } catch (err) {
      console.log("ERROR", err.response?.data);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userDetails = {
      id: userId,
      fields: {
        Name: name,
        Email: email,
      },
    };
    try {
      await httpService.updateRecord(userDetails);
      console.log("Update success");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await httpService.deleteRecord(userId);
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

      <form action="" onSubmit={handleDelete}>
        <h2> Delete Record </h2>
        <label htmlFor="">
          userId:
          <input value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>

        <br />
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default UserRequests;
