import axios from "axios";
import { apiBaseURL } from "./Index";
import { AdminType } from "../Admin";

export const LoginAdmin = async (login: AdminType) => {
  try {
    const response = await axios.post(`${apiBaseURL}/LMS/Admins/Login`, login);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const RegisterAdmin = async (newAdmin: AdminType) => {
    await axios.post(`${apiBaseURL}/LMS/Admins/Register`, newAdmin);
};