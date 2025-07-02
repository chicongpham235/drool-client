import { FC, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Card,
  Space,
} from "antd";
import PageContainer from "@/layout/PageContainer";
import { FaMoneyCheckAlt } from "react-icons/fa";
import ColorButton from "@/components/button";
import { DroolsRule } from "@/interface/rule/drools";
import { BiTrashAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { RuleManagementApi } from "@/api/rule";

const initialRule: DroolsRule = {
  name: "",
  salience: 0,
  when: [],
  then: [{ object: "Transaction", action: "setFee", value: "" }],
};

const RulePage: FC = () => {
  const [noti, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // Xử lý submit form
  const onFinish = async (values: { rules: DroolsRule[] }) => {
    setLoading(true);
    const res = await RuleManagementApi.create(values.rules);
    if (res.status === 200 && res.data == true) {
      noti.success({
        message: "Thành công",
        description: "Lưu Rule thành công",
      });
      form.resetFields();
    } else {
      noti.error({
        message: "Lỗi",
        description: "Không thể lưu Rule, vui lòng thử lại sau.",
      });
    }
    setLoading(false);
  };

  // Thêm một Rule mới
  const handleAddRule = () => {
    const rules = form.getFieldValue("rules") || [];
    form.setFieldsValue({ rules: [...rules, { ...initialRule }] });
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        icon={<FaMoneyCheckAlt />}
        title="Quản trị Rule tính phí"
        extraTitle={
          <div
            style={{
              display: "flex",
              gap: "8px",
              position: "absolute",
              right: "0",
            }}
          >
            <Button
              style={{
                background: "#656565",
                color: "white",
                height: "2.5rem",
              }}
              icon={<AiOutlinePlus />}
              onClick={handleAddRule}
            >
              Thêm Rule
            </Button>
            <Button
              type="primary"
              style={{ height: "2.5rem" }}
              onClick={() => form.submit()}
              loading={loading}
            >
              Lưu tất cả
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            rules: [{ ...initialRule }],
          }}
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          <Form.List name="rules">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, ruleIdx) => (
                  <Card
                    key={field.key}
                    title={`Rule ${ruleIdx + 1}`}
                    style={{ marginBottom: 16 }}
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<BiTrashAlt />}
                          onClick={() => remove(field.name)}
                        >
                          Xóa Rule
                        </Button>
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Col span={20}>
                        <Form.Item
                          name={[field.name, "name"]}
                          label="Tên Rule"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên Rule",
                            },
                          ]}
                        >
                          <Input placeholder="Tên Rule" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "salience"]}
                          label="Độ ưu tiên"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập độ ưu tiên",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={0}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* When Group */}
                    <Form.List name={[field.name, "when"]}>
                      {(whenFields, { add: addWhen, remove: removeWhen }) => (
                        <div style={{ marginBottom: 24 }}>
                          <Row gutter={16}>
                            <Col span={12}>Tổ hợp điều kiện</Col>
                            <Col span={12}>
                              <ColorButton
                                type="primary"
                                size="small"
                                className="float-right"
                                onClick={() =>
                                  addWhen({ object: "", conditions: [] })
                                }
                              >
                                Thêm
                              </ColorButton>
                            </Col>
                          </Row>
                          {whenFields.map((whenField, whenGroupIdx) => (
                            <Row
                              gutter={16}
                              key={whenField.key}
                              style={{ paddingTop: "8px" }}
                            >
                              <Col span={1}>
                                <ColorButton
                                  type="text"
                                  style={{ marginTop: "4px" }}
                                  size="small"
                                  onClick={() => removeWhen(whenField.name)}
                                >
                                  <BiTrashAlt color="red" />
                                </ColorButton>
                              </Col>
                              <Col span={23}>
                                <Form.Item
                                  name={[whenField.name, "object"]}
                                  label="Đối tượng"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng nhập đối tượng",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Đối tượng" />
                                </Form.Item>
                                {/* Conditions */}
                                <Form.List
                                  name={[whenField.name, "conditions"]}
                                >
                                  {(
                                    condFields,
                                    { add: addCond, remove: removeCond }
                                  ) => (
                                    <>
                                      <Row gutter={16}>
                                        <Col span={23}>Điều kiện</Col>
                                        <Col span={1}>
                                          <ColorButton
                                            type="primary"
                                            size="small"
                                            className="float-right"
                                            onClick={() =>
                                              addCond({
                                                field: "",
                                                operator: "",
                                                value: "",
                                              })
                                            }
                                          >
                                            Thêm
                                          </ColorButton>
                                        </Col>
                                      </Row>
                                      {condFields.map((condField, cIdx) => (
                                        <Row
                                          gutter={16}
                                          style={{ paddingTop: "8px" }}
                                          key={condField.key}
                                        >
                                          <Col span={8}>
                                            <Form.Item
                                              name={[condField.name, "field"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng nhập trường",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Trường" />
                                            </Form.Item>
                                          </Col>
                                          <Col span={7}>
                                            <Form.Item
                                              name={[
                                                condField.name,
                                                "operator",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng chọn toán tử",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Toán tử" />
                                            </Form.Item>
                                          </Col>
                                          <Col span={8}>
                                            <Form.Item
                                              name={[condField.name, "value"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng chọn giá trị",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Giá trị" />
                                            </Form.Item>
                                          </Col>
                                          <Col span={1}>
                                            <ColorButton
                                              type="text"
                                              size="small"
                                              style={{ marginTop: "4px" }}
                                              onClick={() =>
                                                removeCond(condField.name)
                                              }
                                            >
                                              <BiTrashAlt color="red" />
                                            </ColorButton>
                                          </Col>
                                        </Row>
                                      ))}
                                    </>
                                  )}
                                </Form.List>
                              </Col>
                            </Row>
                          ))}
                        </div>
                      )}
                    </Form.List>
                    {/* Then */}
                    <Form.List name={[field.name, "then"]}>
                      {(thenFields) => (
                        <Row gutter={16} style={{ paddingTop: "24px" }}>
                          <Col span={24}>Biểu thức tính phí</Col>
                          <Col span={24}>
                            {thenFields.map((thenField) => (
                              <Form.Item
                                key={thenField.key}
                                name={[thenField.name, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập biểu thức tính phí",
                                  },
                                ]}
                              >
                                <Input placeholder="Biểu thức tính phí" />
                              </Form.Item>
                            ))}
                          </Col>
                        </Row>
                      )}
                    </Form.List>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </PageContainer>
    </>
  );
};

export default RulePage;
