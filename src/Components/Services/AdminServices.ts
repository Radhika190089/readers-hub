import axios from "axios";
import { apiBaseURL } from "./Index";
import { AdminType } from "../Admin";

export const GetAdminData = async () => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Admins/Get_All_Admin`
    );
    return response.data as AdminType[]
};

export const RegisterAdmin = async (newAdmin : AdminType) => {
    try {    
       await axios.post(
        `${apiBaseURL}/LMS/Admins/Add_Admin`,
        newAdmin
      )
    } catch (error) {
      console.error(error)
      throw error;
    }
};