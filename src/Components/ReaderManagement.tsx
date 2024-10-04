import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Table,
} from "antd";
import {
  AddNewReader,
  DeleteReader,
  GetReaderData,
  UpdateReader,
} from "./Services/ReaderServices";
import "./Styles/st.css";
import ReaderForm from "./Reader Comp/ReaderForm";

export interface ReaderType {
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
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const activeReadersCount = reader.filter((r) => r.status === "Active").length;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const readers = await GetReaderData();
        setReader(readers);
        setFilteredData(readers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

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

  const handleAddReader = async (
    newReaderData: Omit<ReaderType, "readerId">
  ) => {
    const newReader = {
      readerId: Math.floor(100000 + Math.random() * 900000),
      ...newReaderData,
    };
    setLoading(true);
    try {
      await AddNewReader(newReader);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setViewAddUserModal(false);
      form.resetFields();
    }
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
    form.validateFields().then(async (values) => {
      if (selectedReader) {
        const updatedReader = { ...selectedReader, ...values };
        try {
          await UpdateReader(selectedReader.readerId, updatedReader);
          const updatedData = reader.map((item) =>
            item.readerId === selectedReader.readerId
              ? { ...item, ...values }
              : item
          );
          setRefresh(!refresh);
          setReader(updatedData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(true);
          setSelectedReader(null);
          setViewDetailsModal(false);
          form.resetFields();
        }
      }
    });
  };

  const handleDeleteUser = async (record: ReaderType) => {
    const updatedData = reader.filter(
      (item) => item.readerId !== record.readerId
    );

    try {
      await DeleteReader(record.readerId);
      setLoading(true);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      setReader(updatedData);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      render: (_: any, __: ReaderType, index: number) => index + 1,
      width: "5%",
    },
    { title: "Reader Id", dataIndex: "readerId", width: "8%" },
    {
      title: "Name",
      dataIndex: "name",
      width: "20%",
      sorter: (a: ReaderType, b: ReaderType) => a.name.localeCompare(b.name),
    },
    { title: "Mail", dataIndex: "email", width: "20%" },
    { title: "Phone No", dataIndex: "phoneNo", width: "15%" },
    { title: "Gender", dataIndex: "gender", width: "10%" },
    { title: "Status", dataIndex: "status", width: "8%" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: ReaderType) => (
        <div className="d-flex">
          <Button
            icon={<EditOutlined />}
            className="mx-2 px-3 "
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
              borderRadius: "10px",
              padding: "20px 0px",
              fontFamily: "poppins",
            }}
            type="primary"
            onClick={() => handleViewDetails(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            key="delete"
            style={{
              boxShadow: "3px 4px 12px rgba(151, 150, 150, .4)",
              borderRadius: "10px",
              backgroundColor: "#fb3453",
              padding: "20px 0px",
              fontFamily: "poppins",
            }}
            className="mx-2 px-3 "
            type="primary"
            onClick={() => handleDeleteUser(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between">
        <div
          className="cardz d-flex justify-content-between"
          style={{ width: "100%" }}
        >
          <div className="TR1">
            <div className="p0">
              <div className="p1">
                <h2>{reader.length}</h2>
                <div className="p2">
                  <TeamOutlined
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Total Readers</h2>
            </div>
          </div>
          <div className="TR1">
            <div className="p0">
              <div className="p1">
                <h2>{activeReadersCount}</h2>
                <div className="p2">
                  <UserOutlined
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Active Readers</h2>
            </div>
          </div>
          <div className="TR1">
            <div className="p0">
              <div className="p1">
                <h2>6</h2>
                <div className="p2">
                  <CalendarOutlined
                    style={{ fontSize: "35px", color: "#ffffff" }}
                  />
                </div>
              </div>
              <h2>Readers This Week</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5" style={{ fontFamily: "sans-serif" }}>
        <div
          className="my-5 p-3 "
          style={{
            boxShadow: "3px 4px 12px 10px rgba(151, 150, 150, .1)",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="mb-4 d-flex justify-content-between">
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
                backgroundColor: "#145250",
              }}
              type="primary"
              onClick={showUserModal}
            >
              Add Reader
            </Button>
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
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>

        <Modal
          title="Add New Reader"
          open={viewAddUserModal}
          onCancel={handleCancelAddUser}
          footer={null}
        >
          <ReaderForm
            form={form}
            onSubmit={handleAddReader}
            submitText="Add User"
          />
        </Modal>

        <Modal
          title="Edit Reader"
          open={viewDetailsModal}
          onCancel={() => setViewDetailsModal(false)}
          footer={null}
        >
          <ReaderForm
            form={form}
            initialValues={selectedReader || {}}
            onSubmit={handleSaveChanges}
            submitText="Save Changes"
          />
        </Modal>
      </div>
    </>
  );
};

export default ReaderManagement;
