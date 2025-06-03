# 动态增删表单

- 使用 Form.List 为字段提供数组化管理.
- 实现动态增加、减少表单，精准化表单处理。
- 提交，回显统一由数组管理

## 基础表单

示例代码

```jsx
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
const App = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Form
      className="INFRAUITEMPLATE"
      form={form}
      name="dynamic_form_complex"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Row>
        <Col span={20}>
          <Row gutter={24}>
            <Col span={7}>名称</Col>
            <Col span={7}>年龄</Col>
            <Col span={7}>描述</Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <Form.List name="expressions">
            {(fields, { add, remove }) => (
              <div key={JSON.stringify(fields)}>
                {fields.map(({ key, name, i, ...restField }) => (
                  <Row gutter={24} key={key}>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[
                          {
                            required: true,
                            message: '请输入名称！',
                          },
                        ]}
                      >
                        <Input placeholder="请输入名称" allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'age']}
                        rules={[
                          {
                            required: true,
                            message: '请输入年龄！',
                          },
                        ]}
                      >
                        <Input placeholder="请输入年龄" allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'des']}
                        rules={[
                          {
                            required: true,
                            message: '请输入描述！',
                          },
                        ]}
                      >
                        <Input allowClear placeholder="请输入描述" />
                      </Form.Item>
                    </Col>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="cl-mb-8"
                    />
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    style={{ width: '100%' }}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加条件
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="float-right">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
export default App;

```

## Table 表单

示例代码

```jsx
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import { useState } from 'react';

export default function TableDynamic() {
  const [form] = Form.useForm();
  // TODO 替换默认数据
  const [apps, setApps] = useState([
    {
      value: 'common-admin-service',
      label: 'common-admin-service',
    },
    {
      value: 'account-common',
      label: 'account-common',
    },
  ]);
  const [metrics, setMetrics] = useState({
    'common-admin-service': [
      {
        label: '指标1',
        value: '1',
      },
      {
        label: '指标2',
        value: '2',
      },
    ],
    'account-common': [
      {
        label: 'account指标',
        value: '1',
      },
    ],
  });

  const onAppChange = (index) => {
    form.setFieldValue(['app_metrics', index, 'metrics'], []);
  };

  const onValidate = () => {
    form.validateFields((values) => {
      message.success('提交表单');
    });
  };
  return (
    <Form
      className="INFRAUITEMPLATE"
      form={form}
      autoComplete="off"
      initialValues={{
        app_metrics: [
          {
            name: 'han',
            app: 'common-admin-service',
            metrics: ['1', '2'],
          },
        ],
      }}
    >
      <Row className="p-2 mb-2 bg-[#fafafa]" gutter={16}>
        {/* TODO */}
        <Col span={7}>名称</Col>
        <Col span={7}>应用</Col>
        <Col span={10}>指标(选项随应用动态改变)</Col>
      </Row>
      <Form.List name="app_metrics">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} className="items-baseline">
                <Col span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[
                      {
                        required: true,
                        message: '请输入名称！',
                      },
                    ]}
                  >
                    <Input placeholder="请输入名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'app']}
                    rules={[
                      {
                        required: true,
                        message: '请选择应用',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="请选择应用"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={apps}
                      onChange={() => onAppChange(name)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) => {
                      return (
                        prevValues.app_metrics[name]?.app !==
                        curValues.app_metrics[name]?.app
                      );
                    }}
                  >
                    {() => {
                      return (
                        <Form.Item
                          {...restField}
                          name={[name, 'metrics']}
                          rules={[
                            {
                              required: true,
                              message: '请选择指标',
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            showSearch
                            showArrow
                            placeholder="请选择指标"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={
                              metrics[
                                form.getFieldValue('app_metrics')[name]?.app
                              ] || []
                            }
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col span={2} className="pr-4 text-[16px] text-right">
                  <DeleteOutlined onClick={() => remove(name)} />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" onClick={onValidate}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

```
