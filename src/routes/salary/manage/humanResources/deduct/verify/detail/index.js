/**
 * 人事扣款，审核，详情，首页
*/
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Button, Table, Tooltip, Modal, Input, Row, Col, message } from 'antd';

import { KnightSalaryApproveState, PersonalCutEventType, KnightSalaryType, renderReplaceAmount } from '../../../../../../../application/define';
import { CoreContent } from '../../../../../../../components/core/index';
import Search from './search.js';

const { TextArea } = Input;

class Audit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_list: [], // 选中数据的id列表
      selectedRowKeys: [], // 选中的表格索引
      selectedRows: [], // 选中的数据
      date: props.location.query.month, // 月份
      sort: -1, // 排序
      fund_id: KnightSalaryType.personnalDeduct, // 人事扣款
      modalState: true, // 判断时同意还是驳回
      textAreaValue: '', // 文本域
      stateSum: 0, // 选择的数量
      amount: 0, // 总价格
      summaryDataSource: dot.get(props, 'salaryModel.knightFillingMessage.collect_items', []), // 汇总列表
      dataSource: dot.get(props, 'salaryModel.knightFillingMessage.fund_list', []), // 列表内容,
      visible: false, // modal显示隐藏
      detail_list: this.props.location.query.detail_list, // 详情列表
      submitterList: dot.get(props, 'salaryModel.knightFillingMessage.submitter_list', []), // 提交人列表
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }
  componentWillReceiveProps=(nextProps) => {
    this.setState({
      summaryDataSource: dot.get(nextProps, 'salaryModel.knightFillingMessage.collect_items', []),
      dataSource: dot.get(nextProps, 'salaryModel.knightFillingMessage.fund_list', []), // 列表内容,
    });
  }
  // 点击确定
  onOkModal = () => {
    this.setState({
      visible: false, // 隐藏model
      selectedRows: [], // 选中的表格数据
      selectedRowKeys: [], // 选中的表格索引
    });
    const params = {
      id_list: this.state.id_list, // 选择数据的id列表
      fund_id: this.state.fund_id, // 人事扣款
      detail_list: this.state.detail_list, // 详情列表
      sort: -1, // 排序
      ...this.private.searchParams, // 查询数据
    };
    // 同意
    if (this.state.modalState) {
      params.approval_state = KnightSalaryApproveState.success; // 审核通过
      this.props.dispatch({
        type: 'salaryModel/updateSalaryRecordExamine',
        payload: params,
      });
      // 驳回
    } else if (this.state.textAreaValue) {
      params.approval_state = KnightSalaryApproveState.reject; // 审核未通过
      params.examin_desc = this.state.textAreaValue; // 驳回原因
      this.props.dispatch({
        type: 'salaryModel/updateSalaryRecordExamine',
        payload: params,
      });
    } else {
      message.error('请输入驳回原因');
    }
  }
  // 点击失败
  onCancelModal = () => {
    this.setState({
      visible: false, // 隐藏model
      selectedRows: [], // 选中数据清空
      selectedRowKeys: [], // 选中数据的key值清空
    });
  }
  // 批量同意
  onClickSubmit = () => {
    const { selectedRows } = this.state;
    const stateSum = selectedRows.length;
    if (stateSum) {
      const idList = [];
      let amount = 0;
      selectedRows.forEach((item) => {
        amount += item.amount;
        idList.push(item._id);
      });
      this.setState({
        visible: true, // 显示model
        modalState: true, // 同意
        stateSum, // 选中数据的长度
        amount, // 总价格保留小数点后两位
        id_list: idList, // 选中数据的id列表
        selectedRowKeys: [], // 选中的表格索引
        selectedRows: [], // 选中的数据
      });
    } else {
      message.error('您还没有选中');
    }
  }
  // 批量驳回
  onClickReject = () => {
    const { selectedRows } = this.state;
    const stateSum = selectedRows.length;
    if (stateSum) {
      const idList = [];
      selectedRows.forEach((item) => {
        idList.push(item._id);
      });
      this.setState({
        visible: true, // 显示model
        modalState: false, // 驳回
        id_list: idList, // 选择数据的id列表
        textAreaValue: '', // 文本域
        selectedRowKeys: [], // 选中的表格索引
        selectedRows: [], // 选中的数据
      });
    } else {
      message.error('您还没有选中');
    }
  }
  // 批量选中
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  // 单个同意
  onClicksumbit = (id, amount) => {
    this.setState({
      visible: true, // 显示model
      modalState: true, // 同意
      stateSum: 1, // 单个数据个数
      amount, // 总价格
      id_list: [id], // 选择数据的id列表
    });
  }
  // 单个驳回
  onClickreject = (id) => {
    this.setState({
      visible: true, // 显示model
      modalState: false, // 驳回
      id_list: [id], // 选择数据的id列表
      textAreaValue: '', // 文本域
    });
  }
  // 文本域改变value
  onChangeTextArea = (e) => {
    this.setState({
      textAreaValue: e.target.value, // 文本域
    });
  }
  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    const tempParams = {
      ...params,
      fund_id: this.state.fund_id, // 人事扣款
      sort: -1, // 排序
      detail_list: this.state.detail_list, // 详情列表
    };
    if (Number(params.complateState) === 0) delete tempParams.submit_state;
    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/getFillingMoneyDetailE', payload: tempParams });
  }
  // 渲染搜索条件
  renderSearch = () => {
    const props = {
      onSearch: this.onSearch, // 查询
      dataSource: this.state.dataSource, // 列表数据
      date: this.state.date, // 日期
      submitterList: this.state.submitterList, // 提交人列表
    };
    return (
      <CoreContent>
        <Search {...props} />
      </CoreContent>
    );
  }
  // 扣款日期
  renderDate = () => {
    const { date, summaryDataSource } = this.state;
    const width = summaryDataSource.length > 6 ? 150 : 230;
    const style = {
      width,
      textAlign: 'center',
    };
    return (
      <CoreContent>
        <Row type="flex">
          <Col className="mgt16" key={'汇总项'} style={style}>{`扣款日期：${date}`}</Col>
        </Row>
      </CoreContent>
    );
  }
  // 扣款汇总
  renderSummary = () => {
    const { summaryDataSource } = this.state;
    const obj = {};
    summaryDataSource.forEach((val) => {
      for (const k in val) {
        obj[k] = val[k];
      }
    });
    const width = summaryDataSource.length > 6 ? 80 : 120;
    const style = {
      width,
      textAlign: 'center',
    };
    return (
      <div>
        <CoreContent>
          <Row type="flex">
            {
              <Col className="mgt16" key={'汇总项'} style={style}>{'汇总项'}</Col>
            }
            {
              Object.keys(obj).map((val, k) => {
                return <Col className="mgt16" key={k} style={style}>{PersonalCutEventType.description(PersonalCutEventType[val])}</Col>;
              })
            }
          </Row>
          <Row type="flex">
            {
              <Col className="mgt16" key={'城市'} style={style}>{'城市'}</Col>
            }
            {
              Object.keys(obj).map((val, k) => {
                return <Col className="mgt16" key={k} style={style}>{renderReplaceAmount(obj[val])}</Col>;
              })
            }
          </Row>
        </CoreContent>
        <Button type="primary" size={'large'} style={{ width: '85px', marginLeft: '10px' }} onClick={this.onClickSubmit}>同意</Button>
        <Button type="primary" size={'large'} style={{ width: '85px', marginLeft: '20px' }} onClick={this.onClickReject}>驳回</Button>
      </div>
    );
  }
  // 渲染内容列表
  renderContent = () => {
    const { selectedRowKeys, dataSource } = this.state;
    dataSource.forEach((item) => {
      item.key = item._id;
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state !== KnightSalaryApproveState.pendding, // !待审核
      }),
    };
    const columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    }, {
      title: '商圈',
      dataIndex: 'district_name',
      key: 'district_name',
    }, {
      title: '姓名',
      dataIndex: 'knight_name',
      key: 'knight_name',
    }, {
      title: '扣款项目',
      dataIndex: 'handl_type',
      key: 'handl_type',
      render: (text) => {
        return (
          <span>{PersonalCutEventType.description(PersonalCutEventType[text])}</span>
        );
      },
    }, {
      title: '扣款金额／元',
      dataIndex: 'amount',
      key: 'amount',
      render: text => renderReplaceAmount(text),
    }, {
      title: '原因',
      dataIndex: 'cut_subsidy_other_cause',
      key: 'cut_subsidy_other_cause',
    }, {
      title: '扣款日期',
      dataIndex: 'date',
      key: 'date',
    }, {
      title: '提交人',
      dataIndex: 'submitter_name',
      key: 'submitter_name',
      render: (text) => {
        if (text) {
          return Object.values(text);
        }
      },
    }, {
      title: '提交时间',
      dataIndex: 'submit_date',
      key: 'submit_date',
    }, {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        // 审核未通过
        if (text === KnightSalaryApproveState.reject) {
          return (
            <Tooltip placement="top" title={record.examin_desc}>
              <span>{KnightSalaryApproveState.description(text)}</span>
            </Tooltip>
          );
        }
        return (
          <span>{KnightSalaryApproveState.description(text)}</span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        switch (record.state) {
          // 待审核
          case KnightSalaryApproveState.pendding: return (
            <div style={{ width: '80px' }}>
              <a style={{ marginLeft: '10px' }} onClick={() => this.onClicksumbit(record._id, record.amount)}>同意</a>
              <a style={{ marginLeft: '10px' }} onClick={() => this.onClickreject(record._id)}>驳回</a>
            </div>
          );
          default: return (
            <div style={{ width: '80px' }}>
              <a style={{ marginLeft: '10px' }}>--</a>
            </div>
          );
        }
      },
    }];
    return (
      <CoreContent>
        <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} pagination={false} />
      </CoreContent>
    );
  }
  renderModal = () => {
    return (
      <Modal
        title="确认信息"
        visible={this.state.visible}
        value={this.state.textAreaValue}
        onOk={this.onOkModal}
        onCancel={this.onCancelModal}
      >
        {
          this.state.modalState ? <div>
            <p>总人数：{this.state.stateSum}    总金额（元）：{renderReplaceAmount(this.state.amount)}</p>
            <p>您确定要同意该申请吗?</p>
          </div> : <TextArea value={this.state.textAreaValue} rows={4} onChange={this.onChangeTextArea} />
        }
      </Modal>
    );
  }
  render() {
    const { renderDate, renderSummary, renderContent, renderModal, renderSearch } = this;
    return (
      <div className="mgt8">

        {/* 渲染搜索条件 */}
        {renderSearch()}

        {/* 扣款日期 */}
        {renderDate()}

        {/* 扣款汇总 */}
        {renderSummary()}

        {/* 渲染内容列表 */}
        {renderContent()}

        {/* modol确认框 */}
        {renderModal()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Audit);
