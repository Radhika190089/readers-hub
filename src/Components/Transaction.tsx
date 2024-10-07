import "./Styles/st.css";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { GetTransaction } from "./Services/TransactionServices";
import { FormOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export interface TransactionType {
  transactionId: number;
  readerId: number;
  readerName: string;
  bookISBN: string;
  bookName: string;
  date: Date;
  type: "Borrow" | "Return";
}

const Transaction: React.FC = () => {
  const [filteredData, setFilteredData] = useState<TransactionType[]>([]);
  const [transaction, setTransaction] = useState<TransactionType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const borrowedBooksCount = transaction.filter(
    (r) => r.type === "Borrow"
  ).length;

  useEffect(() => {
    (async () => {
      try {
        const transaction = await GetTransaction();
        setTransaction(transaction);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = transaction.filter(
        (reader) =>
          reader.readerId.toString().includes(searchTerm) ||
          reader.bookISBN.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(transaction);
    }
  }, [searchTerm, transaction]);

  const columns: ColumnsType<TransactionType> = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: TransactionType, index: number) => index + 1,
      width: "5%",
    },
    {
      title: "Reader Name",
      dataIndex: "readerName",
      key: "readerName",
      width: "20%",
    },

    {
      title: "Book Name",
      dataIndex: "bookName",
      key: "bookName",
      width: "20%",
    },
    {
      title: "Book ISBN",
      dataIndex: "bookISBN",
      key: "bookISBN",
      width: "20%",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => new Date(date).toLocaleDateString(),
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
            <div className="p0">
              <div className="p1">
                <h2>{transaction.length}</h2>
                <div className="p2">
                  <FormOutlined
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Total Transactions</h2>
            </div>
          </div>
          <div className="TR1">
            <div className="p0">
              <div className="p1">
                <h2>{borrowedBooksCount}</h2>
                <div className="p2">
                  <FontAwesomeIcon
                    icon={faBook}
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Borrowed Books</h2>
            </div>
          </div>
          <div className="TR1">
            <div className="p0">
              <div className="p1">
                <h2>{transaction.length}</h2>
                <div className="p2">
                  <ClockCircleOutlined
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Books Borrowed This Week</h2>
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
          <h3>Recent TransactionType</h3>
          <div className="d-flex gap-2">
            <Link to={"/readerManagement"} style={{ textDecoration: "none" }}>
              <h6 style={{ color: "#145250", paddingTop: "10px" }}>
                View Readers
              </h6>
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
