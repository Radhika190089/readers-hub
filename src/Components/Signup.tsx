import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS
import bookImage from "./Styles/Rbooks.png";
import "./Styles/st.css";

const Signup = () => {
  const navigate = useNavigate();

  const onFinish = (values: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    age: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("Signup values:", values);

    const users = JSON.parse(localStorage.getItem("admin") || "[]");
    users.push(values);
    localStorage.setItem("admin", JSON.stringify(users));
    message.success("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="fds">
      <div className="formdes d-flex justify-content-center ">
        <div>
          <div className="d-flex justify-content-center">
            <h1
              className="custom m-3 fw-bolder"
              style={{ color: "#fb3453", fontSize: "70px" }}
            >
              LIBRARY <br /> MANAGEMENT
            </h1>
          </div>
          <div className="formdesign p-4 bg-white rounded">
            <h2
              className="mx-4 my-3 fw-bolder text-center"
              style={{ color: "#fb3453" }}
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
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Enter your Full Name" />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input placeholder="Enter your Username" />
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
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  { pattern: /^\+?\d{10}$/, message: "Invalid phone number" },
                ]}
              >
                <Input placeholder="Enter your Phone Number" />
              </Form.Item>

              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "Please enter your age" }]}
              >
                <Input placeholder="Enter your Age" />
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

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#fb3453",
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
                style={{ color: "#fb3453", cursor: "pointer" }}
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
