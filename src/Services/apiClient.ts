import axios from "axios";
import * as Sentry from "@sentry/react";

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_URL;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const apiClient = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    Sentry.captureException(error, {
      extra: {
        status,
        url,
        method: error.config?.method,
        responseData: error.response?.data,
      },
      level: status === 422 ? "warning" : "error",
    });

    return Promise.reject(error);
  },
);

export default apiClient;
