# 高级搜索表格

- 适合搜索条件较多时的场景
- 点击搜索查询按钮统一触发表格的搜索接口
- 参数默认存放到路由中，保持搜索条件持久化
- 页面刷新搜索条件不丢失，链接分享时保留当前页面状态

示例代码

```jsx
import { Button, Card, Col, Form, Input, Row, Space, Table } from 'antd';
import qs from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useLocation } from 'umi';

export default function TableTemplate(props) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [form] = Form.useForm();
  const location = useLocation();
  // Tips: umi/v2 请用 props
  // const { location, history } = props
  const { pathname, search } = location;
  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '姓名',
      name: 'name',
      rules: [],
      render: () => <Input allowClear placeholder="请输入姓名" />,
    },
    {
      label: '年龄',
      name: 'age',
      rules: [],
      render: () => <Input allowClear placeholder="请输入年龄" />,
    },
    {
      label: '描述',
      name: 'des',
      rules: [],
      render: () => <Input allowClear placeholder="请输入描述" />,
    },
  ];
  // TODO: 修改你的配置
  const tableColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      filters: [
        {
          text: 'Male',
          value: 'male',
        },
        {
          text: 'Female',
          value: 'female',
        },
      ],
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: true,
    },
    {
      title: '描述',
      dataIndex: 'des',
      key: 'des',
    },
    {
      title: '操作',
      render: (text, record) => {
        return <a> 详情 </a>;
      },
    },
  ];

  const memoizedQuery = useMemo(() => {
    if (props?.history) {
      return search;
    } else {
      return search.substring(1);
    }
  }, [search]);

  useEffect(() => {
    const queryParams = qs.parse(memoizedQuery);
    form.setFieldsValue(queryParams);
    setTableParams({
      pagination: {
        current: +queryParams?.current || 1,
        pageSize: +queryParams?.pageSize || 10,
      },
    });

    fetchData(queryParams);
  }, [memoizedQuery]);

  /**·
   * 异步加载数据的函数，模拟从服务器获取数据的过程。
   * @param {Object} searchParams - 搜索相关的参数，用于过滤数据。
   */
  const fetchData = useCallback(async (searchParams) => {
    setLoading(true);
    // TODO：替换真实接口
    const res = await import('./mock/mock.js');
    const data = res.default.data;

    setTotal(data.length);
    setTableData(data);
    setLoading(false);
  }, []);

  /**
   * 处理表格变化的回调函数
   * @param {Object} pagination 分页
   * @param {Object} filters 筛选
   * @param {Object} sorter 排序
   */
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });

    replaceHistory({
      ...qs.parse(memoizedQuery),
      current: pagination?.current,
      pageSize: pagination?.pageSize,
    });
  };

  const handleSearchClick = async () => {
    const params = await form.validateFields();
    const searchParams = {
      current: 1,
      ...qs.parse(memoizedQuery),
      ...params,
    };
    replaceHistory(searchParams);
  };

  const handleResetClick = () => {
    replaceHistory();

    form.resetFields();
  };

  const replaceHistory = (params) => {
    const target = {
      pathname,
    };
    // 兼容 umi/v2
    if (props?.history) {
      target.query = params || '';
    } else {
      target.search = qs.stringify(params || {});
    }

    history.replace(target);
  };

  return (
    <div className="INFRAUITEMPLATE">
      <Card bordered={false} className="cl-mb-8">
        {/*  TODO：配置查询条件表单 */}
        <Form layout="horizontal" form={form} className="cl-mt-8">
          <Row gutter={16}>
            {formListColumns.map((item) => {
              return (
                <Col span={6} key={item.name}>
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
            <Col span={6}>
              <Space className="float-right">
                <Button type="primary" onClick={() => handleSearchClick()}>
                  查询
                </Button>
                <Button onClick={() => handleResetClick()}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          columns={tableColumns}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          dataSource={tableData}
          pagination={{
            total: total,
            ...tableParams?.pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}

```
