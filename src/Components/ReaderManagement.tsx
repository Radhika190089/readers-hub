import React, { useEffect, useState } from "react";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";

export interface UserType {
  key: string;
  userId: number;
  name: string;
  gender: string;
  mail: string;
  phoneNo: number;
}

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<UserType[]>([]);
  const [filteredData, setFilteredData] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingKey, setEditingKey] = useState<React.Key | null>(null);
  const [viewAddUserModal, setViewAddUserModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setData(localUsers);
    setFilteredData(localUsers);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userId.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const showUserModal = () => {
    setViewAddUserModal(true);
  };

  const handleAddUser = (user: Omit<UserType, "userId">) => {
    const newUser = {
      userId: Math.floor(1000 + Math.random() * 9000 + Date.now()),
      ...user,
    };
    const updatedUsers = [...data, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setData(updatedUsers);
    setViewAddUserModal(false);
    form.resetFields();
  };

  const handleCancelAddUser = () => {
    form.resetFields();
    setViewAddUserModal(false);
  };

  const handleViewDetails = (record: UserType) => {
    setSelectedUser(record);
    form.setFieldsValue(record);
    setViewDetailsModal(true);
  };

  const handleSaveChanges = () => {
    form.validateFields().then((values) => {
      if (selectedUser) {
        const updatedData = data.map((item) =>
          item.userId === selectedUser.userId ? { ...item, ...values } : item
        );
        setData(updatedData);
        localStorage.setItem("users", JSON.stringify(updatedData));
        setSelectedUser(null);
        setViewDetailsModal(false);
        form.resetFields();
      }
    });
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedData = data.filter(
        (item) => item.userId !== selectedUser.userId
      );
      setData(updatedData);
      localStorage.setItem("users", JSON.stringify(updatedData));
      setSelectedUser(null);
      setViewDetailsModal(false);
    }
  };

  const columns = [
    { title: "User Id", dataIndex: "userId", width: "8%" },
    { title: "Name", dataIndex: "name", width: "25%" },
    { title: "Gender", dataIndex: "gender", width: "10%" },
    { title: "Mail", dataIndex: "mail", width: "20%" },
    { title: "Phone No", dataIndex: "phoneNo", width: "15%" },
    {
      title: "View Details",
      dataIndex: "viewDetails",
      render: (_: any, record: UserType) => (
        <Button
          icon={<EyeOutlined />}
          className="mx-2 p-4"
          style={{
            boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
            borderRadius: "20px",
          }}
          type="primary"
          danger
          onClick={() => handleViewDetails(record)}
        >
          Edit Details
        </Button>
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
        <Button
          icon={<PlusOutlined />}
          className="mx-2 p-4"
          style={{
            boxShadow: "3px 4px 12px rgba(151, 150, 150, .5)",
            borderRadius: "20px",
          }}
          type="primary"
          danger
          onClick={showUserModal}
        >
          Add Reader
        </Button>
      </div>

      <Table
        bordered
        dataSource={filteredData}
        columns={columns}
        rowKey="userId"
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
            name="mail"
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="User Details"
        open={viewDetailsModal}
        onCancel={() => setViewDetailsModal(false)}
        footer={[
          <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
            Delete
          </Button>,
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
            name="mail"
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
        </Form>
      </Modal>
    </div>
  );
};

export default User;
