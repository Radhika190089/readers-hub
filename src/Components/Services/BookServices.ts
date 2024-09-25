import axios from "axios";
import { apiBaseURL } from "./Index";
import { BookType } from "../Book";

export const GetBookData = async () => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Books/Get_All_Books`
    );
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

export const UpdateBook = async (bookId : string , updateBook : BookType) => {
  try {    
    await axios.post(
      `${apiBaseURL}/LMS/Books/Update_Book/${bookId}` ,
      updateBook
    )
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const DeleteBook = async (bookId : string) => {
  try {    
    await axios.post(
      `${apiBaseURL}/LMS/Books/Remove_Book/${bookId}`
    )
  } catch (error) {
    console.error(error)
    throw error;
  }
}