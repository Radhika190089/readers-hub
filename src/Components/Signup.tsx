import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "antd/dist/reset.css";
import "./Styles/st.css";
import { AdminType } from "./Admin";
import { RegisterAdmin } from "./Services/AdminServices";

const Signup = () => {
  const navigate = useNavigate();

  const onFinish = async (values: AdminType) => {
    try {
      await RegisterAdmin(values);
      message.success("Signup successful!");
      navigate("/");
    } catch (error) {
      message.error("Signup failed.");
      console.error("Error during signup:", error);
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
            <div style={{ fontSize: "60px", fontWeight: "bold", color: "white" }}>
              LIBRARY
              <br />
              MANAGEMENT
              <br />
              SYSTEM
            </div>
          </div>
          <div className="formdesign p-4 bg-white rounded">
            <h2
              className="mx-4 my-3 fw-bolder text-center"
              style={{ color: "#145250" }}
            >
              Sign Up
            </h2>
            <Form
              name="signup"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="User Name"
                name="userName"
                rules={[{ required: true, message: "Please enter user name" }]}
              >
                <Input placeholder="Enter your User Name" />
              </Form.Item>

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
                  Sign Up
                </Button>
              </Form.Item>
            </Form>

            <p className="text-center">
              Already have an account?{" "}
              <span
                className="span"
                onClick={() => {
                  navigate("/login");
                }}
                style={{ color: "#145250", cursor: "pointer" }}
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
