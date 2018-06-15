/**
 * 工号管理编辑界面
 * @author Peng
 */

import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Button, Modal, Row, Col, DatePicker, message, Popconfirm } from 'antd';
import moment from 'moment';
import dot from 'dot-prop';
import is from 'is_js';
import { authorize } from '../../../application';
import { CoreContent } from '../../../components/core';
import _ from 'lodash';

import Search from './Search';
import BuildModal from './build';
import { exists } from './utils';

const { RangePicker } = DatePicker;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: dot.get(props, 'employee.deliveryDetailList.result', []),               // 列表数据
      date_list: dot.get(props, 'employee.deliveryDetailList.date_list', []),     // 时间段数组
      searchInfo: {                           // 暂存搜索信息
        account_id: authorize.account.id,
        limit: 30,
        page: 1,
      },                                       // 保存搜索数据

      buildVisible: false,                     // 新建弹窗
      editVisible: false,                      // 编辑窗口
      editId: '',                              // 记录编辑id
      editTime: '',                            // 记录编辑时间段
      timeRange: '',                           // 记录当前记录时间段
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'employee.deliveryDetailList.result', []),
      date_list: dot.get(nextProps, 'employee.deliveryDetailList.date_list', []),
    });
  }

  // 点击新建
  onBuildClick = () => {
    this.setState({
      buildVisible: true,
    });
  }

  // 关闭新建
  onBuildCancle = () => {
    this.setState({
      buildVisible: false,
    });
  }

 // 编辑
  onEdit = (id, start, end) => {
    this.setState({
      editVisible: true,
      editId: id,
      timeRange: [start, end],  // 替跑时间
    });
  }

  // 删除
  onDelete = (id) => {
    this.props.dispatch({ type: 'employee/deliveryEditE',
      payload: {
        account_id: authorize.account.id,
        _id: id,
        is_delete: 1,
        transport_staff_id: window.location.hash.split('=')[1], // 替跑骑士id
      } });
  }

  // 换页
  tableChange = (page, size) => {
    const value = _.cloneDeep(this.state.searchInfo);
    // 后台要int
    value.page = parseFloat(page);
    const { dispatch } = this.props;
    dispatch({ type: 'system/getHandleErrStaffE', payload: value });
  }

  // 编辑提交
  editHandleOk = () => {
    this.props.dispatch({ type: 'employee/deliveryEditE',
      payload: {
        account_id: authorize.account.id,
        _id: this.state.editId,
        ascription_date: this.state.editTime,
        transport_staff_id: window.location.hash.split('=')[1], // 运力工号骑士id
      } });

    this.setState({
      editVisible: false,
    });
  }

  // 编辑时间
  onRangeDate = (value) => {
    // 因为不能选择已选时间，所以先获得所有时间然后过滤
    let timeRange = this.state.date_list || [];
    const exceptTime = this.state.timeRange;
    // 因为不能选择已选时间，所以先获得所有时间然后过滤
    timeRange = timeRange.filter(item => (`${item[0]}-${item[1]}` !== `${exceptTime[0]}-${exceptTime[1]}`));
    const timeList = [];
    // 标示时间是否可选
    let flag = true;
    // 把所有的时间分别存放
    for (let i = 0; i < timeRange.length; i++) {
      const oneList = [];
      const startTimeDay = timeRange[i][0].split('-')[2]; // 二维时间数组
      const endTimeDay = timeRange[i][1].split('-')[2];   // 二维时间数组
      oneList.push(startTimeDay);
      oneList.push(endTimeDay);
      timeList.push(oneList);
    }

    if (exists(value)) {
      const startDate = moment(value[0]).format('YYYY-MM-DD').split('-')[2];
      const endDate = moment(value[1]).format('YYYY-MM-DD').split('-')[2];
      timeList.forEach((item) => {
        if (startDate < item[0] && endDate > item[1]) {
          flag = false;
        }
      });
      // 判断时间是否可选
      if (flag) {
        const time = `${moment(value[0]).format('YYYY-MM-DD')}~${moment(value[1]).format('YYYY-MM-DD')}`;
        this.setState({
          editTime: time,
          timeRange: value,
        });
      } else {
        message.warning('请选择正确时间段');
      }
    } else {
      message.warning('请选择正确时间段');
    }
  }

  // 编辑取消
  editOnCancle = () => {
    this.setState({
      editVisible: false,
      editTime: '',
    });
  }

  // 不可选日期
  disabledDate = (current) => {
    let timeRange = this.state.date_list || [];
    const exceptTime = this.state.timeRange;
    timeRange = timeRange.filter(item => (`${item[0]}-${item[1]}` !== `${exceptTime[0]}-${exceptTime[1]}`));

    // 如果不是当月则不能使用
    if (current.month() !== moment().month()) {
      return true;
    }

    // 如果替跑账号时段为空，则可以使用
    if (is.empty(timeRange)) {
      return false;
    }

    // 是否禁用
    let isDisable = false;
    timeRange.forEach((item) => {
      // 时间段的开始和结束
      const startDate = moment(item[0], 'YYYY-MM-DD');
      const endDate = moment(item[1], 'YYYY-MM-DD');

      // 判断是否在时间段之内，并且日期等于开始和结束，都设置为禁用
      if (current.isBetween(startDate, endDate, 'day') || current.isSame(startDate, 'day') || current.isSame(endDate, 'day')) {
        isDisable = true;
      }
    });
    return isDisable;
  }

  // 返回列表页
  goback = () => {
    window.location.href = '/#/Employee/Delivery';
  }

  // 搜索
  searchHandle = (values) => {
    // 深克隆搜索的参数
    // antd input组件删除会产生'',所以过滤
    const value = _.cloneDeep(values);
    value.account_id = authorize.account.id;
    // 后台时间要和在一起的字符串
    if (values.dateRange) {
      const startDate = value.dateRange[0] ? moment(value.dateRange[0]).format('YYYY-MM-DD') : '';
      const endDate = value.dateRange[1] ? moment(value.dateRange[1]).format('YYYY-MM-DD') : '';
      value.ascription_date = `${startDate}~${endDate}`;
      delete value.dateRange;
    }
    // 如果是空删除属性
    for (const key in value) {
      if (value[key] == null || value[key] === '' || value[key] === '~') {
        delete value[key];
      }
    }
   // 判断平台城市商圈是否为空
    if (Array.isArray(value.platform) && value.platform.length === 0) {
      delete value.platform;
    } else {
      value.platform_code_list = value.platform;
      delete value.platform;
    }
    // 判断是不是空数组
    if (Array.isArray(value.city) && value.city.length === 0) {
      delete value.city;
    } else {
      value.city_spelling_list = value.city;
      delete value.city;
    }
    // 判断是不是空数组
    if (Array.isArray(value.district) && value.district.length === 0) {
      delete value.district;
    } else {
      value.biz_district_list = value.district;
      delete value.district;
    }
    // 获得替跑骑士id
    value.transport_staff_id = window.location.hash.split('=')[1];
    // 编辑页获得详情，和详情页获得详情要给后端一个标志，就是这个
    value.is_modify = 1;
    this.props.dispatch({
      type: 'employee/deliveryDetailE',
      payload: value,
    });
  }

  // 渲染搜索功能
  renderSearch = () => {
    return (
      <Search searchHandle={this.searchHandle} />
    );
  };

// 渲染新建按钮
  renderBuild = () => {
    return (
      <div>
        <BuildModal visible={this.state.buildVisible} onCancle={this.onBuildCancle} />
        <Modal
          title="编辑"
          visible={this.state.editVisible}
          onOk={this.editHandleOk}
          onCancel={this.editOnCancle}
        >
          <Row>
            <Col span={6} style={{ textAlign: 'right' }}><span style={{ lineHeight: '28px', width: '100%', textAlign: 'right' }}>运力时间：</span></Col>
            <Col span={13}><RangePicker value={[moment(this.state.timeRange[0]), moment(this.state.timeRange[1])]} disabledDate={this.disabledDate} onChange={this.onRangeDate} allowClear={false} /></Col>
          </Row>
        </Modal>
      </div>
    );
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
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => (
        <div>
          <a style={{ marginRight: '20px' }} onClick={() => this.onEdit(record._id, record.start_date, record.end_date)}>编辑</a>
          <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record._id)} okText="确认" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    }];
    const ext = (
      <div>
        <Button onClick={this.onBuildClick} type="primary">新建</Button>
      </div>
    );
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="列表" titleExt={ext}>
        <Table rowKey={record => record._id} dataSource={dataSource} columns={columns} pagination={false} bordered />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent, renderBuild } = this;
    return (
      <div>
        { renderSearch() }
        { renderBuild() }
        { renderContent() }
        <Button style={{ display: 'block', margin: '0 auto' }} onClick={this.goback} type="primary">返回</Button>
      </div>);
  }
}

const mapStateToProps = ({ employee }) => {
  return { employee };
};

export default connect(mapStateToProps)(Index);
