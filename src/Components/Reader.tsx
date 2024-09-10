import "./Styles/st.css";
import React, { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { Transaction } from "./Mana";

const Reader: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const localTransaction = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    setTransactions(localTransaction);
  }, []);

  const columns: TableColumnsType<Transaction> = [
    {
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
      width: "5%",
    },
    {
      title: "User Id",
      dataIndex: "userId",
      key: "userId",
      width: "20%",
    },
    {
      title: "Book Id",
      dataIndex: "bookId",
      key: "bookId",
      width: "20%",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
  ];
  return (
    <div style={{ fontFamily: "Poppins", width: "100%" }}>
      <div className="d-flex justify-content-between">
        <div
          className="cardz d-flex justify-content-between"
          style={{ width: "100%" }}
        >
          <div className="TR1">
            <div className="p2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="35px"
                viewBox="0 -960 960 960"
                width="35px"
                fill="#ffffff"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
              </svg>
            </div>
            <div className="d-flex justify-content-between pt-5">
              <div>
                <h2>Total Readers</h2>
                <h2>2,177</h2>
              </div>
              <p className="pin2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffff"
                >
                  <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
                </svg>{" "}
                20%
              </p>
            </div>
          </div>
          <div className="TR2">
            <div className="p2d">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="35px"
                viewBox="0 -960 960 960"
                width="35px"
                fill="#ffffff"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
            </div>
            <div className="d-flex justify-content-between pt-5">
              <div>
                <h2>Active Readers</h2>
                <h2>143</h2>
              </div>
              <p className="pin2d">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
                </svg>{" "}
                20%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-5 p-3"
        style={{
          boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
          borderRadius: "10px",
        }}
      >
        <div className="mx-1 mt-2 d-flex justify-content-between">
          <h3>Recent Transaction</h3>
          <Link to={"/user"} style={{ textDecoration: "none" }}>
            <h6 style={{ color: "#Fb3453", paddingTop: "10px" }}>View Users</h6>
          </Link>
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={transactions}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Reader;
