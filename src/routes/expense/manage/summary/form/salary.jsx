// 费用申请，薪资补发申请列表
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { ExpenseType, renderReplaceAmount } from '../../../../../application/define';
import VerifyRecordsModal from '../detail/modal';

const { Option } = Select;

class SummaryFormSalary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summaryId: dot.get(props, 'summaryId', undefined),      // 汇总记录id
      detail: dot.get(props, 'approval.examineSimpleDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.typeApplyList'),   // 汇总记录，列表数据
      examineId: this.transNull(dot.get(props, 'approval.examineSimpleDetail.examineflow_id', undefined)), // 审批流id, (当前页面选择的参数)
      examineList: dot.get(props, 'approval.examineSimpleNameList', []) || [], // 审批流数据列表
      visible: false, // 审核记录显示状态，默认不显示
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      summaryId: dot.get(props, 'summaryId', undefined),      // 汇总记录id
      detail: dot.get(props, 'approval.examineSimpleDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.typeApplyList'),   // 汇总记录，列表数据
      examineId: this.transNull(dot.get(props, 'approval.examineSimpleDetail.examineflow_id', undefined)), // 审批流id, (当前页面选择的参数)
      examineList: dot.get(props, 'approval.examineSimpleNameList', []) || [], // 审批流数据列表
    });
  }

  // 提交服务器
  onSubmit = () => {
    const { summaryId, examineId } = this.state;
      // 提交前判断有没有选择审批流
    if (!examineId) {
      message.error('请选择审批流');
      return;
    }
      // 提交服务器的参数
    const params = {
      examine_id: summaryId,    // 汇总记录id
      examineflow_id: examineId,    // 审批流id
    };
    this.props.dispatch({
      type: 'approval/submitTypeApplyGroupE',
      payload: params,
    });
  }

  // 设置审批流id
  onChangeExamine = (e) => {
    this.setState({
      examineId: e,
    });
  }

  // 删除列表中的数据
  onClickDelete = (e) => {
    this.props.dispatch({
      type: 'approval/typeApplyDeleteE',
      payload: {
        examine_id: this.state.summaryId,   // 汇总单号
        order_id: e,  // 单条单号
        state: -1,   // -1枚举值删除
      },
    });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { summaryId } = this.state;
    this.private.dispatch({ type: 'typeApplyListE', payload: { examineflow_id: summaryId, limit, page } });
  }

  // 修改分页
  onChangePage = (page) => {
    const { summaryId } = this.state;
    this.private.dispatch({ type: 'typeApplyListE', payload: { examineflow_id: summaryId, limit: 30, page } });
  }

  // 将后台的null转换成undefined
  transNull = (value) => {
    if (value === null) {
      return undefined;
    } else {
      return value;
    }
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { detail, examineList } = this.state;
    const formItems = [
      {
        label: '申请人',
        form: dot.get(detail, 'account_name', '--'),
      }, {
        label: '总金额',
        form: renderReplaceAmount(dot.get(detail, 'total_money', '--')),
      }, {
        label: '费用类型',
        form: dot.get(detail, 'costclass_name', ExpenseType.description(ExpenseType.salary)),
      }, {
        label: '审批流程',
        form: (
          <Select placeholder="请选择审批流程" onChange={this.onChangeExamine}>
            {
              examineList.map((item, index) => {
                return <Option key={index} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>
        ),
      },
    ];

    // 基本信息的布局
    let column = 4;
    if (dot.get(this.props.approval, 'approvalProcess.results', []).length > 0) {
      formItems.splice(2, 0, {
        // 点击后，显示审核记录弹窗页面
        form: <a onClick={() => { this.setState({ visible: true }); }}>审核记录详情</a>,
      });
      column = 6;    // 布局列表
    }

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent >
        <Form layout="horizontal">
          <CoreForm items={formItems} cols={column} layout={layout} />
        </Form>
      </CoreContent>
    );
  }

  // 渲染列表数据
  renderListInfo = () => {
    const { dataSource } = this.state;
    const columns = [{
      title: '单笔流水号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '供应商',
      dataIndex: 'supplier_name_list',
      key: 'supplier_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name_list',
      key: 'platform_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '城市',
      dataIndex: 'city_name_list',
      key: 'city_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '商圈',
      dataIndex: 'district_name_list',
      key: 'district_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '姓名',
      dataIndex: 'knight_name',
      key: 'knight_name',
    }, {
      title: '职位',
      dataIndex: 'position_name',
      key: 'position_name',
    }, {
      title: '薪资时间段',
      dataIndex: 'date',
      key: 'date',
      render: (text) => {
        return text ? moment(text, 'YYYYMMDD').format('YYYY-MM-DD') : '--';
      },
    }, {
      title: '实发金额（元）',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (text) => {
        return renderReplaceAmount(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        // 单条流水号数据的id
        const recordId = record._id;
        // 薪资记录的id
        const salaryId = record.salary_id;

        return (
          <div>
            <a target="_blank" rel="noopener noreferrer" href={`/#/Salary/Search/Detail?id=${salaryId}`} style={{ marginRight: '10px' }}>查看</a>
            <Popconfirm title="确定执行操作？" onConfirm={() => { this.onClickDelete(recordId); }} okText="确定" cancelText="取消">
              <a style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showTotal: total => `总共${total}条`,
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };

    return (
      <CoreContent title="流水单数据">
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  // 渲染审核记录列表弹窗
  renderVerifyRecordsModal = () => {
    const { visible } = this.state;
    return (
      <VerifyRecordsModal title="审核记录" data={dot.get(this.props.approval, 'approvalProcess.results', [])} visible={visible} onCancel={() => { this.setState({ visible: false }); }} />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染列表数据 */}
        {this.renderListInfo()}

        {/* 渲染审核记录列表弹窗 */}
        {this.renderVerifyRecordsModal()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </CoreContent>
      </div>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(SummaryFormSalary);
