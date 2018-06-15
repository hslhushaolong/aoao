
/**
 * 大查询 table
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Pagination, Row, Col } from 'antd';

import { CoreContent } from '../../components/core/index';
import { renderReplaceAmount } from '../../application/define';

class InquireTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,                // 当前页
      limit: props.limit,              // 每页显示条数
      columns: [],            // 表头
      averageListSource: [],  // table 单均数据
      totalListSource: [],    // table 总量数据
    };
    this.private = {
      getPageParams: props.getPageParams,
      tableWidth: 2000,
      tableHieght: 500,
    };
  }

  // props初始化不建议放在 constructor中
  componentWillMount = () => {
    const { count, dateData, orderData, totalData, tabelHeader, averageList, totalList } = this.props.inquireModel;
    this.setState({
      count,
      dateData,
      orderData,
      totalData,
      tabelHeader,
      averageList,
      totalList,
    });
  }
  // update
  componentWillReceiveProps = (nextProps) => {
    const { page, limit } = nextProps;
    const { count, dateData, orderData, totalData, tabelHeader, averageList, totalList } = nextProps.inquireModel;
    // 根据返回数据动态渲染表头 columns: nextProps.table_head
    this.setState({
      count,
      dateData,
      orderData,
      totalData,
      tabelHeader,
      averageList,
      totalList,
      page,
      limit,
    });
    if (tabelHeader && tabelHeader.length >= 0) {
      // update tab columns
      this.createTableColums(tabelHeader, averageList, totalList);
    }
  }

  // 分页函数
  onChangePage = (page) => {
    const { getPageParams } = this.private;
    const { limit } = this.state;
    this.setState({ page }, () => {
      getPageParams(page, limit);
    });
  }
  // 支持修改pageSize
  onChangeLimit = (page, limit) => {
    const { getPageParams } = this.private;
    this.setState({ page, limit }, () => {
      getPageParams(page, limit);
    });
  }
  // 构造动态表头函数
  createTableColums = (tabelHeader, averageList, totalList) => {
    const { page, limit } = this.state;
    const { tableWidth } = this.private;
    // 关联表头数据源-根据指标字典数据 用key关联columns中对应的值重新组合数据源
    // 构造动态表头函数
    const tableColums = [];
    tabelHeader.forEach((item, index) => {
      tableColums.push({
        title: item,
        dataIndex: index,
        key: ((page * limit) + index),
        // 固定第一列和最后一列
        fixed: index === 0 ? 'left' : false,
        width: tableWidth / (tabelHeader.length),
        render: (text) => {
          if ((item.indexOf('单') !== -1 || item.indexOf('元') !== -1) && item.indexOf('天') === -1 && item.indexOf('人') === -1) {
          // 将数字转为金额格式
            return renderReplaceAmount(text);
          }
          return text;
        },
      });
    });
    // 构造数据 - 单均
    const averageLists = [];
    averageList && averageList.forEach((items, index) => {
      const obj = {};
      items.forEach((item, i) => {
        obj[i] = item;
      });
      averageLists.push(obj);
    });
    // 构造数据 - 总量
    const totalLists = [];
    totalList && totalList.forEach((items, index) => {
      const obj = {};
      items.forEach((item, i) => {
        obj[i] = item;
      });
      totalLists.push(obj);
    });
    this.setState({
      columns: tableColums,
      averageListSource: averageLists,
      totalListSource: totalLists,
    });
  }

  // 日均数据展示-平铺数据
  renderDateData = () => {
    const { dateData } = this.state;
    return (
      <Row style={{ lineHeight: '30px', marginLeft: '20px' }}>
        {
          dateData && dateData.map((item, index) => {
            if (item.k.indexOf('单') !== -1 && item.k.indexOf('天') === -1 && item.k.indexOf('人') === -1) {
              // 将数字转为金额格式
              return <Col span={3} key={index}>{item.k} : {renderReplaceAmount(item.v)} </Col>;
            }
            return <Col span={3} key={index}>{item.k} : {item.v} </Col>;
          })
        }
      </Row>
    );
  }
  // 单均数据展示-
  renderOrdereData = () => {
    const { orderData } = this.state;
    return (
      <Row style={{ lineHeight: '25px', marginLeft: '20px' }}>
        {
          orderData && orderData.map((item, index) => {
            // 将数字转为金额格式
            return <Col span={3} key={index}>{item.k} : {renderReplaceAmount(item.v)} </Col>;
          })
        }
      </Row>
    );
  }
  // 总数数据展示-平铺数据
  renderTotalData = () => {
    const { totalData } = this.state;
    return (
      <Row style={{ lineHeight: '25px', marginLeft: '20px' }}>
        {
          totalData && totalData.map((item, index) => {
            if ((item.k.indexOf('单') !== -1 || item.k.indexOf('元') !== -1) && item.k.indexOf('天') === -1 && item.k.indexOf('人') === -1) {
              // 将数字转为金额格式
              return <Col span={3} key={index}>{item.k} : {renderReplaceAmount(item.v)} </Col>;
            }
            return <Col span={3} key={index}>{item.k} : {item.v} </Col>;
          })
        }
      </Row>
    );
  }
  // 渲染列表---平均
  renderAverageList = () => {
    const { renderDateData, renderOrdereData } = this;
    const { columns, averageListSource } = this.state;
    const { tableWidth, tableHieght } = this.private;

    return (
      <div>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }} title={'日均'}>
          {renderDateData()}
        </CoreContent>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }} title={'单均'}>
          {renderOrdereData()}
        </CoreContent>
        <Table scroll={{ x: tableWidth, y: tableHieght }} rowKey={(record, index) => { return ((index * 100) + 2); }} dataSource={averageListSource} columns={columns} pagination={false} bordered />
      </div>
    );
  }
  // 总数列表
  renderTotalList = () => {
    const { renderTotalData } = this;
    const { totalListSource, columns } = this.state;
    const { tableWidth, tableHieght } = this.private;

    return (
      <div>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }} title={'总量'}>
          {renderTotalData()}
        </CoreContent>
        <Table scroll={{ x: tableWidth, y: tableHieght }} rowKey={(record, index) => { return ((index * 10) + 1); }} dataSource={totalListSource} columns={columns} pagination={false} bordered />
      </div>
    );
  }
  // 渲染分页组件
  renderPagination = () => {
    const { onChangePage, onChangeLimit } = this;
    const { limit, count, page } = this.state;
    return (
      <div>
        <Pagination
          style={{ float: 'right' }}
          total={count}
          showTotal={total => `总共 ${total} 条`}
          pageSize={limit}
          defaultCurrent={1}
          current={page}
          onChange={onChangePage}
          onShowSizeChange={onChangeLimit}
          showQuickJumper
          showSizeChanger
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染平均列表 */}
        {this.renderAverageList()}
        {/* 渲染总数列表 */}
        {this.renderTotalList()}
        {/* 渲染分页控件 */}
        {this.renderPagination()}
      </div>
    );
  }
}
const mapStateToProps = ({ inquireModel }) => {
  return { inquireModel };
};
export default connect(mapStateToProps)(InquireTable);
