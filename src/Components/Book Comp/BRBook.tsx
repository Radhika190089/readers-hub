import React, { useEffect, useState } from "react";
import { Button, Form, Select } from "antd";
import { ReaderType } from "../ReaderManagement";
import { BookType } from "../Book";
import { TransactionType } from "../Transaction";

interface BRProps {
  form: any;
  onSubmit: (values: any) => void;
  submitText: string;
  read: ReaderType[];
  book: BookType[];
  transactions?: TransactionType[];
  setSelectedReaderId: (readerId: number) => void;
  setSelectedBookISBN: (bookISBN: string) => void;
}

const BRBook: React.FC<BRProps> = ({
  form,
  onSubmit,
  submitText,
  read,
  book,
  transactions,
  setSelectedReaderId,
  setSelectedBookISBN,
}) => {
  const [selectedReader, setSelectedReader] = useState<number | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<BookType[]>([]);

  useEffect(() => {
    if (selectedReader !== null) {
      const booksForReader =
        transactions
          ?.filter(
            (transaction) =>
              transaction.readerId === selectedReader &&
              transaction.type === "Borrow"
          )
          ?.map((transaction) => transaction.bookISBN)
          .map((isbn) => book.find((b) => b.bookISBN === isbn))
          .filter((b): b is BookType => b !== undefined) || [];

      const returnedBooksISBNs =
        transactions
          ?.filter(
            (transaction) =>
              transaction.readerId === selectedReader &&
              transaction.type === "Return"
          )
          .map((transaction) => transaction.bookISBN) || [];

      const unreturnedBooks = booksForReader.filter(
        (b) => !returnedBooksISBNs.includes(b.bookISBN)
      );

      setBorrowedBooks(unreturnedBooks);
      form.setFieldsValue({ book: undefined });
      setSelectedBookISBN("");
    } else {
      setBorrowedBooks([]);
    }
  }, [selectedReader, book, transactions, form, setSelectedBookISBN]);

  return (
    <div>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="reader"
          label="Select Reader"
          rules={[{ required: true, message: "Please select a reader!" }]}
        >
          <Select
            placeholder="Select Reader"
            onChange={(value) => {
              setSelectedReader(value);
              setSelectedReaderId(value);
              form.setFieldsValue({ reader: value });
            }}
          >
            {read
              .filter((r) => r.status == "Active")
              .map((reader) => (
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
          {submitText == "Return Book" ? (
            <Select
              placeholder="Select Book"
              onChange={(value) => {
                setSelectedBookISBN(value);
                form.setFieldsValue({ book: value });
              }}
              disabled={!selectedReader}
            >
              {borrowedBooks.map((book) => (
                <Select.Option key={book.bookISBN} value={book.bookISBN}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Select
              placeholder="Select Book"
              onChange={(value) => setSelectedBookISBN(value)}
            >
              {book.map((book) => (
                <Select.Option key={book.bookISBN} value={book.bookISBN}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BRBook;
