import PageContainer from "@/layout/PageContainer";
import React, { useEffect, useState } from "react";
import { FiTarget } from "react-icons/fi";
import { Button, Col, Form, Input, Row, Select, message } from "antd";
import FeeApi from "@/api/fee/fee.api";

const { TextArea } = Input;

const httpMethods = ["GET", "POST", "PUT", "DELETE"];

const TargetPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const method = Form.useWatch("method", form);

  const handleSubmit = async (values: any) => {
    const { method, headers, body } = values;
    let parsedHeaders = {};
    let parsedBody: any = undefined;

    try {
      if (headers) parsedHeaders = JSON.parse(headers);
      if (body && method !== "GET") parsedBody = JSON.parse(body);
    } catch (e: any) {
      message.error("Headers hoặc Body không phải JSON hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      const res = await FeeApi.khaiBaoThamSo(values);
      console.log("test1", res);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "GET",
      headers: `{\n  "Content-Type": "application/json"\n}`,
      body: `{\n}`,
    });
  }, []);

  const handleEnterInJsonTextArea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const value = textarea.value;
      const indent = "  ";

      // Insert new line with indentation
      const newValue =
        value.substring(0, start) + "\n" + indent + value.substring(end);

      textarea.value = newValue;

      // Manually set cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + indent.length + 1;
      }, 0);

      // Trigger onChange manually if needed
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  return (
    <PageContainer icon={<FiTarget />} title="Khai báo tham số">
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input placeholder="Tên tham số" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
              <Input placeholder="Mã tham số" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="url"
              label="🔗 API URL"
              rules={[{ required: true }]}
            >
              <Input placeholder="https://your-api.com/endpoint" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="method"
              label="🛠 HTTP Method"
              rules={[{ required: true }]}
            >
              <Select
                options={httpMethods.map((m) => ({ label: m, value: m }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="headers" label="🧾 Headers (JSON)">
              <TextArea rows={5} onKeyDown={handleEnterInJsonTextArea} />
            </Form.Item>
          </Col>
          {method !== "GET" && (
            <Col span={24}>
              <Form.Item name="body" label="📦 Body (JSON)">
                <TextArea rows={5} onKeyDown={handleEnterInJsonTextArea} />
              </Form.Item>
            </Col>
          )}
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingTop: "1rem",
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </PageContainer>
  );
};

export default TargetPage;
