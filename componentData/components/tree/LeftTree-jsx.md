//LeftTree-jsx

源文件: `./components/LeftTree`

```jsx
import { useEffect, useState } from 'react';
import { Tree, Input, Spin } from 'antd';
import { SearchOutlined, CaretDownOutlined, AppstoreOutlined, HeatMapOutlined, RadarChartOutlined, } from '@ant-design/icons';
import { findTreeDataConcat } from '@bilibili/infra-utils';
const { DirectoryTree } = Tree;

let timeId = null;

// 自定义不同等级节点的图标
const treeIconOptions = {
  2: <HeatMapOutlined style={{ color: "blue" }} />,
  3: <RadarChartOutlined style={{ color: "purple" }} />,
  4: <AppstoreOutlined style={{ color: 'hotpink' }} />,
};
function LeftTree(props) {
  const { treeData, selectedKey, expandedKey } = props;
  const [loading, setLoading] = useState(false);
  const [filterTreeData, setFilterTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [leftTreeHeight, setLeftTreeHeight] = useState(window.innerHeight - 160); // 设置树组件虚拟高度，根据实际需求调整

  useEffect(() => {
    // 设置tree组件虚拟高度
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    setFilterTreeData(treeData);
  }, [treeData]);

  useEffect(() => {
    setSelectedKeys(selectedKey);
  }, [selectedKey]);

  useEffect(() => {
    setExpandedKeys(expandedKey);
  }, [expandedKey]);

  function handleResize() {
    setLeftTreeHeight(window.innerHeight - 160);
  }

  function onExpand(expandedKeys) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }

  function onSelect(keys, info) {
    setSelectedKeys(keys);
    props.onSelect(keys, info);
  }

  function onInputChange(e) {
    const { value } = e.target;
    searchTree(value)
  }
  // 搜索树
  function searchTree(searchValue) {
    if (timeId) {
      clearTimeout(timeId);
    }
    setLoading(true);
    timeId = setTimeout(() => {
      if (searchValue?.trim()) {
        let filterData = filterTree(searchValue?.trim(), JSON.parse(JSON.stringify(treeData)));
        if (filterData.resultTree) {
          setFilterTreeData([...filterData.resultTree]);
        }
        setExpandedKeys(filterData.expandKeys);
        setAutoExpandParent(true);
      } else {
        setFilterTreeData(treeData)
        const keys = findTreeDataConcat(selectedKeys, 'key', treeData);
        setExpandedKeys(keys[0])
      }
      setLoading(false);
    }, 400);
  }

  // 过滤tree数据
  const filterTree = (searchVal, treeData) => {
    let _expandKeys_ = [];
    function queryLoop(val, treeArr, resultData = []) {
      if (!(treeArr instanceof Array && treeArr.length && val)) {
        return treeArr;
      }
      for (let item of treeArr) {
        if (item.title.indexOf(val) > -1) {
          if (item.children && item.children.length) {
            _expandKeys_.push(item.key);
            let node = {
              ...item,
              children: queryLoop(val, item.children)
            };
            resultData.push(node);
          } else {
            resultData.push(item);
          }
          continue;
        }
        if (item.children && item.children.length) {
          let subArr = queryLoop(val, item.children);
          if (subArr && subArr.length) {
            _expandKeys_.push(item.key);
            let node = {
              ...item,
              children: subArr
            };
            resultData.push(node);
          }
        }
      }
      return resultData;
    }
    return {
      expandKeys: _expandKeys_,
      resultTree: queryLoop(searchVal, treeData),
    }
  }

  const loop = data => {
    return data?.map(item => {
      if (item.children) {
        return {
          ...item,
          icon: treeIconOptions[item.node_type],
          children: loop(item.children),
        };
      }
      return {
        ...item,
        icon: treeIconOptions[item.node_type],
      };
    });
  };

  return (
    <>
      <Input
        placeholder='请输入'
        prefix={<SearchOutlined />}
        onChange={onInputChange}
        style={{ marginBottom: '10px' }}
      />
      <Spin spinning={loading} tip="Loading...">
        <DirectoryTree
          blockNode
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          showLine={{ showLeafIcon: false }}
          switcherIcon={<CaretDownOutlined />}
          height={leftTreeHeight || 600}
          onSelect={onSelect}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          treeData={loop(filterTreeData)}
        />
      </Spin>
    </>
  );
}

export default LeftTree

```
