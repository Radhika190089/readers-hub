import React, { useState, useEffect } from "react";
import {
  UploadOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, Menu, Space } from "antd";
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
import User from "./ReaderManagement";
import Profile from "./Profile";
import { Avatar } from "evergreen-ui";

const { Header, Content, Sider } = Layout;

const AdminPortal: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "");
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        width={350}
        style={{ backgroundColor: "#fb3453" }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div
          style={{
            height: "64px",
            margin: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h5
            style={{
              color: "white",
              fontFamily: "Racing Sans One",
              fontSize: "35px",
              margin: "0px 20px",
            }}
          >
            LIBRARY MANAGEMENT
          </h5>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedNavItems]}
          onClick={handleNavClick}
          style={{
            marginTop: "30px",
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
            key="/reader"
            icon={
              <UserOutlined
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
            key="/user"
            icon={
              <TeamOutlined
                style={{
                  color: selectedNavItems === "/user" ? "#fb3453" : "white",
                  fontSize: "17px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/user" ? "#fb3453" : "white",
              marginTop: "10px",
            }}
          >
            Reader Management
          </Menu.Item>
          <Menu.Item
            key="/profile"
            icon={
              <UploadOutlined
                style={{
                  color: selectedNavItems === "/profile" ? "#fb3453" : "white",
                  fontSize: "20px",
                }}
              />
            }
            style={{
              color: selectedNavItems === "/profile" ? "#fb3453" : "white",
              position: "relative",
              top: 560,
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
              <Route path="/user" element={<User />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPortal;
