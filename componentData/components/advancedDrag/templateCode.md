- <code>安装 react-resizable-panels 包</code>

# 可改变布局

示例代码

```tsx
import {
  CheckOutlined,
  EllipsisOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { panel, resizeHandleOuter } from './dragTailwindcss';

const SplitScreenBtn = (props) => {
  const { isShowSplitScreen, onChangeSplitScreen, splitScreen } = props;

  const items = [
    { label: '上下分屏', key: 'upAndDown' }, // 菜单项务必填写 key
    { label: '左右分屏', key: 'about' },
    { label: '不分屏', key: 'no' },
  ];

  const content = (
    <div>
      {items.map((item) => {
        return (
          <p
            className="m-[0px] cursor-pointer p-[8px_0px] hover:bg-[#F4F7FB]"
            key={item.key}
            onClick={() => onChangeSplitScreen(item.key)}
          >
            <span className="w-[14px] inline-block mr-[5px]">
              {splitScreen.type === item.key && (
                <CheckOutlined style={{ color: '#1890ff' }} />
              )}
            </span>
            {item.label}
          </p>
        );
      })}
    </div>
  );
  return (
    isShowSplitScreen && (
      <Popover placement="leftBottom" content={content} trigger="click">
        <Button
          className="absolute bottom-[30px] right-[20px] rounded-[4px] z-1"
          icon={<LayoutOutlined />}
        />
      </Popover>
    )
  );
};

export default function AdvancedDrag() {
  const panelGroupRef = useRef<any>(null);
  const [isShowSplitScreen, setIsShowSplitScreen] = useState(false);
  const [splitScreen, setSplitScreen] = useState<{
    direction: 'vertical' | 'horizontal';
    type: 'upAndDown' | 'about' | 'no';
  }>({
    direction: 'vertical',
    type: 'upAndDown',
  });

  const handleMouseResultEnter = () => {
    setIsShowSplitScreen(true);
  };

  const handleMouseResultLeave = () => {
    setIsShowSplitScreen(false);
  };

  const onChangeSplitScreen = (e) => {
    panelGroupRef?.current?.setLayout([50, 50]);
    const direction = e !== 'about' ? 'vertical' : 'horizontal';
    setSplitScreen({
      direction,
      type: e,
    });
    // 进行其他操作，例如根据 e 的值执行不同的逻辑
  };

  return (
    <div className="INFRAUITEMPLATE">
      <PanelGroup
        className={`${
          splitScreen.type !== 'about' ? '' : 'w-full'
        }  bg-[#F4F7FB]`}
        autoSaveId="example"
        direction={splitScreen.direction}
        ref={panelGroupRef}
        style={
          splitScreen.type === 'no'
            ? { overflow: 'auto' }
            : splitScreen.type === 'upAndDown'
            ? { height: 300 }
            : {}
        } // 不分屏时，设置 overflow: auto
      >
        <Panel className={panel} collapsible={true} defaultSize={50} order={1}>
          {/* 内容可修改 */}
          <div>左布局内容</div>
        </Panel>
        {splitScreen.type !== 'no' && (
          <PanelResizeHandle className={resizeHandleOuter}>
            <EllipsisOutlined
              className={`absolute ${
                splitScreen.type === 'about' ? 'rotate-90' : ''
              }`}
            />
          </PanelResizeHandle>
        )}
        <Panel
          className={panel}
          style={
            splitScreen.type === 'no' ? { overflow: 'auto', flex: 'none' } : {}
          } // 不分屏时，设置 overflow: auto
          collapsible={true}
          order={2}
          defaultSize={50}
        >
          {/* 内容可修改 */}
          <div
            className="size-full relative"
            onMouseEnter={handleMouseResultEnter}
            onMouseLeave={handleMouseResultLeave}
          >
            <SplitScreenBtn
              isShowSplitScreen={isShowSplitScreen}
              onChangeSplitScreen={onChangeSplitScreen}
              splitScreen={splitScreen}
            />
            <span className="h-[100px] inline-block">右布局内容</span>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

```
