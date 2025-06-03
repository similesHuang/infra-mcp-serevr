# 折叠面板表单场景

- 折叠面板结合表单，配置式添加表单项
- 使用者只关注 collapseColumns 配置项即可完成整个折叠表单的配置
- 可以通过配置项里 render 函数实现高定制化需求

示例代码

```jsx
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
const { Panel } = Collapse;
export default function FormTemplate() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // TODO: 修改你的配置
  const collapseColumns = [
    {
      key: '1',
      label: <div className="mt-0.5">基础配置</div>,
      children: [
        {
          label: '姓名',
          name: 'name',
          span: 6,
          rules: [{ required: true, message: '请选择姓名!' }],
          render: () => (
            <Select
              allowClear
              placeholder="请选择姓名"
              options={options}
              showSearch
            />
          ),
        },
        {
          label: '描述',
          name: '描述',
          span: 6,
          rules: [{ required: true, message: '请输入描述!' }],
          render: () => <Input allowClear placeholder="请输入描述" />,
        },
        {
          label: '别名',
          name: '别名',
          span: 6,
          rules: [{ required: true, message: '请输入别名!' }],
          render: () => <Input allowClear placeholder="请输入别名" />,
        },
        {
          label: '业务',
          name: '业务',
          span: 6,
          rules: [{ required: true, message: '请输入业务!' }],
          render: () => <Input allowClear placeholder="请输入业务" />,
        },
      ],
    },
    {
      key: '2',
      label: <div className="mt-0.5">告警配置</div>,
      children: [
        {
          label: '应用',
          name: 'app',
          span: 12,
          rules: [{ required: true, message: '请输入应用!' }],
          render: () => <Input allowClear placeholder="请输入应用" />,
        },
        {
          label: '描述',
          name: 'des',
          span: 12,
          rules: [{ required: true, message: '请输入描述!' }],
          render: () => <Input allowClear placeholder="请输入描述" />,
        },
      ],
    },
    {
      key: '3',
      label: <div className="mt-0.5">告警配置</div>,
      children: [
        {
          label: '启用',
          name: 'ref',
          span: 12,
          rules: [{ required: true, message: '请输入启用!' }],
          render: () => <Switch />,
        },
        {
          label: '',
          name: '',
          span: 12,
          render: (getFieldValue) => {
            if (getFieldValue('ref')) {
              return (
                <Form.Item
                  label="组织"
                  name="organization"
                  rules={[{ required: true, message: '请输入组织!' }]}
                >
                  <Input allowClear placeholder="请输入组织" />
                </Form.Item>
              );
            } else {
              return null;
            }
          },
        },
      ],
    },
  ];

  const fetchData = useCallback(async () => {
    // TODO：替换真实接口
    const res = await import('./mock/mock.js');
    const data = res.default.data;
    setOptions(data);
  }, []);

  const handleSubmit = async () => {
    // TODO: 提交表单校验
    const params = await form.validateFields();
  };

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <Card className="INFRAUITEMPLATE">
      <Form form={form} layout="vertical">
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            return (
              <Collapse
                defaultActiveKey={collapseColumns?.map((item) => item.key)}
              >
                {collapseColumns?.map((item) => {
                  return (
                    <Panel header={item.label} key={item.key}>
                      <Row gutter={8}>
                        {item.children?.map((child) => {
                          return (
                            <Col span={child.span} key={child.name}>
                              <Form.Item
                                name={child.name}
                                label={child.label}
                                rules={child?.rules}
                              >
                                {child?.render(getFieldValue)}
                              </Form.Item>
                            </Col>
                          );
                        })}
                      </Row>
                    </Panel>
                  );
                })}
              </Collapse>
            );
          }}
        </Form.Item>
      </Form>
      <Space className="float-right mt-3">
        <Button onClick={() => handleCancel()}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          提交
        </Button>
      </Space>
    </Card>
  );
}

```
