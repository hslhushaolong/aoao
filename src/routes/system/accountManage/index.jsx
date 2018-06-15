/**
 * Created by hejiaoyan 2018/03/13
 * 多账号index
 *
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Select, Form, Table, Pagination, Popconfirm, Modal, Message } from 'antd';
import moment from 'moment';
import { authorize } from '../../../application';
// 手机校验正则
import { PhoneRegExp } from '../../../application/define';
import Search from './search';
import Add from './add';
import Edit from './edit';

// import { AccountModal } from './edit';

const [FormItem, Option] = [Form.Item, Select.Option];

class AccountManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOperationSuccess: props.isOperationSuccess,  // 判断是否添加或编辑成功（清除表单）
      optionIds: [],          // 当前记录操作记录
      visible: false,         // 控制模态框
      type: '',               // 区分add or edit or 删除
      page: 1,                // 当前页
      limit: 10,              // 每页显示条数
      accountsList: props.accountsList,   // 列表数据
      allAccounts: [],        // 所有有效账号
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '关联账号',
          dataIndex: 'phones',
          key: 'phones',
        },
        {
          title: '最新修改时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (text, record) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          },
        }, {
          title: '最新操作人',
          dataIndex: 'operator_name',
          key: 'operator_name',
        }, {
          title: '操作',
          dataIndex: 'id',
          key: 'option',
        },
      ],
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillMount() {
    const { dispatch } = this.private;
    // 获取关联账号列表
    dispatch({ type: 'system/getAccountsListE' });
    // 获取所有手机号
    dispatch({
      type: 'system/getAllAccountsE',
      payload: {
        state: 100, // 100-可用账号， -100-不可用账号
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { system } = nextProps;
    const { accountsList, allAccounts, visible, isOperationSuccess } = system;
    this.setState({
      visible,
      accountsList,
      allAccounts,
      isOperationSuccess,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '关联账号',
          dataIndex: 'phones',
          key: 'phones',
          render: (text, record) => {
            return text.length > 0 ? text.join(',') : '--';
          },
        },
        {
          title: '最新修改时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (text, record) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          },
        }, {
          title: '最新操作人',
          dataIndex: 'operator_name',
          key: 'operator_name',
        }, {
          title: '操作',
          dataIndex: 'id',
          key: 'option',
          render: (text, record) => {
            return (
              <span>
                <a onClick={() => { this.showModal('edit', true, record); }} style={{ color: 'orange', marginRight: '10px' }}>编辑</a>
                <Popconfirm
                  title={'你确定要将该账号关联全部解除？'}
                  onConfirm={() => this.hanleSubmit(text)}
                  // onCancel={this.cancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <a onClick={() => { this.showModal('cancel', false, record); }} style={{ color: 'orange', marginRight: '10px' }}>全部解除关联</a>
                </Popconfirm>
              </span>
            );
          },
        },
      ],
    });
    // 清除表单
    if (visible && isOperationSuccess) {
      this.setState({
        visible: false,
      });
      // 清空表单
      if (this.state.type === 'add') {
        this.props.form.setFieldsValue({ addPhone: [] });
      } else {
        this.props.form.setFieldsValue({ editPhone: [] });
      }
    }
  }

  // 分页函数
  onChangePage = (page) => {
    this.setState({ page }, () => {
      const { dispatch } = this.private;
      dispatch({ type: 'system/getAccountsListE', payload: { page } });
    });
  }
  // 支持修改pageSize
  onChangeLimit = (page, limit) => {
    this.setState({ page, limit }, () => {
      const { dispatch } = this.private;
      dispatch({ type: 'system/getAccountsListE', payload: { page, limit } });
    });
  }

  // 控制模态框状态
  showModal = (type, bool, record = []) => {
    // update type
    this.setState({
      visible: bool,
      type,                 // 判断是编辑还是新建的莫泰框类型
      optionIds: record,    // 当前操作账号记录
    });
  }

  // 添加 or 编辑 or 解除关联账号 dispatch
  hanleSubmit = (phoneList) => {
    const { dispatch } = this.private;
    const { type, optionIds } = this.state;
    // 添加时禁止为空
    if (type === 'add' && phoneList.length <= 0) {
      return Message.info('请选择关联手机号', 3);
    }
    // 点击添加
    if (type === 'add') {
      dispatch({
        type: 'system/getAddAccountsE',
        payload: {
          account_ids: phoneList,
        },
      });
    }

    // 编辑
    if (type === 'edit') {
      dispatch({
        type: 'system/getEditAccountsE',
        payload: {
          id: optionIds.id,
          account_ids: phoneList,
        },
      });
    }

    // 解除关联账号
    if (type === 'cancel') {
      dispatch({
        type: 'system/getEditAccountsE',
        payload: {
          id: optionIds.id,
          account_ids: [],
          state: -100,      // -100禁用, 100 启用
        },
      });
    }
  }

  // 渲染模态框
  renderModalComponent = () => {
    const { type, visible, optionIds, allAccounts } = this.state;
    if (type === 'add') {
      const addProps = {
        visible,
        allAccounts,
        showModal: this.showModal,
        hanleSubmit: this.hanleSubmit,
      };
      return <Add {...addProps} />;
    } else {
      const editProps = {
        visible,
        allAccounts,
        optionIds,
        showModal: this.showModal,
        hanleSubmit: this.hanleSubmit,
      };
      return <Edit {...editProps} />;
    }
  }

  // 渲染表格
  renderTableCompoment = () => {
    const { columns, limit, page, accountsList } = this.state;

    const dataSource = dot.get(accountsList, 'data');
    const total = dot.get(accountsList, '_meta.result_count');

    return (
      <div>
        <Table
          // scroll={{ x: 2000 }}
          rowKey={(record, index) => { return ((index * 10) + 1); }}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Pagination
          style={{ float: 'right' }}
          total={total}
          showTotal={all => `总共 ${all} 条`}
          pageSize={limit}
          defaultCurrent={1}
          current={page}
          onChange={this.onChangePage}
          onShowSizeChange={this.onChangeLimit}
          showQuickJumper
          showSizeChanger
        />
      </div>
    );
  }
  // 渲染
  render() {
    const { allAccounts, visible } = this.state;
    const searchProps = {
      allAccounts,
      showModal: this.showModal,
    };

    return (
      <div>
        {/* 渲染检索条件 */}
        <Search {...searchProps} />
        {/* 渲染表格组件 */}
        {this.renderTableCompoment()}
        {/* 渲染模态框组件 */}
        {visible && this.renderModalComponent()}
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}
export default connect(mapStateToProps)(Form.create()(AccountManage));
