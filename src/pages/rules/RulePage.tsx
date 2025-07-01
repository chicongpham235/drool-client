import { FC, useEffect, useRef, useState } from "react";
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
import { WhenGroup } from "@/interface/rule";
import { DroolsRule } from "@/interface/rule/drools";
import { BiTrashAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

const RulePage: FC = () => {
  const [noti, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const rowRef = useRef<HTMLDivElement>(null);
  const [rules, setRules] = useState<DroolsRule[]>([]);

  useEffect(() => {
    // Initialize with one empty rule
    addRule();
  }, []);

  const addRule = () => {
    const newRule: DroolsRule = {
      name: "",
      salience: 0,
      when: [],
      then: [{ object: "Transaction", action: "setFee", value: "" }],
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (ruleIdx: number) => {
    const newRules = structuredClone(rules);
    newRules.splice(ruleIdx, 1);
    setRules(newRules);
  };

  const updateRule = (ruleIdx: number, field: keyof DroolsRule, value: any) => {
    const newRules = structuredClone(rules);
    (newRules[ruleIdx] as any)[field] = value;
    setRules(newRules);
  };

  const [whenGroups, setWhenGroups] = useState<WhenGroup[]>([]);

  const onFinish = (values: any) => {
    console.log("test1", "payload", rules);
  };

  const addWhenGroup = (ruleIdx: number) => {
    const newRules = structuredClone(rules);
    if (!newRules[ruleIdx].when) {
      newRules[ruleIdx].when = [];
    }
    newRules[ruleIdx].when!.push({ object: "", conditions: [] });
    setRules(newRules);
  };

  const onRemoveWhenGroup = (ruleIdx: number, whenGroupIdx: number) => {
    const newRules = structuredClone(rules);
    newRules[ruleIdx].when!.splice(whenGroupIdx, 1);
    setRules(newRules);
  };

  const addWhenCondition = (ruleIdx: number, whenGroupIdx: number) => {
    const newRules = structuredClone(rules);
    if (!newRules[ruleIdx].when![whenGroupIdx].conditions) {
      newRules[ruleIdx].when![whenGroupIdx].conditions = [];
    }
    newRules[ruleIdx].when![whenGroupIdx].conditions.push({
      field: "",
      operator: "",
      value: "",
    });
    setRules(newRules);
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
              onClick={addRule}
            >
              Thêm Rule
            </Button>
            <Button
              type="primary"
              style={{ height: "2.5rem" }}
              onClick={() => onFinish({})}
            >
              Lưu tất cả
            </Button>
          </div>
        }
      >
        <div
          className="form"
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          {rules.map((rule, ruleIdx) => (
            <Card
              key={`rule-${ruleIdx}`}
              title={`Rule ${ruleIdx + 1}`}
              style={{ marginBottom: 16 }}
              extra={
                rules.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<BiTrashAlt />}
                    onClick={() => removeRule(ruleIdx)}
                  >
                    Xóa Rule
                  </Button>
                )
              }
            >
              <Form
                className="base-form"
                layout="vertical"
                initialValues={rule}
                onValuesChange={(changedValues) => {
                  Object.keys(changedValues).forEach((key) => {
                    updateRule(
                      ruleIdx,
                      key as keyof DroolsRule,
                      changedValues[key]
                    );
                  });
                }}
              >
                <Row
                  gutter={16}
                  className="form-content"
                  ref={ruleIdx === 0 ? rowRef : undefined}
                >
                  <Col span={20}>
                    <Form.Item
                      name="name"
                      label="Tên Rule"
                      rules={[
                        { required: true, message: "Vui lòng nhập tên Rule" },
                      ]}
                    >
                      <Input
                        placeholder="Tên Rule"
                        value={rule.name}
                        onChange={(e) =>
                          updateRule(ruleIdx, "name", e.target.value)
                        }
                      />
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
                        value={rule.salience}
                        onChange={(value) =>
                          updateRule(ruleIdx, "salience", value || 0)
                        }
                        parser={(value) => {
                          if (!value) return 0;
                          const parsedValue = Number(
                            value.replace(/[^\d]/g, "")
                          );
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
                          onClick={() => addWhenGroup(ruleIdx)}
                        >
                          Thêm
                        </ColorButton>
                      </Col>
                    </Row>
                    {rule.when?.map((whenGroup, whenGroupIdx) => (
                      <Row
                        gutter={16}
                        key={`rule-${ruleIdx}-whenGroup-${whenGroupIdx}`}
                        style={{ paddingTop: "8px" }}
                      >
                        <Col span={1}>
                          <ColorButton
                            type="text"
                            style={{ marginTop: "4px" }}
                            size="small"
                            onClick={() =>
                              onRemoveWhenGroup(ruleIdx, whenGroupIdx)
                            }
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
                            <Input
                              placeholder="Đối tượng"
                              value={whenGroup.object}
                              onChange={(e) => {
                                const newRules = structuredClone(rules);
                                newRules[ruleIdx].when![whenGroupIdx].object =
                                  e.target.value;
                                setRules(newRules);
                              }}
                            />
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
                                  onClick={() =>
                                    addWhenCondition(ruleIdx, whenGroupIdx)
                                  }
                                >
                                  Thêm
                                </ColorButton>
                              </Col>
                            </Row>
                            {whenGroup.conditions?.map(
                              (condition, conditionIdx) => (
                                <Row
                                  gutter={16}
                                  style={{ paddingTop: "8px" }}
                                  key={`rule-${ruleIdx}-whenGroup-${whenGroupIdx}-condition-${conditionIdx}`}
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
                                        value={condition.field}
                                        onChange={(e) => {
                                          const newRules =
                                            structuredClone(rules);
                                          newRules[ruleIdx].when![
                                            whenGroupIdx
                                          ].conditions[conditionIdx].field =
                                            e.target.value;
                                          setRules(newRules);
                                        }}
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
                                        value={condition.operator}
                                        onChange={(e) => {
                                          const newRules =
                                            structuredClone(rules);
                                          newRules[ruleIdx].when![
                                            whenGroupIdx
                                          ].conditions[conditionIdx].operator =
                                            e.target.value;
                                          setRules(newRules);
                                        }}
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
                                        value={condition.value}
                                        onChange={(e) => {
                                          const newRules =
                                            structuredClone(rules);
                                          newRules[ruleIdx].when![
                                            whenGroupIdx
                                          ].conditions[conditionIdx].value =
                                            e.target.value;
                                          setRules(newRules);
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              )
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </Col>
                  <Col span={24} style={{ paddingTop: "24px" }}>
                    <Row gutter={16}>
                      <Col span={24}>Biểu thức tính phí</Col>
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
                          <Input
                            placeholder="Biểu thức tính phí"
                            value={rule.then[0]?.value || ""}
                            onChange={(e) => {
                              const newRules = structuredClone(rules);
                              if (newRules[ruleIdx].then[0]) {
                                newRules[ruleIdx].then[0].value =
                                  e.target.value;
                              }
                              setRules(newRules);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Card>
          ))}
        </div>
      </PageContainer>
    </>
  );
};

export default RulePage;
