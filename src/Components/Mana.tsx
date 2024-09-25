import { Button, Form, Input, Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  readerId: number;
  bookId: number;
  date: Date;
  type: "borrow" | "return";
}

const Mana = () => {
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
          notifyAdmin(transaction.readerId, fine);
        }
      }
    });
  }, []);

  const notifyAdmin = (readerId: number, fine: number) => {
    const user = users.find((x) => x.readerId === readerId);
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
          readerId: userID,
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
          transaction.readerId === userID &&
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
            readerId: userID,
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

  return (
    <>
      <div>
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

        {categories.map((category) => (
          <div
            key={category}
            className="pt-4 pb-2 px-1 my-4"
            style={{
              boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
              borderRadius: "20px",
              fontFamily: "poppins",
              overflowX: "scroll",
            }}
          >
            <div className="mx-4">
              <h4>{category}</h4>
            </div>
            <div className="d-flex flex-direction-column">
              {books
                .filter((book) => book.category === category)
                .map((book) => (
                  <div
                    key={book.id}
                    style={{ margin: "20px", lineHeight: 0.5 }}
                  >
                    <img src={book.bookPic} alt="" height={"250px"} />
                    <h6 className="mt-2">Book Id: {book.id}</h6>
                    <h6 className="mt-2">{book.title}</h6>
                    <h6 className="mt-2">Book Count: {book.bookCount}</h6>
                    <h6 className="mt-2">Price: {book.price}</h6>
                    <h6 className="mt-2">Author: {book.author}</h6>
                  </div>
                ))}
            </div>
          </div>
        ))}

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
              rules={[
                { required: true, message: "Please enter book category" },
              ]}
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
                  <Select.Option key={user.readerId} value={user.readerId}>
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
                  <Select.Option key={user.readerId} value={user.readerId}>
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
    </>
  );
};

export default Mana;
