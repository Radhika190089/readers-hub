import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Select, Table } from "antd";
import { ReaderType } from "./ReaderManagement";

export interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  bookCount: number;
  bookPic: string;
  price: number;
}

export interface TransactionType {
  transactionId: number;
  userId: number;
  bookId: number;
  date: Date;
  type: "borrow" | "return";
}

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<BookType[]>([]);
  const [filteredData, setFilteredData] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewBorrowModal, setViewBorrowModal] = useState(false);
  const [viewReturnModal, setViewReturnModal] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [users, setUsers] = useState<ReaderType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const [addBookForm] = Form.useForm();
  const [borrowBookForm] = Form.useForm();
  const [returnBookForm] = Form.useForm();

  const overdueLimit = 1;
  const finePerDay = 100;

  useEffect(() => {
    const localBooks = JSON.parse(localStorage.getItem("books") || "[]");
    const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const localTransaction = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    setBooks(localBooks);
    setUsers(localUsers);
    setTransactions(localTransaction);

    localTransaction.forEach((transaction: TransactionType) => {
      if (transaction.type === "borrow") {
        const dueDate = new Date(transaction.date);
        dueDate.setDate(dueDate.getDate() + overdueLimit);

        if (new Date() > dueDate) {
          const overdueDays = Math.floor(
            (new Date().getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
          );
          const fine = overdueDays * finePerDay;
          notifyAdmin(transaction.userId, fine);
        }
      }
    });
  }, []);

  useEffect(() => {
    const localBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setData(localBooks);
    setFilteredData(localBooks);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (book) =>
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.id.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const notifyAdmin = (userId: number, fine: number) => {
    const user = users.find((x) => x.userId === userId);
    notification.warning({
      message: "There is an overdue book.",
      description: `${user?.name} has an overdue fine of ₹${fine}`,
    });
  };

  const showAddModal = () => {
    setViewAddModal(true);
  };

  const showBorrowModal = () => {
    setViewBorrowModal(true);
  };

  const showReturnModal = () => {
    setViewReturnModal(true);
  };

  const handleAddBook = (values: Omit<BookType, "id">) => {
    const newBook = { id: Math.floor(1000 + Math.random() * 9000), ...values };
    const updatedBooks = [...books, newBook];

    localStorage.setItem("books", JSON.stringify(updatedBooks));

    setBooks(updatedBooks);
    setViewAddModal(false);
    addBookForm.resetFields();
  };

  const handleBorrowBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookID = Number(selectedBookId);
      const userID = Number(selectedUserId);

      const bookIndex = books.findIndex((b) => b.id === bookID);

      if (bookIndex !== -1 && books[bookIndex].bookCount > 0) {
        const updatedBooks = [...books];
        updatedBooks[bookIndex].bookCount -= 1;
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        const newTransaction: TransactionType = {
          transactionId: transactions.length + 1,
          bookId: bookID,
          userId: userID,
          type: "borrow",
          date: new Date(),
        };
        const updatedTransactions = [...transactions, newTransaction];
        localStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );
        setTransactions(updatedTransactions);
        setViewBorrowModal(false);
        borrowBookForm.resetFields();

        alert("Book Borrowed Successfully.");
      } else {
        console.error("Book not found or out of stock");
      }
    } else {
      alert("Please select a User and Book.");
    }
  };

  const handleReturnBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookID = Number(selectedBookId);
      const userID = Number(selectedUserId);

      const borrowedBook = transactions.find((transaction) => {
        return (
          transaction.bookId === bookID &&
          transaction.userId === userID &&
          transaction.type === "borrow"
        );
      });

      if (borrowedBook) {
        const bookIndex = books.findIndex((b) => b.id === bookID);

        if (bookIndex !== -1) {
          const updatedBooks = [...books];
          updatedBooks[bookIndex].bookCount += 1;
          setBooks(updatedBooks);
          localStorage.setItem("books", JSON.stringify(updatedBooks));
          const newTransaction: TransactionType = {
            transactionId: transactions.length + 1,
            bookId: bookID,
            userId: userID,
            type: "return",
            date: new Date(),
          };

          const updatedTransactions = [...transactions, newTransaction];
          localStorage.setItem(
            "transactions",
            JSON.stringify(updatedTransactions)
          );
          setTransactions(updatedTransactions);
          setViewReturnModal(false);
          returnBookForm.resetFields();
        } else {
          console.error("Book not found");
        }
      } else {
        alert("No borrowed transaction found for this book by the user.");
      }
    } else {
      alert("Please select a User and Book.");
    }
  };

  const handleCancelAddModal = () => {
    setViewAddModal(false);
    addBookForm.resetFields();
  };

  const handleCancelBorrowModal = () => {
    setViewBorrowModal(false);
    borrowBookForm.resetFields();
  };

  const handleCancelReturnModal = () => {
    setViewReturnModal(false);
    returnBookForm.resetFields();
  };

  const categories = Array.from(new Set(books.map((book) => book.category)));

  const handleViewDetails = (record: BookType) => {
    setSelectedBook(record);
    form.setFieldsValue({
      author: record.author,
      title: record.title,
      category: record.category,
      bookPic: record.bookPic,
      price: record.price,
    });
    setViewDetailsModal(true);
  };

  const handleSaveChanges = () => {
    form.validateFields().then((values) => {
      if (selectedBook) {
        const updatedData = data.map((item) =>
          item.id === selectedBook.id ? { ...item, ...values } : item
        );
        setData(updatedData);
        localStorage.setItem("books", JSON.stringify(updatedData));
        setSelectedBook(null);
        setViewDetailsModal(false);
        form.resetFields();
      }
    });
  };

  const handleDeleteBook = (record: BookType) => {
    const updatedData = data.filter((item) => item.id !== record.id);
    setData(updatedData);
    localStorage.setItem("books", JSON.stringify(updatedData));
    setSelectedBook(null);
    setViewDetailsModal(false);
  };

  const columns = [
    {
      title: "BookPic",
      dataIndex: "bookPic",
      width: "10%",
      render: (_: any, record: BookType) => (
        <img src={record.bookPic} alt={record.title} height={"250px"} />
      ),
    },
    { title: "BookID", dataIndex: "id", width: "8%" },
    { title: "Author", dataIndex: "author", width: "25%" },
    { title: "Book Title", dataIndex: "title", width: "10%" },
    { title: "Category", dataIndex: "category", width: "10%" },
    { title: "Price", dataIndex: "price", width: "10%" },
    {
      title: "Book details",
      dataIndex: "BookDetails",
      render: (_: any, record: BookType) => (
        <div className="d-flex gap-3">
          <Button type="primary" onClick={() => handleViewDetails(record)}>
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteBook(record)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-2">
      <div className="mb-3 d-flex justify-content-between">
        <Input
          className="search"
          placeholder="Search by Booktitle or BookID"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
      </div>
      <div className="my-4">
        <div className="d-flex justify-content-between">
          <Button
            icon={<PlusOutlined />}
            className="mx-2 p-4"
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
              borderRadius: "15px",
              backgroundColor: "#fb3453",
            }}
            type="primary"
            onClick={showAddModal}
          >
            Add Book
          </Button>
          <div>
            <Button
              icon={<BookOutlined />}
              className="mx-2 p-4"
              style={{
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "15px",
                backgroundColor: "#fb3453",
              }}
              type="primary"
              onClick={showBorrowModal}
            >
              Borrow Book
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              className="mx-2 p-4"
              style={{
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "15px",
                backgroundColor: "#fb3453",
              }}
              type="primary"
              onClick={showReturnModal}
            >
              Return Book
            </Button>
          </div>
        </div>
      </div>
      <Table
        bordered
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Book Details"
        open={viewDetailsModal}
        onCancel={() => {
          setViewDetailsModal(false);
          form.resetFields();
        }}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Book Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please input the author!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="bookPic"
            label="Book Cover Image URL"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input type="string" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
      {/* Add Book Modal */}
      <Modal
        visible={viewAddModal}
        title="Add Book"
        onCancel={handleCancelAddModal}
        footer={null}
      >
        <Form form={addBookForm} onFinish={handleAddBook} layout="vertical">
          <Form.Item
            name="title"
            label="Book Title"
            rules={[{ required: true, message: "Please enter book title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please enter author name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter book category" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bookCount"
            label="Book Count"
            rules={[{ required: true, message: "Please enter book count" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="bookPic"
            label="Book Picture URL"
            rules={[
              { required: true, message: "Please enter book picture URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter book price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Book
          </Button>
        </Form>
      </Modal>

      {/* Borrow Book Modal */}
      <Modal
        visible={viewBorrowModal}
        title="Borrow Book"
        onCancel={handleCancelBorrowModal}
        footer={null}
      >
        <Form
          form={borrowBookForm}
          onFinish={handleBorrowBook}
          layout="vertical"
        >
          <Form.Item
            name="user"
            label="Select User"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select
              placeholder="Select User"
              onChange={(value) => setSelectedUserId(value)}
            >
              {users.map((user) => (
                <Select.Option key={user.userId} value={user.userId}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="book"
            label="Select Book"
            rules={[{ required: true, message: "Please select a book" }]}
          >
            <Select
              placeholder="Select Book"
              onChange={(value) => setSelectedBookId(value)}
            >
              {books.map((book) => (
                <Select.Option key={book.id} value={book.id}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Borrow Book
          </Button>
        </Form>
      </Modal>

      {/* Return Book Modal */}
      <Modal
        visible={viewReturnModal}
        title="Return Book"
        onCancel={handleCancelReturnModal}
        footer={null}
      >
        <Form
          form={returnBookForm}
          onFinish={handleReturnBook}
          layout="vertical"
        >
          <Form.Item
            name="user"
            label="Select User"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select
              placeholder="Select User"
              onChange={(value) => setSelectedUserId(value)}
            >
              {users.map((user) => (
                <Select.Option key={user.userId} value={user.userId}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="book"
            label="Select Book"
            rules={[{ required: true, message: "Please select a book" }]}
          >
            <Select
              placeholder="Select Book"
              onChange={(value) => setSelectedBookId(value)}
            >
              {books.map((book) => (
                <Select.Option key={book.id} value={book.id}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Return Book
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
