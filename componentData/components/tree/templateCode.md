# 左树右表页

- 支持搜索过滤
- 支持自定义ICON
- 路由记忆当前选中节点

示例代码

```jsx
import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { Empty, Spin } from 'antd';
import LeftTree from './components/LeftTree';
import DetailView from '../detail/Detail';
import qs from 'query-string';
import './index.less';
import { findTreeData, findTreeDataConcat } from '@bilibili/infra-utils';
export default function TreeDetail(props) {
  // Tips: umi/v2 请用 props
  // const { location, history } = props
  const location = useLocation();
  const { pathname, search } = location;
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState()
  const [selectedKey, setSelectedKey] = useState([]);
  const [expandedKey, setExpandedKey] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])
 

  // 初始化获取路由参数，修改相关树节点数据
  useEffect(() => {
    // umi/v2 用 location.query  
    // const queryParams = location.query  
    const queryParams = qs.parse(search);
    if (queryParams.path && treeData.length > 0) {
      const node = findTreeData(queryParams.path, 'key', treeData)
      const keys = findTreeDataConcat([queryParams.path], 'key', treeData);
      setSelectedNode(node)
      setSelectedKey([queryParams.path])
      setExpandedKey(keys[0])
    }
  }, [treeData])

  /**·
    * 异步加载数据的函数，模拟从服务器获取数据的过程。
    */
  const fetchData = async () => {
    setLoading(true);
    // TODO：替换真实接口
    const res = await import('./mock/mock.js');
    const data = res.default.data;
    setTreeData(data);
    setLoading(false);
  }

  // TODO 节点选中事件
  function onTreeSelect(keys, info) {
    let params = { path: keys[0], node_id: info.node.id, node_type: info.node.node_type, }
    const target = { pathname };
    // 兼容 umi/v2
    if (props?.history) {
      target.query = params;
    } else {
      target.search = qs.stringify(params);
    }
    setSelectedNode(info.node)
    history.replace(target);
  }

  return (
    <div className='INFRAUITEMPLATE'>
      <div className='tree-detail'>
        <div className='tree'>
          <Spin spinning={loading}>
            <LeftTree
              selectedKey={selectedKey}
              expandedKey={expandedKey}
              treeData={treeData}
              onSelect={onTreeSelect}
            />
          </Spin>
        </div>
        <div className='content'>
          {!selectedNode ?
            <Empty description='请选择左侧节点查看详情'></Empty>
            :
            <DetailView></DetailView>
          }
        </div>
      </div>
    </div>
  )
}

```
