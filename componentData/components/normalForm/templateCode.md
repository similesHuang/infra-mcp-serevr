# 普通表单场景

- 常用的新增页面表单场景
- 根据标准表单配置项(formListColumns)，自动生成表单
- 根据具体的产品内容，只需关注表单项的修改
- 最终渲染的结果统一，数据标准化，方便后续的维护

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
      label: '姓名',
      name: 'name',
      rules: [{ required: true, message: '请输入姓名!' }],
      render: () => (
        <Select
          allowClear
          placeholder="请输入姓名"
          options={options}
          showSearch
        />
      ),
    },
    {
      label: 'ID',
      name: 'ID',
      rules: [{ required: true, message: '请输入ID!' }],
      render: () => <Input allowClear placeholder="请输入ID" />,
    },
    {
      label: '应用',
      name: 'app',
      rules: [{ required: true, message: '请输入应用!' }],
      render: () => <Input allowClear placeholder="请输入应用" />,
    },
    {
      label: '描述',
      name: 'des',
      rules: [{ required: true, message: '请输入描述!' }],
      render: () => <Input allowClear placeholder="请输入描述" />,
    },
    {
      label: 'Title',
      name: 'title',
      rules: [{ required: true, message: '请输入Title!' }],
      render: () => <Input allowClear placeholder="请输入Title" />,
    },
    {
      label: '组织',
      name: 'org',
      rules: [{ required: true, message: '请输入组织!' }],
      render: () => <Input allowClear placeholder="请输入组织" />,
    },
    {
      label: '类别',
      name: 'type',
      rules: [{ required: true, message: '请输入类别!' }],
      render: () => <Input allowClear placeholder="请输入类别" />,
    },
    {
      label: '别名',
      name: 'alias',
      rules: [{ required: true, message: '请输入别名!' }],
      render: () => <Input allowClear placeholder="请输入别名" />,
    },
    {
      label: '业务',
      name: 'bus',
      rules: [{ required: true, message: '请输入业务!' }],
      render: () => <Input allowClear placeholder="请输入业务" />,
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
          {() => {
            return (
              <>
                <Row justify="space-between" gutter={48}>
                  {formListColumns.map((item) => {
                    return (
                      <Col span={8} key={item.name}>
                        <Form.Item
                          name={item.name}
                          label={item.label}
                          rules={item?.rules}
                        >
                          {item?.render()}
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
