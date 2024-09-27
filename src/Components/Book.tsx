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
import axios from "axios";  


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

const Book: React.FC = () => {
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
  const [transactions, setTransactions] = useState<any[]>([]); 
  
  const [readers, setUsers] = useState<any[]>([]); 
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const [addBookForm] = Form.useForm();
  const [borrowBookForm] = Form.useForm();
  const [returnBookForm] = Form.useForm();

  const overdueLimit = 1;
  const finePerDay = 100;

  useEffect(() => {
 
    
    axios.get("/api/books")
      .then((res) => setBooks(res.data))
      .catch((error) => console.error("Error fetching books:", error));

    axios.get("/api/readers")
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("Error fetching readers:", error));

    axios.get("/api/transactions")
      .then((res) => setTransactions(res.data))
      .catch((error) => console.error("Error fetching transactions:", error));
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

  const notifyAdmin = (readerId: number, fine: number) => {
    const reader = readers.find((x) => x.readerId === readerId);
    notification.warning({
      message: "There is an overdue book.",
      description: `${reader?.name} has an overdue fine of ₹${fine}`,
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
    axios.post("/api/books", values)
      .then((res) => {
        setBooks([...books, res.data]);
        setViewAddModal(false);
        addBookForm.resetFields();
      })
      .catch((error) => console.error("Error adding book:", error));
  };


  
  const handleBorrowBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookISBN = selectedBookId;
      const readerID = Number(selectedUserId);

      axios.post("/api/borrow", { bookISBN, readerID })
        .then(() => {
          const updatedBooks = books.map((book) =>
            book.bookISBN === bookISBN ? { ...book, bookCount: book.bookCount - 1 } : book
          );
          setBooks(updatedBooks);
          setViewBorrowModal(false);
          borrowBookForm.resetFields();
          alert("Book Borrowed Successfully.");
        })
        .catch((error) => console.error("Error borrowing book:", error));
    } else {
      alert("Please select a User and Book.");
    }
  };


  
  const handleReturnBook = () => {
    if (selectedBookId && selectedUserId) {
      const bookISBN = selectedBookId;
      const readerID = Number(selectedUserId);

      axios.post("/api/return", { bookISBN, readerID })
        .then(() => {
          const updatedBooks = books.map((book) =>
            book.bookISBN === bookISBN ? { ...book, bookCount: book.bookCount + 1 } : book
          );
          setBooks(updatedBooks);
          setViewReturnModal(false);
          returnBookForm.resetFields();
        })
        .catch((error) => console.error("Error returning book:", error));
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
        axios.put(`/api/books/${selectedBook.id}`, values)
          .then(() => {
            const updatedData = data.map((item) =>
              item.id === selectedBook.id ? { ...item, ...values } : item
            );
            setData(updatedData);
            setSelectedBook(null);
            setViewDetailsModal(false);
            form.resetFields();
          })
          .catch((error) => console.error("Error updating book:", error));
      }
    });
  };

  const handleDeleteBook = (record: BookType) => {
    axios.delete(`/api/books/${record.id}`)
      .then(() => {
        const updatedData = data.filter((item) => item.id !== record.id);
        setData(updatedData);
        setSelectedBook(null);
        setViewDetailsModal(false);
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  const columns = [
    { title: "BookID", dataIndex: "id", width: "6%" },
    {
      title: "Book Title", dataIndex: "title", width: "25%", render: (_: any, record: BookType) => (
        <div className="d-flex fs-7 gap-3">
          <img src={record.bookPic} alt={record.title} height={"140px"} width={"100px"} />
          <span className="d-flex justify-content-center align-items-center">
            <p className="ms-4">{record.title}</p>
          </span>
        </div>
      ),
      sorter: (a: BookType, b: BookType) => a.title.localeCompare(b.title),
      defaultSortOrder: 'ascend' as const,
    },
    { title: "Author", dataIndex: "author", width: "15%" },
    { title: "Category", dataIndex: "category", width: "15%" },
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
      width: "15%",
    },
  ];

  return (
    <>
      <div className="row mx-auto d-flex justify-content-center">
        <div className="d-flex justify-content-between mb-4">
          <h1 className="mt-4">Library Book List</h1>
          <Button type="primary" className="mx-4" onClick={showAddModal}>
            Add New Book <PlusOutlined />
          </Button>
        </div>
        <Input
          className="mx-auto mb-3"
          placeholder="Search by BookID, Title, or Author"
          onChange={(e) => setSearchTerm(e.target.value)}
          suffix={<SearchOutlined />}
        />
      </div>

   
   
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 4 }} />

    
    
      <Modal
        title="Book Details"
        visible={viewDetailsModal}
        onCancel={() => setViewDetailsModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setViewDetailsModal(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="Book Pic URL" name="bookPic">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Book"
        visible={viewAddModal}
        onCancel={handleCancelAddModal}
        onOk={addBookForm.submit}
      >
        <Form form={addBookForm} layout="vertical" onFinish={handleAddBook}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Book Pic URL" name="bookPic">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Book;

