/**
 * 人事扣款，首页
*/
import moment from 'moment';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Table, Button, Popover, Popconfirm } from 'antd';
import { Link } from 'react-router';

import { CoreContent } from '../../../../../components/core';
import { DeductSubmitType, Modules, KnightSalaryType, renderReplaceAmount } from '../../../../../application/define';
import { authorize } from '../../../../../application';
import Operate from '../../../../../application/define/operate';
import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      isShowTaskCreateModal: false,   // 是否显示创建内容的弹窗
      dataSource: dot.get(props, 'salaryModel.fillingMoneyList', []),   // 汇总数据
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: dot.get(props, 'salaryModel.fillingMoneyList', []),
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    const tempParams = {
      permission_id: Modules.ModuleSalaryManageKnightDeduct.id, // 权限id
      fund_id: KnightSalaryType.personnalDeduct, // 扣款
      page: params.page, // 页码
      limit: 30, // 条数
      sort: -1, // 排序
      platform_code: params.platform, // 平台
      supplier_id: params.supplier, // 供应商
      city_spelling_list: params.city, // 城市列表
      biz_district_list: params.district, // 商圈列表
      submit_state: Number(params.complateState), // 完成状态
      created_start_date: params.createdStartDate, // 创建开始时间
      created_end_date: params.createdEndDate, // 创建结束时间
    };
    if (!params.complateState || Number(params.complateState) === 0) delete tempParams.submit_state;
    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/getFillingMoneyListE', payload: tempParams });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

   // 删除
  onConfirmDelete = (index) => {
    const list = dot.get(this.state, 'dataSource.data', []);
    const deleteId = list[index] ? list[index]._id : '';
    if (deleteId === '') return;
    this.props.dispatch({
      type: 'salaryModel/removeOrderList',
      payload: {
        id: deleteId, // id
        index, // 下标
      },
    });
  }

   // 编辑
  onEdit = (index, id, list) => {
    // 获取默认的平台值
    let platform;
    if (dot.has(authorize.platform(), '0.id')) {
      platform = dot.get(authorize.platform(), '0.id');
    }

    const params = {
      fund_id: KnightSalaryType.personnalDeduct, // 人事扣款
      page: 1, // 页码
      limit: 50, // 条数
      platform_code: this.private.searchParams.platform_code || platform, // 平台
      detail_id_list: list, // 详情列表
    };
    this.props.dispatch({
      type: 'salaryModel/getDeductMoneyE',
      payload: {
        params,
        id, // 母单id，在保存的时候需要
      },
    });
  }

  // 显示创建弹窗
  onShowTaskCreateModal = () => {
    this.props.dispatch({
      type: 'salaryModel/openCreatePageE',
      payload: {
        hash: '/Salary/Manage/HumanResources/Deduct/Create',
      },
    });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    return (
      <Search onSearch={onSearch} onDownload={onDownload} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [
      // 后期会用
      // {
      //   title: '供应商',
      //   dataIndex: 'supplier_name',
      //   key: 'supplier_name',
      //   render: (text) => {
      //     if (Object.prototype.toString.call(text) === '[object String]') text = [text];
      //     return text[0];
      //   },
      // },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: (text) => {
          if (Object.prototype.toString.call(text) === '[object String]') text = [text];
          return text[0];
        },
      },
      {
        title: '城市',
        dataIndex: 'city_name_list',
        key: 'city_name_list',
        render: (text) => {
          let names = [];
          if (Object.prototype.toString.call(text) === '[object String]') text = [text];
          if (!text) {
            return '暂无';
          }
          // 只有一个时
          if (text.length === 1) {
            names = text[0];
          }
          // 多个时
          if (text.length > 1) {
            const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
            names = (
              <Popover placement="top" content={content} trigger="hover">
                {text[0]}等{text.length}个城市
              </Popover>
          );
          }
          return names;
        },
      },
      {
        title: '商圈',
        dataIndex: 'district_name_list',
        key: 'district_name_list',
        render: (text) => {
          let names = [];
          if (!text || text.length === 0) {
            return '全部';
          }
        // 只有一个时
          if (text.length === 1) {
            names = text[0];
          }
        // 多个时
          if (text.length > 1) {
            const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
            names = (
              <Popover placement="top" content={content} trigger="hover">
                {text[0]}等{text.length}个商圈
            </Popover>
          );
          }
          return names;
        },
      }, {
        title: '扣款总额/元',
        dataIndex: 'total_money',
        key: 'total_money',
        render: (text) => {
          return renderReplaceAmount(text);
        },
      }, {
        title: '扣款人数',
        dataIndex: 'total_people',
        key: 'total_people',
        render: (text, record) => {
          return text;
        // `${SalaryTaskTime.description(record.compute_time_slot)} - ${text}`;
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm');
        },
      }, {
        title: '完成状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return DeductSubmitType.description(Number(text));
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        render: (text, record, index) => {
          return (
            <div>
              <Link target="_blank" to={`Salary/Manage/HumanResources/Deduct/Detail?id=${record._id}&detail_list=${record.detail_list}&state=${record.state}`}>查看</Link>
              {record.state === DeductSubmitType.waitForSubmit && <span className="mgl8 pointer" onClick={() => this.onEdit(index, record._id, record.detail_list)}>编辑</span>}
              {record.state === DeductSubmitType.waitForSubmit && <Popconfirm title="确定删除?" onConfirm={() => this.onConfirmDelete(index)}>
                <span className="mgl8 systemTextColor pointer">删除</span>
              </Popconfirm> }
            </div>
          );
        },
      }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    return (
      <CoreContent>

        {/* 是否有新建人事扣款按钮权限 */}
        { Operate.canOperateSalaryPersonnalDeductCreateButton() ?
          <div style={{ marginBottom: '10px' }} >
            <Button type="primary" style={{ marginRight: '10px' }} onClick={this.onShowTaskCreateModal}>新建人事扣款</Button>
          </div> : ''
        }

        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 1000 }} />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染表格 */}
        {renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
