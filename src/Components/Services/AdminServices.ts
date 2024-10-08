import axios from "axios";
import { apiBaseURL } from "./Index";
import { AdminType } from "../Admin";

export const LoginAdmin = async (login : AdminType) => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Admins/Login`
    );
    return response.data as AdminType[]
};

export const RegisterAdmin = async (newAdmin: AdminType) => {
    await axios.post(`${apiBaseURL}/LMS/Admins/Register`, newAdmin);
};