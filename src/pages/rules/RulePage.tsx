import { FC, useRef, useState } from "react";
import { Button, Col, Form, Input, InputNumber, notification, Row } from "antd";
import PageContainer from "@/layout/PageContainer";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import ColorButton from "@/components/button";
import { WhenGroup } from "@/interface/rule";
import { BiTrashAlt } from "react-icons/bi";

const RulePage: FC = () => {
  const [noti, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const rowRef = useRef<HTMLDivElement>(null);

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
                    defaultValue={0}
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
                  <Col span={12}>When</Col>
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
                  {whenGroups.map((whenGroup, whenGroupIdx) => {
                    return (
                      <Row
                        gutter={16}
                        key={whenGroupIdx}
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
                            name={["whenGroups", whenGroupIdx, "object"]}
                            label="Đối tượng"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập đối tượng",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Đối tượng"
                              type="text"
                              value={whenGroup.object}
                              onChange={(e) => {
                                const newWhenGroups =
                                  structuredClone(whenGroups);
                                newWhenGroups[whenGroupIdx].object =
                                  e.target.value;
                                setWhenGroups(newWhenGroups);
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["whenGroups", whenGroupIdx, "conditions"]}
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
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                </>
              </Col>
            </Row>
          </Form>
        </div>
      </PageContainer>
    </>
  );
};

export default RulePage;
