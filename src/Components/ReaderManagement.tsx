import React, { useEffect, useState } from "react";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import {
  AddNewReader,
  DeleteReader,
  GetReaderData,
  UpdateReader,
} from "./Services/ReaderServices";

export interface ReaderType {
  key: string;
  readerId: number;
  name: string;
  email: string;
  phoneNo: number;
  gender: string;
  age: number;
  status: "Active" | "Inactive";
}

const ReaderManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [reader, setReader] = useState<ReaderType[]>([]);
  const [filteredData, setFilteredData] = useState<ReaderType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewAddUserModal, setViewAddUserModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedReader, setSelectedReader] = useState<ReaderType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const readers = await GetReaderData();
        setReader(readers);
        setFilteredData(readers);
      } catch (error) {
        console.error(error);
      }
    })();

    // const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
    // setReader(localUsers);
    // setFilteredData(localUsers);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = reader.filter(
        (reader) =>
          reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reader.readerId.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(reader);
    }
  }, [searchTerm, reader]);

  const showUserModal = () => {
    setViewAddUserModal(true);
  };

  const handleAddUser = (newReaderData: Omit<ReaderType, "readerId">) => {
    const newReader = {
      readerId: Math.floor(100000 + Math.random() * 900000),
      ...newReaderData,
    };
    const updatedReader = [...reader, newReader];

    (async () => {
      try {
        await AddNewReader(updatedReader);
        setReader(updatedReader);
      } catch (error) {
        console.error(error);
      }
    })();

    // localStorage.setItem("users", JSON.stringify(updatedReader));
    // setReader(updatedReader);
    setViewAddUserModal(false);
    form.resetFields();
  };

  const handleCancelAddUser = () => {
    form.resetFields();
    setViewAddUserModal(false);
  };

  const handleViewDetails = (record: ReaderType) => {
    setSelectedReader(record);
    form.setFieldsValue(record);
    setViewDetailsModal(true);
  };

  const handleSaveChanges = () => {
    form.validateFields().then((values) => {
      if (selectedReader) {
        const updatedData = reader.map((item) =>
          item.readerId === selectedReader.readerId
            ? { ...item, ...values }
            : item
        );

        (async () => {
          try {
            await UpdateReader(selectedReader.readerId, values);
            setReader(updatedData);
          } catch (error) {
            console.error(error);
          }
        })();

        // localStorage.setItem("users", JSON.stringify(updatedData));
        setSelectedReader(null);
        setViewDetailsModal(false);
        form.resetFields();
      }
    });
  };

  const handleDeleteUser = () => {
    if (selectedReader) {
      const updatedData = reader.filter(
        (item) => item.readerId !== selectedReader.readerId
      );

      (async () => {
        try {
          await DeleteReader(selectedReader.readerId);
          setReader(updatedData);
        } catch (error) {
          console.error(error);
        }
      })();

      // localStorage.setItem("users", JSON.stringify(updatedData));
      setSelectedReader(null);
      setViewDetailsModal(false);
    }
  };

  const columns = [
    { title: "User Id", dataIndex: "readerId", width: "8%" },
    { title: "Name", dataIndex: "name", width: "25%" },
    { title: "Gender", dataIndex: "gender", width: "20%" },
    { title: "Mail", dataIndex: "email", width: "20%" },
    { title: "Status", dataIndex: "status", width: "10%" },
    { title: "Phone No", dataIndex: "phoneNo", width: "15%" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: ReaderType) => (
        <>
          <Button
            icon={<EyeOutlined />}
            className="mx-2 px-3"
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
              borderRadius: "10px",
              backgroundColor: "#fb3453",
              padding: "20px 0px",
              fontFamily: "poppins",
            }}
            type="primary"
            onClick={() => handleViewDetails(record)}
          >
            Edit
          </Button>
          <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="mt-2" style={{ fontFamily: "sans-serif" }}>
      <div className="mb-3 d-flex justify-content-between">
        <Input
          className="search"
          placeholder="Search by Name or Reader ID"
          prefix={<SearchOutlined style={{ paddingRight: "6px" }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, height: 40 }}
        />
        <Button
          icon={<PlusOutlined />}
          className="mx-1 p-4"
          style={{
            boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
            borderRadius: "10px",
            backgroundColor: "#fb3453",
          }}
          type="primary"
          onClick={showUserModal}
        >
          Add Reader
        </Button>
      </div>

      <Table
        bordered
        dataSource={filteredData}
        columns={columns}
        rowKey="readerId"
        pagination={{ pageSize: 13 }}
      />

      <Modal
        title="Add New Reader"
        open={viewAddUserModal}
        onCancel={handleCancelAddUser}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="phoneNo"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be 10 digits long!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please input the gender!" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please input the age!" }]}
          >
            <InputNumber style={{ width: "100%" }} autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Reader Details"
        open={viewDetailsModal}
        onCancel={() => setViewDetailsModal(false)}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="phoneNo"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be 10 digits long!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} autoComplete="off" />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <InputNumber style={{ width: "100%" }} autoComplete="off" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReaderManagement;
