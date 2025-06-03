# 普通详情页

示例代码

```jsx
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import qs from 'query-string';
import { Button, Card, Col, Descriptions, Row, Tabs } from 'antd';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'umi';

export default function DetailView(props) {
  const [listStatus, setListStatus] = useState(false);
  const handleTabs = (e) => { };
  const handleEdit = () => { };

  // Tips: umi/v2 请用 props
  // const { location, history } = props
  const location = useLocation();
  const { search } = location;

  const memoizedQuery = useMemo(() => {
    if (props?.history) {
      return qs.parse(search);
    } else {
      return qs.parse(search.substring(1))
    }
  }, [search]);
  

  return (
    <div className="INFRAUITEMPLATE">
      <Card className="cl-mb-8" bordered={false}>
        <Descriptions
          title={
            <Row justify="space-between">
              <Col>title {memoizedQuery.path}</Col>
              <Col>
                <Button type="primary" onClick={handleEdit}>
                  修改
                </Button>
              </Col>
            </Row>
          }
        >
          <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
          <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
          <Descriptions.Item label="Remark">empty</Descriptions.Item>
          <Descriptions.Item label="Address">Hangzhou</Descriptions.Item>
          {!listStatus && (
            <Descriptions.Item>
              <a
                onClick={() => setListStatus(!listStatus)}
                className="cl-link-50"
              >
                更多
                <DownOutlined />
              </a>
            </Descriptions.Item>
          )}
          {listStatus && (
            <>
              <Descriptions.Item label="Live">
                Hangzhou, Zhejiang
              </Descriptions.Item>
              <Descriptions.Item label="Remark">empty</Descriptions.Item>
              <Descriptions.Item label="Address">Hangzhou</Descriptions.Item>
              {listStatus && (
                <Descriptions.Item>
                  <a
                    onClick={() => setListStatus(!listStatus)}
                    className="cl-link-50"
                  >
                    收起
                    <UpOutlined />
                  </a>
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>
      </Card>

      <Card bordered={false}>
        <Tabs
          onChange={handleTabs}
          items={[
            {
              label: 'Tab 1',
              key: '1',
              children: <div>Tab 1</div>,
            },
            {
              label: 'Tab 2',
              key: '2',
              children: <div>Tab 2</div>,
            },
            {
              label: 'Tab 3',
              key: '3',
              children: <div>Tab 3</div>,
            },
          ]}
        />
      </Card>
    </div>
  );
}

```

# 编辑单个详情页

示例代码

```jsx
import { FormOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Row,
  Select,
  Tabs,
} from 'antd';
import qs from 'query-string';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'umi';

export default function DetailView(props) {
  const [allEdit, setAllEdit] = useState({});
  // TODO: 修改你的数据
  const [data, setData] = useState({
    name: 'Zhou Maomao',
    phone: '1810000000',
    live: 'lucy',
    remark: 'empty',
    address: 'lucy',
  });
  const [editValue, setEditValue] = useState();

  const handleTabs = (e) => {};

  // TODO: 修改你的操作
  const handleEditSingle = (type, flag, value) => {
    setAllEdit({
      ...allEdit,
      [type]: flag,
    });
    // 编辑状态 && 值
    if (flag && value) {
      setEditValue({
        ...editValue,
        [type]: value,
      });
    }
    // 保存状态 && 值
    if (!flag && value) {
      setData({
        ...data,
        [type]: value,
      });
    }
  };

  const handleChange = (type, value) => {
    setEditValue({
      ...editValue,
      [type]: value,
    });
  };

  const location = useLocation();
  const { search } = location;

  const memoizedQuery = useMemo(() => {
    if (props?.history) {
      return qs.parse(search);
    } else {
      return qs.parse(search.substring(1));
    }
  }, [search]);

  // TODO: 修改你的配置
  const descriptionsList = [
    {
      label: 'UserName',
      type: 'name',
      options: {
        span: 6,
      },
      isEdit: true,
      editComponent: (type, value) => (
        <Input
          className="p-[0px]"
          value={editValue ? editValue[type] : ''}
          onChange={(e) => handleChange(type, e.target.value)}
          placeholder="请输入用户名"
        />
      ),
    },
    {
      label: 'Telephone',
      type: 'phone',
      options: {
        span: 6,
      },
      isEdit: false,
    },
    {
      label: 'Live',
      type: 'live',
      options: {
        span: 6,
      },
      isEdit: true,
      editComponent: (type) => (
        <Select
          className="p-[0px] h-[18px]"
          value={editValue ? editValue[type] : ''}
          style={{ width: 120 }}
          onChange={(newValue) => handleChange(type, newValue)}
          options={[
            {
              value: 'jack',
              label: 'Jack',
            },
            {
              value: 'lucy',
              label: 'Lucy',
            },
            {
              value: 'disabled',
              disabled: true,
              label: 'Disabled',
            },
            {
              value: 'Yiminghe',
              label: 'yiminghe',
            },
          ]}
        />
      ),
    },
    {
      label: 'Remark',
      type: 'remark',
      options: {
        span: 6,
      },
      isEdit: true,
      editComponent: (type, value) => (
        <Input
          className="p-[0px]"
          value={editValue ? editValue[type] : ''}
          onChange={(e) => handleChange(type, e.target.value)}
          placeholder="请输入用户名"
        />
      ),
    },
    {
      label: 'Address',
      type: 'address',
      options: {
        span: 6,
      },
      isEdit: true,
      editComponent: (type) => (
        <Select
          className="p-[0px] h-[18px]"
          value={editValue ? editValue[type] : ''}
          style={{ width: 120 }}
          onChange={(newValue) => handleChange(type, newValue)}
          options={[
            {
              value: 'jack',
              label: 'Jack',
            },
            {
              value: 'lucy',
              label: 'Lucy',
            },
            {
              value: 'disabled',
              disabled: true,
              label: 'Disabled',
            },
            {
              value: 'Yiminghe',
              label: 'yiminghe',
            },
          ]}
        />
      ),
    },
    {
      label: 'Telephone',
      type: 'phone',
      options: {
        span: 6,
      },
      isEdit: false,
    },
  ];

  return (
    <div className="INFRAUITEMPLATE">
      <Card className="cl-mb-8" bordered={false}>
        <Descriptions
          title={
            <Row justify="space-between">
              <Col>title {memoizedQuery.path}</Col>
            </Row>
          }
        >
          {descriptionsList.map((item) => {
            return (
              <Descriptions.Item label={item.label}>
                {item?.isEdit && allEdit[item.type]
                  ? item.editComponent(item.type, data[item.type])
                  : data[item.type] || '-'}
                {item?.isEdit && !allEdit[item.type] && (
                  <FormOutlined
                    className="text-[#00aeec] ml-[8px]"
                    onClick={() =>
                      handleEditSingle(item.type, true, data[item.type])
                    }
                  />
                )}
                {item?.isEdit && allEdit[item.type] && (
                  <>
                    <Button
                      type="link"
                      className="p-[0px] h-[17px] m-[0px_4px]"
                      onClick={() =>
                        handleEditSingle(item.type, false, editValue[item.type])
                      }
                    >
                      保存
                    </Button>
                    <Button
                      type="link"
                      className="p-[0px] h-[17px]"
                      onClick={() =>
                        handleEditSingle(item.type, false, data[item.type])
                      }
                    >
                      取消
                    </Button>
                  </>
                )}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </Card>

      <Card bordered={false}>
        <Tabs
          onChange={handleTabs}
          items={[
            {
              label: 'Tab 1',
              key: '1',
              children: <div>Tab 1</div>,
            },
            {
              label: 'Tab 2',
              key: '2',
              children: <div>Tab 2</div>,
            },
            {
              label: 'Tab 3',
              key: '3',
              children: <div>Tab 3</div>,
            },
          ]}
        />
      </Card>
    </div>
  );
}

```
