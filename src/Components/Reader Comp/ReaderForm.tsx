import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";
import { ReaderType } from "../ReaderManagement";

interface ReaderProps {
  form: any;
  initialValues?: Partial<ReaderType>;
  onSubmit: (values: ReaderType) => void;
  submitText: string;
}

const ReaderForm: React.FC<ReaderProps> = ({
  form,
  initialValues,
  onSubmit,
  submitText,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input the email!" },
          {
            pattern: /^[^\s@]+@[a-zA-Z]+[a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email!",
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="phoneNo"
        label="Phone Number"
        rules={[
          { required: true, message: "Please input the phone number!" },
          {
            pattern: /^\d{10}$/,
            message: "Phone number must be 10 digits long!",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please input the gender!" }]}
      >
        <Select placeholder="Select gender">
          <Select.Option value="Male">Male</Select.Option>
          <Select.Option value="Female">Female</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: "Please input the age!" }]}
      >
        <InputNumber style={{ width: "100%" }} autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select the status!" }]}
      >
        <Select placeholder="Select status">
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReaderForm;
