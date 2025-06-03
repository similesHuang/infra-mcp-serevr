- <code>安装 react-resizable-panels 包</code>

# 横向布局

示例代码

```tsx
import { EllipsisOutlined } from '@ant-design/icons';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { panel, resizeHandleOuter } from './dragTailwindcss';

export default function HorizontalDrag() {
  return (
    <div className="INFRAUITEMPLATE">
      <PanelGroup
        className="w-full bg-[#F4F7FB]"
        autoSaveId="example"
        direction="horizontal"
      >
        <Panel className={panel} collapsible={true} defaultSize={50} order={1}>
          {/* 内容可修改 */}
          <div>左布局内容</div>
        </Panel>
        <PanelResizeHandle className={resizeHandleOuter}>
          <EllipsisOutlined className="absolute rotate-90" />
        </PanelResizeHandle>
        <Panel className={panel} collapsible={true} order={2} defaultSize={50}>
          {/* 内容可修改 */}
          <div>右布局内容</div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

```

# 纵向布局

示例代码

```tsx
import { EllipsisOutlined } from '@ant-design/icons';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { panel, resizeHandleOuter } from './dragTailwindcss';

export default function VerticalDrag() {
  return (
    <div className="INFRAUITEMPLATE">
      <PanelGroup
        className="bg-[#F4F7FB]"
        autoSaveId="example"
        direction="vertical"
        style={{ height: '300px' }}
      >
        <Panel className={panel} collapsible={true} defaultSize={50} order={1}>
          {/* 内容可修改 */}
          <div>上布局内容</div>
        </Panel>
        <PanelResizeHandle className={resizeHandleOuter}>
          <EllipsisOutlined className="absolute" />
        </PanelResizeHandle>
        <Panel className={panel} collapsible={true} order={2} defaultSize={50}>
          {/* 内容可修改 */}
          <div>下布局内容</div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

```
