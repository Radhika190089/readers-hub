import { Button, Form, Input, Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UserType } from "./ReaderManagement";

export interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  bookCount: number;
  bookPic: string;
  price: number;
}

export interface Transaction {
  transactionId: number;
  userId: number;
  bookId: number;
  date: Date;
  type: "borrow" | "return";
  dueDate?: Date;
  fine?: number;
}

const Mana = () => {
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewBorrowModal, setViewBorrowModal] = useState(false);
  const [viewReturnModal, setViewReturnModal] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const [bookIdInput, setBookIdInput] = useState<number | null>(null);
  const [userIdInput, setUserIdInput] = useState<number | null>(null);

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

    localTransaction.forEach((transaction: Transaction) => {
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

  const notifyAdmin = (userId: number, fine: number) => {
    const user = users.find((x) => x.userId === userId);
    notification.warning({
      message: "There is a Over due Book.",
      description: `${user?.name} has a overdue fine of ₹${fine}`,
    });
  };

  useEffect(() => {
    if (bookIdInput !== null) {
      const book = books.find((b) => b.id === bookIdInput);
      if (book) {
        setSelectedBookId(book.id.toString());
        borrowBookForm.setFieldsValue({ bookId: book.id });
        returnBookForm.setFieldsValue({ bookId: book.id });
      }
    }
  }, [bookIdInput, books, borrowBookForm, returnBookForm]);

  useEffect(() => {
    if (userIdInput !== null) {
      const user = users.find((u) => u.userId === userIdInput);
      if (user) {
        setSelectedUserId(user.userId.toString());
        borrowBookForm.setFieldsValue({ userId: user.userId });
        returnBookForm.setFieldsValue({ userId: user.userId });
      }
    }
  }, [userIdInput, users, borrowBookForm, returnBookForm]);

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

      if (!isNaN(bookID) && !isNaN(userID)) {
        const bookIndex = books.findIndex((b) => b.id === bookID);

        if (bookIndex !== -1 && books[bookIndex].bookCount > 0) {
          const updatedBooks = [...books];
          updatedBooks[bookIndex].bookCount -= 1;
          setBooks(updatedBooks);
          localStorage.setItem("books", JSON.stringify(updatedBooks));
          const newTransaction: Transaction = {
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
        alert("Invalid UserId or BookId.");
      }
    }
  };

  const handleReturnBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookID = Number(selectedBookId);
      const userID = Number(selectedUserId);

      if (!isNaN(bookID) && !isNaN(userID)) {
        const borrewedBook = transactions.find((transaction) => {
          return (
            transaction.bookId === bookID &&
            transaction.userId === userID &&
            transaction.type === "borrow"
          );
        });

        if (borrewedBook) {
          const bookIndex = books.findIndex((b) => b.id === bookID);

          if (bookIndex !== -1) {
            const updatedBooks = [...books];
            updatedBooks[bookIndex].bookCount += 1;
            setBooks(updatedBooks);
            localStorage.setItem("books", JSON.stringify(updatedBooks));
            const newTransaction: Transaction = {
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
          alert("No borrowed transactoin found of this book by the user.");
        }
      } else {
        console.error("Invalid bookId or userId");
      }
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
                borderRadius: "20px",
              }}
              type="primary"
              danger
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
                  borderRadius: "20px",
                }}
                type="primary"
                danger
                onClick={showBorrowModal}
              >
                Borrow Book
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                className="mx-2 p-4"
                style={{
                  boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                  borderRadius: "20px",
                }}
                type="primary"
                danger
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
                    <p style={{ color: "rgb(125,125,125)" }}>{book.author}</p>
                    <h6 style={{ color: "#Fb3453" }}>₹{book.price}</h6>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <Modal
          title="Add New Book"
          open={viewAddModal}
          onCancel={handleCancelAddModal}
          footer={null}
        >
          <Form form={addBookForm} layout="vertical" onFinish={handleAddBook}>
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
              rules={[
                { required: true, message: "Please input the category!" },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="bookCount"
              label="Book Count"
              rules={[
                { required: true, message: "Please input the book count!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="bookPic"
              label="Book Cover Image URL"
              rules={[
                { required: true, message: "Please input the image URL!" },
              ]}
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
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Book
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Borrow Book"
          open={viewBorrowModal}
          onCancel={handleCancelBorrowModal}
          footer={null}
        >
          <Form
            form={borrowBookForm}
            layout="vertical"
            onFinish={handleBorrowBook}
          >
            <Form.Item name="bookIdInput" label="Book ID">
              <Input
                type="number"
                value={bookIdInput !== null ? bookIdInput : ""}
                onChange={(e) => setBookIdInput(Number(e.target.value))}
              />
            </Form.Item>
            <Form.Item name="userIdInput" label="User ID">
              <Input
                type="number"
                value={userIdInput !== null ? userIdInput : ""}
                onChange={(e) => setUserIdInput(Number(e.target.value))}
              />
            </Form.Item>
            <Form.Item name="bookId" label="Book" rules={[{ required: true }]}>
              <Select onChange={(value) => setSelectedBookId(value)}>
                {books.map((book) => (
                  <Select.Option key={book.id} value={book.id}>
                    {book.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="userId" label="User" rules={[{ required: true }]}>
              <Select
                value={selectedUserId}
                onChange={(value) => setSelectedUserId(value)}
              >
                {users.map((user) => (
                  <Select.Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Borrow Book
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Return Book"
          open={viewReturnModal}
          onCancel={handleCancelReturnModal}
          footer={null}
        >
          <Form
            form={returnBookForm}
            layout="vertical"
            onFinish={handleReturnBook}
          >
            <Form.Item name="bookIdInput" label="Book ID">
              <Input
                type="number"
                value={bookIdInput !== null ? bookIdInput : ""}
                onChange={(e) => setBookIdInput(Number(e.target.value))}
              />
            </Form.Item>
            <Form.Item name="userIdInput" label="User ID">
              <Input
                type="number"
                value={userIdInput !== null ? userIdInput : ""}
                onChange={(e) => setUserIdInput(Number(e.target.value))}
              />
            </Form.Item>
            <Form.Item
              name="bookId"
              label="Select Book"
              rules={[{ required: true }]}
            >
              <Select
                value={selectedBookId}
                onChange={(value) => setSelectedBookId(value)}
              >
                {books.map((book) => (
                  <Select.Option key={book.id} value={book.id}>
                    {book.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="userId"
              label="Select User"
              rules={[{ required: true }]}
            >
              <Select
                value={selectedUserId}
                onChange={(value) => setSelectedUserId(value)}
              >
                {users.map((user) => (
                  <Select.Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Return Book
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Mana;
