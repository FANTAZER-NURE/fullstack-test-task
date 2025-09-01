import axios from "axios";
import { makeApi } from "./makeApi";
import { API_URL } from "../utils/constants";

export const authHttp = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
const {
  getApi,
  postApi,
  patchApi,
  deleteApi,
} = makeApi(authHttp);

export { getApi, postApi, patchApi, deleteApi };
