import React from "react";
import { Form, Input, Button } from "antd";
import { BookType } from "../Book";

interface BookProps {
  form: any;
  initialValues?: Partial<BookType>;
  onSubmit: (values: BookType) => void;
  submitText: string;
}

const BookForm: React.FC<BookProps> = ({
  form,
  initialValues,
  onSubmit,
  submitText,
}) => {
  const isbnRegex = /^(?:\d{9}[\dXx]|97[89]\d{10})$/;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="title"
        label="Book Title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="author"
        label="Author"
        rules={[{ required: true, message: "Please input the author!" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please input the category!" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="bookISBN"
        label="ISBN"
        rules={[
          { required: true, message: "Please enter book ISBN!" },
          {
            pattern: isbnRegex,
            message: "Please enter a valid ISBN (ISBN-10 or ISBN-13 format).",
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="bookCount"
        label="Book Count"
        rules={[
          { required: true, message: "Please enter book count!" },
          {
            type: "number",
            min: 0,
            message: "Book Count cannot be negative!",
          },
        ]}
        normalize={(value) => {
          return Number(value);
        }}
      >
        <Input type="number" autoComplete="off" />
      </Form.Item>

      <Form.Item name="bookURL" label="Book Cover Image URL">
        <Input type="string" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[
          { required: true, message: "Please input the price!" },
          { type: "number", min: 0, message: "Price cannot be negative!" },
        ]}
      >
        <Input type="number" autoComplete="off" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookForm;
