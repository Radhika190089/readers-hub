import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ReadOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ReaderType } from "./ReaderManagement";
import { GetReaderData } from "./Services/ReaderServices";
import { GetBookData } from "./Services/BookServices";
import { GetTransaction } from "./Services/TransactionServices";
import { BookType } from "./Book";
import { TransactionType } from "./Transaction";

const Dashboard = () => {
  const [reader, setReaders] = useState<ReaderType[]>([]);
  const [book, setBook] = useState<BookType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [topBooks, setTopBooks] = useState<BookType[]>([]);
  const activeReadersCount = reader.filter((r) => r.status === "Active").length;

  useEffect(() => {
    (async () => {
      try {
        const book = await GetBookData();
        const reader = await GetReaderData();
        const transaction = await GetTransaction();
        setBook(book);
        setReaders(reader);
        setTransactions(transaction);

        // Set random top 6-7 books
        setTopBooks(getRandomBooks(book, 6)); // Select 6 random books
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const borrowedBooksCount = transactions.filter(
    (r) => r.type === "Borrow"
  ).length;

  const calculateOverdues = () => {
    const today = new Date();
    const borrowingPeriod = 2; // Assume a borrowing period of 2 days

    const overdueBooks = transactions.filter((t) => {
      if (t.type === "Borrow") {
        const borrowDate = new Date(t.date);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + borrowingPeriod);

        return (
          today > dueDate &&
          !transactions.some(
            (tr) => tr.bookISBN === t.bookISBN && tr.type === "Return"
          )
        );
      }
      return false;
    });

    return overdueBooks.length;
  };

  // Function to get random books
  const getRandomBooks = (books: BookType[], count: number) => {
    const shuffled = [...books].sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, count); // Return random number of books
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <div
          className="cardz d-flex justify-content-between"
          style={{ width: "100%", fontFamily: "Poppins" }}
        >
          <div className="TR2">
            <div className="p0">
              <div className="p1">
                <h2>{book.length}</h2>
                <div className="p2">
                  <BookOutlined
                    style={{ fontSize: "30px", color: "#145250" }}
                  />
                </div>
              </div>
              <h4>Total Books</h4>
            </div>
          </div>

          <div className="TR2">
            <div className="p0">
              <div className="p1">
                <h2>{borrowedBooksCount}</h2>
                <div className="p2">
                  <ReadOutlined
                    style={{ fontSize: "30px", color: "#145250" }}
                  />
                </div>
              </div>
              <h4>Borrowed Books</h4>
            </div>
          </div>

          <div className="TR2">
            <div className="p0">
              <div className="p1">
                <h2>{calculateOverdues()}</h2>
                <div className="p2">
                  <HourglassOutlined
                    style={{ fontSize: "30px", color: "#145250" }}
                  />
                </div>
              </div>
              <h4>Overdue Books</h4>
            </div>
          </div>

          <div className="TR2">
            <div className="p0">
              <div className="p1">
                <h2>{reader.length}</h2>
                <div className="p2">
                  <TeamOutlined
                    style={{ fontSize: "30px", color: "#145250" }}
                  />
                </div>
              </div>
              <h4>Total Readers</h4>
            </div>
          </div>

          <div className="TR2">
            <div className="p0">
              <div className="p1">
                <h2>{activeReadersCount}</h2>
                <div className="p2">
                  <UserOutlined
                    style={{ fontSize: "30px", color: "#145250" }}
                  />
                </div>
              </div>
              <h4>Active Readers</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="topchoices">
        <h3>Top Picks</h3>
        <div className="topbooks">
          {topBooks.map((book) => (
            <div key={book.bookISBN} className="book-card">
              <img src={book.bookURL} alt={book.title} />
              <h5>{book.title}</h5>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Dashboard;
