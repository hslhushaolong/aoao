// 薪资查询模块, 数据汇总页面
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Button, Table, Popconfirm, message, Alert } from 'antd';
import { CoreContent, CoreForm } from '../../../../components/core';
import { SalaryPaymentState, DutyState, renderReplaceAmount } from '../../../../application/define';
import { authorize, utils } from '../../../../application';
import Operate from '../../../../application/define/operate';
import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    const { id, platform, city, isTask, canDelay } = props.location.query;
    this.state = {
      dataSource: dot.get(props, 'salaryModel.salaryRecords', []),   // 列表数据
      salaryRecordsInfo: dot.get(props, 'salaryModel.salaryRecordsInfo', {}),    // 列表汇总数据
      selectedRowKeys: [],  // 选择要操作的数据keys
      recordId: id,   // 数据id
      platform,       // 选择的平台
      city,           // 选择的城市
      isTask,         // 是否是任务数据
      canDelay: canDelay === '1',       // 是否能执行缓发
      isProcessDownload: false,         // 是否执行下载文件操作
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
      utils.downloadFile(salaryRecordsDownloadURL, '骑士薪资明细');

      // 文件下载的操作已经结束
      isProcessDownload = false;
    }

    this.setState({
      isProcessDownload,
      dataSource: dot.get(props, 'salaryModel.salaryRecords', []),
      salaryRecordsInfo: dot.get(props, 'salaryModel.salaryRecordsInfo', {}),    // 列表汇总数据
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
    const { city, recordId, isTask } = this.state;
    params.city = city;
    params.recordId = recordId;
    params.isTask = isTask;

    // 保存搜索的参数
    this.private.searchParams = params;

    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/fetchSalaryRecords', payload: params });
    this.private.dispatch({ type: 'salaryModel/fetchSalaryRecordsInfo', payload: params });
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
      state: SalaryPaymentState.delayed,
    };
    this.private.dispatch({ type: 'salaryModel/updateSalaryRecordState', payload: params });

    // 重置选择数据
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    const { recordId, platform, city } = this.state;
    return (
      <Search recordId={recordId} platform={platform} city={city} onSearch={onSearch} onDownload={onDownload} />
    );
  }

  // 渲染汇总信息
  renderSummayInfo = () => {
    const { salaryRecordsInfo } = this.state;
    const formItems = [
      {
        form: `完成单量: ${dot.get(salaryRecordsInfo, 'order_count', 0).toFixed(2)}`,
      }, {
        form: `出单天数: ${dot.get(salaryRecordsInfo, 'issue_days', 0).toFixed(2)}`,
      }, {
        form: `准时单量: ${dot.get(salaryRecordsInfo, 'time_limit_complete_order_count', 0).toFixed(2)}`,
      }, {
        form: `超时单量: ${dot.get(salaryRecordsInfo, 'timeout_order_count', 0).toFixed(2)}`,
      }, {
        form: `底薪总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'base_salary', 0))}`,
      }, {
        form: `提成总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'percentage_amount', 0))}`,
      }, {
        form: `奖金总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'bonus_amount', 0))}`,
      }, {
        form: `扣罚总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'deduction_amount', 0))}`,
      }, {
        form: `骑士扣款总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'knight_deduction_amount', 0))}`,
      }, {
        form: `骑士补款总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'knight_payment_amount', 0))}`,
      }, {
        form: `物资扣款总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'material_deduction_amount', 0))}`,
      }, {
        form: `应发工资总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'real_pay_salary_amount', 0))}`,
      }, {
        form: `跨行费用总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'inter_bank_transfer_amount', 0))}`,
      }, {
        form: `装备扣款总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'equipment_deduction_amount', 0))}`,
      }, {
        form: `装备保证金总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'equipmen_cash_deposit_amount', 0))}`,
      }, {
        form: `三方扣款总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'three_sides_deduction_amount', 0))}`,
      }, {
        form: `实发工资总额: ${renderReplaceAmount(dot.get(salaryRecordsInfo, 'actual_pay_salary_amount', 0))}`,
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    return (
      <CoreContent title="所选城市汇总" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={6} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource, selectedRowKeys, canDelay } = this.state;
    const columns = [{
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 100,
      fixed: 'left',
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
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
    },
    {
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => {
        return authorize.roleNameById(text);
      },
    }, {
      title: '在职状态',
      dataIndex: 'work_state',
      key: 'work_state',
      render: (text) => {
        return DutyState.description(text);
      },
    }, {
      title: '骑士类型',
      dataIndex: 'knight_type_name',
      key: 'knight_type_name',
    }, {
      title: '入职时间',
      dataIndex: 'entry_date',
      key: 'entry_date',
    }, {
      title: '合同归属',
      dataIndex: 'contract_belong',
      key: 'contract_belong',
    }, {
      title: '身份证号码',
      dataIndex: 'identity_card_id',
      key: 'identity_card_id',
    }, {
      title: '完成单量',
      dataIndex: 'order_count',
      key: 'order_count',
    }, {
      title: '出单天数',
      dataIndex: 'issue_days',
      key: 'issue_days',
    }, {
      title: '人效',
      dataIndex: 'efficiency',
      key: 'efficiency',
    }, {
      title: '有效出勤',
      dataIndex: 'valid_attendance_days',
      key: 'valid_attendance_days',
    }, {
      title: '准时单量',
      dataIndex: 'time_limit_complete_order_count',
      key: 'time_limit_complete_order_count',
    }, {
      title: '超时单量',
      dataIndex: 'timeout_order_count',
      key: 'timeout_order_count',
    }, {
      title: '底薪／元',
      dataIndex: 'base_salary',
      key: 'base_salary',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '提成／元',
      dataIndex: 'percentage_amount',
      key: 'percentage_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '奖金／元',
      dataIndex: 'bonus_amount',
      key: 'bonus_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '扣罚／元',
      dataIndex: 'deduction_amount',
      key: 'deduction_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '骑士扣款／元',
      dataIndex: 'knight_deduction_amount',
      key: 'knight_deduction_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '骑士补款／元',
      dataIndex: 'knight_payment_amount',
      key: 'knight_payment_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '物资扣款／元',
      dataIndex: 'material_deduction_amount',
      key: 'material_deduction_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '应发工资／元',
      dataIndex: 'real_pay_salary_amount',
      key: 'real_pay_salary_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: <div>跨行费用／元 <div>(实扣/应扣)</div></div>,
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
      title: <div>装备扣款／元 <div>(实扣/应扣)</div></div>,
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
      title: <div>装备保证金／元 <div>(实扣/应扣)</div></div>,
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
      title: <div>三方扣款／元<div>(实扣/应扣)</div></div>,
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
      key: 'actual_pay_salary_amount',
      render: text => renderReplaceAmount(text || 0),
    }, {
      title: '工资发放状态',
      dataIndex: 'pay_salary_state',
      key: 'pay_salary_state',
      render: (text) => {
        return SalaryPaymentState.description(text);
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <a target="_blank" href={`/#/Salary/Search/Detail?id=${record._id}`}>查看</a>;
      },
    },
    ];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
    };

    // 薪资查询列表，批量缓发按钮(城市经理，城市助理) && 能够进行缓发操作（历史注释）
    let rowSelection;
    // 2018-04-17: 所有勾选改功能的角色都可操作批量缓发。
    if (Operate.canOperateSalarySearchRecordsDelayButton() && canDelay) {
      rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          this.setState({
            selectedRowKeys: selectedKeys,
          });
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          // 只有正常状态才能够选择
          disabled: `${record.pay_salary_state}` !== `${SalaryPaymentState.normal}`,
        }),
      };
    }

    return (
      <CoreContent>
        <div style={{ marginBottom: '10px' }} >
          {
            // 薪资查询列表，批量缓发按钮，勾选的角色都能够进行缓发操作
            Operate.canOperateSalarySearchRecordsDelayButton() && canDelay ?
              <Popconfirm title="确定执行操作？" onConfirm={this.onClickUpdate} okText="确定" cancelText="取消">
                <Button type="primary" style={{ marginRight: '10px' }}>批量缓发</Button>
              </Popconfirm>
              : ''
          }
        </div>
        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 3000, y: 500 }} />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent, renderSummayInfo } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}
        <Alert showIcon message="请确保查看的商圈存在骑士和有效的薪资规则，若没有则不显示薪资单。" type="info" />
        {/* 渲染汇总信息 */}
        {renderSummayInfo()}

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
