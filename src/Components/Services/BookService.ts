import axios from "axios";
import { BookType } from "../Mana";
import { apiBaseURL } from "./Index";

export const GetBookData = async () => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Books/Get_All_Books`
    );
    console.log(process.env.REACT_APP_API_URL);

    
    return response.data as BookType[]
};

export const AddNewBook = async (newBook : BookType) => {
  try {    
     await axios.post(
      `${apiBaseURL}/LMS/Books/Add_Book`,
      newBook
    )
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const UpdateBook = async (id : string , updateBook : BookType) => {
  try {    
    await axios.post(
      `${apiBaseURL}/LMS/Books/Update_Book/${id}` ,
      updateBook
    )
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const DeleteBook = async (id : string) => {
  try {    
    await axios.post(
      `${apiBaseURL}/LMS/Books/Remove_Book/${id}`
    )
  } catch (error) {
    console.error(error)
    throw error;
  }
}