import { FC, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, InputNumber, notification, Row } from "antd";
import PageContainer from "@/layout/PageContainer";
import { FaMoneyCheckAlt } from "react-icons/fa";
import ColorButton from "@/components/button";
import { WhenGroup } from "@/interface/rule";
import { BiTrashAlt } from "react-icons/bi";

const RulePage: FC = () => {
  const [noti, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    form.setFieldValue("salience", 0);
    form.setFieldValue("then", [
      { object: "Transaction", action: "setFee", value: "" },
    ]);
  }, []);

  const [whenGroups, setWhenGroups] = useState<WhenGroup[]>([]);

  const onFinish = (values: any) => {
    console.log("test1", "payload", values);
  };

  const addWhenGroup = () => {
    setWhenGroups([...whenGroups, { object: "", conditions: [] }]);
  };
  const onRemoveWhenGroup = (idx: number) => {
    const newWhenGroups = structuredClone(whenGroups);
    newWhenGroups.splice(idx, 1);
    setWhenGroups(newWhenGroups);
  };

  const addWhenCondition = (whenGroupIdx: number) => {
    const newWhenGroups = structuredClone(whenGroups);
    if (!newWhenGroups[whenGroupIdx].conditions) {
      newWhenGroups[whenGroupIdx].conditions = [];
    }
    newWhenGroups[whenGroupIdx].conditions.push({
      field: "",
      operator: "",
      value: "",
    });
    setWhenGroups(newWhenGroups);
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        icon={<FaMoneyCheckAlt />}
        title="Quản trị Rule tính phí"
        extraTitle={
          <Button
            type="primary"
            style={{ float: "right", height: "2.5rem" }}
            onClick={() => onFinish(form.getFieldsValue())}
          >
            Tạo mới
          </Button>
        }
      >
        <div className="form">
          <Form
            className="base-form"
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={16} className="form-content" ref={rowRef}>
              <Col span={20}>
                <Form.Item
                  name="name"
                  label="Tên Rule"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên Rule" },
                  ]}
                >
                  <Input placeholder="Tên Rule" type="text" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="salience"
                  label="Độ ưu tiên"
                  rules={[
                    { required: true, message: "Vui lòng nhập độ ưu tiên" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    precision={0}
                    style={{ width: "100%" }}
                    parser={(value) => {
                      if (!value) return 0;
                      const parsedValue = Number(value.replace(/[^\d]/g, ""));
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={12}>Tổ hợp điều kiện</Col>
                  <Col span={12}>
                    <ColorButton
                      type="primary"
                      size="small"
                      className="float-right"
                      onClick={addWhenGroup}
                    >
                      Thêm
                    </ColorButton>
                  </Col>
                </Row>
                <>
                  {whenGroups.map((_whenGroup, whenGroupIdx) => {
                    return (
                      <Row
                        gutter={16}
                        key={"whenGroup-" + whenGroupIdx}
                        style={{ paddingTop: "8px" }}
                      >
                        <Col span={1}>
                          <ColorButton
                            type="text"
                            style={{ marginTop: "4px" }}
                            size="small"
                            onClick={() => onRemoveWhenGroup(whenGroupIdx)}
                          >
                            <BiTrashAlt color="red" />
                          </ColorButton>
                        </Col>
                        <Col span={23}>
                          <Form.Item
                            name={["when", whenGroupIdx, "object"]}
                            label="Đối tượng"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập đối tượng",
                              },
                            ]}
                          >
                            <Input placeholder="Đối tượng" type="text" />
                          </Form.Item>
                          <Form.Item
                            name={["when", whenGroupIdx, "conditions"]}
                          >
                            <Row gutter={16}>
                              <Col span={23}>Điều kiện</Col>
                              <Col span={1}>
                                <ColorButton
                                  type="primary"
                                  size="small"
                                  className="float-right"
                                  onClick={() => addWhenCondition(whenGroupIdx)}
                                >
                                  Thêm
                                </ColorButton>
                              </Col>
                            </Row>
                            {_whenGroup.conditions &&
                              _whenGroup.conditions.map(
                                (_condition, conditionIdx) => {
                                  return (
                                    <Row
                                      gutter={16}
                                      style={{ paddingTop: "8px" }}
                                      key={
                                        "whenGroup-" +
                                        whenGroupIdx +
                                        "-condition-" +
                                        conditionIdx
                                      }
                                    >
                                      <Col span={8}>
                                        <Form.Item
                                          name={[
                                            "when",
                                            whenGroupIdx,
                                            "conditions",
                                            conditionIdx,
                                            "field",
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Vui lòng nhập trường",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="Trường"
                                            type="text"
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={8}>
                                        <Form.Item
                                          name={[
                                            "when",
                                            whenGroupIdx,
                                            "conditions",
                                            conditionIdx,
                                            "operator",
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Vui lòng chọn toán tử",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="Toán tử"
                                            type="text"
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={8}>
                                        <Form.Item
                                          name={[
                                            "when",
                                            whenGroupIdx,
                                            "conditions",
                                            conditionIdx,
                                            "value",
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Vui lòng chọn giá trị",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="Giá trị"
                                            type="text"
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  );
                                }
                              )}
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                </>
              </Col>
              <Col span={24} style={{ paddingTop: "24px" }}>
                <Row gutter={16}>
                  <Col span={24}>Biểu thức tính phí</Col>
                  <Col span={0} style={{ display: "none" }}>
                    <Form.Item name={["then", 0, "object"]}></Form.Item>
                  </Col>
                  <Col span={0} style={{ display: "none" }}>
                    <Form.Item name={["then", 0, "action"]}></Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={["then", 0, "value"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập biểu thức tính phí",
                        },
                      ]}
                    >
                      <Input placeholder="Biểu thức tính phí" type="text" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </PageContainer>
    </>
  );
};

export default RulePage;
