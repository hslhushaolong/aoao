// 薪资查询模块, 数据汇总页面-首页
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Alert, Table, Button, Popconfirm, Tooltip, message, Modal, Row, Col, Input } from 'antd';

import { CoreContent } from '../../../../components/core';
import { SalarySummaryState, SalarySummaryFlag, SalaryPaymentCricle, KnightTypeWorkProperty, renderReplaceAmount } from '../../../../application/define';
import { authorize } from '../../../../application';
import Operate from '../../../../application/define/operate';
import ModalPage from './modal';
import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      dataSource: dot.get(props, 'salaryModel.salarySummary', []),   // 汇总数据
      selectedRowKeys: [],              // 选择要操作的数据keys
      isShowSalarySummaryExceptionMessage: dot.get(props, 'salaryModel.isShowSalarySummaryExceptionMessage', false), // 是否显示账户异常的信息
      isShowSalarySummaryNotice: dot.get(props, 'salaryModel.isShowSalarySummaryNotice', false),                     // 是否显示提示弹窗
      isVisibleReject: false,          // 初始化驳回模态框
      positionList: dot.get(props, 'salaryModel.positionList', []), // 职位list
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      isShowSalarySummaryExceptionMessage: dot.get(props, 'salaryModel.isShowSalarySummaryExceptionMessage', false),
      isShowSalarySummaryNotice: dot.get(props, 'salaryModel.isShowSalarySummaryNotice', false),
      dataSource: dot.get(props, 'salaryModel.salarySummary', []),
      positionList: dot.get(props, 'salaryModel.positionList', []), // 职位list
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/fetchSalarySummary', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 同意审核
  onClickAgree = () => {
    this.onUpdateState(SalarySummaryState.success);
  }

  // 更新薪资单
  onDirctToUpdate = () => {
    window.location.href = '/#/Salary/Task';
  }

  // 提交薪资单
  onClickSubmit = () => {
    // 计算中时，不能提交审核
    const values = this.private.searchParams;
    if (this.private.searchParams.flag === `${SalarySummaryFlag.process}`) {
      message.info('计算中数据不能提交审核');
      return;
    }
    this.onUpdateState(SalarySummaryState.pendding);
  }

  // 撤回薪资单
  onClickRevert = (id) => {
    const params = {
      ids: [id],
      state: SalarySummaryState.waiting,
    };
    this.private.dispatch({ type: 'salaryModel/updateSalarySummaryState', payload: params });
  }

  // 驳回薪资单
  onClickReject = () => {
    this.onUpdateState(SalarySummaryState.failure);
  }

  // 更新数据状态（通用接口封装）
  onUpdateState = (state, rejectReason) => {
    const { selectedRowKeys } = this.state;
    // 判断数据是否为空
    if (selectedRowKeys.length === 0) {
      return message.error('请选择数据');
    }
    // 刷新列表参数
    const { searchParams } = this.private;
    const params = {
      ids: selectedRowKeys,
      state,
      searchParams,
    };
    // reject_reason: 驳回原因
    // 判断是否驳回操作
    if (state === SalarySummaryState.failure) {
      params.reject_reason = rejectReason;
    }
    this.private.dispatch({ type: 'salaryModel/updateSalarySummaryState', payload: params });
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 隐藏薪资提示
  onHideNotice = () => {
    this.private.dispatch({ type: 'salaryModel/hideSalarySummaryNotice' });
  }

  // 不再显示弹窗
  onDisableNotice = () => {
    this.private.dispatch({ type: 'salaryModel/disableSalarySummaryNotice' });
  }
  // 显示模态框
  onShowModal = () => {
    this.updateModalState(true);
  }

  updateModalState = (isVisibleReject) => {
    this.setState({
      isVisibleReject,
    });
  }
  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    const props = {
      positionList: this.state.positionList,  // 职位信息
    };
    return (
      <Search onSearch={onSearch} {...props} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource, selectedRowKeys } = this.state;

    const columns = [{
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 100,
      fixed: 'left',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
        // return text.substring(0, 10).concat(' ', text.substring(11, 16));
      },
    }, {
      title: '薪资时间段',
      dataIndex: 'compute_time_slot',
      key: 'compute_time_slot',
      width: 100,
      fixed: 'left',
    }, {
      title: '城市',
      dataIndex: 'city_name_joint',
      key: 'city_name_joint',
      width: 80,
      fixed: 'left',
    }, {
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => {
        return authorize.poistionNameById(text);
      },
      width: 80,
      fixed: 'left',
    }, {
      title: '薪资计算周期',
      dataIndex: 'pay_salary_cycle',
      key: 'pay_salary_cycle',
      render: text => SalaryPaymentCricle.description(text),
    }, {
      title: '工作性质',
      dataIndex: 'work_type',
      key: 'work_type',
      render: text => KnightTypeWorkProperty.description(text),
    }, {
      title: '人员数量',
      dataIndex: 'staff_count',
      key: 'staff_count',
    }, {
      title: '完成单量',
      dataIndex: 'order_count',
      key: 'order_count',
    }, {
      title: '底薪总额／元',
      dataIndex: 'base_salary_total',
      key: 'base_salary_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '应发总额／元',
      dataIndex: 'real_pay_salary_total',
      key: 'real_pay_salary_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '人事扣款总额／元',
      dataIndex: 'human_affairs_deduction_total',
      key: 'human_affairs_deduction_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '实发总额／元',
      dataIndex: 'actual_pay_salary_total',
      key: 'actual_pay_salary_total',
      render: text => renderReplaceAmount(text),
    },

    {
      title: '计算状态',
      dataIndex: 'option_flag',
      key: 'option_flag',
      render: text => SalarySummaryFlag.description(text),
    }, {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        let context = SalarySummaryState.description(text);
        // 审核状态是不通过时，显示驳回原因
        if (text === SalarySummaryState.failure) {
          context = (
            <Tooltip title={record.reject_reason}>
              {/* SalarySummaryState.description(text) */}
              <span>{context}</span>
            </Tooltip>
          );
        }
        return context;
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <a target="_blank" href={`/#/Salary/Search/Records?id=${record._id}&platform=${record.platform_code}&city=${record.city_spelling}&canDelay=1`}>查看</a>
            {
              // 薪资汇总查询，提交薪资单审核
              Operate.canOperateSalarySearchSummaryRevert() && record.state === SalarySummaryState.pendding && record.option_flag !== false ?
                <Popconfirm title="确定执行操作？" onConfirm={() => { this.onClickRevert(record._id); }} okText="确定" cancelText="取消">
                  <a style={{ marginLeft: '10px' }}>撤回</a>
                </Popconfirm>
                : ''
            }
          </div>
        );
      },
    }];

    // 薪资汇总查询，同意驳回操作
    let rowSelection;
    if (Operate.canOperateSalarySearchSummaryManagement() || Operate.canOperateSalarySearchSummarySubmit()) {
      rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          this.setState({
            selectedRowKeys: selectedKeys,
          });
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        // getCheckboxProps: record => ({
        //   disabled: record.option_flag === true,
        // }),
      };
    }

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    const description = (
      <div>
        <p>1.每月3号系统开始生成本月薪资，且每2小时更新一次，可更新时长为2个月；</p>
        <p>2.每个人每月生成一笔或多笔薪资单；</p>
        <p>3.兼职薪资单按薪资规则所设置的计算周期生成；</p>
        <p>4.全职薪资单每月3号系统开始自动按规则计算当月薪资单，薪资计算周期为按月；</p>
        <p>5.薪资单生成有误，可停用原有的薪资规则新建新的薪资规则提交审核，或提交补扣款；可主动触发更新薪资单，也可待2小时后系统自动更新；</p>
        <p>6.薪资单审核通过后，将不可再进行更新操作；</p>
        <p>7.若到薪资单生成时间对应城市商圈存在系统异常账号未处理，该城市薪资单无法正常生成，请下级站长及时处理上月系统异常账号！</p>
        <p>备注：若存在异常账号的情况，该骑士将不计算薪资单，必须处理完成后才可计算。</p>
      </div>
    );
    return (
      <CoreContent>
        {/* 提示信息 */}
        <Alert message="薪资单注意事项" description={description} type="info" showIcon style={{ marginBottom: '10px' }} />

        <Row type="flex" justify="start" style={{ marginBottom: '10px' }} >
          {
            // 薪资汇总查询，更新薪资单
            Operate.canOperateSalarySearchSummaryUpdate() ?
              <Col>
                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.onDirctToUpdate}>更新薪资</Button>
              </Col>
              : ''
          }
          {
            // 薪资汇总查询，提交薪资单审核
            Operate.canOperateSalarySearchSummarySubmit() ?
              <Col>
                <Popconfirm title="确定执行操作？" onConfirm={this.onClickSubmit} okText="确定" cancelText="取消">
                  <Button type="primary" style={{ marginRight: '10px' }}>提交</Button>
                </Popconfirm>
              </Col>
              : ''
          }
          {
            // 薪资汇总查询，同意驳回操作
            Operate.canOperateSalarySearchSummaryManagement() ?
              <Col>
                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.onShowModal}>驳回</Button>
              </Col>
              : ''
          }
          {
            // 薪资汇总查询，同意按钮(coo)
            Operate.canOperateSalarySearchSummaryManagement() ?
              <Col>
                <Popconfirm title="确定执行操作？" onConfirm={this.onClickAgree} okText="确定" cancelText="取消">
                  <Button type="primary" style={{ marginRight: '10px' }}>同意</Button>
                </Popconfirm>
              </Col>
              : ''
          }
        </Row>
        {/* 时间提示: 计算中展示时间提示，时间：today-2 */}
        {
          this.private.searchParams.flag === `${SalarySummaryFlag.process}` &&
          <Alert type="info" showIcon style={{ marginBottom: '10px' }} message={`薪资单已计算至${moment().subtract(2, 'days').format('YYYY-MM-DD')}日，预计系统将于次月2号完成薪资单计算！`} />
        }
        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 1300 }} />
      </CoreContent>
    );
  }

  // 渲染薪资汇总
  renderNotice = () => {
    const { onHideNotice, onDisableNotice } = this;
    const { isShowSalarySummaryExceptionMessage, isShowSalarySummaryNotice } = this.state;
    const footer = [
      <Button key="hide" onClick={onDisableNotice}>不再显示</Button>,
      <Button key="submit" type="primary" onClick={onHideNotice}>
        确定
      </Button>,
    ];

    return (
      <Modal visible={isShowSalarySummaryNotice} title="重要提示" footer={footer} onOk={onHideNotice} onCancel={onHideNotice} >
        {/* 判断是否显示异常账号的信息提示 */}
        {isShowSalarySummaryExceptionMessage ? <p>请下级站长尽快处理上月系统异常账号！</p> : ''}
        <p>请在3天内将所需提交的资金款项提交！</p>
      </Modal>
    );
  }
  // 渲染模态框
  renderModal = () => {
    const { isVisibleReject } = this.state;
    const props = {
      isVisibleReject,
      updateModalState: this.updateModalState, // 修改模态框状态
      onUpdateState: this.onUpdateState,       // 请求驳回接口
    };
    return (
      <ModalPage {...props} />
    );
  }

  render() {
    const { renderSearch, renderContent, renderNotice } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染内容栏目 */}
        {renderContent()}

        {/* 渲染弹窗 */}
        {renderNotice()}
        {/* 渲染模态框 */}
        {this.renderModal()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(IndexPage);
