// 工号管理列表

import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import dot from 'dot-prop';
import is from 'is_js';

import { authorize, session } from '../../../application';
import { CoreContent } from '../../../components/core';
import _ from 'lodash';
import { transformNum } from './utils';
import { numberType } from './define';
import { Position } from '../../../application/define';
import Operate from '../../../application/define/operate';

import Search from './IndexSearch';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: dot.get(props, 'employee.gainDeliveryKnightList.data', []),       // 列表数据
      total: dot.get(props, 'employee.gainDeliveryKnightList._meta.result_count', 0),     // 总数
      searchValue: {                             // 保存搜索数据
        account_id: authorize.account.id,
        limit: 30,
        page: 1,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'employee.gainDeliveryKnightList.data', []),
      total: dot.get(nextProps, 'employee.gainDeliveryKnightList._meta.result_count', 0),
    });
  }

  // 去编辑页
  goEdit = (id, platFormCode, citySpelling, platFormName, cityName) => {
    this.props.dispatch({ type: 'employee/deliveryGoEditE', payload: id });
    // 去编辑页，将搜索状态保存，防止编辑页刷新，数据丢失
    session.set('employee.delivery.build.create', {
      platform_code: platFormCode,
      city_spelling: citySpelling,
      platform_name: platFormName,
      city_name: cityName,
    });
    // 获取运力工号平台城市
    this.props.dispatch({ type: 'employee/getDeliveryCityR',
      payload: {
        platform_code: platFormCode,
        city_spelling: citySpelling,
        platform_name: platFormName,
        city_name: cityName,
      } });
  }

  // 去详情页
  goDetail = (id) => {
    this.props.dispatch({ type: 'employee/deliveryGoDetailE', payload: id });
  }

  // 启用/停用
  goStop = (id) => {
    this.props.dispatch({ type: 'employee/deliveryGoStopE', payload: id });
  }

  // 换页
  tableChange = (page, size) => {
    // 复制数据方式不小心篡改
    const value = _.cloneDeep(this.state.searchValue);
    value.page = parseFloat(page);
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/gainDeliveryKnightE',
      payload: value,
    });
  }

  // 搜索
  searchHandle = (values) => {
    // 复制数据方式不小心篡改
    const value = _.cloneDeep(values);
    value.account_id = authorize.account.id;
    value.limit = 30;
    value.page = 1;
    // ant design多选组件，多选清除之后可能是空数组,再次过滤
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
      value.biz_district_id_list = value.district;
      delete value.district;
    }
    // 判断运力工号骑士是否为空
    if (is.not.existy(value.transport_state_list) || is.empty(value.transport_state_list) || is.not.array(value.transport_state_list)) {
      delete value.transport_state_list;
    } else {
      value.transport_state_list = value.transport_state_list.map((item) => { return parseFloat(item); });
    }
    // 判断运力工号类型是否为空
    if (is.not.existy(value.transport_type_list) || is.empty(value.transport_type_list) || is.not.array(value.transport_type_list)) {
      delete value.transport_type_list;
    } else {
      value.transport_type_list = value.transport_type_list.map((item) => { return parseFloat(item); });
    }
    // 判断职位列表是否为空
    if (is.not.existy(value.position_id_list) || is.empty(value.position_id_list) || is.not.array(value.position_id_list)) {
      delete value.position_id_list;
    } else {
      value.position_id_list = value.position_id_list.map((item) => { return parseFloat(item); });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/gainDeliveryKnightE',
      payload: value,
    });
    this.setState({
      searchValue: value,
    });
  }

  // 渲染搜索功能
  renderSearch = () => {
    return (
      <Search searchHandle={this.searchHandle} />
    );
  };

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
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => { return <span>{authorize.poistionNameById(text)}</span>; },
    },
    {
      title: '运力状态',
      dataIndex: 'transport_state',
      key: 'transport_state',
      render: text => (<span>{transformNum(text)}</span>),
    }, {
      title: '工号种类',
      dataIndex: 'transport_type',
      key: 'transport_type',
      render: (text) => {
        return <span>{transformNum(text)}</span>;
      },
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        if (record.transport_type === numberType.capacityNumber) {    // 运力工号
          return (
            <div>
              <a style={{ marginRight: '20px' }} onClick={() => this.goDetail(record._id)}>查看详情</a>
              {/* 判断是否有启用运力工号的权限 */}
              {Operate.canOperateEmployeeDeliveryStartButton() ? <div>
                <a style={{ marginRight: '20px' }} onClick={() => this.goEdit(record._id, record.platform_code, record.city_spelling, record.platform_name, record.city_name)}>编辑</a>
                <Popconfirm title="是否停用该运力工号?" onConfirm={() => this.goStop(record._id)} okText="确认" cancelText="取消">
                  <a>停用</a>
                </Popconfirm></div> : ''}
            </div>
          );
        } else if (record.transport_type === numberType.runNumber) {   // 替跑工号
          return <div>{null}</div>;
        } else if (record.transport_type === numberType.normalNumber && Operate.canOperateEmployeeDeliveryStartButton()) {   // 正常工号
          return (
            <div>
              <Popconfirm title="是否启用该骑士成为运力工号?" onConfirm={() => this.goStop(record._id)} okText="确认" cancelText="取消">
                <a>启用</a>
              </Popconfirm>
            </div>
          );
        } else {
          return <div>{null}</div>;
        }
      },
    }];
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="账号列表">
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
      </div>);
  }
}

const mapStateToProps = ({ employee }) => {
  return { employee };
};

export default connect(mapStateToProps)(Index);
