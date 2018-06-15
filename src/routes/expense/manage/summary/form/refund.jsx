// 费用申请，房租汇总申请
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { ExpenseType, ExpenseHouseState, renderReplaceAmount } from '../../../../../application/define';
import VerifyRecordsModal from '../detail/modal';

const { Option } = Select;

class SummaryFormRefund extends Component {
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
      examineId: this.transNull(dot.get(props, 'approval.examineSimpleDetail.examineflow_id', undefined)), // 审批流id, (当前页面选择的参数)
      summaryId: dot.get(props, 'summaryId', undefined),      // 汇总记录id
      detail: dot.get(props, 'approval.examineSimpleDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.typeApplyList'),   // 汇总记录，列表数据
      examineList: dot.get(props, 'approval.examineSimpleNameList', []) || [], // 审批流数据列表
    });
  }

  // 提交服务器
  onSubmit = () => {
    const { summaryId, examineId } = this.state;

    // 提交服务器的参数
    if (!examineId) {
      message.error('请选择审批流');
      return;
    }
    const params = {
      examine_id: summaryId,    // 汇总记录id
      examineflow_id: examineId,    // 审批流id
    };
    // 提交汇总单创建
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
    const { dataSource } = this.state;
    const { dispatch } = this.private;
    // 删除申请
    this.props.dispatch({
      type: 'approval/typeApplyDeleteE',
      payload: {
        examine_id: this.state.summaryId,   // 总ID
        order_id: e,   // 单条id
        state: -1,  // 枚举值 删除
      },
    });
  }

  // 创建新的数据
  onClickCreate = () => {
    const { summaryId, detail } = this.state;

    // 跳转到创建页面
    window.location.href = (`/#/Expense/Manage/Template/Create?type=${ExpenseType.refund}&summaryId=${summaryId}&name=${detail.costclass_name}&id=${detail.costclass_id}`);
  }
  // 每页展示数
  onShowSizeChange = (page, limit) => {
    const { summaryId } = this.state;
    this.private.dispatch({ type: 'typeApplyListE', payload: { examineflow_id: summaryId, limit, page } });
  }
  // 修改分页
  onChangePage = (page) => {
    const { summaryId } = this.state;
    this.private.dispatch({ type: 'typeApplyListE', payload: { examineflow_id: summaryId, limit: 30, page } });
  }
  // 根据不同房屋状态跳转到不同详情和编辑
  judgeRoute = (state, recordId) => {
    if (state === ExpenseHouseState.new || state === '') {
      return (<a href={`/#/Expense/Manage/Template/Update?recordId=${recordId}&type=${ExpenseType.refund}`} style={{ marginRight: '10px' }}>编辑</a>);
    } else {
      return (<a href={`/#/Expense/Manage/Records/Form?recordId=${recordId}&houseState=${state}`} style={{ marginRight: '10px' }}>编辑</a>);
    }
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
    let column = 4; // 基本信息的布局艰巨
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
      },
      {
        label: '审批流程',
        form: (
          <Select placeholder="请选择审批流程" defaultValue={this.transNull(this.props.approval.examineSimpleDetail.examineflow_id)} onChange={this.onChangeExamine}>
            {
              examineList.map((item, index) => {
                return <Option key={index} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>
        ),
      },
    ];
    if (dot.get(this.props.approval, 'approvalProcess.results', []).length > 0) {
      formItems.splice(2, 0, {
              // 点击后，显示审核记录弹窗页面
        form: <a onClick={() => { this.setState({ visible: true }); }}>审核记录详情</a>,
      });
      column = 6;    // 布局列表
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent>
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
      title: '科目',
      dataIndex: 'catalog_name',
      key: 'catalog_name',
    }, {
      title: '金额（元）',
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
        // 单条流水单数据id
        const recordId = record._id;
        return (
          <div>
            {this.judgeRoute(record.thing_state, recordId)}
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

    // 新建按钮
    const titleExt = (
      <Button type="primary" onClick={this.onClickCreate}>新建</Button>
    );

    return (
      <CoreContent title="流水单数据" titleExt={titleExt}>
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
export default connect(mapStateToProps)(SummaryFormRefund);
