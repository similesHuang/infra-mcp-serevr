# 欢迎首页

示例代码

```jsx
import {
  BankTwoTone,
  DatabaseTwoTone,
  FundTwoTone,
  SlidersTwoTone,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useState } from 'react';
import { Link, history } from 'umi';
import BlockCalendar from './components/blockCalendar';
import styles from './index.less';

const { Paragraph } = Typography;

export default function HomePage() {
  const [show, setShow] = useState(true); // 展示介绍
  // TODO: 步骤数据
  const stepList = [
    {
      title: '平台接入',
      desc: '负责具体承接变更执行流程的平台',
      url: '/platform',
    },
    {
      title: '场景注册',
      desc: '用来描述某变更平台提供的自动化和非自动化变更操作',
    },
    {
      title: '检查项编排',
      desc: '具体的校验执行规则，基于具体的防御场景来配置',
    },
    {
      title: '变更单测试',
      desc: '通过触发一条具体的变更执行单，观察防御规则生效情况',
    },
  ];
  // TODO: 快捷入口
  const list = [
    {
      name: '平台接入',
      icon: <FundTwoTone />,
      url: '/platform',
      type: 1,
    },
    {
      name: '变更订阅',
      icon: <DatabaseTwoTone />,
      url: 'subscribe',
      type: 1,
    },
    {
      name: '业务风控',
      icon: <BankTwoTone />,
      url: 'block',
      type: 1,
    },
    {
      name: '分析定位',
      icon: <SlidersTwoTone />,
      url: 'http://cloud.bilibili.co/alchemy-v2/fulllink#sh/sh001/prod',
      type: 2,
    },
  ];
  // TODO: 帮助与实践
  const helpList = [
    {
      name: '变更管控ChangePilot整体概述',
      url: 'https://info.bilibili.co/pages/viewpage.action?pageId=75580434',
    },
    {
      name: '各类变更平台如何接入？',
      url: 'https://info.bilibili.co/pages/viewpage.action?pageId=645594110#id-%E5%8F%98%E6%9B%B4%E7%AE%A1%E6%8E%A7-%E9%9D%A2%E5%90%91%E5%90%84%E7%B1%BB%E5%8F%98%E6%9B%B4%E5%B9%B3%E5%8F%B0',
    },
    {
      name: '各个业务如何利用变更平台进行风险管控？',
      url: 'https://info.bilibili.co/pages/viewpage.action?pageId=645594110#id-%E5%8F%98%E6%9B%B4%E7%AE%A1%E6%8E%A7-%E9%9D%A2%E5%90%91%E6%9C%80%E7%BB%88%E4%B8%9A%E5%8A%A1%E6%96%B9',
    },
  ];

  const handleJump = (type, url) => {
    if (type === 1) {
      history.push(url);
    } else {
      window.open(url);
    }
  };

  return (
    <div class="INFRAUITEMPLATE">
      <div className={styles.intro}>
        {/* TODO */}
        <div className={styles.title}>欢迎来到Cloud平台</div>
        <div className={styles.tip}>xxx 的统一平台</div>
        <Button
          className={styles.btn}
          icon={<UpOutlined rotate={show ? null : 180} />}
          shape="round"
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? '收起' : '展开'}
        </Button>
        {show && (
          <div className={styles.steps}>
            {stepList.map((item, index) => {
              return (
                <div className={styles.step} key={index}>
                  <div className={styles.title}>
                    {item.url ? (
                      <Link
                        style={{
                          color: '#000',
                          cursor: item.url ? 'pointer' : 'auto',
                        }}
                        to={item.url}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                    <span>step{index + 1}</span>
                  </div>
                  <Paragraph ellipsis={{ rows: 3 }} className={styles.tip}>
                    {item.desc}
                  </Paragraph>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.overview}>
        <div className="flex-1 mr-[20px]">
          <div className={styles.inlet}>
            <div className={styles.title}>快捷入口</div>
            <div className={styles.content}>
              {list.map((item, index) => {
                return (
                  <div
                    className={styles.item}
                    key={index}
                    onClick={() => {
                      handleJump(item.type, item.url);
                    }}
                  >
                    <span class="text-[24px]">{item.icon}</span>
                    <div className={styles.name}>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.control}>
            <div className={styles.title}>
              其他数据
              <span className={styles.time}>数据统计更新于：2025-06-06</span>
            </div>
          </div>
        </div>
        <div className="w-[310px]">
          <BlockCalendar />
          <div className={styles.helpPractice}>
            <div className={styles.title}>
              <span>帮助与实践</span>
              {/* TODO */}
              <a
                href="https://info.bilibili.co/pages/viewpage.action?pageId=746028658"
                target="_blank"
                rel="noreferrer"
              >
                查看更多
              </a>
            </div>
            <div className={styles.content}>
              {helpList?.map((item) => {
                return (
                  <div>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```
