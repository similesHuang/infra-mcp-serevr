//blockCalendar-jsx

源文件: `./components/blockCalendar`

```jsx
import { Badge, Calendar, Divider, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useState } from 'react';
import styles from '../index.less';
dayjs.locale('zh-cn');

export default function BlockCalendar() {
  const [loading, setLoading] = useState(false); // loading效果
  const [dateList, setDateList] = useState({}); // 封网计划数据
  const [month, setMonth] = useState(+dayjs().format('M')); // 当前月份
  // 进入页面调取接口
  useEffect(() => {
    const elements = document.querySelectorAll('*[title]');
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('title');
    }
    getBlockCalendar();
  }, []);
  // 获取变更搜索列表
  const getBlockCalendar = async (replace) => {
    setLoading(true);
    const params = {
      date: dayjs().format('YYYYMM'),
      ...replace,
    };
    const { default: res } = await import('../mock/mock');
    console.log(res);
    if (res.code === 0) {
      setDateList(res.data);
    }
    setLoading(false);
  };
  // 切换日期
  const onChangeDate = (date) => {
    const params = {
      date: dayjs(date).format('YYYYMM'),
    };
    setMonth(+dayjs(date).format('M'));
    getBlockCalendar(params);
  };
  // 渲染内容
  const dateCellRender = (value) => {
    if (value.month() === month - 1) {
      const num1 = dateList?.all_day
        ?.map((item) => item.day)
        .indexOf(value.date());
      const num2 = dateList?.half_day
        ?.map((item) => item.day)
        .indexOf(value.date());
      if (num1 >= 0) {
        return (
          <Tooltip placement="left" title={dateList.all_day[num1].desc}>
            <Badge status="error" />
          </Tooltip>
        );
      } else if (num2 >= 0) {
        return (
          <Tooltip placement="left" title={dateList.half_day[num2].desc}>
            <Badge status="warning" />
          </Tooltip>
        );
      }
    }
  };
  // 页面
  return (
    <div className={`${styles.blockCalendar} INFRAUITEMPLATE`}>
      <div className={styles.title}>封网计划</div>
      <Spin spinning={loading}>
        <div className={styles.content}>
          <Calendar
            fullscreen={false}
            onPanelChange={onChangeDate}
            // dateCellRender={dateCellRender}
            cellRender={dateCellRender}
          />
          <Divider style={{ margin: '0' }} />
          <div className={styles.legend}>
            <Badge
              status="error"
              text={`全天封网：${
                dateList?.all_day?.length
                  ? dateList?.all_day?.length + ' 天'
                  : '-'
              }`}
            />
            <Badge
              status="warning"
              text={`非全天封网：${
                dateList?.half_day?.length
                  ? dateList?.half_day?.length + ' 天'
                  : '-'
              }`}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}

```
