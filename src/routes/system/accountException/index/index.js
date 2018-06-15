// 异常账户管理
import _ from 'lodash';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popover } from 'antd';
import moment from 'moment';
import dot from 'dot-prop';

import { authorize } from '../../../../application';
import { CoreContent } from '../../../../components/core';
import { ExceptionHandleMethod, ExceptionMessage, ExceptionHandleState } from '../define';

import Search from './search';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: dot.get(props, 'system.handleErrStaff.data', []),                   // 列表
      total: dot.get(props, 'system.handleErrStaff._meta.result_count', 0),     // 数据总数
      hasmore: dot.get(props, 'system.handleErrStaff._meta.has_more', false),   // 是否有更多
      // 搜索的参数
      search: {
        platform_code: undefined,  // 平台
        limit: 30,
        page: 1,
        remind_date: `${moment().format('YYYY-MM-DD')}~${moment().format('YYYY-MM-DD')}`,  // 提醒时间默认显示当天
      }, // 保存搜索数据
    };
  }

  componentWillMount=() => {
    const { search } = this.state;
    this.props.dispatch({ type: 'system/getHandleErrStaffE', payload: search });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.system.handleErrStaff.data,
      total: nextProps.system.handleErrStaff._meta.result_count,
      hasmore: nextProps.system.handleErrStaff._meta.has_more,
    });
  }

  // 换页
  tableChange = (page) => {
    const params = this.state.search;
    params.page = page;
    this.props.dispatch({ type: 'system/getHandleErrStaffE', payload: params });

    // 设置当前的页码
    this.setState({
      page,
    });
  }

  // 搜索
  searchHandle = (values) => {
    const value = _.cloneDeep(values);
    // 因为ant design 的input填过值之后在删除，值由undefinde变成''，所以要检测过滤掉不传给后台
    if (value.phone != null && value.phone != '') {
      value.phone = value.phone;
    }
    // 职位
    if (value.position_id != null) {
      value.position_id = value.position_id.map((item) => {
        return parseFloat(item);
      });
    }
    // 异常原因
    if (value.error_reason) {
      value.error_reason = [value.error_reason];
    }
    // 处理方式
    // if (value.handling != null) {
    //   value.handling.forEach((item, index) => {
    //     value.handling[index] = parseFloat(item);
    //   });
    // }
    value.limit = 30;
    value.page = 1;

    // 处理日期
    if (values.handle_date != undefined) {
      const startDate = value.handle_date[0] ? moment(value.handle_date[0]).format('YYYY-MM-DD') : '';
      const endDate = value.handle_date[1] ? moment(value.handle_date[1]).format('YYYY-MM-DD') : '';
      value.handle_date = `${startDate}~${endDate}`;
    }
    if (values.remind_date != undefined) {
      const startDate = value.remind_date[0] ? moment(value.remind_date[0]).format('YYYY-MM-DD') : '';
      const endDate = value.remind_date[1] ? moment(value.remind_date[1]).format('YYYY-MM-DD') : '';
      value.remind_date = `${startDate}~${endDate}`;
    }
    // 如果是空，就删除属性，不发给后台
    for (const key in value) {
      // 如果是空，就删除属性，不发给后台
      if (value[key] == null || value[key] === '' || value[key] === '~') {
        delete value[key];
      }
    }
    this.setState({
      search: value,
    });
    const { dispatch } = this.props;
    dispatch({ type: 'system/getHandleErrStaffE', payload: value });
  }

  // 渲染搜索功能
  renderSearch = () => {
    const props = {
      searchHandle: this.searchHandle,
      platform: this.state.search.platform_code,
      remindDate: this.state.search.remind_date, // 提醒时间
    };
    return (
      <Search {...props} />
    );
  };

  // 渲染列表
  renderContent = () => {
    // 当前的分页页码
    const current = this.state.search.page;

    const { list } = this.state;
    const dataSource = list;
    const columns = [
      {
        title: '提醒时间',
        dataIndex: 'remind_date',
        key: 'remind_date',
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '职位',
        dataIndex: 'position_id',
        key: 'position_id',
        render: (text) => { return <span>{authorize.poistionNameById(text)}</span>; },
      }, {
        title: '供应商',
        dataIndex: 'supplier_name_list',
        key: 'supplier_name_list',
      }, {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
      }, {
        title: '城市',
        dataIndex: 'city_name',
        key: 'city_name',
      }, {
        title: '商圈',
        dataIndex: 'biz_district_name',
        key: 'biz_district_name',
      }, {
        title: '异常原因',
        dataIndex: 'error_reason',
        key: 'error_reason',
        render: text => (<span>{ExceptionMessage.description(text)}</span>),
      }, {
        title: '处理方式',
        dataIndex: 'handling',
        key: 'handling',
        className: 'textCenter',
        render: (text) => {
        // 其他原因暂时无法处理，显示原因
          if (!text) {
            return '--';
          }
          if (text && text.state === 40090) {
            return (
              <Popover placement="top" content={dot.get(text, 'desc')} trigger="hover">
                <span>{ExceptionHandleMethod.description(text.state)}</span>
              </Popover>
            );
          }
          return <span>{ExceptionHandleMethod.description(text && text.state)}</span>;
        },
      }, {
        title: '处理状态',
        dataIndex: 'handle_state',
        key: 'handle_state',
        render: (text) => {
          return <span>{ExceptionHandleState.description(text)}</span>;
        },
      }, {
        title: '处理完成时间',
        dataIndex: 'handle_date',
        key: 'handle_date',
        render: (text) => {
          return <span>{text || '--'}</span>;
        },
      }, {
        title: '操作人',
        dataIndex: 'operator_name',
        key: 'operator_name',
      }];
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="列表">
        <Table
          rowKey={record => record._id}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current,
            defaultPageSize: 30,
            onChange: this.tableChange,
            total: this.state.total,
            showTotal: total => `总共 ${this.state.total} 条，${30}条/页 `,
            // showQuickJumper: true,
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

const mapStateToProps = ({ system }) => {
  return { system };
};

export default connect(mapStateToProps)(Index);
