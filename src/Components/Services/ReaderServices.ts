import axios from "axios";
import { apiBaseURL } from "./Index";
import { ReaderType } from "../ReaderManagement";

export const GetReaderData = async () => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Readers/Get_All_Readers`
    );
    return response.data as ReaderType[]
};

export const AddNewReader = async (newReader : ReaderType[]) => {
    try {    
       await axios.post(
        `${apiBaseURL}/LMS/Readers/Add_Reader`,
        newReader
      )
    } catch (error) {
      console.error(error)
      throw error;
    }
};

export const UpdateReader = async (readerId : number , updateReader : ReaderType[]) => {
    try {    
      await axios.post(
        `${apiBaseURL}/LMS/Readers/Update_Reader/${readerId}` ,
        updateReader
      )
    } catch (error) {
      console.error(error)
      throw error;
    }
};

export const DeleteReader = async (readerId : number) => {
    try {    
      await axios.post(
        `${apiBaseURL}/LMS/Readers/Delete_Reader/${readerId}`
      )
    } catch (error) {
      console.error(error)
      throw error;
    }
};