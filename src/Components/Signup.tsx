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
      const resp = await RegisterAdmin(values);
      if (resp) {
        message.success("Signup successful!");
        localStorage.setItem("loggedUser", JSON.stringify(resp));
        navigate("/");
      }
    } catch (error) {
      message.error("User email already exists.");
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
            <div className="projectName">
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
              style={{ color: "rgb(57 118 116)" }}
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
                  {
                    pattern: /^[^\s@]+@[a-zA-Z]+[a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input placeholder="Enter your Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    message:
                      "Password must be 8-20 characters long, include at least one uppercase, one lowercase letter, one number, and one special character.",
                  },
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
                style={{ color: "rgb(0 181 175)", cursor: "pointer" }}
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
