import React from 'react'
import { Button, Form, Select } from "antd";
import { ReaderType } from "../ReaderManagement";
import { BookType } from '../Book';

interface BRProps {
    form: any;
    onSubmit: any;
    submitText: string;
    read: ReaderType[];
    book: BookType[];
    setSelectedUserId: any;
    setSelectedBookId: any;
}

const BRBook: React.FC<BRProps> = ({
    form,
    onSubmit,
    submitText,
    read,
    book,
    setSelectedUserId,
    setSelectedBookId,
}) => {
    return (
        <div>
            <div>
                <Form
                    form={form}
                    onFinish={onSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="reader"
                        label="Select User"
                        rules={[{ required: true, message: "Please select a reader" }]}
                    >
                        <Select
                            placeholder="Select User"
                            onChange={(value) => setSelectedUserId(value)}
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
                        rules={[{ required: true, message: "Please select a book" }]}
                    >
                        <Select
                            placeholder="Select Book"
                            onChange={(value) => setSelectedBookId(value)}
                        >
                            {book.map((book) => (
                                <Select.Option key={book.id} value={book.id}>
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
    )
}

export default BRBook