
import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/st.css";
import { GetBookData } from "./Services/BookServices";
import { BookType } from "./Book";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';
import { mobileAndDesktopOS, valueFormatter } from './webUsageStats';






const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  // const [randomBooks, setRandomBooks] = useState<BookType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await GetBookData();
        setBooks(data);
        console.log(books)
      } catch (error) {
        console.error(error);
      }
    })();

    // const groupedBooks: { [key: string]: BookType[] } = books.reduce(
    //   (acc: { [key: string]: BookType[] }, book: BookType) => {
    //     acc[book.category] = acc[book.category] || [];
    //     acc[book.category].push(book);
    //     return acc;
    //   },
    //   {}
    // );

    // const selectedBooks: BookType[] = Object.values(groupedBooks).map(
    //   (categoryBooks) =>
    //     categoryBooks[Math.floor(Math.random() * categoryBooks.length)]
    // );

    // setRandomBooks(selectedBooks);
  }, []);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="row" >
        <div className="core" >
          <Carousel autoplay >
            <div className="slidebar-1">
              <div className="justify-content-spacebetween rounded-5">
                <h1 style={{ fontSize: "75px", fontWeight: 'bolder' }}>Welcome Back!</h1>
                <h4>Continue exploring the library.</h4>
              </div>
              <div>
                <span
                  className="bottom-left"
                  onClick={() => navigate("/books")}
                  style={{ cursor: "pointer" }}
                >
                  <h6>Add New Books →</h6>
                </span>
              </div>
            </div>
            <div>
              <div className="slidebar-2">
                <div className="justify-content-spacebetween">
                  <h1 style={{ fontSize: "75px", fontWeight: 'bolder' }}>Manage Readers</h1>
                  <h4>Add or update Readers information easily.</h4>
                </div>
                <span
                  className="bottom-left"
                  onClick={() => navigate("/readerManagement")}
                  style={{ cursor: "pointer" }}
                >
                  <h6>Manage Readers →</h6>
                </span>
              </div>
            </div>
            <div>
              <div className="slidebar-3">
                <div className="justify-content-spacebetween">
                  <h1 style={{ fontSize: "75px", fontWeight: 'bolder' }}>Admin Profile</h1>
                  <h4>View and edit your profile details.</h4>
                </div>
                <div>
                  {/* <img src="\Images\profile.png" alt="Admin Profile" className="bottom" height={'180px'} /> */}
                </div>
                <span
                  className="bottom-left"
                  onClick={() => navigate("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  <h6>View Profile →</h6>
                </span>
              </div>
            </div>
          </Carousel>
        </div>
        <div className="col-xl-6 col-12 flex align-items-center justify-content-center">
          <div>
            <Box sx={{ width: '100%' }}>
              <PieChart
                height={300}
                series={[
                  {
                    data: mobileAndDesktopOS.slice(0, 4),
                    innerRadius: 70,
                    arcLabel: (params) => params.label ?? '',
                    arcLabelMinAngle: 20,
                    valueFormatter,
                  },
                ]}
                skipAnimation={false}
              />
            </Box>
          </div>
        </div>


        {/* 
        <div className="recentBooks col-12 col-xl-6"
          style={{
            // width: "49%",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
          }}
        >
          <h4 className="px-2"> Recent Books</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col" style={{ color: "	#145250" }}>
                  Book Id
                </th>
                <th scope="col" style={{ color: "#145250" }}>
                  Title
                </th>
                <th scope="col" style={{ color: "#145250" }}>
                  Author
                </th>
                <th scope="col" style={{ color: "#145250" }}>
                  Available
                </th>
                <th scope="col" style={{ color: "#145250" }}>
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">12432</td>
                <td>Aot</td>
                <td>Eren</td>
                <td>9</td>
                <td>1900</td>
              </tr>
              <tr>
                <td className="fw-medium">22432</td>
                <td>Naruto</td>
                <td>Kisimoto</td>
                <td>7</td>
                <td>2500</td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>

      <div
        className="mt-4 pt-4 pb-2 px-3"
        style={{
          boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
          borderRadius: "20px",
        }}
      >
        <div className="mx-3 d-flex justify-content-between fs-6 ">
          <h2 style={{ fontWeight: "700" }}>Top Choices</h2>
          <Link
            to={"/book"}
            style={{
              textDecoration: "none",
              color: "#145250",
              fontWeight: "600",
              paddingTop: "8px",
            }}
          >
            View All
          </Link>
        </div>
        <div className="d-flex flex-direction-column overflow-auto">
          {books.map((book) => {
            console.log("book", book);
            return (
              <div
                key={book.bookId}
                style={{ margin: "20px", lineHeight: 0.4, cursor: "pointer" }}
                className="card1 shadow border p-5"
              >
                <img src={book.bookURL} alt={book.title} height={"250px"} />
                <h6 className="mt-2">{book.title}</h6>
                <p style={{ color: "#145250" }}>{book.author}</p>
                <h6 style={{ color: "#145250" }}>{book.category}</h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
