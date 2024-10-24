import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  TeamOutlined,
  FormOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  message,
} from "antd";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import { Avatar } from "evergreen-ui";
import Book from "./Book";
import ReaderManagement from "./ReaderManagement";
import Transaction from "./Transaction";

const { Header, Content, Sider } = Layout;

export interface AdminType {
  _id: string;
  userName: string;
  email: string;
  password: string;
}
const handleMenuClick: MenuProps["onClick"] = (e) => {
  console.log("click", e);
};

const handleLogout = () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "/login";
};

const items: MenuProps["items"] = [
  {
    label: "Profile",
    key: "1",
    icon: <UserOutlined />,
    onClick: () => (window.location.href = "/profile"),
  },
  {
    label: "LogOut",
    key: "2",
    icon: <LogoutOutlined />,
    onClick: handleLogout,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const AdminPortal: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "[]");
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedNavItems, setSelectedNavItems] = useState<string>(
    location.pathname
  );
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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

  return (
    <Layout
      style={{ minHeight: "100vh", overflow: "hidden", fontFamily: "Poppins" }}
    >
      <div className="mobileHidden">
        <Sider
          width={350}
          style={{ backgroundColor: "#145250" }}
          onCollapse={(value) => setCollapsed(value)}
          collapsible
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
                margin: "0px 10px",
              }}
            >
              {collapsed ? (
                <img
                  src="/LMS.png"
                  alt="LMS"
                  height={"85px"}
                  width={"85px"}
                  style={{ display: "flex", justifyContent: "center" }}
                />
              ) : (
                <div className="d-flex">
                  <img
                    src="/LMS.png"
                    alt="Library Management"
                    height={"85px"}
                    width={"85px"}
                  />
                  <div className="mt-2 ms-2">
                    LIBRARY <span className="fs-3"> MANAGEMENT </span> <br />
                    SYSTEM
                  </div>
                </div>
              )}
            </h5>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedNavItems]}
            onClick={handleNavClick}
            style={{
              marginTop: "35px",
              color: "white",
              backgroundColor: "#145250",
              fontFamily: "Poppins",
              fontSize: "18px",
            }}
          >
            <Menu.Item
              key="/"
              icon={
                <HomeOutlined
                  style={{
                    color: selectedNavItems === "/" ? "	#145250" : "white",
                    fontSize: "20px",
                  }}
                />
              }
              style={{
                color: selectedNavItems === "/" ? "#145250" : "white",
                marginTop: "5px",
              }}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              key="/book"
              icon={
                <BookOutlined
                  style={{
                    color: selectedNavItems === "/book" ? "#145250" : "white",
                    fontSize: "20px",
                  }}
                />
              }
              style={{
                color: selectedNavItems === "/book" ? "#145250" : "white",
                position: "relative",
                marginTop: "5px",
              }}
            >
              Books
            </Menu.Item>
            <Menu.Item
              key="/readerManagement"
              icon={
                <TeamOutlined
                  style={{
                    color:
                      selectedNavItems === "/readerManagement"
                        ? "#145250"
                        : "white",
                    fontSize: "20px",
                  }}
                />
              }
              style={{
                color:
                  selectedNavItems === "/readerManagement"
                    ? "#145250"
                    : "white",
                marginTop: "5px",
              }}
            >
              Readers
            </Menu.Item>
            <Menu.Item
              key="/transaction"
              icon={
                <FormOutlined
                  style={{
                    color:
                      selectedNavItems === "/transaction" ? "#145250" : "white",
                    fontSize: "20px",
                  }}
                />
              }
              style={{
                color:
                  selectedNavItems === "/transaction" ? "	#145250" : "white",
                marginTop: "5px",
              }}
            >
              Transactions
            </Menu.Item>
          </Menu>
        </Sider>
      </div>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            height: "74px",
          }}
        >
          <div className="menumobaHidden" style={{ width: "100%" }}>
            <Dropdown menu={menuProps}>
              <div className="d-flex align-items-center ms-auto">
                <div className="mt-4">
                  <Avatar name={user} size={50} style={{ cursor: "pointer" }} />
                </div>
                <div className="linh mx-3" style={{ fontFamily: "poppins" }}>
                  <h5 style={{ cursor: "pointer" }}>{user}</h5>
                  <p style={{ cursor: "pointer" }}>Admin</p>
                </div>
              </div>
            </Dropdown>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ backgroundColor: "#145250", width: "100%" }}
          >
            <img
              src="/LMS.png"
              height={"85px"}
              width={"85px"}
              className="moblogo"
              style={{ margin: "0px 5px" }}
            />
            <Button
              type="primary"
              onClick={showDrawer}
              className="mobdraw m-4"
              style={{ backgroundColor: "white" }}
            >
              <MenuOutlined
                style={{
                  color: "#145250",
                  display: "flex",
                  alignItems: "center",
                }}
              />
            </Button>
            <Drawer
              title={
                <>
                  LIBRARY <span style={{ fontSize: "18px" }}> MANAGEMENT </span>{" "}
                  SYSTEM
                </>
              }
              onClose={onClose}
              open={open}
              width={"260px"}
            >
              <Menu
                mode="inline"
                selectedKeys={[selectedNavItems]}
                onClick={handleNavClick}
                style={{
                  color: "white",
                  backgroundColor: "#145250",
                  fontFamily: "Poppins",
                  fontSize: "15px",
                }}
              >
                <Menu.Item
                  key="/"
                  icon={
                    <HomeOutlined
                      style={{
                        color: selectedNavItems === "/" ? "	#145250" : "white",
                        fontSize: "15px",
                      }}
                    />
                  }
                  style={{
                    color: selectedNavItems === "/" ? "#145250" : "white",
                    marginTop: "5px",
                  }}
                >
                  Dashboard
                </Menu.Item>
                <Menu.Item
                  key="/book"
                  icon={
                    <BookOutlined
                      style={{
                        color:
                          selectedNavItems === "/book" ? "#145250" : "white",
                        fontSize: "15px",
                      }}
                    />
                  }
                  style={{
                    color: selectedNavItems === "/book" ? "#145250" : "white",
                    position: "relative",
                    marginTop: "5px",
                  }}
                >
                  Books
                </Menu.Item>
                <Menu.Item
                  key="/readerManagement"
                  icon={
                    <TeamOutlined
                      style={{
                        color:
                          selectedNavItems === "/readerManagement"
                            ? "#145250"
                            : "white",
                        fontSize: "15px",
                      }}
                    />
                  }
                  style={{
                    color:
                      selectedNavItems === "/readerManagement"
                        ? "#145250"
                        : "white",
                    marginTop: "5px",
                  }}
                >
                  Reader
                </Menu.Item>
                <Menu.Item
                  key="/transaction"
                  icon={
                    <FormOutlined
                      style={{
                        color:
                          selectedNavItems === "/transaction"
                            ? "#145250"
                            : "white",
                        fontSize: "15px",
                      }}
                    />
                  }
                  style={{
                    color:
                      selectedNavItems === "/transaction" ? "	#145250" : "white",
                    marginTop: "5px",
                  }}
                >
                  Transactions
                </Menu.Item>
                <Menu.Item
                  key="/profile"
                  icon={
                    <UserOutlined
                      style={{
                        color:
                          selectedNavItems === "/profile" ? "#145250" : "white",
                        fontSize: "15px",
                      }}
                    />
                  }
                  style={{
                    color:
                      selectedNavItems === "/profile" ? "#145250" : "white",
                  }}
                >
                  Profile
                </Menu.Item>
              </Menu>
            </Drawer>
          </div>
        </Header>
        <Content
          className="cont"
          style={{
            borderRadius: "10px",
            backgroundColor: "white",
            height: "calc(100vh - 124px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "16px",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transaction" element={<Transaction />} />
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
