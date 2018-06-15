// 费用审核记录 Expense/Manage/Audit
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Table, Input, Modal } from 'antd';

import { CoreContent } from '../../../../components/core';
import { renderReplaceAmount, ExpenseVerifyState } from '../../../../application/define';
import Operate from '../../../../application/define/operate';

import Search from './search';

const { TextArea } = Input;

class IndexPage extends Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: dot.get(props, 'approval.approvalList', []), // 审批单数据源
      visible: false,                          // 审核窗
      summaryId: undefined,                     // 审批单id
      state: undefined,                         // 审批单状态 1同意,-1驳回
      desc: undefined,                          // 审核意见
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      dataSource: dot.get(props, 'approval.approvalList', []),
    });
  }
  // 打开审批窗口，保存id和状态
  onOpen = (id, state) => {
    this.setState({
      visible: true,
      summaryId: id,                     // 审批单id
      state,                             // 审批单状态 1同意,-1驳回
    });
  }
  // 关闭审批窗口，清空状态
  handleCancel = () => {
    this.setState({
      visible: false,                          // 审核窗
      summaryId: undefined,                     // 审批单id
      state: undefined,                         // 审批单状态 1同意,-1驳回
      desc: undefined,                          // 审核意见
    });
  }
  // 确认提交审批
  handleOk = () => {
    // 提交审批（同意／驳回）
    this.props.dispatch({
      type: 'approval/approvalEditE',
      payload: {
        examine_id: this.state.summaryId,    // 审批单id
        examine_state: this.state.state,    // 审批结果
        desc: this.state.desc,   // 备注
      },
    });
    this.setState({
      visible: false,                          // 审核窗
      summaryId: undefined,                     // 审批单id
      state: undefined,                         // 审批单状态 1同意,-1驳回
      desc: undefined,                          // 审核意见
    });
    const { searchParams } = this.private;
    searchParams.page = 1;
    searchParams.limit = 30;
  }
  // 输入审批意见
  onChangeOpinion = (e) => {
    this.setState({
      desc: e.target.value,
    });
  }
  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }

    // 调用搜索
    this.private.dispatch({ type: 'approval/getApprovalListE', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
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

    const columns = [{
      title: '流水号',
      dataIndex: 'examine_id',
      key: 'examine_id',
    }, {
      title: '费用类型',
      dataIndex: 'costclass',
      key: 'costclass',
    }, {
      title: '申请日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    }, {
      title: '申请人',
      dataIndex: 'apply_account',
      key: 'apply_account',
    }, {
      title: '总金额',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (text) => {
        return renderReplaceAmount(text);
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return ExpenseVerifyState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        // 汇总记录id
        const summaryId = record.examine_id;
        // 是否能编辑
        let isEdit = false;
        // 能否审批
        let isApproval = false;
        // 由后台和权限一起判断是否能编辑
        if (record.conceal && Operate.canOperateExpenseManageEditButton()) {
          isEdit = true;
        }
        // 是否能审批，由后台和权限一起判断是否能审批
        if (record.can_examine && Operate.canOperateExpenseManageApprovalButton()) {
          isApproval = true;
        }
        return (
          <div>
            {/* 详情 */}
            <a href={`/#/Expense/Manage/Summary/Detail?summaryId=${summaryId}&type=${record.template}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>查看</a>

            {/* 编辑 conceal后台标记能否编辑的字段*/}
            {isEdit === true ?
              <a href={`/#/Expense/Manage/Summary/Create?summaryId=${summaryId}&type=${record.template}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>编辑</a>
            : ''}
            {/* 同意操作 */}
            {isApproval === true ?
              <a style={{ marginRight: '10px' }} onClick={() => { this.onOpen(summaryId, 1); }}>同意</a>
            : ''}
            {/* 驳回操作 */}
            {isApproval === true ?
              <a style={{ marginRight: '10px' }} onClick={() => { this.onOpen(summaryId, -1); }}>驳回</a>
            : ''}
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      current: this.private.searchParams.page,
      defaultPageSize: 30,                   // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      showQuickJumper: true,                // 显示快速跳转
      showSizeChanger: true,                  // 显示分页
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table rowKey={record => record.examine_id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
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
        <Modal
          title="审批"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <TextArea value={this.state.desc} onChange={this.onChangeOpinion} placeholder={'请输入审批意见'} rows={4} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(IndexPage));
