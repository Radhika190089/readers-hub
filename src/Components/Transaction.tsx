import "./Styles/st.css";
import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { GetTransaction } from "./Services/TransactionServices";
import { GetReaderData } from "./Services/ReaderServices";
import { GetBookData } from "./Services/BookServices";
import { ReaderType } from "./ReaderManagement";
import { BookType } from "./Book";

export interface TransactionType {
  transactionId: number;
  readerId: number;
  bookISBN: string;
  date: Date;
  type: "Borrow" | "Return";
}

const Transaction: React.FC = () => {
  const [reader, setReaders] = useState<ReaderType[]>([]);
  const [book, setBook] = useState<BookType[]>([]);
  const [filteredData, setFilteredData] = useState<TransactionType[]>([]);
  const [transaction, setTransaction] = useState<TransactionType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const transactions = await GetTransaction();
        const books = await GetBookData();
        const readers = await GetReaderData();

        setTransaction(transactions);
        setBook(books);
        setReaders(readers);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = transaction.filter(
        (t) =>
          t.readerId.toString().includes(searchTerm) ||
          t.bookISBN.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(transaction);
    }
  }, [searchTerm, transaction]);

  const getReaderName = (readerId: number) => {
    const readerObj = reader.find((r) => r.readerId === readerId);
    return readerObj?.name;
  };

  const getBookName = (bookISBN: string) => {
    const bookObj = book.find((b) => b.bookISBN === bookISBN);
    return bookObj?.title;
  };

  const columns: ColumnsType<TransactionType> = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: TransactionType, index: number) => index + 1,
      width: "8%",
      className: "text-center"
    },
    {
      title: "Reader Name",
      dataIndex: "readerId",
      key: "readerName",
      render: (readerId: number) => getReaderName(readerId),
      width: "20%",
      className: "text-center"
    },
    {
      title: "Book Name",
      dataIndex: "bookISBN",
      key: "bookName",
      render: (bookISBN: string) => getBookName(bookISBN),
      width: "20%",
      className: "text-center"
    },
    {
      title: "Book ISBN",
      dataIndex: "bookISBN",
      key: "bookISBN",
      width: "20%",
      className: "text-center"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => new Date(date).toLocaleDateString(),
      width: "13%",
      className: "text-center"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "13%",
      className: "text-center"
    },
  ];

  const brColumns: ColumnsType<TransactionType> = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: TransactionType, index: number) => index + 1,
      width: "8%",
      className: "text-center"
    },
    {
      title: "Reader Name",
      dataIndex: "readerId",
      key: "readerName",
      render: (readerId: number) => getReaderName(readerId),
      width: "20%",
      className: "text-center"
    },
    {
      title: "Book Name",
      dataIndex: "bookISBN",
      key: "bookName",
      render: (bookISBN: string) => getBookName(bookISBN),
      width: "20%",
      className: "text-center"
    },
    {
      title: "Book ISBN",
      dataIndex: "bookISBN",
      key: "bookISBN",
      width: "20%",
      className: "text-center"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => new Date(date).toLocaleDateString(),
      width: "13%",
      className: "text-center"
    },
  ];

  const tabItems = [
    {
      label: "All Transactions",
      key: "1",
      icon: <FileTextOutlined />,
      children: (
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),

    },
    {
      label: "Borrowed Books",
      key: "2",
      icon: <BookOutlined />,
      children: (
        <Table
          columns={brColumns}
          dataSource={transaction.filter((t) => t.type === "Borrow")}
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),
    },
    {
      label: "Returned Books",
      key: "3",
      icon: <CheckCircleOutlined />,
      children: (
        <Table
          columns={brColumns}
          dataSource={transaction.filter((t) => t.type === "Return")}
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),
    },
    {
      label: "Overdue Books",
      key: "4",
      icon: <ExclamationCircleOutlined />,
      children: (
        <Table
          columns={[
            {
              title: "S No.",
              dataIndex: "sno",
              render: (_: any, __: TransactionType, index: number) => index + 1,
              width: "8%",
               className: "text-center" 
            },
            {
              title: "Reader Name",
              dataIndex: "readerName",
              key: "readerName",
              width: "20%",
               className: "text-center" 
            },
            {
              title: "Book Name",
              dataIndex: "bookName",
              key: "bookName",
              width: "20%",
               className: "text-center" 
            },
            {
              title: "Book ISBN",
              dataIndex: "bookISBN",
              key: "bookISBN",
              width: "20%",
               className: "text-center" 
            },
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
              render: (date: any) => new Date(date).toLocaleDateString(),
              width: "13%",
               className: "text-center" 
            },
            {
              title: "Fine",
              dataIndex: "fine",
              key: "fine",
              render: (_: any, record: TransactionType) => {
                const today = new Date();
                const borrowDate = new Date(record.date);
                const borrowingPeriod = 1;
                const dueDate = new Date(borrowDate);
                dueDate.setDate(borrowDate.getDate() + borrowingPeriod);

                if (today > dueDate) {
                  const overdueDays = Math.floor(
                    (today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
                  );
                  const fine = overdueDays * 200;
                  return `₹${fine}`;
                }
                return "No Fine";
              },
              width: "13%",
               className: "text-center" 
            },
          ]}
          dataSource={transaction.filter((t) => {
            const today = new Date();
            const borrowingPeriod = 1;

            if (t.type === "Borrow") {
              const borrowDate = new Date(t.date);
              const dueDate = new Date(borrowDate);
              dueDate.setDate(borrowDate.getDate() + borrowingPeriod);

              return (
                today > dueDate &&
                !transaction.some(
                  (tr) => tr.bookISBN === t.bookISBN && tr.type === "Return"
                )
              );
            }
            return false;
          })}
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "Poppins", width: "100%" }}>
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        style={{ fontFamily: "Poppins", }} />
    </div>
  );
};

export default Transaction;
