/**
 * 员工查询模块
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Pagination } from 'antd';

import Operate from '../../../application/define/operate';
import Modules from '../../../application/define/modules';
import { DutyState } from '../../../application/define';
import { authorize } from '../../../application';
import Table from '../../../components/table';
import aoaoBossTools from '../../../utils/util';
import Search from './search';
import KnightLeaveCheck from './knightLeaveCheck';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: dot.get(props, 'employee.employeeList._meta.result_count') || 0,  // 数据总量
      page: 1, // 默认页码
      current: 1, // 默认的高亮页码
      pageSize: 30,  // 每页数据量
      searchValue: {  // 搜索条件
        state: DutyState.onDuty,  // 在职
      },
      visible: false,  // 对话框
      staffId: '',  // 员工id
      positionId: '',  // 职位id
      knightTypeId: '',  // 骑士类型id
      record: {},  // 记录
      detail: dot.get(props, 'employee.employeeDetail'),  // 详情
      dataSource: dot.get(props, 'employee.employeeList.data'),  // 数据源
      knightTypeList: dot.get(props, 'employee.knightTypeList.data'),  // 骑士类型
      contractBelong: dot.get(props, 'system.companyList.data', []), // 合同归属
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
      knightColumns: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '115px',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '145px',
      },
      {
        title: '职位',
        dataIndex: 'position_id',
        key: 'position_id',
        width: '145px',
        render: (text) => {
          const position = this.state.positionInfoList.find(item => item.gid === text);
          return position ? position.name : '未定义';
        },
      },
      {
        title: '骑士类型',
        dataIndex: 'knight_type_name',
        key: 'knight_type_name',
        width: '145px',
      },
      {
        title: '第三方平台骑士ID',
        dataIndex: 'associated_knight_id_list',
        key: 'associated_knight_id_list',
        width: '130px',
        render: (text, record) => {
          if (Operate.knightTypeShow(record.position_id)) {
            let string = '';
            const len = record.associated_knight_id_list.length;
            const arr = record.associated_knight_id_list || [];
            arr.forEach((item, index) => {
              string += `${item}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          } else {
            return '--';
          }
        },
      }, {
        title: '供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        width: '100px',
      }, {
        title: '平台',
        dataIndex: 'platform_list',
        key: 'platform_list',
        width: '100px',
        render: (text, record) => {
          return (
            <span>{record.platform_list && record.platform_list.map((item, index) => {
              return (
                <span
                  key={index}
                >{`${item.platform_name}${index == record.platform_list.length - 1 ? '' : '、'}`}</span>);
            })}</span>
          );
        },
      }, {
        title: '城市',
        dataIndex: 'city_list',
        key: 'city_list',
        width: '220px',
        render: (text, record) => {
          return (
            <div className="overEllipsis">{ record.city_list && record.city_list.map((item, index) => {
              return (<span
                key={index}
              >{`${item.city_name_joint}${index == record.city_list.length - 1 ? '' : '、'}`}</span>);
            })}</div>
          );
        },
      }, {
        title: '商圈',
        dataIndex: 'district_description',
        key: 'district_description',
        width: '220px',
        render: (text, record) => {
          if (record.district_description && record.district_description[0] === '全部') {
            return '全部';
          } else {
            return (
              <div className="overEllipsis">{ record.district_description && record.district_description.map((item, index) => {
                return (
                  <span
                    key={index}
                  >{`${item}${index === record.district_description.length - 1 ? '' : '、'}`}</span>);
              })}</div>
            );
          }
        },
      }, {
        title: '合同归属',
        dataIndex: 'contract_belong_name',
        key: 'contract_belong_name',
        width: '80px',
      }, {
        title: '在职状态',
        dataIndex: 'state',
        key: 'state',
        width: '80px',
        render: (text) => {
          return aoaoBossTools.enumerationConversion(text);
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: '_id',
        width: '200px',
        render: (text, record, index) => {
          // 账号id
          const accountId = authorize.account.id;
          // 判断当前数据是否是下级
          const isSuperior = authorize.positions(true, true).find(item => item.id === record.position_id);
          return (
            <div style={{ width: '60px' }}>
              {
                // 查看员工详情按钮
                Operate.canOperateEmployeeSearchDetailButton() ?
                  <p><Link to={`Employee/Detail?id=${record._id}`} className="mgl8 systemTextColor pointer">查看详情</Link></p> : ''}
              {
                // 当前登陆用户的下级 & 状态不等于离职 & 拥有编辑员工信息按钮权限
                record.operable ? <p><Link
                  to={`Employee/Edit?id=${record._id}`}
                  className="mgl8 systemTextColor pointer"
                >编辑</Link></p> : ''
              }
              {
                // 当前登陆用户的下级 & 状态不等于离职 & 拥有查看员工显示离职按钮权限
                record.operable ?
                  <p onClick={this.employeeLeave.bind(this, record)} className="mgl8 systemTextColor pointer">离职</p> : ''
              }
            </div>
          );
        },
      }],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'employee.employeeList.data'),
      total: dot.get(nextProps, 'employee.employeeList._meta.result_count') || 0,
      detail: dot.get(nextProps, 'employee.employeeDetail'),
      knightTypeList: dot.get(nextProps, 'employee.knightTypeList.data'),  // 骑士类型
      contractBelong: dot.get(nextProps, 'system.companyList.data', []), // 合同归属
    });
  }

  // 弹窗显示
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // 员工离职
  employeeLeave(record) {
    const { _id, knight_type_id, position_id } = record;
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      staffId: _id,
      positionId: position_id,
      knightTypeId: knight_type_id,
      record,
    });
    dispatch({
      type: 'employee/getEmployeeDetailE',
      payload: {
        staff_id: _id,
        permission_id: Modules.ModuleEmployeeUpdate.id,
      },
    });
  }

  // 分页
  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    this.setState({
      current: page,
      pageSize,
    });
    const value = this.state.searchValue;
    value.limit = pageSize;
    value.page = page;
    value.permission_id = Modules.ModuleEmployeeSearch.id;
    dispatch({
      type: 'employee/getEmployeeListE',
      payload: value,
    });
  };

  // 弹窗取消事件
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 离职审批
  handleOk = (values) => {
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    const departureApproverAccountId = authorize.account.id;
    values.state = DutyState.onResign;// 离职状态
    values.staff_id = this.state.staffId;
    values.departure_approver_account_id = departureApproverAccountId;
    values.account_id = departureApproverAccountId;
    values.departure_date = moment().format('YYYY-MM-DD');
    values.option = true;  // 此属性区别离职审批和编辑员工调用该接口
    values.permission_id = Modules.OperateEmployeeResignVerifyButton.id;
    values.position_id = this.state.positionId;
    values.knight_type_id = this.state.knightTypeId;
    dispatch({
      type: 'employee/employeeEditE',
      payload: values,
    });
  };

  // 查询
  handleSearch = (value) => {
    const { dispatch } = this.props;
    this.setState({
      searchValue: value,
      current: 1,
    });
    value.limit = this.state.pageSize;
    value.page = this.state.page;
    value.permission_id = Modules.ModuleEmployeeSearch.id;
    dispatch({
      type: 'employee/getEmployeeListE',
      payload: value,
    });
  };

  // 导出员工
  exportEmployee = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/exportEmployeeE',
      payload: value,
    });
  };

  render() {
    const props = {
      columns: this.state.knightColumns,
      dataSource: this.state.dataSource,
    };
    return (
      <div>
        <Search
          search={this.handleSearch}
          export={this.exportEmployee}
          knightTypeList={this.state.knightTypeList}
          contractBelong={this.state.contractBelong}
          positionInfoList={this.state.positionInfoList}
        />
        <Table {...props} bordered />
        <div className="fltr">
          {
            this.state.total > 0 ?
              <Pagination
                onChange={this.pageChange}
                className="mgt8"
                total={this.state.total}
                showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
                pageSize={this.state.pageSize}
                current={this.state.current}
              /> : ''
            }
        </div>
        <KnightLeaveCheck
          {...{ detail: this.state.detail, visible: this.state.visible }}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
        />
      </div>
    );
  }

}
function mapStateToProps({ employee, system }) {
  return { employee, system };
}
export default connect(mapStateToProps)(Page);
