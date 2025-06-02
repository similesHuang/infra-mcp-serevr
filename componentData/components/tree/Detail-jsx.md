//Detail-jsx

源文件: `../detail/Detail`

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
