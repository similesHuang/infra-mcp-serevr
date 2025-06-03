# 代码编辑表单

- <code>安装 @monaco-editor/react 包</code>
- 常用的新增页面表单场景+代码编辑器功能
- 代码编辑器组件传入form实例，用于代码同步修改表单绑定数据，并完成格式校验

示例代码

```jsx
import { Button, Card, Col, Form, Input, Row, Select, Space ,message} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Editor,{loader} from '@monaco-editor/react';

// 可选版本(0.27.0 ~ 0.52.2)
const version = '0.28.1'
loader.config({
  paths: {
    vs: `https://unpkg.com/monaco-editor@${version}/min/vs`,
  },
});

function MonacoComponent({form,options}) {
  const [defaultCode, setDefaultCode] = useState("");
  const handleEditorChange = (value, event) => {
    form.setFieldValue("code",value)
    form.validateFields()
  };
  return (
    <div style={{ height: options.height }}>
      <Editor
        height="100%"
        defaultLanguage={options.language}
        defaultValue={form.getFieldValue("code")}
        onChange={handleEditorChange}
        theme={options.theme}
      />
    </div>
  );
}

export default function FormTemplate() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // TODO: 修改编辑器配置
  const monacoOption = {
    height:"500px",
    language:"javascript",
    theme:"vs-dark"
  }

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '姓名',
      name: 'name',
      col:8,
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
      col:8,
      rules: [{ required: true, message: '请输入ID!' }],
      render: () => <Input allowClear placeholder="请输入ID" />,
    },
    {
      label: '应用',
      name: 'app',
      col:8,
      rules: [{ required: true, message: '请输入应用!' }],
      render: () => <Input allowClear placeholder="请输入应用" />,
    },
    {
      label: '代码模块',
      name: 'code',
      col:24,
      rules: [{ required: true, message: '请输入代码模块!' }],
      render: () => <MonacoComponent form={form} options={monacoOption}></MonacoComponent>,
    }
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
    message.success("提交成功");
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
                      <Col span={item.col} key={item.name}>
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
