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
import {
  AddNewBook,
  DeleteBook,
  GetBookData,
  UpdateBook,
} from "./Services/BookServices";
import { GetReaderData } from "./Services/ReaderServices";
import {
  BorrowTransaction,
  GetTransaction,
  ReturnTransaction,
} from "./Services/TransactionServices";
import { TransactionType } from "./Transaction";
import generateUniqueId from "generate-unique-id";

export interface BookType {
  title: string;
  bookId: string;
  author: string;
  category: string;
  bookISBN: string;
  bookCount: number;
  bookURL: string;
  price: number;
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
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [readers, setReaders] = useState<ReaderType[]>([]);
  const [selectedReaderId, setSelectedReaderId] = useState<number | null>(null);
  const [selectedBookISBN, setSelectedBookISBN] = useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const [addBookForm] = Form.useForm();
  const [borrowBookForm] = Form.useForm();
  const [returnBookForm] = Form.useForm();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const book = await GetBookData();
        const reader = await GetReaderData();
        const transaction = await GetTransaction();

        setBook(book);
        setReaders(reader);
        setTransactions(transaction);
        setFilteredData(book);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = book.filter(
        (book) =>
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.bookISBN.toString().includes(searchTerm)
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

  const handleBorrowBook = async () => {
    if (selectedBookISBN && selectedReaderId) {
      const bookISBN = selectedBookISBN;
      const readerID = Number(selectedReaderId);

      const bookIndex = book.findIndex((b) => b.bookISBN === bookISBN);

      if (bookIndex !== -1 && book[bookIndex].bookCount > 0) {
        const updatedBooks = [...book];
        updatedBooks[bookIndex].bookCount -= 1;
        setBook(updatedBooks);

        try {
          await BorrowTransaction(bookISBN, readerID);
          setRefresh(!refresh);
          notification.success({ message: "Book borrowed successfully!" });
        } catch (error: any) {
          notification.error({
            message: "Failed to borrow book",
            description: error.message,
          });
        } finally {
          setViewBorrowModal(false);
          borrowBookForm.resetFields();
        }
      }
    } else {
      notification.error({ message: "Please select a Reader and Book." });
    }
  };

  const handleReturnBook = async () => {
    if (selectedBookISBN && selectedReaderId) {
      const bookISBN = selectedBookISBN;
      const readerID = Number(selectedReaderId);

      const borrowedBook = transactions.find(
        (transaction) =>
          transaction.bookISBN === bookISBN &&
          transaction.readerId === readerID &&
          transaction.type === "Borrow"
      );

      if (borrowedBook) {
        const bookIndex = book.findIndex((b) => b.bookISBN === bookISBN);

        if (bookIndex !== -1) {
          const updatedBooks = [...book];
          updatedBooks[bookIndex].bookCount += 1;
          setBook(updatedBooks);

          try {
            await ReturnTransaction(bookISBN, readerID);

            setRefresh(!refresh);
            notification.success({ message: "Book returned successfully!" });
          } catch (error: any) {
            notification.error({
              message: "Failed to return book",
              description: error.message,
            });
          } finally {
            setViewReturnModal(false);
            returnBookForm.resetFields();
          }
        } else {
          console.error("Book not found");
        }
      } else {
        alert("No borrowed transaction found for this book by the reader.");
      }
    } else {
      alert("Please select a Reader and Book.");
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

  const handleAddBook = async (values: BookType) => {
    setLoading(true);
    try {
      await AddNewBook(values);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setViewAddModal(false);
      addBookForm.resetFields();
    }
  };

  const handleViewDetails = (record: BookType) => {
    setSelectedBook(record);
    form.setFieldsValue(record);
    setViewDetailsModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedValues = await form.validateFields(); // Get updated form values
      if (selectedBook) {
        const updatedBook = { ...selectedBook, ...updatedValues };
        await UpdateBook(selectedBook.bookId, updatedBook);
        setBook((prevBooks) =>
          prevBooks.map((book) =>
            book.bookId === selectedBook.bookId ? updatedBook : book
          )
        );

        notification.success({
          message: "Book updated successfully!",
        });
        setRefresh(!refresh);
      }
    } catch (error: any) {
      notification.error({
        message: "Failed to update book",
        description: error.message,
      });
    } finally {
      setViewDetailsModal(false);
      form.resetFields();
      setSelectedBook(null);
    }
  };

  const handleDeleteBook = async (record: BookType) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the book titled: "${record.title}"?`
    );

    if (isConfirmed) {
      try {
        await DeleteBook(record.bookId);
        const updatedData = book.filter(
          (item) => item.bookId !== record.bookId
        );
        setBook(updatedData);
        notification.success({ message: "Book deleted successfully!" });
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Failed to delete book",
          description: error.message,
        });
      }
    } else {
      console.log("Deletion canceled");
    }
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: BookType, index: number) => index + 1,
      width: "5%",
    },
    {
      title: "Book Title",
      dataIndex: "title",
      width: "25%",
      render: (_: any, record: BookType) => (
        <div className="d-flex fs-7 gap-3">
          <img
            src={record.bookURL}
            alt={record.title}
            height={"140px"}
            width={"100px"}
          />
          <span className="d-flex justify-content-center align-items-center">
            <p className="ms-4">{record.title}</p>
          </span>
        </div>
      ),
      sorter: (a: BookType, b: BookType) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      width: "15%",
      sorter: (a: BookType, b: BookType) => a.author.localeCompare(b.author),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "10%",
      sorter: (a: BookType, b: BookType) =>
        a.category.localeCompare(b.category),
    },
    { title: "ISBN", dataIndex: "bookISBN", width: "10%" },
    {
      title: "Price",
      dataIndex: "price",
      width: "8%",
      sorter: (a: any, b: any) => a.price - b.price,
    },
    { title: "Book Count", dataIndex: "bookCount", width: "7%" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: BookType) => (
        <div className="d-flex gap-3">
          <Button
            icon={<EditOutlined />}
            type="primary"
            className="mx-2 px-3 "
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
              borderRadius: "10px",
              padding: "20px 0px",
              fontFamily: "poppins",
            }}
            onClick={() => handleViewDetails(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            className="mx-2 px-3 "
            icon={<DeleteOutlined />}
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
              borderRadius: "10px",
              backgroundColor: "#145250",
              padding: "20px 0px",
              fontFamily: "poppins",
            }}
            onClick={() => handleDeleteBook(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex justify-content-between">
            <Input
              className="search"
              placeholder="Search by Book Title or BookISBN"
              prefix={<SearchOutlined style={{ paddingRight: "6px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300, height: 40 }}
            />
          </div>
          <div>
            <Button
              icon={<PlusOutlined />}
              style={{
                padding: '22px 12px',
                fontSize: '1rem',
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "10px",
                backgroundColor: "#145250",
              }}
              type="primary"
              onClick={showAddModal}
            >
              Add Book
            </Button>
            <Button
              icon={<BookOutlined />}
              style={{
                padding: '22px 12px',
                fontSize: '1rem',
                marginLeft:"8px",
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "10px",
                backgroundColor: "#145250",
              }}
              type="primary"
              onClick={showBorrowModal}
            >
              Borrow Book
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              style={{
                padding: '22px 12px',
                fontSize: '1rem',
                marginLeft:"8px",
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "10px",
                backgroundColor: "#145250",
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
          rowKey="bookId"
          pagination={{ pageSize: 10 }}
        />
      )}
      <Modal
        title="Book Details"
        open={viewDetailsModal}
        style={{ margin: 0, top: 0 }}
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
        open={viewAddModal}
        title="Add Book"
        onCancel={handleCancelAddModal}
        footer={null}
      >
        <BookForm form={form} onSubmit={handleAddBook} submitText="Add Book" />
      </Modal>

      {/* Borrow Book Modal */}
      <Modal
        open={viewBorrowModal}
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
          setSelectedReaderId={setSelectedReaderId}
          setselectedBookISBN={setSelectedBookISBN}
        />
      </Modal>

      {/* Return Book Modal */}
      <Modal
        open={viewReturnModal}
        title="Return Book"
        onCancel={handleCancelReturnModal}
        footer={null}
      >
        <BRBook
          form={borrowBookForm}
          onSubmit={handleReturnBook}
          submitText="Return Book"
          read={readers}
          book={book}
          setSelectedReaderId={setSelectedReaderId}
          setselectedBookISBN={setSelectedBookISBN}
        />
      </Modal>
    </div>
  );
};
export default Book;
