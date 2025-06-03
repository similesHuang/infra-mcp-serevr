# 步骤表单

- Steps 配合 Form 场景的步骤表单
- 统一分发 refs 给每一个步骤表单，控制表单的数据收集
- 提交，回显统一由父组件控制，每个表单各自维护状态
- 步骤切换通过样式的切换面板，来展示对应的表单，防止切换丢失数据

示例代码

```jsx
import { Button, Card, Divider, Space, Steps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import StepsForm1 from '../components/StepsForm1';
import StepsForm2 from '../components/StepsForm2';
import StepsForm3 from '../components/StepsForm3';
import StepsForm4 from '../components/StepsForm4';

const StepsForm = () => {
  const [current, setCurrent] = useState(0);
  const formRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    getDefaultValues();
  }, []);

  /**
   * 获取默认表单值的异步函数
   * 该函数通过Promise实现，用于模拟异步操作，设置默认的表单值。
   * 主要用于在数据尚未准备好或需要模拟加载时间的场景下，提供一个默认的表单数据对象。
   * 根据实际业务场景选择使用
   */
  const getDefaultValues = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDefaultFormValues({
          name: 'test',
          ID: 'test',
          des: 'test',
          title: 'test',
          type: 'test',
          alias: 'test',
          app: 'test',
          org: 'test',
          bus: 'test',
        });
      });
    });
  };

  /**
   * 获取当前活跃的表单组件
   * 该函数通过switch语句根据当前的状态(current)来决定返回哪个表单组件的当前实例。
   * 它用于在多个表单之间切换或获取当前表单的状态时，提供了一个统一的访问点。
   */
  const getCurrentForm = () => {
    let currentForm;
    switch (current) {
      case 0:
        currentForm = formRefs[0].current;
        break;
      case 1:
        currentForm = formRefs[1].current;
        break;
      case 2:
        currentForm = formRefs[2].current;
        break;
      case 3:
        currentForm = formRefs[3].current;
        break;
      default:
        break;
    }
    return currentForm;
  };

  /**
   * 点击下一步按钮时执行的操作。
   * 该函数负责获取当前表单的数据，并验证这些数据的有效性。如果数据验证通过，
   * 则将当前步骤的索引增加1，以推进到下一个表单步骤。
   */
  const onNext = () => {
    const currentForm = getCurrentForm();
    currentForm.onValidateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const setDefaultFormValues = (data) => {
    formRefs[0].current.setFormValues(data);
  };

  const onSubmit = () => {
    const currentForm = getCurrentForm();
    currentForm.onValidateFields().then(() => {
      const form1values = formRefs[0].current.getFormValues();
      const form2values = formRefs[1].current.getFormValues();
      const form3values = formRefs[2].current.getFormValues();
      const form4values = formRefs[3].current.getFormValues();
    });
  };

  return (
    <Card className="INFRAUITEMPLATE">
      <Steps
        current={current}
        items={[
          {
            title: '步骤1',
          },
          {
            title: '步骤2',
          },
          {
            title: '步骤3',
          },
          {
            title: '步骤4',
          },
        ]}
      />
      <Divider />
      <div className="overflow-hidden">
        {/* 通过样式切换当前的表单，不销毁表单组件保留上一次填写的值 */}
        <div
          className="cl-step-formAll flex transition-all ease-linear duration-200 overflow-hidden"
          style={{
            transform: `translateX(-${25 * current}%)`,
          }}
        >
          <div className="h-full overflow-auto w-1/4">
            <StepsForm1 ref={formRefs[0]} />
          </div>
          <div className="h-full overflow-auto w-1/4">
            <StepsForm2 ref={formRefs[1]} />
          </div>
          <div className="h-full overflow-auto w-1/4">
            <StepsForm3 ref={formRefs[2]} />
          </div>
          <div className="h-full overflow-auto w-1/4">
            <StepsForm4 ref={formRefs[3]} />
          </div>
        </div>
      </div>
      <Divider />
      <Space className="float-right">
        {current !== 0 && current !== 4 ? (
          <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
        ) : null}
        {current === 3 ? (
          <Button type="primary" onClick={() => onSubmit()}>
            提交
          </Button>
        ) : (
          <Button type="primary" onClick={() => onNext()}>
            下一步
          </Button>
        )}
      </Space>
    </Card>
  );
};
export default StepsForm;

```
