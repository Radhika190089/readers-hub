import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { LineChart } from "@mui/x-charts/LineChart";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/st.css";
import { BookType } from "./Mana";

const Visit = [58, 91, 42, 50, 32, 31, 47];
const Read = [30, 48, 20, 40, 60, 23, 18];
const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [randomBooks, setRandomBooks] = useState<BookType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(localBooks);

    const groupedBooks: { [key: string]: BookType[] } = localBooks.reduce(
      (acc: { [key: string]: BookType[] }, book: BookType) => {
        acc[book.category] = acc[book.category] || [];
        acc[book.category].push(book);
        return acc;
      },
      {}
    );

    const selectedBooks: BookType[] = Object.values(groupedBooks).map(
      (categoryBooks) =>
        categoryBooks[Math.floor(Math.random() * categoryBooks.length)]
    );

    setRandomBooks(selectedBooks);
  }, []);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "49%" }}>
          <Carousel autoplay>
            <div>
              <div className="slidebar">
                <div className='justify-content-spacebetween'>
                  <h1 style={{ fontSize: '75px' }} >Welcome Back!</h1>
                  <h4>Continue exploring the library.</h4>
                </div>
                <div>
                  {/* <img src="\Images\Booktree.png" alt="Welcome" className="bottom" height={'320px'} /> */}
                </div>
                <div>
                  <span className="bottom-left" onClick={() => navigate("/books")}><h6>Add New Books →</h6></span>
                </div>
              </div>
            </div>
            <div>
              <div className="slidebar">
                <div className='justify-content-spacebetween'>
                  <h1 style={{ fontSize: '75px' }}>Manage Users</h1>
                  <h4>Add or update user information easily.</h4>
                </div>
                <span className="bottom-left" onClick={() => navigate("/users")}><h6>Go to User Management →</h6></span>
              </div>
            </div>
            <div>
              <div className="slidebar">
                <div className='justify-content-spacebetween'>
                  <h1 style={{ fontSize: '75px' }}>Admin Profile</h1>
                  <h4>View and edit your profile details.</h4>
                </div>
                <div>
                  {/* <img src="\Images\profile.png" alt="Admin Profile" className="bottom" height={'180px'} /> */}
                </div>
                <span className="bottom-left" onClick={() => navigate("/profile")}><h6>View Profile →</h6></span>
              </div>
            </div>
          </Carousel>
        </div>
        <div
          style={{
            width: "49%",
            backgroundColor: "",
            borderRadius: "10px",
            boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
          }}
        >
          <h4 className="mx-4 mt-3">Visit & Read</h4>
          <LineChart
            width={710}
            height={270}
            series={[
              { data: Visit, label: "Visit", color: "#Fb3453" },
              { data: Read, label: "Read" },
            ]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
            yAxis={[{ scaleType: "linear" }]}
          />
        </div>
      </div>

      <div
        className="mt-4 pt-5 pb-2 px-1"
        style={{
          boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
          borderRadius: "20px",
        }}
      >
        <div className="mx-3 d-flex justify-content-between fs-6">
          <h3>Book Categories</h3>
          <Link
            to={"/books"}
            style={{
              textDecoration: "none",
              color: "#Fb3453",
              fontWeight: "600",
              paddingTop: "8px",
            }}
          >
            View All
          </Link>
        </div>
        <div className="d-flex flex-direction-column overflow-auto">
          {randomBooks.map((book) => (
            <div
              key={book.id}
              style={{ margin: "20px", lineHeight: 0.5, cursor: "pointer" }}
              className="card1"
            >
              <img
                src={book.bookPic}
                alt={book.title}
                height={"250px"}
              />
              <h6 className="mt-2">{book.title}</h6>
              <p style={{ color: "rgb(125,125,125)" }}>{book.author}</p>
              <h6 style={{ color: "#Fb3453" }}>{book.category}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;