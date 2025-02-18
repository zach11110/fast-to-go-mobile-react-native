import axios from "axios";
import cache from "../utils/cache";

export const serverURL = "http://181.215.68.223:5000";
// export const serverURL = "http://192.168.1.6:5000"; // local url

const api = axios.create({
  baseURL: serverURL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 2,
});
const get = api.get;
api.get = async (url, axiosConfig, expiryInMins = 0) => {
  const value = await cache.get(url);
  if (value) {
    return { ok: true, data: value };
  }

  const response = await get(url, axiosConfig);

  if (Number.isInteger(expiryInMins) && expiryInMins > 0) {
    await cache.store(url, response.data, expiryInMins || 0);
  }

  return response;
};

export default api;
