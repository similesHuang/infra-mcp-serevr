## 对话框表单场景

- 对话框表单采用封装组件形式，减少对视图的依赖
- 整体兼容两种常见业务场景，新增&修改，通过“viewType”字段区分

示例代码

```jsx
import { Button, Card, Form, Input, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';

export default function ModalFormView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <Card>
      <Space>
        <Button type="primary" onClick={() => handleOpenModal('create')}>
          添加
        </Button>
        <Button type="primary" onClick={() => handleOpenModal('edit')}>
          修改
        </Button>
      </Space>
      <ModalForm
        title="testDemo"
        viewType={modalType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Card>
  );
}

function ModalForm(props) {
  /**
   * @param {Object} props - 组件属性。
   * @param {string} props.title - 对话框标题。
   * @param {string} props.viewType - 改变抽屉打开状态的函数。对应不同的业务场景例如：编辑（edit）、创建（create）等。
   * @param {boolean} props.isModalOpen - 对话框是否打开。
   * @param {Function} props.setIsModalOpen - 改变对话框打开状态的函数。
   */
  const { title, isModalOpen, setIsModalOpen, viewType } = props;

  const [form] = Form.useForm();

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '名称',
      name: 'name',
      rules: [
        {
          required: true,
          message: '请输入名称!',
        },
      ],
      render: () => (
        <Input
          onChange={() => handleSearchChange()}
          allowClear
          placeholder="请输入名称"
        />
      ),
    },
    {
      label: '描述',
      name: 'des',
      rules: [
        {
          required: true,
          message: '请输入描述!',
        },
      ],
      render: () => (
        <Input
          onChange={() => handleSearchChange()}
          allowClear
          placeholder="请输入描述"
        />
      ),
    },
  ];

  // 监听对话框打开状态的变化，当对话框打开时，设置表单的默认值
  useEffect(() => {
    if (isModalOpen && viewType) {
      switch (viewType) {
        case 'edit':
          setFormDefaultValues();
          break;
        case 'create':
          break;
        default:
          break;
      }
    }
  }, [isModalOpen, viewType]);

  const setFormDefaultValues = () => {
    form.setFieldsValue({
      name: 'testUser',
      des: 'des',
    });
  };

  /**
   * 确认按钮的点击事件。
   * 该函数用于验证表单数据，并在验证通过后关闭对话框。
   */
  const handleClickSubmit = async () => {
    // TODO: 提交表单数据
    const params = await form.validateFields();

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      className="INFRAUITEMPLATE"
      title={title}
      centered
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleClickSubmit}>
          确认
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="cl-my-16">
        {formListColumns.map((item) => {
          return (
            <Form.Item
              name={item.name}
              label={item.label}
              rules={item?.rules}
              key={item.name}
            >
              {item?.render()}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
}

```

## 抽屉表单场景

- 对话框表单采用封装组件形式，减少对视图的依赖
- 整体兼容两种常见业务场景，新增&修改，通过“viewType”字段区分

示例代码

```jsx
import { Button, Card, Drawer, Form, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
export default function DrawerFormView() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('create');

  const handleOpenDrawer = (type) => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  return (
    <Card className="INFRAUITEMPLATE">
      <Space>
        <Button type="primary" onClick={() => handleOpenDrawer('create')}>
          添加
        </Button>
        <Button type="primary" onClick={() => handleOpenDrawer('edit')}>
          修改
        </Button>
      </Space>
      <DrawerForm
        title="testDemo"
        viewType={drawerType}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </Card>
  );
}
function DrawerForm(props) {
  /**
   * @param {Object} props - 组件属性。
   * @param {string} props.title - 抽屉标题。
   * @param {string} props.viewType - 改变抽屉打开状态的函数。对应不同的业务场景例如：编辑（edit）、创建（create）等。
   * @param {boolean} props.isDrawerOpen - 抽屉是否打开。
   * @param {Function} props.setIsDrawerOpen - 改变抽屉打开状态的函数。
   */

  const { title, viewType, isDrawerOpen, setIsDrawerOpen } = props;

  const [form] = Form.useForm();

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '名称',
      name: 'name',
      rules: [
        {
          required: true,
          message: '请输入名称!',
        },
      ],
      render: () => (
        <Input
          onChange={() => handleSearchChange()}
          allowClear
          placeholder="请输入名称"
        />
      ),
    },
    {
      label: '描述',
      name: 'des',
      rules: [
        {
          required: true,
          message: '请输入描述!',
        },
      ],
      render: () => (
        <Input
          onChange={() => handleSearchChange()}
          allowClear
          placeholder="请输入描述"
        />
      ),
    },
  ];

  // 监听抽屉打开状态的变化，当抽屉打开时，设置表单的默认值
  useEffect(() => {
    if (isDrawerOpen && viewType) {
      switch (viewType) {
        case 'edit':
          setFormDefaultValues();
          break;
        case 'create':
          break;
        default:
          break;
      }
    }
  }, [isDrawerOpen, viewType]);

  const setFormDefaultValues = () => {
    form.setFieldsValue({
      name: 'testUser',
      des: 'des',
    });
  };

  /**
   * 处理确认按钮的点击事件。
   * 该函数用于验证表单数据，并在验证通过后关闭抽屉。
   */
  const handleClickSubmit = async () => {
    const params = await form.validateFields();
    handleClickCancel();
  };

  /**
   * 处理取消按钮的点击事件。
   * 该函数用于重置表单字段的值，并关闭抽屉。
   */
  const handleClickCancel = () => {
    form.resetFields();
    setIsDrawerOpen(false);
  };

  return (
    <Drawer
      title={title}
      open={isDrawerOpen}
      closable={false}
      onClose={handleClickCancel}
      footer={[
        <Space key="configSpace" className="float-right">
          <Button key="onClose" onClick={handleClickCancel}>
            取消
          </Button>
          <Button key="submit" type="primary" onClick={handleClickSubmit}>
            确认
          </Button>
        </Space>,
      ]}
    >
      <Form form={form} layout="vertical">
        {formListColumns.map((item) => {
          return (
            <Form.Item
              name={item.name}
              label={item.label}
              rules={item?.rules}
              key={item.name}
            >
              {item?.render()}
            </Form.Item>
          );
        })}
      </Form>
    </Drawer>
  );
}

```
