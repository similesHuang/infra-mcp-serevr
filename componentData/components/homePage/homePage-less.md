//homePage-less

样式文件: `../index.less`

```less
a {
  text-decoration: none;
  color: #1890ff;
}
// 概览
.overview {
  padding: 16px;
  display: flex;
  background-color: #fff;
  border-radius: 6px;
  .title {
    position: relative;
    margin-bottom: 10px;
    font-weight: 500;
    color: #000;
    .time {
      margin-left: 10px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
    .tip {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
// 简介
.intro {
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
  background: linear-gradient(270deg, #dff6ff 0%, #c8e5ff 100%);
  border-radius: 6px;
  .title {
    font-size: 22px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .tip {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
  .btn {
    position: absolute;
    top: 24px;
    right: 24px;
    color: rgba(0, 0, 0, 0.45);
    background: rgba(0, 0, 0, 0.04);
    border: none;
  }
  .steps {
    margin-left: -20px;
    display: flex;
    .step {
      box-sizing: border-box;
      margin: 10px 20px 0;
      padding: 16px;
      position: relative;
      flex: 1;
      height: 100px;
      background-color: #fff;
      &:nth-of-type(n + 2)::before {
        content: '';
        width: 0;
        height: 0;
        border-bottom: 20px solid transparent;
        border-left: 50px solid #fff;
        border-right: 50px solid #fff;
        transform: rotate(90deg);
        position: absolute;
        top: 40px;
        left: -60px;
      }
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-top: 50px solid transparent;
        border-bottom: 50px solid transparent;
        border-left: 20px solid #fff;
        position: absolute;
        top: 0;
        right: -20px;
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        span {
          font-style: italic;
          color: rgba(24, 144, 255, 0.3);
        }
      }
      .tip {
        margin-bottom: 5px;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px !important;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
// 快捷入口
.inlet {
  margin-bottom: 16px;
  .content {
    padding: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .item {
      cursor: pointer;
      text-align: center;
      .name {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
// 管控数据
.control {
  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    a {
      font-size: 20px !important;
    }
    .item {
      min-width: 400px;
      display: flex;
      margin-bottom: 16px;
      width: calc(50% - 8px);
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #d9d9d9;
      &:nth-of-type(2n + 1) {
        margin-right: 16px;
      }
      .left_con {
        padding: 16px 0;
        flex: 1;
        text-align: center;
        background: #f6fcff linear-gradient(270deg, #dff6ff 0%, #c8e5ff 100%);
        opacity: 0.8;
        .name {
          font-weight: 500;
        }
        .total {
          margin: 5px 0;
          display: flex;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: #000000;
        }
        .desc {
          font-size: 12px;
        }
      }
      .rigth_con {
        padding: 0 20px;
        flex: 1.5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .data {
          margin: 5px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          .index {
            width: 100px;
          }
          .count {
            width: 100px;
            text-align: center;
            background-color: #f3fbff;
          }
        }
      }
    }
  }
}
// 封网计划
.blockCalendar {
  margin-bottom: 16px;
  .content {
    padding: 1px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    :global {
      .ant-picker-calendar-header {
        justify-content: start;
      }
      .ant-radio-group {
        display: none;
      }
    }
    .legend {
      :global .ant-badge {
        margin: 10px 19px;
      }
    }
    :global .ant-picker-calendar-date-content {
      position: absolute;
      top: 0;
      left: 0;
      .ant-badge {
        width: 24px;
        height: 32px;
        .ant-badge-status-dot {
          top: 12px;
          right: 3px;
        }
      }
    }
  }
  :global .ant-picker-cell-inner {
    height: 32px !important;
  }
}
// 帮助与实践
.helpPractice {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      font-size: 12px;
    }
  }
  .content {
    font-size: 12px;
    padding: 10px 20px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    a {
      color: #000;
      line-height: 30px;
      &:hover {
        color: #1890ff !important;
      }
    }
  }
}

```
