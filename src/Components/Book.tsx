import React, { useEffect, useState } from "react";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";

export interface Booktype {
  author: string
  title: string;
  id: number;
  category: string;
  bookPic: string;
  price: number
}

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Booktype[]>([]);
  const [filteredData, setFilteredData] = useState<Booktype[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Booktype | null>(null);

  useEffect(() => {
    const localUsers = JSON.parse(localStorage.getItem("books") || "[]");
    setData(localUsers);
    setFilteredData(localUsers);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (book) =>
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.id.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const handleEditBook = (user: Omit<Booktype, "id">) => {
  };

  const handleViewDetails = (record: Booktype) => {
    setSelectedBook(record);
    form.setFieldsValue(record);
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

  const handleDeleteBook = () => {
    if (selectedBook) {
      const updatedData = data.filter(
        (item) => item.id !== selectedBook.id
      );
      setData(updatedData);
      localStorage.setItem("books", JSON.stringify(updatedData));
      setSelectedBook(null);
      setViewDetailsModal(false);
    }
  };

  const columns = [
    {
      title: "Book Pic", dataIndex: "bookPic", width: "10%",
      render: (_: any, record: Booktype) => (

        <img
          src={record.bookPic}
          alt={record.title}
          height={"250px"}
        />
      ),
    },
    { title: "BookID", dataIndex: "id", width: "8%" },
    { title: "Author", dataIndex: "author", width: "25%" },
    { title: "Book Title", dataIndex: "title", width: "10%" },
    { title: "Category", dataIndex: "category", width: "10%" },
    { title: "Price", dataIndex: "price", width: "10%" },
    {
      title: "View Details",
      dataIndex: "viewDetails",
      render: (_: any, record: Booktype) => (
        <div className="d-flex gap-3">

          <Button




            type="primary"
            danger
            onClick={() => handleViewDetails(record)}
          >
            Edit Details
          </Button>
          <Button key="delete" type="primary" danger onClick={handleDeleteBook}>
            Delete
          </Button>
        </div>

      ),
    },
  ];

  return (
    <div className="mt-2">
      <div className="mb-3 d-flex justify-content-between">
        <Input
          placeholder="Search by Name or Reader ID"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
      </div>
      <Table
        bordered
        dataSource={filteredData}
        columns={columns}
        rowKey="BookId"
        pagination={{ pageSize: 13 }}
      />
      <Modal
        title="User Details"
        open={viewDetailsModal}
        onCancel={() => setViewDetailsModal(false)}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>,

        ]}

      >
        <Form layout="vertical" onFinish={handleEditBook}>
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
            name="book-pic"
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
        </Form>
      </Modal>
    </div>
  );
};

export default User;
