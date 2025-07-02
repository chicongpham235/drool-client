import { FC, useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  notification,
} from "antd";
import PageContainer from "@/layout/PageContainer";
import { TbTransactionDollar } from "react-icons/tb";
import { Transaction } from "@/interface/transaction";
import { Customer } from "@/interface/customer";
import FeeApi from "@/api/fee/fee.api";

interface FeeCalculationPayload {
  transaction: Transaction;
  customer: Customer;
}

const FeePage: FC = () => {
  const [form] = Form.useForm();
  const [noti, contextHolder] = notification.useNotification();

  const [fee, setFee] = useState<number | null>(null);

  // Debounce timer for auto-submit
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Check if all required fields are filled
  const checkAllFieldsFilled = useCallback(() => {
    const values = form.getFieldsValue();
    return (
      values.amount &&
      values.transactionType &&
      values.channel &&
      values.customerName &&
      values.customerType &&
      values.tier
    );
  }, [form]);

  // Auto-submit function with debounce
  const handleAutoSubmit = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if (checkAllFieldsFilled()) {
        form.submit();
      }
    }, 300); // 300ms delay

    setDebounceTimer(timer);
  }, [debounceTimer, checkAllFieldsFilled, form]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const onFinish = async (values: any) => {
    const payload: FeeCalculationPayload = {
      transaction: {
        amount: values.amount,
        type: values.transactionType,
        channel: values.channel,
      },
      customer: {
        name: values.customerName,
        type: values.customerType,
        tier: values.tier,
      },
    };

    const res = await FeeApi.calcFee(payload);
    if (
      res.status === 200 &&
      typeof res.data === "number" &&
      !isNaN(res.data)
    ) {
      setFee(res.data == 0 ? null : res.data);
    }
  };

  return (
    <>
      {contextHolder}
      <PageContainer icon={<TbTransactionDollar />} title="Tạo giao dịch">
        <Card
          title="Thông tin giao dịch và khách hàng"
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleAutoSubmit}
            initialValues={{
              amount: 0,
              transactionType: "",
              channel: "",
              customerName: "",
              customerType: "",
              tier: "",
            }}
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col span={24}>
                <h3 style={{ marginBottom: 16, color: "#1890ff" }}>
                  Thông tin giao dịch
                </h3>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="amount"
                  label="Số tiền"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tiền" },
                    {
                      type: "number",
                      min: 0,
                      message: "Số tiền phải lớn hơn 0",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Nhập số tiền"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      Number(value!.replace(/\$\s?|(,*)/g, "")) as any
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="transactionType"
                  label="Loại giao dịch"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại giao dịch" },
                  ]}
                >
                  <Select placeholder="Chọn loại giao dịch">
                    <Select.Option value="TRANSFER">Chuyển khoản</Select.Option>
                    <Select.Option value="WITHDRAW">Rút tiền</Select.Option>
                    <Select.Option value="DEPOSIT">Nạp tiền</Select.Option>
                    <Select.Option value="PAYMENT">Thanh toán</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="channel"
                  label="Kênh giao dịch"
                  rules={[
                    { required: true, message: "Vui lòng chọn kênh giao dịch" },
                  ]}
                >
                  <Select placeholder="Chọn kênh giao dịch">
                    <Select.Option value="ATM">ATM</Select.Option>
                    <Select.Option value="ONLINE">Online Banking</Select.Option>
                    <Select.Option value="MOBILE">Mobile Banking</Select.Option>
                    <Select.Option value="BRANCH">Chi nhánh</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <h3
                  style={{ marginBottom: 16, marginTop: 24, color: "#1890ff" }}
                >
                  Thông tin khách hàng
                </h3>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="customerName"
                  label="Tên khách hàng"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên khách hàng" },
                  ]}
                >
                  <Input placeholder="Nhập tên khách hàng" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="customerType"
                  label="Loại khách hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại khách hàng",
                    },
                  ]}
                >
                  <Select placeholder="Chọn loại khách hàng">
                    <Select.Option value="PRIVATE">Cá nhân</Select.Option>
                    <Select.Option value="CORPORATE">
                      Doanh nghiệp
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="tier"
                  label="Hạng khách hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hạng khách hàng",
                    },
                  ]}
                >
                  <Select placeholder="Chọn hạng khách hàng">
                    <Select.Option value="SILVER">Bạc</Select.Option>
                    <Select.Option value="GOLD">Vàng</Select.Option>
                    <Select.Option value="PLATINUM">Bạch kim</Select.Option>
                    <Select.Option value="DIAMOND">Kim cương</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <div>Phí giao dịch:</div>
              </Col>
              <Col span={16}>
                {fee && (
                  <div
                    style={{
                      fontSize: "1.2em",
                      color: "#ff4d4f",
                      textAlign: "right",
                    }}
                  >
                    {fee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </PageContainer>
    </>
  );
};

export default FeePage;
