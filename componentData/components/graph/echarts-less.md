//echarts-less

样式文件: `./index.less`

```less
.graphContainer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .graphItem {
    position: relative;
    border: 1px solid #ccc;
  }
  .sliceIcon {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 999;
    cursor: pointer;
  }
}

```
