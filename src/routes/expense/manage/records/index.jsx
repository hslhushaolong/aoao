// 费用记录明细列表页面
import moment from 'moment';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Table, Popconfirm, Button } from 'antd';
import { CoreContent } from '../../../../components/core';
import { ExpenseType, ExpenseVerifyState, ExpenseHouseState, renderReplaceAmount } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import { authorize } from '../../../../application';
import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      selectedRowKeys: [],  // 批量选择，选中的数据
      dataSource: dot.get(props, 'approval.getRecordList', []), // 列表数据
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      dataSource: dot.get(props, 'approval.getRecordList', []),
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    // 调用搜索
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    this.private.dispatch({ type: 'approval/getRecordListE', payload: this.private.searchParams });
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

  // 批量续租
  onUpdateRecord = (ids, state) => {
    const params = {
      c_type: 2,      // 批量续租 判断创建页面 1 初创新增 2 续租、批量续租 3 批量缓发薪资
      apply_id_list: this.state.selectedRowKeys,    // 数据要更新的状态
    };
    this.props.dispatch({
      type: 'approval/batchRecordEditE',
      payload: params,
    });
  }
  // 断租／续租／续签／退租等操作
  recordEdit =(recordId, hourseState, summaryId) => {
    this.props.dispatch({
      type: 'approval/recordEditE',
      payload: {
        order_id: recordId,
        thing_state: parseFloat(hourseState),
        summaryId,    // 记录汇总id
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
    const { dataSource, selectedRowKeys } = this.state;

    const columns = [{
      title: '流水号',
      dataIndex: 'examine_id',
      key: 'examine_id',
    }, {
      title: '单笔流水号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '费用类型',
      dataIndex: 'costclass_name',
      key: 'costclass_name',
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
      title: '申请日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '申请人',
      dataIndex: 'apply_account_name',
      key: 'apply_account_name',
    }, {
      title: '金额（元）',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (text) => {
        return renderReplaceAmount(text);
      },
    }, {
      title: '房屋状态',
      dataIndex: 'thing_state',
      key: 'thing_state',
      render: (text) => {
        return ExpenseHouseState.description(text);
      },
    }, {
      title: '状态',
      dataIndex: 'examine_state',
      key: 'examine_state',
      render: (text) => {
        return ExpenseVerifyState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        // 汇总数据id
        const summaryId = record.examine_id;
        // 单条数据id
        const recordId = record._id;
        // 判断是否是新租
        let isNew = false;
        if (record.thing_state === ExpenseHouseState.new) {
          isNew = true;
        }

        const {
          relet,          // 续租
          break: bre,     // 断租
          renew,          // 续签
          quit,           // 退租
            } = text;
        // 判断房屋状态是否存在，如果不存在就设置模版类型为报销，并且跳转到报销模版的详情页面
        if (record.thing_state === '' || !record.thing_state) {
          return (
            <div>
              {/* 详情 */}
              <a href={`/#/Expense/Manage/Template/Detail?recordId=${recordId}&type=${ExpenseType.refund}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>查看</a>
            </div>
          );
        }

        return (
          <div>
            {/* 详情 */}
            {isNew === true ? <a href={`/#/Expense/Manage/Template/Detail?recordId=${recordId}&type=${ExpenseType.rent}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>查看</a>
            : <a href={`/#/Expense/Manage/Records/Detail?recordId=${recordId}&houseState=${record.thing_state}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>查看</a>
            }
            {record.apply_account_id === authorize.account.id ? <span>
              {/* 续租 */}
              {relet === true && Operate.canOperateExpenseManageRecordsEditButton() ?
                <Popconfirm title="你确定要续租吗?" onConfirm={() => { this.recordEdit(recordId, ExpenseHouseState.continue, summaryId); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>续租</a>
                </Popconfirm>
            : '' }
              {/* 退租 */}
              {quit === true && Operate.canOperateExpenseManageRecordsEditButton() ?
                <Popconfirm title="你确定要退租吗?" onConfirm={() => { this.recordEdit(recordId, ExpenseHouseState.cancel, summaryId); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>退租</a>
                </Popconfirm>
            : '' }
              {/* 续签 */}
              {renew === true && Operate.canOperateExpenseManageRecordsEditButton() ?
                <Popconfirm title="你确定要续签吗?" onConfirm={() => { this.recordEdit(recordId, ExpenseHouseState.sign, summaryId); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>续签</a>
                </Popconfirm>
            : '' }
              {/* 断租 */}
              {bre === true && Operate.canOperateExpenseManageRecordsEditButton() ?
                <Popconfirm title="你确定要断租吗?" onConfirm={() => { this.recordEdit(recordId, ExpenseHouseState.break, summaryId); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>断租</a>
                </Popconfirm>
            : '' }
            </span> : ''}
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showTotal: total => `总共${total}条`,
      showQuickJumper: true,                // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };

    // 薪资缓发|补发明细,提交审批按钮(运营)
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedKeys,
        });
      },
      getCheckboxProps: record => ({
          // 工资发放状态必须是缓发才能操作
        disabled: record.operation.relet !== true,
      }),
    };

    return (
      <CoreContent>

        {/* 批量续租 */}
        <div style={{ marginBottom: '10px' }} >
          <Popconfirm title="执行操作？" onConfirm={() => { this.onUpdateRecord(selectedRowKeys, ExpenseHouseState.continue); }} okText="确定" cancelText="取消">
            <Button type="primary" style={{ marginRight: '10px' }}>批量续租</Button>
          </Popconfirm>
        </div>

        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
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

function mapStateToProps({ approval }) {
  return { approval };
}
IndexPage = Form.create()(IndexPage);
export default connect(mapStateToProps)(IndexPage);
