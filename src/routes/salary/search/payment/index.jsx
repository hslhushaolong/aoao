// 薪资缓发|补发明细页
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Button, Table, message, Popconfirm } from 'antd';

import { CoreContent } from '../../../../components/core';
import { SalaryPaymentState, Gender, DutyState, renderReplaceAmount } from '../../../../application/define';
import { authorize, utils } from '../../../../application';
import Operate from '../../../../application/define/operate';
import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      dataSource: dot.get(props, 'salaryModel.salaryRecords', []),   // 列表数据
      summaryInfo: dot.get(props, 'salaryModel.summaryInfo', []),    // 列表汇总数据
      selectedRowKeys: [],  // 选择要操作的数据keys
      isProcessDownload: false,         // 是否执行下载文件操作
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    let { isProcessDownload } = this.state;
    // 获取下载文件的文件地址
    const salaryRecordsDownloadURL = dot.get(props, 'salaryModel.salaryRecordsDownloadURL', '');
    // 如果下载文件的链接不为空，并且已经在执行下载的操作，则打开新的页面下载文件
    if (salaryRecordsDownloadURL !== '' && isProcessDownload === true) {
      // 下载文件
      utils.downloadFile(salaryRecordsDownloadURL, '导出薪资单');

      // 文件下载的操作已经结束
      isProcessDownload = false;
    }

    this.setState({
      isProcessDownload,
      dataSource: dot.get(props, 'salaryModel.salaryRecords', []),
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
    });
  }

  // 下载文件
  onDownload = (params) => {
    this.private.dispatch({ type: 'salaryModel/downloadSalaryRecords', payload: params });
    // 开始执行下载文件的操作
    this.setState({ isProcessDownload: true });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;

    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/fetchSalaryRecords', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 批量缓发
  onClickUpdate = () => {
    const { selectedRowKeys } = this.state;

    // 判断数据是否为空
    if (selectedRowKeys.length === 0) {
      return message.error('请选择要审核的数据');
    }
    const params = {
      ids: selectedRowKeys,
    };
    this.private.dispatch({ type: 'approval/submitSalaryApplyE', payload: params });

    // 重置选择数据
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    const props = {
      positionList: this.state.positionList,
    };
    return (
      <Search onSearch={onSearch} onDownload={onDownload} {...props} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource, selectedRowKeys } = this.state;
    const columns = [{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      fixed: 'left',
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      width: 80,
      fixed: 'left',
    }, {
      title: '城市',
      dataIndex: 'city_name_joint',
      key: 'city_name_joint',
      width: 80,
      fixed: 'left',
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      width: 80,
      fixed: 'left',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      fixed: 'left',
    }, {
      title: '性别',
      dataIndex: 'gender_id',
      key: 'gender_id',
      render: (text) => {
        return Gender.description(text);
      },
    }, {
      title: '在职状态',
      dataIndex: 'work_state',
      key: 'work_state',
      render: (text) => {
        return DutyState.description(text);
      },
    }, {
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => {
        return authorize.roleNameById(text);
      },
    }, {
      title: '单量',
      dataIndex: 'order_count',
      key: 'order_count',
    }, {
      title: '底薪／元',
      dataIndex: 'base_salary',
      key: 'base_salary',
      render: text => renderReplaceAmount(text),
    }, {
      title: '提成／元',
      dataIndex: 'percentage_amount',
      key: 'percentage_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '奖金／元',
      dataIndex: 'bonus_amount',
      key: 'bonus_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '扣罚／元',
      dataIndex: 'deduction_amount',
      key: 'deduction_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '骑士扣款／元',
      dataIndex: 'knight_deduction_amount',
      key: 'knight_deduction_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '骑士补款／元',
      dataIndex: 'knight_payment_amount',
      key: 'knight_payment_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '应发工资／元',
      dataIndex: 'real_pay_salary_amount',
      key: 'real_pay_salary_amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '跨行费用／元',
      dataIndex: 'inter_bank_transfer_amount',
      key: 'inter_bank_transfer_amount',
      render: (text) => {
        // 实际
        const first = renderReplaceAmount(dot.get(text, 'first', 0));
        // 应扣
        const end = renderReplaceAmount(dot.get(text, 'end', 0));
        // 判断扣款是否够
        const isShowRedColor = dot.get(text, 'flag', false);
        if (isShowRedColor) {
          return <div><span style={{ color: 'red' }}>{first}</span> / <span>{end}</span></div>;
        } else {
          return <div><span >{first}</span> / <span>{end}</span></div>;
        }
      },
    }, {
      title: '装备扣款／元',
      dataIndex: 'equipment_deduction_amount',
      key: 'equipment_deduction_amount',
      render: (text) => {
        // 实际
        const first = renderReplaceAmount(dot.get(text, 'first', 0));
        // 应扣
        const end = renderReplaceAmount(dot.get(text, 'end', 0));
        // 判断扣款是否够
        const isShowRedColor = dot.get(text, 'flag', false);
        if (isShowRedColor) {
          return <div><span style={{ color: 'red' }}>{first}</span> / <span>{end}</span></div>;
        } else {
          return <div><span >{first}</span> / <span>{end}</span></div>;
        }
      },
    }, {
      title: '装备保证金／元',
      dataIndex: 'equipmen_cash_deposit_amount',
      key: 'equipmen_cash_deposit_amount',
      render: (text) => {
        // 实际
        const first = renderReplaceAmount(dot.get(text, 'first', 0));
        // 应扣
        const end = renderReplaceAmount(dot.get(text, 'end', 0));
        // 判断扣款是否够
        const isShowRedColor = dot.get(text, 'flag', false);
        if (isShowRedColor) {
          return <div><span style={{ color: 'red' }}>{first}</span> / <span>{end}</span></div>;
        } else {
          return <div><span >{first}</span> / <span>{end}</span></div>;
        }
      },
    }, {
      title: '三方扣款／元',
      dataIndex: 'three_sides_deduction_amount',
      key: 'three_sides_deduction_amount',
      render: (text) => {
        // 实际
        const first = renderReplaceAmount(dot.get(text, 'first', 0));
        // 应扣
        const end = renderReplaceAmount(dot.get(text, 'end', 0));
        // 判断扣款是否够
        const isShowRedColor = dot.get(text, 'flag', false);
        if (isShowRedColor) {
          return <div><span style={{ color: 'red' }}>{first}</span> / <span>{end}</span></div>;
        } else {
          return <div><span >{first}</span> / <span>{end}</span></div>;
        }
      },
    }, {
      title: '实发工资／元',
      dataIndex: 'actual_pay_salary_amount',
      key: '',
      render: (text) => {
        // 实际
        const first = renderReplaceAmount(dot.get(text, 'first', 0));
        // 应扣
        const end = renderReplaceAmount(dot.get(text, 'end', 0));
        // 判断扣款是否够
        const isShowRedColor = dot.get(text, 'flag', false);
        if (isShowRedColor) {
          return <div><span style={{ color: 'red' }}>{first}</span> / <span>{end}</span></div>;
        } else {
          return <div><span >{first}</span> / <span>{end}</span></div>;
        }
      },
    }, {
      title: '薪资发放状态',
      dataIndex: 'pay_salary_state',
      key: 'pay_salary_state',
      render: (text) => {
        return SalaryPaymentState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <a target="_blank" href={`/#/Salary/Search/Detail?id=${record._id}`}>查看</a>;
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
    };

    // 薪资缓发|补发明细,提交审批按钮(运营)
    let rowSelection;
    if (Operate.canOperateFinanceSalarySubmitButton()) {
      rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          this.setState({
            selectedRowKeys: selectedKeys,
          });
        },
        getCheckboxProps: record => ({
          // 薪资发放状态必须是缓发才能选
          disabled: record.pay_salary_state !== SalaryPaymentState.delayed,
        }),
      };
    }
    return (
      <CoreContent>
        {
          // 薪资缓发|补发明细,提交审批按钮(运营)
          Operate.canOperateFinanceSalarySubmitButton() ?
            <Popconfirm title="确定执行操作?" onConfirm={this.onClickUpdate} onCancel={() => {}} okText="确定" cancelText="取消">
              <Button type="primary" style={{ marginRight: '10px', marginBottom: '10px' }}>提交审批</Button>
            </Popconfirm>
          : ''
        }

        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 2000, y: 500 }} />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染内容栏目 */}
        {renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
