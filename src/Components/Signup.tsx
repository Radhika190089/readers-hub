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
      message.error("Signup failed. Admin may already exist.");
      console.error("Error during signup:", error);
    }

    // const users = JSON.parse(localStorage.getItem("admin") || "[]");
    // users.push(values);
    // localStorage.setItem("admin", JSON.stringify(users));
    // message.success("Signup successful!");
    // navigate("/login");
  };

  return (
    <div className="fds">
      <div className="formdes d-flex justify-content-center">
        <h1
          className="custom m-3 fw-bolder"
          style={{ color: "#fb3453", fontSize: "65px" }}
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
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your Password" />
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
  );
};

export default Signup;
