// 工号管理详情页

import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import moment from 'moment';
import dot from 'dot-prop';

import { authorize } from '../../../application';
import { CoreContent } from '../../../components/core';
import _ from 'lodash';

import Search from './Search';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: dot.get(props, 'employee.deliveryDetailList.result', []),          // 列表数据
      searchInfo: {                                                          // 暂存搜索结果
        account_id: authorize.account.id,
        limit: 30,
        page: 1,
      },
      total: dot.get(props, 'employee.deliveryDetailList.meta.result_count', 0), // 数据总数
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'employee.deliveryDetailList.result', []),
      total: dot.get(nextProps, 'employee.deliveryDetailList.meta.result_count', 0),
    });
  }

  // 换页
  tableChange = (page) => {
    // 换页，取一下搜索框内的值
    const value = _.cloneDeep(this.state.searchInfo);
    value.page = parseFloat(page);
    const { dispatch } = this.props;
    dispatch({ type: 'system/getHandleErrStaffE', payload: value });
  }

  // 搜索
  searchHandle = (values) => {
    // 防止无意中更改原数组，进行了深刻龙
    const value = _.cloneDeep(values);
    value.account_id = authorize.account.id;
    if (values.dateRange) {
      const startDate = value.dateRange[0] ? moment(value.dateRange[0]).format('YYYY-MM-DD') : '';
      const endDate = value.dateRange[1] ? moment(value.dateRange[1]).format('YYYY-MM-DD') : '';
      value.ascription_date = `${startDate}~${endDate}`;
      delete value.dateRange;
    }
    for (const key in value) {
      if (value[key] == null || value[key] === '' || value[key] === '~') {
        delete value[key];
      }
    }
   // 判断平台是否为空
    if (Array.isArray(value.platform) && value.platform.length === 0) {
      delete value.platform;
    } else {
      value.platform_code_list = value.platform;
      delete value.platform;
    }
    // 判断城市是否为空
    if (Array.isArray(value.city) && value.city.length === 0) {
      delete value.city;
    } else {
      value.city_spelling_list = value.city;
      delete value.city;
    }
    // 判断商圈是否为空
    if (Array.isArray(value.district) && value.district.length === 0) {
      delete value.district;
    } else {
      value.biz_district_list = value.district;
      delete value.district;
    }
    // 获取location上到staff_id
    value.transport_staff_id = window.location.hash.split('=')[1];
    value.page = 1;
    value.limit = 30;
    this.props.dispatch({
      type: 'employee/deliveryDetailE',
      payload: value,
    });
    this.setState({
      searchInfo: value,
    });
  }

  // 渲染搜索功能
  renderSearch = () => {
    // 详情页时间不可选因此需要判断
    return (
      <Search searchHandle={this.searchHandle} isDetail />
    );
  };

  // 返回列表页
  goback = () => {
    window.location.href = '/#/Employee/Delivery';
  }

  // 渲染列表
  renderContent = () => {
    const { list } = this.state;
    const dataSource = list;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
    },
    {
      title: '开始时间',
      dataIndex: 'start_date',
      key: 'start_date',
    }, {
      title: '结束时间',
      dataIndex: 'end_date',
      key: 'end_date',
    }];
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="列表">
        <Table
          rowKey={record => record._id} dataSource={dataSource} columns={columns}
          pagination={{
            defaultPageSize: 30,
            onChange: this.tableChange,
            total: this.state.total,
            showQuickJumper: true,
          }}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        { renderSearch() }
        { renderContent() }
        <Button style={{ display: 'block', margin: '0 auto' }} onClick={this.goback} type="primary">返回</Button>
      </div>);
  }
}

const mapStateToProps = ({ employee }) => {
  return { employee };
};

export default connect(mapStateToProps)(Index);
