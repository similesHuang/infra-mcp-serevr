# 复杂扩展表单场景

- 常用的新增页面表单场景
- 使用 <code><Form.Item noStyle shouldUpdate></Form.Item></code> 整体包裹表单，实现表单联动
- 可以通过配置项里 render 箭头函数进行扩展，定义形参获取数据，实现自定义表单项
- 表单渲染，通过箭头函数传入实参，配置项调用 rander 方法传入实参，实现自定义效果

示例代码

```jsx
import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

export default function FormTemplate() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '数据源',
      name: 'dataSource',
      rules: [{ required: true, message: '请选择数据源!' }],
      render: (getFieldValue) => (
        <Select
          allowClear
          placeholder="请选择数据源"
          options={options}
          showSearch
          onChange={(value) => {
            form.setFieldValue('account', value + '账号');
          }}
        />
      ),
    },
    {
      label: '',
      name: '',
      render: (getFieldValue) => {
        return getFieldValue('dataSource') ? (
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label="账号"
                name="account"
                rules={[{ required: true, message: '请输入账号!' }]}
              >
                <Input allowClear placeholder="请输入账号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input allowClear placeholder="请输入密码" />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <div></div>
        );
      },
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
              <>
                <Row justify="space-between" gutter={48}>
                  {formListColumns.map((item) => {
                    return (
                      <Col span={12} key={item.name}>
                        <Form.Item
                          name={item.name}
                          label={item.label}
                          rules={item?.rules}
                        >
                          {item?.render(getFieldValue)}
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </>
            );
          }}
        </Form.Item>
      </Form>
      <Space className="float-right">
        <Button onClick={() => handleCancel()}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          提交
        </Button>
      </Space>
    </Card>
  );
}

```
