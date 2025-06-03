//BaseEcharts-jsx

源文件: `./BaseEcharts`

```jsx
import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

// todo：宽高有默认值，可自定义传入
export function EChartsComponent({ options }) {
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

  return (
    <div
      ref={chartRef}
      className="INFRAUITEMPLATE"
      style={options?.eleStyle}
    ></div>
  );
}

export default function BaseEcharts() {
  const options = {
    title: { text: '柱状图' },
    tooltip: {},
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30, 40] }],
    eleStyle: {
      width: '100%',
      height: '400px',
    },
  };
  return <EChartsComponent options={options} />;
}

```
