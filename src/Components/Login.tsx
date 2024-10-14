import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "antd/dist/reset.css";
import "./Styles/st.css";
import { LoginAdmin } from "./Services/AdminServices";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (value: any) => {
    try {
      const response = await LoginAdmin(value);

      if (response) {
        message.success("Login successful!");
        localStorage.setItem("loggedUser", JSON.stringify(response));
        navigate("/");
      }
    } catch (error) {
      message.error("Invalid login details!");
    }
  };

  return (
    <div className="fds">
      <div className="fds1">
        <div className="fds2">
          <div>
            <img
              src="/LMS.png"
              alt="Library Management"
              height={"150px"}
              width={"150px"}
            />
            <div
              style={{ fontSize: "60px", fontWeight: "bold", color: "white" }}
            >
              LIBRARY
              <br />
              MANAGEMENT
              <br />
              SYSTEM
            </div>
          </div>
          <div className="formdesign bg-white rounded pt-5">
            <h1
              className="mx-4 mt-3 fw-bolder text-center"
              style={{ color: "rgb(57 118 116)" }}
            >
              Log In
            </h1>
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              className="p-4"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
              >
                <Input placeholder="Enter your Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password placeholder="Enter your Password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#145250",
                    color: "white",
                    width: "100%",
                  }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <p className="text-center">
              Don't have an account?{" "}
              <span
                className="span"
                onClick={() => navigate("/signup")}
                style={{ color: "rgb(0 181 175)", cursor: "pointer" }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
