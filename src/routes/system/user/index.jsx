/**
 * 用户管理
 * */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Form, Input, Spin, Pagination } from 'antd';
import ModalPage from './modal';
import aoaoBossTools from './../../../utils/util';
import EditModalPage from './edit';
import Search from './search';
import Operate from '../../../application/define/operate';
import { Roles } from '../../../application/define';
import Modules from './../../../application/define/modules';
import { authorize } from '../../../application';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 对话框可见性
      title: '添加用户',  // 提示
      loading: props.loading, // 添加用户loading
      editLoading: props.editLoading, // 编辑
      content: '',  // 提示内容
      total: dot.get(props, 'system.accountList._meta.result_count') || 0,  // 数据总量
      page: 1,            // 默认页码
      current: 1,         // 默认的高亮页码
      pageSize: 30,       // 每页显示数据量
      searchValue: 100,   // 默认为启用状态
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '手机',
          dataIndex: 'phone',
          key: 'phone',
        }, {
          title: '角色',
          dataIndex: 'gid',
          key: 'gid',
          render: (text) => {
            return Roles.description(text);
          },
        }, {
          title: '平台',
          dataIndex: 'platform_list',
          key: 'platform_list',
          render: (text, record) => {
            return (
              <span>{record.platform_list && record.platform_list.map((item, index) => {
                return (
                  <span key={index}>{`${item.platform_name}${index == record.platform_list.length - 1 ? '' : '、'}`}</span>);
              })}</span>
            );
          },
        }, {
          title: '城市',
          dataIndex: 'city_list',
          key: 'city_list',
          width: '240px',
          render: (text, record) => {
            return (
              <div className="overEllipsis">{record.city_list && record.city_list.map((item, index) => {
                if (item.city_name_joint) {
                  return (<span
                    key={index}
                  >{`${item.city_name_joint}${index === record.city_list.length - 1 ? '' : '、'}`}</span>);
                }
                return '--';
              })}</div>
            );
          },
        }, {
          title: '商圈',
          dataIndex: 'biz_district_list',
          key: 'biz_district_list',
          render: (text, record) => {
            if (record.district_description && record.district_description[0] === '全部') {
              return '全部';
            } else {
              return (
                <div className="overEllipsis">{record.district_description && record.district_description.map((item, index) => {
                  return (
                    <span
                      key={index}
                    >{`${item}${index === record.district_description.length - 1 ? '' : '、'}`}</span>);
                })}</div>
              );
            }
          },
        }, {
          title: '用户状态',
          dataIndex: 'state',
          key: 'state',
          render: (text, record) => {
            return (
              <span>{text === 100 ? '开启' : '关闭'}</span>
            );
          },
        }, {
          title: '最新修改时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          }
        }, {
          title: '最新操作人',
          dataIndex: 'operator_name',
          key: 'operator_name',
        }, {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (text, record) => {
            return (
              <div>{aoaoBossTools.prctoMinute(record.created_at, 3)}</div>
            );
          },
        }, {
          title: '操作',
          dataIndex: '_id',
          key: '_id',
          render: (text, record) => {
            const accountId = authorize.account.id;
            return (
              record.operable ? <a className="systemTextColor" onClick={this.showEditPage.bind(this, record)}>编辑</a> : '--'
            );
          },
        }],
      dataSource: dot.get(props, 'system.accountList.data'),
      editPage: 'none',
      userID: '',
      userDetail: '',
      employeeDetail: dot.get(props, 'system.employeeDetail'),
      supplierList: dot.get(props, 'system.supplierList.data', []),  // 可选供应商
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.state;
    const { system } = nextProps;
    const { accountList, employeeDetail, supplierList, isCreateUserSuccess, loading, editLoading } = system;
    this.setState({
      dataSource: dot.get(accountList, 'data', []),
      employeeDetail,
      supplierList: dot.get(supplierList, 'data', []),
      total: dot.get(accountList, '_meta.result_count', 0),  // 数据总量
      visible: isCreateUserSuccess === true ? false : visible,      // 判断是否创建用户成功
      loading,
      editLoading,
    });
    if (isCreateUserSuccess) {
      this.props.dispatch({ type: 'system/resetCreateAccountE' });
    }
  }

  // 根据角色获取可添加账号供应商
  getSupplierListByRole = (roleId, option) => {
    // 除超管外只可用supplierId 和supplierName
    const role = authorize.account.role.id === 1000;
    if (!role) {
      // 其他角色
      const supplierList = [];
      supplierList.push({ supplier_id: authorize.account.supplierId, supplier_name: authorize.account.supplierName });
      this.props.dispatch({ type: 'system/getSupplierListR', payload: { data: supplierList } });
      return;
    }
    // 只有超管可以获取供应商
    this.props.dispatch({
      type: 'system/getSupplierListE',
      payload: {
        permission_id: Modules.ModuleSystemUser.id,
        gid: Number(roleId),
        limit: 1000,
        page: 1,
        option,  // 查找没有添加过coo的供应商
      },
    });
  }

  // 点击分页条
  pageChange(page, pageSize) {
    this.setState({
      current: page,
      pageSize,
    });
    const { dispatch } = this.props;
    const { searchValue } = this.state;
    const value = {};
    value.limit = pageSize;
    value.page = page;
    value.state = Number(searchValue.state) || 100;
    value.permission_id = Modules.ModuleSystemUser.id;
    // 检索条件-姓名
    if (searchValue.name) {
      value.name = searchValue.name;
    }
    // 检索条件-手机号
    if (searchValue.phone) {
      value.name = searchValue.phone;
    }
    // 检索条件-角色
    if (searchValue.gid_list) {
      value.gid_list = searchValue.gid_list.map((item) => {
        return Number(item);
      });
    }
    dispatch({
      type: 'system/getAccountListE',
      payload: value,
    });
  }

  // 弹窗显示
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  // 获取edit和add的商圈列表
  getChangeAreaList = (areaList) => {
    this.setState({
      areaList,
    });
  }
  // 点击搜索,修改搜索条件
  changeSearchValue(val) {
    val = val || '';
    this.setState({
      searchValue: val,
    });
  }
  // 弹窗确认事件
  handleOk = (values) => {
    this.setState({ editPage: 'none' });
    const { dispatch } = this.props;
    const params = values;
    // 删除 平台和城市数据
    delete params.platform_code_list;
    delete params.city_spelling_list;
    delete params.supplier_id;
    dispatch({ type: 'system/addAccountE', payload: { ...params, current: this.state.current } });
    // 控制添加用户loading状态
    dispatch({ type: 'system/updateLoading' });
  };

  // 编辑弹窗确认事件
  editHandleOk = (values) => {
    const { dispatch } = this.props;
    // values.supplier_id = dot.get(this, 'state.userDetail.supplier_id');
    const params = values;
    // 删除 平台和城市数据和供应商
    delete params.platform_code_list;
    delete params.city_spelling_list;
    delete params.supplier_id;
    params.current = 1;

    dispatch({
      type: 'system/updateAccountE',
      payload: params,
    });
    this.setState({
      // visible: false,
      editPage: 'none',
    });
    // 控制编辑用户loading状态
    dispatch({ type: 'system/updateEditLoading' });
    // 重置所有搜索条件
    this.searchPage.resetFields();
  };

  // 弹窗取消事件
  handleCancel = () => {
    this.setState({
      visible: false,
      editPage: 'none',
    });
  };

  // 查询员工列表信息
  getEmployeeList = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/getEmployeeListOfAccountE',
      payload: { option: true, ...value },  // option 过滤是否由该用户创建的员工
    });
  };

  // 控制编辑页面的加载
  showEditPage = (record) => {
    this.setState({
      editPage: 'block',
      userDetail: record,
    });
  };

  // 编辑用户信息
  editModal = () => {
    const props = {
      // visible: this.state.visible,
      userDetail: this.state.userDetail,
      getChangeAreaList: this.getChangeAreaList,          // 获取商圈列表
      // update
      supplierList: this.state.supplierList,
      getSupplierListByRole: this.getSupplierListByRole,  // 根据角色获取可选供应商
      positionInfoList: this.state.positionInfoList,      // 职位信息
      loading: this.state.editLoading,     // 编辑用户loading
    };
    return (
      <div>
        <EditModalPage
          {...props}
          handleCancel={this.handleCancel}
          handleOk={this.editHandleOk}
          ref={(ref) => {
            this.editPage = ref;
          }}
        />
      </div>);
  };

  render() {
    const props = {
      visible: this.state.visible,
      title: this.state.title,
      content: this.state.content,
      employeeDetail: this.state.employeeDetail,
      getChangeAreaList: this.getChangeAreaList,  // 获取商圈列表
      // update
      supplierList: this.state.supplierList,
      getSupplierListByRole: this.getSupplierListByRole,  // 根据角色获取可选供应商
      positionInfoList: this.state.positionInfoList,   // 职位信息
      loading: this.state.loading,  // 编辑用户loading
    };
    return (
      <div>
        <Search
          changeSearchValue={this.changeSearchValue.bind(this)}
          showModal={this.showModal.bind(this)}
          positionInfoList={this.state.positionInfoList}
          ref={(ref) => {
            this.searchPage = ref;
          }}
        />
        <Table
          pagination={false} columns={this.state.columns} dataSource={this.state.dataSource}
          rowKey={(record, index) => {
            return index;
          }}
          bordered
        />
        <div className="fltr">
          {
            this.state.total > 0 ?
              <Pagination
                onChange={this.pageChange.bind(this)}
                className="mgt8"
                total={this.state.total}
                showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
                pageSize={this.state.pageSize}
                current={this.state.current}
              />
              : ''
          }
        </div>
        <div className="textCenter">
          {/* <Button type="primary" className="mgt8" onClick={this.showModal}>添加用户</Button>*/}
          <ModalPage
            {...props}
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            getEmployeeList={this.getEmployeeList}
          />
          {
            this.state.editPage === 'block' && this.editModal()
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps({ system, employee }) {
  return { system, employee };
}

export default connect(mapStateToProps)(User);
