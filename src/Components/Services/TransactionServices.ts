import axios from "axios";
import { apiBaseURL } from "./Index";
import { TransactionType } from "../Book";

export const GetReaderData = async () => {
    const response = await axios.get(
      `${apiBaseURL}/LMS/Transactions/Get_All_Transaction`
    );
    return response.data as TransactionType[]
};

export const BorrowTransaction = async (bookISBN : string,readerId : string ) =>{
    try {
        await axios.post(
            `${apiBaseURL}/LMS/Transactions/Borrow_Book/${bookISBN}&${readerId}`
        )
    } catch (error) {        
      console.error(error)
      throw error;
    }
};

export const ReturnTransaction = async (bookISBN : string,readerId : string ) =>{
    try {
        await axios.post(
            `${apiBaseURL}/LMS/Transactions/Return_Book/${bookISBN}&${readerId}`
        )
    } catch (error) {        
      console.error(error)
      throw error;
    }
};