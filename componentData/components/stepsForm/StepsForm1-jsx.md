//StepsForm1-jsx

源文件: `../components/StepsForm1`

```jsx
import { Col, Form, Input, Row } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';

const StepsForm1 = (props, ref) => {
  const [form] = Form.useForm();

  function onValidateFields() {
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then((values) => {
          resolve(values);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    //暴露给父组件的当前表单校验的方法
    onValidateFields,
    //暴露给父组件获取当前表单信息方法
    getFormValues: () => {
      return form.getFieldsValue();
    },
    //暴露给父组件重置form表单方法
    resetFields: () => {
      form.resetFields();
    },
    //暴露给父组件设置form表单方法
    setFormValues: (defaultValues) => {
      form.setFieldsValue(defaultValues);
    },
  }));

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '姓名',
      name: 'name',
      rules: [{ required: true, message: '请输入姓名!' }],
      render: () => <Input allowClear placeholder="请输入姓名" />,
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

  return (
    <Form form={form} layout="vertical">
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          return (
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
          );
        }}
      </Form.Item>
    </Form>
  );
};
export default forwardRef(StepsForm1);

```
