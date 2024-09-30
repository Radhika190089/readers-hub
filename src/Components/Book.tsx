import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Spin, Table } from "antd";
import { ReaderType } from "./ReaderManagement";
import BookForm from "./Book Comp/BookForm";
import BRBook from "./Book Comp/BRBook";
import { AddNewBook, DeleteBook, GetBookData, UpdateBook } from "./Services/BookServices";


export interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  bookISBN: string;
  bookCount: number;
  bookPic: string;
  price: number;
}

export interface TransactionType {
  key: number;
  transactionId: number;
  readerId: number;
  readerName: string;
  bookISBN: string;
  bookName: string;
  date: Date;
  type: "borrow" | "return";
}

const Book: React.FC = () => {
  const [form] = Form.useForm();
  const [book, setBook] = useState<BookType[]>([]);
  const [filteredData, setFilteredData] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewBorrowModal, setViewBorrowModal] = useState(false);
  const [viewReturnModal, setViewReturnModal] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [readers, setUsers] = useState<ReaderType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const [addBookForm] = Form.useForm();
  const [borrowBookForm] = Form.useForm();
  const [returnBookForm] = Form.useForm();

  const overdueLimit = 1;
  const finePerDay = 100;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const books = await GetBookData();
        setBook(books);
        setFilteredData(books);
      }
      catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    })();
  }, [refresh])

  useEffect(() => {
    if (searchTerm) {
      const filtered = book.filter(
        (book) =>
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.id.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(book);
    }
  }, [searchTerm, book]);


  const showAddModal = () => {
    setViewAddModal(true);
  };

  const showBorrowModal = () => {
    setViewBorrowModal(true);
  };

  const showReturnModal = () => {
    setViewReturnModal(true);
  };

  const handleBorrowBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookISBN = selectedBookId;
      const readerID = Number(selectedUserId);

      const bookIndex = books.findIndex((b) => b.bookISBN === bookISBN);

      if (bookIndex !== -1 && books[bookIndex].bookCount > 0) {
        const updatedBooks = [...books];
        updatedBooks[bookIndex].bookCount -= 1;
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        const newTransaction: TransactionType = {
          transactionId: transactions.length + 1,
          bookISBN: bookISBN,
          bookName: books[bookIndex].title,
          readerId: readerID,
          readerName: readers.find((x) => x.readerId == readerID)?.name || "",
          type: "borrow",
          date: new Date(),
          key: 0
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
      const bookISBN = selectedBookId;
      const readerID = Number(selectedUserId);

      const borrowedBook = transactions.find((transaction) => {
        return (
          transaction.bookISBN === bookISBN &&
          transaction.readerId === readerID &&
          transaction.type === "borrow"
        );
      });

      if (borrowedBook) {
        const bookIndex = books.findIndex((b) => b.bookISBN === bookISBN);

        if (bookIndex !== -1) {
          const updatedBooks = [...books];
          updatedBooks[bookIndex].bookCount += 1;
          setBooks(updatedBooks);
          localStorage.setItem("books", JSON.stringify(updatedBooks));
          const newTransaction: TransactionType = {
            transactionId: transactions.length + 1,
            bookISBN: bookISBN,
            bookName: books[bookIndex].title,
            readerId: readerID,
            readerName: readers.find((x) => x.readerId == readerID)?.name || "",
            type: "return",
            date: new Date(),
            key: 0
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
        alert("No borrowed transaction found for this book by the reader.");
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
  const handleAddBook = async (values: Omit<BookType, "id">) => {
    const newBook = { id: Math.floor(1000 + Math.random() * 9000), ...values };
    setLoading(true);
    try {
      await AddNewBook(newBook);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false)
      setViewAddModal(false);
      addBookForm.resetFields();
    }
  };

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
    form.validateFields().then(async (values) => {
      if (selectedBook) {
        try {
          await UpdateBook(selectedBook.id, selectedBook)
          const UpdateData = book.map((item) =>
            item.id === selectedBook.id ?
              { ...item, ...values }
              : item
          );
          setRefresh(!refresh);
          setBook(UpdateData);
        } catch (error) {
          console.error(error);
        }
        finally {
          setLoading(true);
          setSelectedBook(null);
          setViewDetailsModal(false);
          form.resetFields();
        }
      }
    });
  };

  const handleDeleteBook = async (record: BookType) => {
    const updatedData = book.filter((item) => item.id !== record.id);
    try {
      await DeleteBook(record.id);
      setLoading(true);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error)
    } finally {
      setBook(updatedData);
      setSelectedBook(null);
      setViewDetailsModal(false);
    }
  }

  const columns = [
    { title: "BookID", dataIndex: "id", width: "6%" },
    {
      title: "Book Title", dataIndex: "title", width: "25%", render: (_: any, record: BookType) => (
        <div className="d-flex fs-7 gap-3">
          <img src={record.bookPic} alt={record.title} height={"140px"} width={"100px"} /><span className="d-flex justify-content-center align-items-center"><p className="ms-4">{record.title}</p></span>
        </div>
      ),
      sorter: (a: BookType, b: BookType) => a.title.localeCompare(b.title),
      defaultSortOrder: 'ascend' as const,
    },
    { title: "Author", dataIndex: "author", width: "15%" },
    {
      title: "Category", dataIndex: "category", width: "15%"
    },

    { title: "Price", dataIndex: "price", width: "10%" },
    { title: "ISBN", dataIndex: "bookISBN", width: "10%" },
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
      <div className="my-3">
        <div className="d-flex justify-content-between">
          <div className="mb-3 d-flex justify-content-between">
            <Input className="search"
              placeholder="Search by Booktitle or BookID"
              prefix={<SearchOutlined style={{ paddingRight: '6px' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300, height: 40 }}
            />
          </div>
          <div>
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
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spin tip="Loading..." size="large" />
        </div>
      ) : (
        <Table
          bordered
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
      <Modal
        title="Book Details"
        open={viewDetailsModal}
        onCancel={() => {
          setViewDetailsModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        <BookForm
          form={form}
          onSubmit={handleSaveChanges}
          submitText="Save Changes"
        />
      </Modal>
      {/* Add Book Modal */}
      <Modal
        visible={viewAddModal}
        title="Add Book"
        onCancel={handleCancelAddModal}
        footer={null}
      >
        <BookForm
          form={form}
          onSubmit={handleAddBook}
          submitText="Add Book"
        />

      </Modal>

      {/* Borrow Book Modal */}
      <Modal
        visible={viewBorrowModal}
        title="Borrow Book"
        onCancel={handleCancelBorrowModal}
        footer={null}
      >
        <BRBook
          form={borrowBookForm}
          onSubmit={handleBorrowBook}
          submitText="Borrow Book"
          read={readers}
          book={book}
          setSelectedUserId={selectedUserId}
          setSelectedBookId={selectedBookId}
        />
      </Modal>

      {/* Return Book Modal */}
      <Modal
        visible={viewReturnModal}
        title="Return Book"
        onCancel={handleCancelReturnModal}
        footer={null}
      >
      </Modal>
    </div>
  );
};
export default Book;