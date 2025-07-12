import axios from "axios";

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

export default axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});
