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
import { Table, Button } from "antd"; // Import Button here
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reader, setReaders] = useState<ReaderType[]>([]);
  const [book, setBook] = useState<BookType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [topBooks, setTopBooks] = useState<(BookType | null)[]>([]); // Allow null for placeholders
  const activeReadersCount = reader.filter((r) => r.status === "Active").length;

  useEffect(() => {
    (async () => {
      try {
        const bookData = await GetBookData();
        const readerData = await GetReaderData();
        const transactionData = await GetTransaction();
        setBook(bookData);
        setReaders(readerData);
        setTransactions(transactionData);

        // Set top books
        setTopBooks(getTopBooks(bookData, 6)); // Ensure exactly 6 books
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

  const getTopBooks = (books: BookType[], count: number) => {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    const selectedBooks = shuffled.slice(0, count);
    return [...selectedBooks, ...Array(count - selectedBooks.length).fill(null)].slice(0, count);
  };

  const dataSource = reader.slice(0, 5);

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: "Reader ID", dataIndex: "readerId" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone No", dataIndex: "phoneNo" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Status", dataIndex: "status" },
  ];

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
                  <BookOutlined style={{ fontSize: "30px", color: "#145250" }} />
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
                  <ReadOutlined style={{ fontSize: "30px", color: "#145250" }} />
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
                  <HourglassOutlined style={{ fontSize: "30px", color: "#145250" }} />
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
                  <TeamOutlined style={{ fontSize: "30px", color: "#145250" }} />
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
                  <UserOutlined style={{ fontSize: "30px", color: "#145250" }} />
                </div>
              </div>
              <h4>Active Readers</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="topchoices">
        <div className="d-flex justify-content-between m-0">
          <h2>Top Choices</h2>
          <h5 className="view mt-2" onClick={()=>(navigate("/book"))} >View All</h5>
        </div>
        <div className="topbooks">
          {topBooks.map((book, index) => (
            <div key={book ? book.bookISBN : `placeholder-${index}`} className="book-card">
              {book ? (
                <>
                  <img src={book.bookURL} alt={book.title} />
                  <h5>{book.title}</h5>
                  <p>{book.author}</p>
                </>
              ) : (
                <div className="placeholder">No Book Available</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="reader">
        <div className="d-flex justify-content-between m-0">
          <h2>Readers List</h2>
          <h5 className="view mt-2" onClick={()=>(navigate("/readerManagement"))}>View All</h5>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          style={{borderRadius:'20px'}}
        />
      </div>
    </div>
  );
};

export default Dashboard;
