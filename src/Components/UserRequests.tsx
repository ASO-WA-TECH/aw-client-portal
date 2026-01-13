import React, { useEffect, useMemo, useState } from "react";
import HttpService from "../Services/httpService";

const UserRequests = () => {
  interface User {
    id: string;
    fields: {
      Name: string;
      Emil: string;
    };
  }

  const httpService = useMemo(() => new HttpService("Users"), [])

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await httpService.fetchAllRecords();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          console.error("Unknown error", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [httpService]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userDetails = {
      Name: name,
      Email: email,
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
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await httpService.deleteRecord(userId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="border p-1 m-2 required"
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
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
          <input
            value={userId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserId(e.target.value)
            }
          />
        </label>
        <br />
        <label htmlFor="">
          Name:
          <input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </label>
        <br />
        <label htmlFor="">
          Email:
          <input
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>

      <form action="" onSubmit={handleDelete}>
        <h2> Delete Record </h2>
        <label htmlFor="">
          userId:
          <input
            value={userId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserId(e.target.value)
            }
          />
        </label>

        <br />
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default UserRequests;
