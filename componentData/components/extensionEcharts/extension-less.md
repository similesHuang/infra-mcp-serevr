//extension-less

样式文件: `./extension.less`

```less
.common-style() {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
}

.circle {
  .common-style();
}
.ring {
  .common-style();
}
.table-legend {
  .ant-table-tbody tr td {
    border-bottom: none;
  }
  .ant-table-thead tr th{
    border-bottom: none;
    background: none;
    border-right: none;
  }
  .ant-table-thead tr th::before{
    height: 0!important;
  }
}

```
