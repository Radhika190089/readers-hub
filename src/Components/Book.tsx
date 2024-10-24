import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Popconfirm, Image } from "antd";
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
import { MoreOutlined } from "@ant-design/icons";

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

  interface BookRecord {
    id: number;
    title: string;
    author: string;
  }
  type HandleViewDetails = (record: BookRecord) => void;
  type HandleDeleteBook = (record: BookRecord) => void;

  const menu = (
    record: BookRecord,
    handleViewDetails: HandleViewDetails,
    handleDeleteBook: HandleDeleteBook
  ) => (
    <Menu
      items={[
        {
          key: "1",
          icon: <EditOutlined />,
          label: "Edit",
          onClick: () => handleViewDetails(record),
        },
        {
          key: "2",
          icon: <DeleteOutlined />,
          label: "Delete",
          onClick: () => handleDeleteBook(record),
        },
      ]}
    />
  );

  interface ThreeDotsMenuProps {
    record: BookRecord;
    handleViewDetails: HandleViewDetails;
    handleDeleteBook: HandleDeleteBook;
  }

  const ThreeDotsMenu: React.FC<ThreeDotsMenuProps> = ({
    record,
    handleViewDetails,
    handleDeleteBook,
  }) => (
    <Dropdown
      overlay={menu(record, handleViewDetails, handleDeleteBook)}
      trigger={["click"]}
    >
      <Button
        icon={<MoreOutlined />}
        className="mx-2 px-3"
        style={{
          boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
          borderRadius: "10px",
          padding: "20px 0px",
          fontFamily: "poppins",
          backgroundColor: "#145250",
        }}
      />
    </Dropdown>
  );

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

      const existingTransaction = transactions.find(
        (transaction) =>
          transaction.bookISBN === bookISBN &&
          transaction.readerId === readerID &&
          transaction.type === "Borrow" &&
          !transactions.some(
            (t) =>
              t.bookISBN === bookISBN &&
              t.readerId === readerID &&
              t.type === "Return"
          )
      );

      if (existingTransaction) {
        notification.error({
          message: "Book Already Borrowed",
          description:
            "The reader has already borrowed this book and hasn't returned it yet.",
        });
        return;
      }

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
      } else {
        notification.error({
          message: "Book Out of Stock",
          description: "The book is currently out of stock.",
        });
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
      notification.success({ message: "Book added successfully!" });
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
      const updatedValues = await form.validateFields();
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

  const handleDeleteBook = async (bookId: any) => {
    try {
      await DeleteBook(bookId);
      const updatedData = book.filter((item) => item.bookId !== bookId);
      setBook(updatedData);
      notification.success({ message: "Book deleted successfully!" });
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: "Failed to delete book",
        description: error.message,
      });
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
      title: "Preview",
      dataIndex: "Preview",
      width: "7%",

      render: (_: any, record: BookType) => (
        <Image
          src={record.bookURL}
          alt={record.title}
          height={"80px"}
          width={"55px"}
        />
      ),
    },

    {
      title: "Title",
      dataIndex: "title",
      width: "20%",
      render: (_: any, record: BookType) => (
          <span>{record.title}</span>
      ),
      sorter: (a: BookType, b: BookType) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      width: "20%",
      sorter: (a: BookType, b: BookType) => a.author.localeCompare(b.author),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "12%",
      sorter: (a: BookType, b: BookType) =>
        a.category.localeCompare(b.category),
    },
    { title: "ISBN", dataIndex: "bookISBN", width: "12%" },
    {
      title: "Price",
      dataIndex: "price",
      width: "5%",
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => `₹${price}`,
    },
    {
      title: "Book Count",
      dataIndex: "bookCount",
      width: "8%",
      sorter: (a: any, b: any) => a.bookCount - b.bookCount,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "5%",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleViewDetails(record)}
              >
                Edit
              </Menu.Item>
              <Popconfirm
                title="Delete the task"
                description="Are you sure you want to delete this book?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDeleteBook(record.bookId)} // Move onClick here
              >
                <Menu.Item key="delete" icon={<DeleteOutlined />}>
                  Delete
                </Menu.Item>
              </Popconfirm>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div className="d-flex justify-content-between mb-3 box">
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
          <div className="box1 d-flex ">
            <Button
              icon={<PlusOutlined />}
              style={{
                padding: "22px 12px",
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "7px",
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
                padding: "22px 12px",

                marginLeft: "8px",
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "7px",
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
                padding: "22px 12px",
                marginLeft: "8px",
                boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
                borderRadius: "7px",
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
        <div style={{ overflowX: "auto" }}>
          <Table
            className="modal1"
            bordered
            dataSource={filteredData}
            columns={columns}
            rowKey="bookId"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
      <Modal
        title="Book Details"
        open={viewDetailsModal}
        style={{
          alignContent: "center",
          marginRight: "auto",
          marginLeft: "auto",
        }}
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
        <BookForm
          form={addBookForm}
          onSubmit={handleAddBook}
          submitText="Add Book"
        />
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
          setSelectedBookISBN={setSelectedBookISBN}
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
          setSelectedBookISBN={setSelectedBookISBN}
          transactions={transactions}
        />

        {/*<BRBook
  form={form}
  onSubmit={handleReturn}
  submitText="Return Book"
  readers={reader}
  allBooks={book}
  transactions={transaction} // Pass the transactions here
  setSelectedReaderId={setSelectedReaderId}
  setSelectedBookISBN={setSelectedBookISBN}
/>
*/}
      </Modal>
    </div>
  );
};
export default Book;
