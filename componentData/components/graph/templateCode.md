# 数据统计图表

- <code>数据统计图表</code>
- 结合已有图表组件模版快速搭建的可视化首页
- 配置式修改页面
- 支持常规可视化页面请求流程
- 支持可视化图表的全屏展示等...

示例代码

```jsx
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { EChartsComponent } from './BaseEcharts';
import './index.less';
const { RangePicker } = DatePicker;
export default function FormTemplate() {
  const [form] = Form.useForm();
  const [fullScreen, setFullScreen] = useState(false);
  const events = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange',
  ];

  // TODO: 修改你的配置
  const [graphLists, setGraphLists] = useState([
    {
      elementId: 'child',
      yAxis: { type: 'value' },
      title: { text: '子节点故障分排行' },
      series: [{ type: 'bar', data: [10, 20, 30] }],
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      eleStyle: {
        eleWidth: '99.9%',
        width: '100%',
        height: '250px',
        margin: '0px  0px 10px 0px',
      },
    },
    {
      elementId: '1',
      yAxis: { type: 'value' },
      title: { text: '召回率' },
      series: [{ type: 'line', data: [10, 20, 10] }],
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      eleStyle: {
        width: '100%',
        eleWidth: '32%',
        height: '250px',
      },
    },
    {
      elementId: '2',
      yAxis: { type: 'value' },
      title: { text: '召回准确率' },
      series: [{ type: 'line', data: [5, 10, 20] }],
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      eleStyle: {
        width: '100%',
        eleWidth: '32%',
        margin: '0px calc(4% - 23px)',
        height: '250px',
      },
    },
    {
      elementId: '3',
      yAxis: { type: 'value' },
      title: { text: '整体问题' },
      series: [{ type: 'bar', data: [20, 25, 30] }],
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      eleStyle: {
        width: '100%',
        eleWidth: '32%',
        height: '250px',
      },
    },
  ]);

  // TODO: 修改你的配置
  const formListColumns = [
    {
      label: '',
      name: 'first',
      span: 6,
      render: () => <Select allowClear placeholder="请选择" showSearch />,
    },
    {
      label: '',
      name: 'type',
      span: 6,
      render: () => (
        <Radio.Group>
          <Radio value={1}>按责任方</Radio>
          <Radio value={2}>按受损业务</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '',
      name: 'time',
      span: 6,
      render: () => (
        <RangePicker showTime placeholder={['开始时间', '结束时间']} />
      ),
    },
    {
      label: '',
      name: 'mode',
      span: 6,
      render: () => (
        <Radio.Group>
          <Radio value={1}>按月</Radio>
          <Radio value={2}>按周</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '',
      name: 'des',
      checked: 'des',
      span: 6,
      render: () => <Checkbox placeholder="click">剔除毛刺数据</Checkbox>,
    },
    {
      label: '定级',
      name: 'level',
      span: 6,
      render: () => <Select allowClear placeholder="请选择" showSearch />,
    },
    {
      label: '发现方式',
      name: 'dis',
      span: 6,
      render: () => <Input allowClear placeholder="请输入" />,
    },
    {
      label: '应急找回细分',
      name: 'info',
      span: 6,
      render: () => <Input allowClear placeholder="请输入" />,
    },
    {
      label: '分类',
      name: 'Category',
      span: 6,
      render: () => <Input allowClear placeholder="请输入" />,
    },
    {
      label: '是否变更导致',
      name: 'change',
      span: 6,
      render: () => <Input allowClear placeholder="请输入描述" />,
    },
    {
      label: '',
      name: '',
      span: 12,
      render: () => {
        return (
          <Space
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={() => handleCancel()}>取消</Button>
            <Button type="primary" onClick={() => handleSubmit()}>
              提交
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setFullScreen(false);
        setGraphLists(
          graphLists?.map((item) => {
            return {
              ...item,
              eleStyle: { ...item?.eleStyle, height: '250px' },
            };
          }),
        );
      }
    };
    events.forEach((event) =>
      document.addEventListener(event, handleFullScreenChange),
    );
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleFullScreenChange),
      );
    };
  }, []);

  const handleToggleFullScreen = (type, id) => {
    ToggleFullScreen(id);
    setGraphLists(
      graphLists?.map((item, i) => {
        if (`${i}+${item?.elementId}` === id) {
          if (fullScreen) {
            return {
              ...item,
              eleStyle: {
                ...item?.eleStyle,
                height: '250px',
              },
            };
          } else {
            return {
              ...item,
              eleStyle: {
                ...item?.eleStyle,
                height: '100%',
              },
            };
          }
        } else {
          return item;
        }
      }),
    );
    setFullScreen(!fullScreen);
  };

  const ToggleFullScreen = (id) => {
    let ele = document.getElementById(id);
    ele.style.backgroundColor = '#fff';
    if (document.fullscreenElement) {
      ele.style.height = '250px';
      // 处理不同浏览器的退出全屏兼容性
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      ele.style.height = '100%';
      // 处理不同浏览器的进入全屏兼容性
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    }
  };

  const handleSubmit = () => {};

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <Card className="INFRAUITEMPLATE">
      <Form
        form={form}
        layout="horizontal"
        initialValues={{ type: 1, mode: 1 }}
      >
        <Form.Item noStyle shouldUpdate>
          {() => {
            return (
              <>
                <Row justify="start" gutter={16}>
                  {formListColumns.map((item) => {
                    return (
                      <Col span={item.span} key={item.name}>
                        <Form.Item
                          name={item.name}
                          label={item.label}
                          rules={item?.rules}
                          valuePropName={item?.checked ? 'checked' : 'value'}
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

      <div className="graphContainer">
        {graphLists?.map((item, i) => {
          return (
            <div
              className="graphItem"
              id={`${i}+${item?.elementId}`}
              key={`${i}+${item?.elementId}`}
              style={{
                width: item.eleStyle.eleWidth,
                height: item.eleStyle.height,
                margin: item?.eleStyle?.margin,
              }}
            >
              <div
                className={'sliceIcon'}
                onClick={() =>
                  handleToggleFullScreen('list', `${i}+${item?.elementId}`)
                }
              >
                {fullScreen ? (
                  <FullscreenExitOutlined />
                ) : (
                  <FullscreenOutlined />
                )}
              </div>
              <div key={i} className="h-full p-5">
                <EChartsComponent id={item.elementId} options={item} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

```
