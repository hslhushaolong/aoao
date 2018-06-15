/**
 * 薪资模板列表
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Table, Button, Popconfirm, Popover, message } from 'antd';
import moment from 'moment';

import Operate from '../../../application/define/operate';
import { CoreContent } from '../../../components/core';
import { SalaryVerifyState, SalaryPaymentCricle } from '../../../application/define';
import { authorize } from '../../../application';
import Modal from './modal';

import Search from './search';

class Index extends Component {
  constructor(props) {
    super();
    this.state = {
      list: dot.get(props, 'salaryModel.salarySetupList', []),
      visible: false,       // 模态框状态
      selectedRowKeys: [],  // 保存批量数据
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
    };
    this.private = {
      searchParams: {
        page: 1,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'salaryModel.salarySetupList', []),
      positionList: dot.get(nextProps, 'salaryModel.positionList', []),   // 职位数据
    });
  }

  // 跳转到创建薪资模版页面
  onDirctToCreate = () => {
    window.location.href = '/#/Salary/Setting/Create?mode=create';
  }

  // 审核通过
  onApprove = (type, id) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const payload = {
      id: [id],
    };
    // 批量同意
    if (type === 'select' && selectedRowKeys.length === 0) {
      return message.error('请选择要审核的数据');
    }
    if (type === 'select' && selectedRowKeys.length >= 1) {
      payload.id = selectedRowKeys;
    }
    dispatch({ type: 'salaryModel/approveSalarySetup', payload });
    // 清空选中项
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 审核单个驳回-不通过状态
  onReject = (id) => {
    this.setState({
      visible: true, // 显示模态框
      selectedRowKeys: [id], // 保存批量数据
    });
  }
  // 批量驳回
  onRejectMany = (visible) => {
    this.setState({
      visible, // 显示模态框
    });
  }
  // 驳回原因
  onHandleSubmit = (text) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const payload = {};
    // 批量驳回
    if (selectedRowKeys.length === 0) {
      return message.error('请选择要审核的数据');
    }
    if (selectedRowKeys.length >= 1) {
      payload.id = selectedRowKeys; // 保存批量数据
      payload.reject_reason = text.description; // 驳回原因
    }
    dispatch({ type: 'salaryModel/rejectSalarySetup', payload });
    // 清空选中项
    this.setState({
      selectedRowKeys: [],
      visible: false,   // 关闭模态框
    });
  }

  // 停用
  onStopSetup = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'salaryModel/salarySettingStop', payload: { id: [id], state: SalaryVerifyState.stoping } });
  }
  // 删除-同撤回、停用共用一个接口
  onDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'salaryModel/salarySettingStop', payload: { id: [id], state: SalaryVerifyState.remove } });
  }
  // 撤回: 待审核状态撤回后，状态为待提交(保存后状态)
  onRevocation = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'salaryModel/salarySettingStop', payload: { id: [id], state: SalaryVerifyState.saving } });
  }

  // 修改分页
  onChangePage = (page) => {
    const { dispatch } = this.props;
    const { searchParams } = this.private;
    searchParams.page = page;
    dispatch({ type: 'salaryModel/getSetupSalaryListE', payload: searchParams });
  }
  // 行选择
  onChangeSelection = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  // 取消modal
  onCancel = () => {
    this.setState({ visible: false });
  }

  // 禁选
  getCheckboxProps = record => ({
    disabled: record.state !== SalaryVerifyState.pendding,
  })
  // 搜索
  searchHandle = (payload = {}) => {
    const { dispatch } = this.props;
    this.private.searchParams = payload;
    dispatch({ type: 'salaryModel/getSetupSalaryListE', payload });
  }

  // 渲染=搜索功能
  renderSearch = () => {
    const props = {
      positionList: this.state.positionList,
    };
    return (
      <Search searchHandle={this.searchHandle} {...props} />
    );
  };

  // 渲染列表
  renderContent = () => {
    const { list } = this.state;
    const dataSource = list.data ? list.data : [];
    const columns = [{
      title: '城市',
      dataIndex: 'city_list',
      key: 'city_list',
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
          const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
          names = (
            <Popover placement="top" content={content} trigger="hover">
              {text[0]}等{text.length}个城市
            </Popover>
          );
        }
        return names;
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_list',
      key: 'biz_district_list',
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
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => { return authorize.poistionNameById(text); },
    }, {
      title: '骑士类型',
      dataIndex: 'knight_type_list',
      key: 'knight_type_list',
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
          const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
          names = (
            <Popover placement="top" content={content} trigger="hover">
              {text[0]}等{text.length}个商圈
            </Popover>
          );
        }
        return names;
        // return system.knightTypeById(text);
      },
    }, {
      title: '薪资计算周期',
      dataIndex: 'pay_salary_cycle',
      key: 'pay_salary_cycle',
      render: text => SalaryPaymentCricle.description(text),
    }, {
      title: '创建时间',
      dataIndex: 'date',
      key: 'date',
      render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'; },
    }, {
      title: '生效时间',
      dataIndex: 'enabled_time',
      key: 'enabled_time',
      render: (text, record) => {
        // 如果是待审核状态，或者是审核不通过，不显示生效时间
        if (record.state === SalaryVerifyState.pendding || record.state === SalaryVerifyState.reject) {
          return '--';
        } else {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        }
      },
    }, {
      title: '失效时间',
      dataIndex: 'disabled_time',
      key: 'disabled_time',
      render: (text, record) => {
        // 停用状态下才会显示
        if (record.state !== SalaryVerifyState.stoping) {
          return '--';
        } else {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        }
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        // 不通过时，添加驳回原因
        if (text === SalaryVerifyState.reject) {
          const title = record.reject_reason ? record.reject_reason : '--';
          return (
            <Popover placement="top" content={title} trigger="hover">
              {SalaryVerifyState.description(text)}
            </Popover>
          );
        }
        return SalaryVerifyState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'operation',
      width: '180px',
      render: (text, record) => {
        // 是否显示同意和驳回按钮（待审核状态下显示 && coo 有审核驳回权限）
        const isShowOperation = (record.state === SalaryVerifyState.pendding) && Operate.canOperateSalarySettingVerifyButton();
        // 是否显示撤回按钮(待审核状态显示 && coo 有撤回权限)
        const isShowRevocation = (record.state === SalaryVerifyState.pendding) && Operate.canOperateSalarySettingWithdrawButton();
        // 是否显示编辑按钮（审核未通过状态下 && 城市经理有编辑权限）
        const isShowEdit = (record.state === SalaryVerifyState.reject || record.state === SalaryVerifyState.saving) && Operate.canOperateSalarySettingEditButton();
        // 是否显示停用按钮（待使用，使用中，不通过状态下 && 权限选择）
        const isShowStop = ([SalaryVerifyState.waiting, SalaryVerifyState.working, SalaryVerifyState.reject].includes(record.state)) && Operate.canOperateSalarySettingStopButton();
        // 是否显示复制按钮 (根据权限选择判断)
        const isShowCopy = Operate.canOperateSalarySettingCopyButton();
        // 是否显示删除按钮-只有待提交状态展示
        const isShowDelete = record.state === SalaryVerifyState.saving;
        //
        const title = (
          <div>
            <div style={{ color: 'orange', fontSize: '16px', marginBottom: '10px' }}>确认停用该薪资规则？</div>
            <div>备注：规则停用后，可能影响对应使用商圈的薪资计算，</div>请尽快在系统出薪资前创建新规则。
          </div>
        );
        return (
          <div style={{ width: '180px' }}>
            <a target='_blank' href={`/#/Salary/Setting/Detail?id=${text}`} style={{ marginRight: '10px' }}>详情</a>

            {/* 编辑按钮 */}
            {
              isShowEdit ?
                <a href={`/#/Salary/Setting/Create?mode=edit&id=${text}`} style={{ marginRight: '10px' }}>编辑</a> : ''
            }

            {/* 复制按钮 */}
            {
              isShowCopy ?
                <a href={`/#/Salary/Setting/Create?mode=copy&id=${text}`} style={{ marginRight: '10px' }}>复制</a> : ''
            }

            {/* 停用按钮*/}
            {
              isShowStop ?
                <Popconfirm title={title} onConfirm={() => { this.onStopSetup(text); }} okText="确定" cancelText="取消">
                  <a href="停用按钮" style={{ marginRight: '10px' }}>停用</a>
                </Popconfirm> : ''
            }

            {/* coo 有审核权限 */}
            {
              isShowOperation ? <a style={{ marginRight: '10px' }} onClick={() => { this.onReject(text); }}>驳回</a> : ''
            }
            {
              isShowOperation ?
                <Popconfirm title="您确定同意该模板吗?" onConfirm={() => { this.onApprove('single', text); }} okText="确定" cancelText="取消">
                  <a href="#" style={{ marginRight: '10px' }}>同意</a>
                </Popconfirm> : ''
            }
            {/* 撤回 isShowRevocation*/}
            {
              isShowRevocation ?
                <Popconfirm title="撤回该模版?" onConfirm={() => { this.onRevocation(text); }} okText="确定" cancelText="取消">
                  <a href="#" style={{ marginRight: '10px' }}>撤回</a>
                </Popconfirm> : ''
            }
            {
              isShowDelete ?
                <Popconfirm title="您确定删除该模板吗?" onConfirm={() => { this.onDelete(text); }} okText="确定" cancelText="取消">
                  <a href="#" style={{ marginRight: '10px' }}>删除</a>
                </Popconfirm> : ''
            }
          </div>
        );
      },
    }];


    // 判断是否有权限使用新建薪资模版的功能
    let ext = '';
    if (Operate.canOperateSalarySettingCreateButton()) {
      ext = (<Button type="primary" onClick={this.onDirctToCreate}>新建薪资模版</Button>);
    }

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(list, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
    };
    // rowSelection
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onChangeSelection,
      getCheckboxProps: this.getCheckboxProps,
    };

    return (
      <div>
        <Popconfirm title="您确定同意该模板吗?" onConfirm={() => { this.onApprove('select'); }} okText="确定" cancelText="取消">
          <Button type="primary" style={{ marginRight: '10px' }}>同意</Button>
        </Popconfirm>
        <Button type="primary" onClick={() => this.onRejectMany(true)} > 驳回</Button>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="列表" titleExt={ext}>
          <Table rowSelection={rowSelection} rowKey={record => record._id} dataSource={dataSource} columns={columns} pagination={pagination} bordered />
        </CoreContent>
      </div>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    const props = {
      visible: this.state.visible,
      onHandleSubmit: this.onHandleSubmit,
      onCancel: this.onCancel,
    };
    return (
      <div>
        {renderSearch()}
        {renderContent()}
        {<Modal {...props} />}
      </div>);
  }
}

const mapStateToProps = ({ salaryModel }) => {
  return { salaryModel };
};

export default connect(mapStateToProps)(Index);
