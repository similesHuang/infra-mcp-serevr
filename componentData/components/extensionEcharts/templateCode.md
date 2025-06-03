## 图表&列表
- <code>安装 Ecarts 包</code>
- 使用 ECharts 饼图数据展示，进行数据可视化
- 扩展列表数据配置项，展示图表数据，例：min、max值，新增排序功能
- 支持配置是否展示列表，列表名称前缀样式
- 支持单条选中联动图表展示

示例代码

```jsx
import { Table, Tooltip } from 'antd';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import './extension.less';

// 固定前10种颜色
const colorPalette = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#2f4554',
];

// 大于10条数据后随机颜色。
function getColor(index) {
  if (index < colorPalette.length) {
    return colorPalette[index];
  }
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
  );
}

// todo：宽高有默认值，可自定义传入
function EChartsComponent({ options, setOptions }) {
  const observerRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(options);
    //todo：使用 ResizeObserver 监听当前图表页面内容区的尺寸变化，并调用 resize 方法重新渲染图表
    observerRef.current = new ResizeObserver(() => {
      chartInstance.resize();
    });
    observerRef.current.observe(chartRef.current);
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      chartInstance.dispose();
    };
  }, [options]);

  const handleLabelClick = (i, record) => {
    if (!chartRef.current) return;
    let newOptions = JSON.parse(JSON.stringify(options));
    if (record.activeStatus === false) {
      newOptions.legendList.filter((item) => {
        item.activeStatus = undefined;
      });
      newOptions.series = newOptions.legendList;
    } else {
      let showSeries = [];
      newOptions.legendList.filter((item) => {
        if (item.name === record.name) {
          item.activeStatus = false;
          showSeries.push(item);
        } else {
          item.activeStatus = true;
        }
        return item;
      });
      newOptions.series = showSeries;
    }
    setOptions(newOptions);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      ellipsis: true,
      width: '60%',
      render: (text, record, index) => {
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleLabelClick(index, record)}
          >
            <Tooltip title={record.name}>
              <span
                className={options.TableLegendLabelType || 'circle'}
                style={{
                  backgroundColor:
                    options.TableLegendLabelType === 'ring'
                      ? '#fff'
                      : record.itemStyle.color,
                  boxShadow:
                    options.TableLegendLabelType === 'ring'
                      ? `0 0 0 2px ${record.itemStyle.color} inset`
                      : 'none',
                  opacity: !record.activeStatus ? 1 : 0.3,
                }}
              ></span>
              <span
                style={{
                  opacity: !record.activeStatus ? 1 : 0.3,
                }}
              >
                {record.name}
              </span>
            </Tooltip>
          </span>
        );
      },
    },
    {
      title: 'min',
      dataIndex: 'min',
      width: '10%',
      sorter: (a, b) => {
        return a.min - b.min;
      },
      render: (text, record, index) => {
        return (
          <span
            style={{
              opacity: !record.activeStatus ? 1 : 0.3,
            }}
          >
            {record.min}
          </span>
        );
      },
    },
    {
      title: 'max',
      dataIndex: 'max',
      width: '10%',
      sorter: (a, b) => {
        return a.max - b.max;
      },
      render: (text, record, index) => {
        return (
          <span
            style={{
              opacity: !record.activeStatus ? 1 : 0.3,
            }}
          >
            {record.max}
          </span>
        );
      },
    },
    {
      title: 'avg',
      dataIndex: 'avg',
      width: '10%',
      sorter: (a, b) => {
        return a.avg - b.avg;
      },
      render: (text, record, index) => {
        return (
          <span
            style={{
              opacity: !record.activeStatus ? 1 : 0.3,
            }}
          >
            {record.avg}
          </span>
        );
      },
    },
    {
      title: 'current',
      dataIndex: 'current',
      width: '10%',
      sorter: (a, b) => {
        return a.current - b.current;
      },
      render: (text, record, index) => {
        return (
          <span
            style={{
              opacity: !record.activeStatus ? 1 : 0.3,
            }}
          >
            {record.current}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div
        ref={chartRef}
        className="INFRAUITEMPLATE"
        style={options?.eleStyle}
      ></div>
      {options.isShowTableLegend && (
        <Table
          columns={columns}
          className="table-legend"
          dataSource={options.legendList}
          showSorterTooltip={{ target: 'sorter-icon' }}
          scroll={{ y: 60 }}
          pagination={false}
          size="small"
        />
      )}
    </div>
  );
}

const dataList = [
  {
    name: 'a',
    data: [10, 20, 30, 40],
  },
  { name: 'b', data: [20, 30, 10, 20] },
  { name: 'c', data: [20, 30, 10, 20] },
  { name: 'd', data: [20, 30, 10, 20] },
  { name: 'e', data: [20, 30, 10, 20] },
  { name: 'f', data: [20, 30, 10, 20] },
  { name: 'g', data: [20, 30, 10, 20] },
  { name: 'h', data: [20, 30, 10, 20] },
  { name: 'i', data: [20, 30, 10, 20] },
  { name: 'j', data: [20, 30, 10, 20] },
  { name: 'k', data: [20, 30, 10, 20] },
  { name: 'l', data: [20, 30, 10, 20] },
  { name: 'm', data: [20, 30, 10, 20] },
  {
    name: 'n',
    data: [20, 30, 10, 20],
  },
];

// 动态数据,根据实际业务需求修改,min,max,avg,current
const series = dataList.map((item, i) => ({
  name: item.name,
  type: 'bar',
  stack: 'total',
  data: item.data,
  itemStyle: {
    color: getColor(i),
  },
  min: item.data[0],
  max: item.data[1],
  avg: item.data[1],
  current: item.data[1],
}));

export default function BaseEcharts() {
  const [options, setOptions] = useState({
    title: { text: '柱状图' },
    tooltip: {},
    xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025'] },
    yAxis: { type: 'value' },
    series: series, // 表格联动展示过滤展示数据
    legendList: series, // 表格图例元数据源
    eleStyle: { width: '100%', height: '400px' },
    isShowTableLegend: true, // 配置是否展示表格图例扩展样式
    TableLegendLabelType: 'ring', // 表格名称前缀图例扩展样式类型 circle: 圆形 ring: 环形
  });
  return <EChartsComponent options={options} setOptions={setOptions} />;
}

```