# Tabs 切换表格页

- 适合需要 Tab 切换搜索列表的场景
- Tab 切换和单个表单元素变化时，都会触发表格的搜索接口
- 参数默认存放到路由中，保持搜索条件持久化
- 页面刷新搜索条件不丢失，链接分享时保留当前页面状态

示例代码

```jsx
import { Card, Col, Form, Input, Row, Select, Table, Tabs, Tag } from 'antd';
import qs from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useLocation } from 'umi';
import { statusOptions } from './mock/config';
import { getList } from './mock/service';

export default function TabsTable(props) {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [activeTab, setActiveTab] = useState('all');
  const defaultTabs = [
    {
      key: 'all',
      label: '全部',
    },
    ...statusOptions,
  ];
  const [tabItems, setTabItems] = useState(defaultTabs);

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
      render: () => (
        <Input
          onPressEnter={() => handleSearchChange()}
          allowClear
          placeholder="请输入姓名"
        />
      ),
    },
    {
      label: '年龄',
      name: 'age',
      rules: [],
      render: () => (
        <Select
          onChange={() => handleSearchChange()}
          allowClear
          placeholder="请选择年龄"
          options={[
            { value: '32', label: '32' },
            { value: '18', label: '18', disabled: true },
          ]}
        />
      ),
    },
    {
      label: '描述',
      name: 'des',
      rules: [],
      render: () => (
        <Input
          onPressEnter={() => handleSearchChange()}
          allowClear
          placeholder="请输入描述"
        />
      ),
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return <Tag> {text} </Tag>;
      },
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
    const _promiseArr = [];
    defaultTabs.map((item) => {
      _promiseArr.push(
        getList({
          status: item.key === 'all' ? null : item.key,
        }),
      );
    });
    Promise.allSettled(_promiseArr).then((results) => {
      const _statusTabs = [];
      results.map((item, index) => {
        _statusTabs.push({
          key: defaultTabs[index].key,
          label: `${defaultTabs[index].label}(${
            item.status === 'fulfilled' ? item.value.default.data?.length : 0
          })`,
        });
      });
      setTabItems(_statusTabs);
    });
  }, []);

  useEffect(() => {
    const queryParams = qs.parse(memoizedQuery);
    form.setFieldsValue(queryParams);
    setTableParams({
      pagination: {
        current: +queryParams?.current || 1,
        pageSize: +queryParams?.pageSize || 10,
      },
    });
    setActiveTab(queryParams?.status || 'all');
    fetchData(queryParams);
  }, [memoizedQuery]);
  /**·
   * 异步加载数据的函数，模拟从服务器获取数据的过程。
   * @param {Object} searchParams - 搜索相关的参数，用于过滤数据。
   */
  const fetchData = async (searchParams) => {
    setLoading(true);
    try {
      // TODO：替换真实接口
      const res = await getList(searchParams);
      const data = res.default.data;
      changeTabLabel(searchParams.status, data);
      setTotal(data.length);
      setTableData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const changeTabLabel = (status, data) => {
    const _tabItems = [...tabItems];
    const _findIndex = defaultTabs.findIndex(
      (item) => item.key === (status || 'all'),
    );
    if (_findIndex > -1) {
      _tabItems.splice(_findIndex, 1, {
        key: status || 'all',
        label: `${defaultTabs[_findIndex]?.label}(${data?.length})`,
      });
    }
    setTabItems(_tabItems);
  };

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

  const handleSearchChange = async () => {
    const params = await form.getFieldsValue();
    const searchParams = {
      ...qs.parse(memoizedQuery),
      current: 1,
      ...params,
    };
    replaceHistory(searchParams);
  };

  const onTabChange = (e) => {
    setActiveTab(e);
    const searchParams = {
      ...qs.parse(memoizedQuery),
      current: 1,
      status: e,
    };
    replaceHistory(searchParams);
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
        {/* 表单搜索部分 */}
        <Form layout="horizontal" form={form}>
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
          </Row>
        </Form>
        <Tabs activeKey={activeTab} items={tabItems} onChange={onTabChange} />
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
