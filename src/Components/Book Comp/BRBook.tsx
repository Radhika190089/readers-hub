import React from "react";
import { Button, Form, Select } from "antd";
import { ReaderType } from "../ReaderManagement";
import { BookType } from "../Book";

interface BRProps {
  form: any;
  onSubmit: any;
  submitText: string;
  read: ReaderType[];
  book: BookType[];
  setSelectedReaderId: any;
  setselectedBookISBN: any;
}

const BRBook: React.FC<BRProps> = ({
  form,
  onSubmit,
  submitText,
  read,
  book,
  setSelectedReaderId,
  setselectedBookISBN,
}) => {
  return (
    <div>
      <div>
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item
            name="reader"
            label="Select Reader"
            rules={[{ required: true, message: "Please select a reader!" }]}
          >
            <Select
              placeholder="Select Reader"
              onChange={(value) => setSelectedReaderId(value)}
            >
              {read.map((reader) => (
                <Select.Option key={reader.readerId} value={reader.readerId}>
                  {reader.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="book"
            label="Select Book"
            rules={[{ required: true, message: "Please select a book!" }]}
          >
            <Select
              placeholder="Select Book"
              onChange={(value) => setselectedBookISBN(value)}
            >
              {book.map((book) => (
                <Select.Option key={book.bookISBN} value={book.bookISBN}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BRBook;
