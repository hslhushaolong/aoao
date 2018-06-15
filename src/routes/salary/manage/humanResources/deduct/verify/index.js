/**
 * 人事扣款，审核，首页
 */
import { connect } from 'dva';
import moment from 'moment';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Table, Popover } from 'antd';

import { authorize } from '../../../../../../application';
import { SalaryKnightState, KnightSalaryType, renderReplaceAmount } from '../../../../../../application/define';
import { CoreContent } from '../../../../../../components/core';
import Search from './search';

class Index extends Component {
  constructor(props) {
    super();
    this.state = {
      supplier_id: authorize.account.supplierId,        // 供应商 - 唯一
      platform_code: authorize.platform()[0].id,        // 默认平台
      city_spelling_list: [],                           // 城市
      fund_start_date: '',  // 扣款月份
      fund_end_date: '',    // 扣款月份
      knightChargeSource: props.knightChargeSource,  // 数据源
    };
    this.private = {
      dispatch: props.dispatch,
      search: {
        fund_id: KnightSalaryType.personnalDeduct,  // 扣款
        page: 1,                              // 页码 （不需分页，只有6条数据）
        limit: 10,
      },
    };
  }
  componentWillMount = () => {
    // 初始化列表
    this.searchHandle();
  }
  componentWillReceiveProps = (nextProps) => {
    const { salaryModel } = nextProps;
    const { knightChargeSource } = salaryModel;
    this.setState({
      knightChargeSource,
    });
  }

  // 分页
  onChangePage = (page) => {
    this.private.search.page = page;
  }
  // 请求列表
  searchHandle = (values) => {
    const { dispatch, search } = this.private;
    const { fund_id, page, limit } = search;
    const { supplier_id, platform_code } = this.state;
    // 必传参数
    const params = {
      fund_id,
      page,
      limit,
      supplier_id,
      platform_code,
    };
    if (dot.get(values, 'platform_code')) {
      params.platform_code = values.platform_code;
    }
    if (dot.get(values, 'supplier_id')) {
      params.supplier_id = values.supplier_id;
    }
    // 非必传参数
    if (dot.get(values, 'city_spelling_list')) {
      params.city_spelling_list = values.city_spelling_list;
    }
    if (dot.get(values, 'startMonth')) {
      params.fund_start_date = `${values.startMonth}-01`;
    }
    if (dot.get(values, 'endMonth')) {
      params.fund_end_date = moment(values.endMonth).endOf('month').format('YYYY-MM-DD');
    }
    if (dot.get(values, 'submit_state')) {
      params.submit_state = values.submit_state;
    }
    // 请求列表
    dispatch({
      type: 'salaryModel/getKnightChargeSourceE',
      payload: params,
    });
  }
  // 渲染列表
  renderContent = () => {
    const { knightChargeSource } = this.state;
    const list = dot.get(knightChargeSource, 'collect_fund_list');
    const columns = [
      // 后期会用
      // {
      //   title: '供应商',
      //   dataIndex: 'supplier_name',
      //   key: 'supplier_name',
      // },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
      },
      {
        title: '城市',
        dataIndex: 'city_name_list',
        key: 'city_name_list',
        render: (text) => {
          let names = [];
          if (!text) {
            return '暂无';
          }
          // 只有一个时
          if (text.length === 1) {
            names = text[0];
          }
          // 多个时
          if (text.length > 1) {
            const content = <p style={{ width: '100px' }}>{text.join(',')}</p>;
            names = (
              <Popover placement="top" content={content} trigger="hover">
                {text[0]}等{text.length}个城市
            </Popover>
            );
          }
          return names;
        },
      }, {
        title: '扣款月份',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: '扣款总额/元',
        dataIndex: 'total_money',
        key: 'total_money',
        render: text => renderReplaceAmount(text),
      },
      {
        title: '扣款人数',
        dataIndex: 'total_people',
        key: 'total_people',
      }, {
        title: '完成状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => { return SalaryKnightState.description(text); },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              <a target="_blank" href={`/#/Salary/Manage/HumanResources/Deduct/Verify/Detail?detail_list=${record.detail_id_list}&month=${record.month}&submitState=${record.state}`} style={{ marginRight: '10px' }}>查看</a>
            </div>
          );
        },
      }];

    // 分页
    const pagination = {
      defaultPageSize: 10,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(knightChargeSource, 'meta.total_num', 0), // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
    };

    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="列表" >
        <Table rowKey={record => record._id} dataSource={list} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  render() {
    const { supplier_id, platform_code, city_spelling_list, submit_state, fund_start_date, fund_end_date } = this.state;
    const searchPros = {
      supplier_id,
      platform_code,
      city_spelling_list,
      submit_state,
      fund_start_date,
      fund_end_date,
      searchHandle: this.searchHandle,
    };

    return (
      <div>
        {/* 检索 */}
        <Search {...searchPros} />
        {/* 列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = ({ salaryModel }) => {
  return { salaryModel };
};
export default connect(mapStateToProps)(Index);
