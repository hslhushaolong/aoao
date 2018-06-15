/**
 * 员工离职审批模块
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Pagination, Form, Row, Col, Select, Button, Input } from 'antd';
import moment from 'moment';
import dot from 'dot-prop';
import aoaoBossTools from './../../../utils/util';
import Operate from '../../../application/define/operate';
import Table from './../../../components/table';
import LeaveDetail from './leaveDetail';
import { authorize } from '../../../application';
import { Position } from '../../../application/define';
import Modules from '../../../application/define/modules';

const [FormItem, Option] = [Form.Item, Select.Option];

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,  // 总量
      pageSize: 30,  // 每页显示数据量
      current: 1,  // 当前页
      leaveDetail: dot.get(props, 'employee.leaveDetail'),  // 离职详情
      ModalFlag: dot.get(props, 'employee.ModalFlag'),  // 对话框
      cityList: [],  // 城市
      areaList: [],  // 商圈
      searchValue: {},  // 查询条件
      dataSource: dot.get(props, 'employee.employeeList.data', []),  // 员工信息
      knightTypeList: dot.get(props, 'employee.knightTypeList.data'),  //  骑士类型列表
      knightColumns: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '平台',
        dataIndex: 'platform_list',
        key: 'platform_list',
        render: (text, record) => {
          return (
            <span>{record.platform_list.map((item, index) => {
              return (
                <span
                  key={index}
                >{`${item.platform_name}${index === record.platform_list.length - 1 ? '' : '、'}`}</span>);
            })}</span>
          );
        },
      }, {
        title: '城市',
        dataIndex: 'city_list',
        key: 'city_list',
        render: (text, record) => {
          return (
            <div className="overEllipsis">{record.city_list.map((item, index) => {
              return (
                <span key={index}>
                  {`${item.city_name_joint}${index === record.city_list.length - 1 ? '' : '、'}`}
                </span>);
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
        title: '职位',
        dataIndex: 'position_id',
        key: 'position_id',
        render: (text) => {
          return authorize.poistionNameById(text);
        },
      }, {
        title: '骑士类型',
        dataIndex: 'knight_type_name',
        key: 'knight_type_name',
        render: (text, record) => {
          if (Operate.knightTypeShow(record.position_id)) {
            return text;
          } else {
            return '--';
          }
        },
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return aoaoBossTools.enumerationConversion(text);
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: '_id',
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={this.showDetail.bind(this, index)} className="mgl8 systemTextColor pointer">查看详情</span>
              {
                // 1是离职待审核
                !record.operable ? '' :
                <span>
                  <span
                    onClick={this.employeeLeave.bind(this, record)}
                    className="mgl8 systemTextColor pointer"
                  >同意离职</span>
                  <span
                    onClick={this.reject.bind(this, record)}
                    className="mgl8 systemTextColor pointer"
                  >驳回</span>
                </span>
              }
            </div>
          );
        },
      }],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      leaveDetail: dot.get(nextProps, 'employee.leaveDetail'),
      dataSource: dot.get(nextProps, 'employee.employeeList.data', []),
      ModalFlag: dot.get(nextProps, 'employee.ModalFlag'),
      knightTypeList: dot.get(nextProps, 'employee.knightTypeList.data'),  // 骑士类型
    });
  }

  // 同意员工离职
  employeeLeave(params) {
    const { dispatch } = this.props;
    const { _id, position_id, knight_type_id } = params;
    const departureApproverAccountId = authorize.account.id;
    const value = {
      state: -50, // 离职
      staff_id: _id,
      departure_approver_account_id: departureApproverAccountId,
      account_id: departureApproverAccountId,
      option: false,  // 此属性区别离职审批和编辑员工调用该接口
      departure_date: moment().format('YYYY-MM-DD'),
      permission_id: Modules.OperateEmployeeResignVerifyButton.id,
      position_id,
      knight_type_id,
    };
    dispatch({
      type: 'employee/employeeEditE',
      payload: value,
    });
  }

  // 员工离职详情
  showDetail = (params) => {
    const detailValue = this.state.dataSource[params];
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/getEmployeeLeaveDetailR',
      payload: detailValue,
    });
    dispatch({
      type: 'employee/ModalFlagR',
      payload: true,  // 此属性区别离职审批和编辑员工调用该接口
    });
  };

  // 驳回离职申请
  reject(params) {
    const { dispatch } = this.props;
    const { _id, position_id, knight_type_id } = params;
    const departureApproverAccountId = authorize.account.id;
    const value = {
      state: 50,  // 在职
      staff_id: _id,
      departure_approver_account_id: departureApproverAccountId,
      account_id: departureApproverAccountId,
      option: false,  // 此属性区别离职审批和编辑员工调用该接口
      permission_id: Modules.OperateEmployeeResignVerifyButton.id,
      position_id,
      knight_type_id,
    };
    dispatch({
      type: 'employee/employeeEditE',
      payload: value,
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

  // 查询
  handleSubmit = (value) => {
    const { dispatch } = this.props;
    this.setState({
      searchValue: value,
      current: 1, // 当前页
    });
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        const departureApproverAccountId = authorize.account.id;
        values.departure_approver_account_id = departureApproverAccountId;
        values.limit = 30;
        values.page = 1;
        values.permission_id = Modules.ModuleEmployeeSearch.id;
        dispatch({
          type: 'employee/getEmployeeListE',
          payload: values,
        });
        this.props.form.setFields();
      }
    });
  };

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return (dataList.map((item, index) => {
      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
    }));
  }

  // 选择平台，获取城市列表
  platformChange = (data) => {
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
    const cityData = this.state.cityList;
    const areaArray = [];
    const areaData = [];
    keyList.forEach((item) => {
      areaArray.push(cityData[item].biz_district_list);
    });
    for (let i = 0; i < areaArray.length; i++) {
      areaArray[i].forEach((item) => {
        areaData.push(item);
      });
    }
    this.setState({
      areaList: areaData,
    });
  };

  // 弹窗状态
  changeModalFlag = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/ModalFlagR',
      payload: false,
    });
  };

  render() {
    const props = {
      columns: this.state.knightColumns,
      dataSource: this.state.dataSource,
    };
    const { getFieldDecorator } = this.props.form;
    // 获取职位类型
    const positionList = authorize.positions(true, true);
    // 骑士类型列表
    const jobType = this.state.knightTypeList || [];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const ModalProps = {
      ModalFlag: this.state.ModalFlag,
      detail: this.state.leaveDetail,
    };
    return (
      <div>
        <Form>
          <Row>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'姓名'}>
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入姓名" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'手机号'}>
                {getFieldDecorator('phone', {
                  rules: [{ required: false, message: '请输入手机号', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入手机号" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'职位'}>
                {
                  getFieldDecorator('position_id_list', {
                    rules: [{ required: false, message: '请选择职位', trigger: 'onBlur', type: 'array' }],
                  })(
                    <Select placeholder="请选择职位" mode="multiple" allowClear>
                      {
                      positionList.map((item, index) => {
                        return (
                          <Option value={`${item.id}`} key={index}>{item.name}</Option>);
                      })
                    }
                    </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'状态'}>
                {getFieldDecorator('state', {
                  rules: [{ required: false, message: '请选择骑士状态', trigger: 'onBlur', type: 'string' }],
                  initialValue: '1',
                })(
                  <Select
                    onChange={this.stateChange}
                    placeholder="请选择骑士状态" allowClear
                  >
                    <Option value={'50'} key={50} >在职</Option>
                    <Option value={'1'} key={1} >离职待审核</Option>
                    <Option value={'-50'} key={-50} >离职</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'类型'}>
                {getFieldDecorator('job_category_id_list')(
                  <Select
                    placeholder="请选择骑士类型"
                    mode="multiple" allowClear
                  >
                    {
                      jobType && jobType.map((item, index) => {
                        return (
                          <Option
                            value={item._id.toString()}
                            key={index}
                          >{item.name}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'平台'}>
                {getFieldDecorator('platform_code_list')(
                  <Select
                    mode="multiple" placeholder="请选择平台"
                    onChange={this.platformChange} allowClear
                  >
                    {
                      this.createPlatformList()
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="城市" {...formItemLayout}>
                {getFieldDecorator('city_spelling_list', {
                  rules: [{
                    type: 'array', message: '请选择城市',
                  }, {
                    required: false, message: '请选择城市',
                  }],
                })(
                  <Select
                    placeholder="请选择城市" onChange={this.handleCityChange}
                    mode="multiple" allowClear
                  >
                    {
                      dot.get(this, 'state.cityList', []).map((item, index) => {
                        return (<Option
                          value={item.city_spelling}
                          key={index}
                        >{item.city_name_joint}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="商圈" {...formItemLayout}>
                {getFieldDecorator('biz_district_id_list', {
                  rules: [{
                    type: 'array', message: '请输入身份证号',
                  }, {
                    required: false, message: '请输入身份证号',
                  }],
                })(
                  <Select placeholder="请选择商圈" mode="multiple" allowClear>
                    {
                      dot.get(this, 'state.areaList', []).map((item, index) => {
                        return (
                          <Option
                            value={item.biz_district_id}
                            key={item.biz_district_id}
                          >{item.biz_district_name}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <Col sm={3} />
              <Button type="primary" className={'mgr8'} onClick={this.handleSubmit}>查询</Button>
            </Col>
          </Row>
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
                />
                : ''
            }
          </div>
          <LeaveDetail {...ModalProps} changeModalFlag={this.changeModalFlag} />
        </Form>
      </div>
    );
  }

}
Page = Form.create()(Page);
function mapStateToProps({ employee }) {
  return { employee };
}
export default connect(mapStateToProps)(Page);
