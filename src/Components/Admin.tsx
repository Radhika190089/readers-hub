import React, { useState, useEffect } from "react";
import {
  UploadOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  TeamOutlined,
  FormOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, Space } from "antd";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard";
import Reader from "./Reader";
import Mana from "./Mana";
import Profile from "./Profile";
import { Avatar } from "evergreen-ui";
import Book from "./Book";
import ReaderManagement from "./ReaderManagement";

const { Header, Content, Sider } = Layout;

const AdminPortal: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "[]");
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedNavItems, setSelectedNavItems] = useState<string>(
    location.pathname
  );

  useEffect(() => {
    setSelectedNavItems(location.pathname);
  }, [location]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleNavClick = (menuItems: any) => {
    navigate(menuItems.key);
    setSelectedNavItems(menuItems.key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        width={350}
        style={{ backgroundColor: "#fb3453" }}
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth="95"
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h5
            style={{
              color: "white",
              fontFamily: "poppins",
              fontSize: "15px",
              fontWeight: "800",
              margin: '0px 10px'
            }}
          >
            {collapsed ? <img src="/LMS.png" alt="LMS" height={"85px"} width={"85px"} style={{ display: 'flex', justifyContent: 'center' }} />
              : (<div className="d-flex"><img src="/LMS.png" alt="Library Management" height={"85px"} width={"85px"} /> <div className="mt-2 ms-2">LIBRARY <span className="fs-3"> MANAGEMENT </span> <br /> SYSTEM</div></div>)}
          </h5>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedNavItems]}
          onClick={handleNavClick}
          style={{
            marginTop: "35px",
            color: "white",
            backgroundColor: "#Fb3454",
            fontFamily: "Poppins",
            fontSize: "17px",
          }}
        >
          <Menu.Item
            key="/"
            icon={
              <HomeOutlined
                style={{
                  color: selectedNavItems === "/" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{ color: selectedNavItems === "/" ? "#fb3453" : "white" }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="/books"
            icon={
              <BookOutlined
                style={{
                  color: selectedNavItems === "/books" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/books" ? "#fb3453" : "white",
              marginTop: "10px",
            }}
          >
            Books Management
          </Menu.Item>
          <Menu.Item
            key="/book"
            icon={
              <FileTextOutlined
                style={{
                  color: selectedNavItems === "/book" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/book" ? "#fb3453" : "white",
              position: "relative",

            }}
          >
            Book Details
          </Menu.Item>
          <Menu.Item
            key="/reader"
            icon={
              <FormOutlined
                style={{
                  color: selectedNavItems === "/reader" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/reader" ? "#fb3453" : "white",
              marginTop: "10px",
            }}
          >
            Transactions
          </Menu.Item>
          <Menu.Item
            key="/readerManagement"
            icon={
              <TeamOutlined
                style={{
                  color: selectedNavItems === "/readerManagement" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/readerManagement" ? "#fb3453" : "white",
              marginTop: "10px",
            }}
          >
            Reader Management
          </Menu.Item>
          <Menu.Item
            key="/profile"
            icon={
              <UserOutlined
                style={{
                  color: selectedNavItems === "/profile" ? "#fb3453" : "white",
                  fontSize: "20px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/profile" ? "#fb3453" : "white",
              position: "relative",
              top: 500,
            }} // Adjusted to the same position
          >
            Profile
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "74px",
          }}
        >
          <Button onClick={toggleCollapsed} style={{ marginBottom: 16, backgroundColor: '#fb3453', color: 'white', height: '40px', border: 'none', margin: '10px', width: '60px' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <div className="d-flex align-items-center ms-auto">
            <div className="d-flex align-items-center ms-auto">

              <div className="mt-4">
                <Avatar
                  onClick={() => navigate("/profile")}
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg"
                  name={"Suresh"}
                  size={50}
                />
              </div>
              <div
                className="linh text-end mx-3"
                style={{ fontFamily: "poppins" }}
              >
                <h5
                  onClick={() => navigate("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  Suresh
                </h5>
                <p
                  onClick={() => navigate("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  Admin
                </p>
              </div>

            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "15px 15px 10px",
            backgroundColor: "white",
            borderRadius: "20px",
            height: "calc(100vh - 124px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: 24,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reader" element={<Reader />} />
              <Route path="/books" element={<Mana />} />
              <Route path="/readerManagement" element={<ReaderManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/book" element={<Book />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPortal;
