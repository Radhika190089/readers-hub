import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "antd/dist/reset.css";
import "./Styles/st.css";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values: { email: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem("admin") || "") || [];
    const user =
      users?.filter(
        (user: { email: string; password: string }) =>
          user.email === values.email && user.password === values.password
      ) || [];

    if (user.length !== 0) {
      message.success("Login successful!");
      localStorage.setItem("loggedUser", "true");
      navigate("/");
    } else {
      message.error("Invalid login details!");
    }
  };

  return (
    <div className="fds">
      <div className="formdes d-flex justify-content-center">
        <div>
          <div className="d-flex justify-content-center">
            <h1
              className="custom m-3 fw-bolder"
              style={{
                color: "#fb3453",
                fontSize: "70px",
                textAlign: "center",
              }}
            >
              LIBRARY <br /> MANAGEMENT
            </h1>
          </div>
          <div className="formdes2 p-3 rounded">
            <h2
              className="mx-4 bg-white fw-bolder text-center"
              style={{ color: "#fb3453" }}
            >
              Log In
            </h2>
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
                <Input
                  placeholder="Enter your Email"
                  className="form-control"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your Password"
                  className="form-control"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="btn w-100 mb-4"
                style={{ backgroundColor: "#fb3453", color: "white" }}
              >
                Log In
              </Button>

              <p>
                Don't have an account?{" "}
                <span
                  className="span"
                  onClick={() => navigate("/signup")}
                  style={{ color: "#fb3453", cursor: "pointer" }}
                >
                  Sign Up
                </span>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
