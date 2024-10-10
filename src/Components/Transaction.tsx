import "./Styles/st.css";
import React, { useEffect, useState } from "react";
import { Table, Tabs, } from "antd";
import { BookOutlined, FileTextOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from "antd/es/table";
import { GetTransaction } from "./Services/TransactionServices";

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

  const getCurrentWeekRange = () => {
    const now = new Date();
    const firstDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 1)
    );
    const lastDayOfWeek = new Date(now.setDate(now.getDate() + 6));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return { firstDayOfWeek, lastDayOfWeek };
  };

  const booksBorrowedThisWeek = transaction.filter((t) => {
    const { firstDayOfWeek, lastDayOfWeek } = getCurrentWeekRange();
    const transactionDate = new Date(t.date);
    return (
      t.type === "Borrow" &&
      transactionDate >= firstDayOfWeek &&
      transactionDate <= lastDayOfWeek
    );
  }).length;

  const calculateOverdues = () => {
    const today = new Date();

    const borrowingPeriod = 2;

    const overdueBooks = transaction.filter((t) => {
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
    });

    return overdueBooks.length;
  };

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

  const tabItems = [
    {
      label: "All Transactions",
      key: "1",
      icon: <FileTextOutlined />,
      children: (
        <Table columns={columns} dataSource={filteredData} pagination={false} />
      ),
    },
    {
      label: "Borrowed Books",
      key: "2",
      icon: <BookOutlined />,
      children: (
        <Table
          columns={columns}
          dataSource={transaction.filter((t) => t.type === "Borrow")}
          pagination={false}
        />
      ),
    },
    {
      label: "Returned Books",
      key: "3",
      icon: <CheckCircleOutlined />,
      children: (
        <Table
          columns={columns}
          dataSource={transaction.filter((t) => t.type === "Return")}
          pagination={false}
        />
      ),
    },
    {
      label: "Overdue Books",
      key: "4",
      icon: <ExclamationCircleOutlined />,
      children: (
        <Table
          columns={columns}
          dataSource={transaction.filter((t) => t.type === "Return")}
          pagination={false}
        />
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "Poppins", width: "100%" }}>
      <Tabs defaultActiveKey="1" items={tabItems} style={{ fontFamily: "Poppins" }} />
    </div>
  );
};

export default Transaction;