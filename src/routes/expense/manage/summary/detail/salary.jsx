// 费用申请，薪资补发申请列表
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form, Table } from 'antd';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { renderReplaceAmount } from '../../../../../application/define';
import VerifyRecordsModal from './modal';

class SummaryDetailSalary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summaryId: dot.get(props, 'summaryId', undefined),      // 汇总记录id
      detail: dot.get(props, 'approval.examineSimpleDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.typeApplyList'),   // 汇总记录，列表数据
      visible: false, // 审核记录显示状态，默认不显示
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
    };
    this.private = {
      dispatch: props.dispatch,
    };
    console.log(dot.get(props, 'employee.positionInfoList', []))
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      summaryId: dot.get(props, 'summaryId', undefined),      // 汇总记录id
      detail: dot.get(props, 'approval.examineSimpleDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.typeApplyList'),   // 汇总记录，列表数据
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

  // 渲染基本信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '申请人',
        form: dot.get(detail, 'account_name', '--'),
      }, {
        label: '总金额',
        form: renderReplaceAmount(dot.get(detail, 'total_money', '--')),
      }, {
        label: '费用类型',
        form: dot.get(detail, 'costclass_name', '--'),
      }, {
        // 点击后，显示审核记录弹窗页面
        form: <a onClick={() => { this.setState({ visible: true }); }}>审核记录详情</a>,
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent >
        <CoreForm items={formItems} cols={4} layout={layout} />
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
        // 当前数据id
        const salaryId = record.salary_id;

        return (
          <div>
            <a target="_blank" rel="noopener noreferrer" href={`/#/Salary/Search/Detail?id=${salaryId}`} style={{ marginRight: '10px' }}>查看</a>
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };

    return (
      <CoreContent title="流水单数据" >
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  // 渲染审核记录列表弹窗
  renderVerifyRecordsModal = () => {
    const { visible, positionInfoList } = this.state;
    return (
      <VerifyRecordsModal positionInfoList={positionInfoList} title="审核记录" data={dot.get(this.props.approval, 'approvalProcess.results', [])} visible={visible} onCancel={() => { this.setState({ visible: false }); }} />
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
      </div>
    );
  }
}

function mapStateToProps({ approval, employee }) {
  return { approval, employee };
}
export default connect(mapStateToProps)(SummaryDetailSalary);
