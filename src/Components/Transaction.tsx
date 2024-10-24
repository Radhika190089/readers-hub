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
    },
    {
      title: "Reader Name",
      dataIndex: "readerId",
      key: "readerName",
      render: (readerId: number) => getReaderName(readerId),
      width: "20%",
    },
    {
      title: "Book Name",
      dataIndex: "bookISBN",
      key: "bookName",
      render: (bookISBN: string) => getBookName(bookISBN),
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
      width: "13%",
    },
    {
      title: "Days After Issuing",
      dataIndex: "date",
      key: "daysAfterIssuing",
      render: (date: any) => {
        const issueDate = new Date(date);
        const today = new Date();
        const daysIssued = Math.floor(
          (today.getTime() - issueDate.getTime()) / (1000 * 3600 * 24)
        );
        return daysIssued === 0 ? " - " : `${daysIssued} days`;
      },
      width: "13%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "13%",
    },
  ];

  const brColumns: ColumnsType<TransactionType> = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: TransactionType, index: number) => index + 1,
      width: "8%",
    },
    {
      title: "Reader Name",
      dataIndex: "readerId",
      key: "readerName",
      render: (readerId: number) => getReaderName(readerId),
      width: "20%",
    },
    {
      title: "Book Name",
      dataIndex: "bookISBN",
      key: "bookName",
      render: (bookISBN: string) => getBookName(bookISBN),
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
      width: "13%",
    },
    {
      title: "Days After Issuing",
      dataIndex: "date",
      key: "daysAfterIssuing",
      render: (date: any) => {
        const issueDate = new Date(date);
        const today = new Date();
        const daysIssued = Math.floor(
          (today.getTime() - issueDate.getTime()) / (1000 * 3600 * 24)
        );
        return daysIssued === 0 ? " - " : `${daysIssued} days`;
      },
      width: "15%",
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
      label: "Books Issued",
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
            },
            {
              title: "Reader Name",
              dataIndex: "readerId",
              key: "readerName",
              render: (readerId: number) => getReaderName(readerId),
              width: "20%",
            },
            {
              title: "Book Name",
              dataIndex: "bookISBN",
              key: "bookName",
              render: (bookISBN: string) => getBookName(bookISBN),
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
              width: "13%",
            },
            {
              title: "Overdue Days",
              dataIndex: "date",
              width: "10%",
              render: (date: any) => {
                const issueDate = new Date(date);
                const today = new Date();
                const daysIssued = Math.floor(
                  (today.getTime() - issueDate.getTime()) / (1000 * 3600 * 24)
                );
                return `${daysIssued} days`;
              },
            },
            {
              title: "Fine",
              dataIndex: "fine",
              key: "fine",
              render: (_: any, record: TransactionType) => {
                const today = new Date();
                const borrowDate = new Date(record.date);
                const borrowingPeriod = 1; // Set borrowing period (days)
                const dueDate = new Date(borrowDate);
                dueDate.setDate(borrowDate.getDate() + borrowingPeriod);

                if (today > dueDate) {
                  const overdueDays = Math.floor(
                    (today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
                  );
                  const fine = overdueDays * 200; // ₹200 fine per day
                  return `₹${fine}`;
                }
                return null; // Return nothing if no fine
              },
              width: "6%",
            },
          ]}
          dataSource={transaction
            .filter((t) => {
              const today = new Date();
              const borrowingPeriod = 1; // Set borrowing period (days)

              if (t.type === "Borrow") {
                const borrowDate = new Date(t.date);
                const dueDate = new Date(borrowDate);
                dueDate.setDate(borrowDate.getDate() + borrowingPeriod);

                // Check if overdue and no return transaction exists for this book
                const isOverdue = today > dueDate;
                const hasNotReturned = !transaction.some(
                  (tr) => tr.bookISBN === t.bookISBN && tr.type === "Return"
                );

                // Only include overdue entries where there would be a fine
                return isOverdue && hasNotReturned;
              }
              return false;
            })
            .filter((t) => {
              // Further filter out any entries where the fine would be zero
              const today = new Date();
              const borrowDate = new Date(t.date);
              const dueDate = new Date(borrowDate);
              dueDate.setDate(borrowDate.getDate() + 1); // borrowingPeriod = 1

              const overdueDays = Math.floor(
                (today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
              );

              return overdueDays > 0; // Only keep transactions with positive overdue days
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
        style={{ fontFamily: "Poppins" }}
      />
    </div>
  );
};

export default Transaction;
