/**
 * Created by jay 2017/12/04
 * 个人离职模块
 *
 */

import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Progress, Input, Button, Mention, Select } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Information from './../../../components/informationTemplate';
import Certificate from './../../../components/certificateTemplate';
import ShowContractPhoto from './../../employee/search/showContractPhoto';
import Operate from '../../../application/define/operate';
import Modules from '../../../application/define/modules';
import { authorize } from '../../../application';
import { AccountRecruitmentChannel, AccountState, Gender, DutyState } from '../../../application/define';

const [FormItem, Option] = [Form.Item, Select.Option];

class PersonalLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeDetail: props.account,  // 员工详情
      detail: props.system.employeeDetail, // 信息详情
      flag: false,  // 标记离职状态
    };
  }

  // 获取员工信息
  componentDidMount() {
    // 超管、coo、运营 通过account_id_list字段获取账户信息，其他员工通过staff_id字段获取员工信息，这两者调用接口不同
    const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
    const accountId = authorize.account.id;
    let result = false;
    if (staffId == '' || staffId == null) {
      result = true;
    }
    const type = result ? 'account/getAccountDetailByRoleIdE' : 'account/getAccountDetailByStaffIdE';
    const payload = result ? { account_id: accountId, account_id_list: [accountId], limit: 30, page: 1, state: 100, permission_id: Modules.ModuleAccountResign.id } : { staff_id: staffId, permission_id: Modules.ModuleAccountResign.id };
    this.props.dispatch({
      type,
      payload,
    });
    // 获取离职审批人
    this.props.dispatch({ type: 'system/getApproveListE', payload: {} });
  }

  componentWillReceiveProps(nextProps) {
    const { employeeDetail } = nextProps.account;
    this.setState({
      employeeDetail,
      detail: dot.get(nextProps, 'system.employeeDetail'),
    });
    if (dot.get(nextProps, 'system.employeeDetail.state') === 1) {
      this.setState({
        flag: true,
      });
    } else if (dot.get(nextProps, 'system.employeeDetail.state') === 50) {
      this.setState({
        flag: false,
      });
    }
  }


  // 获取用户信息
  getUserInfo = () => {
    const { employeeDetail } = this.props.account;
    const userInfo = {
      dataList: {
        color: false,
        topTitle: '个人信息',
        content: [{
          sm: 8,
          title: '姓名',
          data: dot.get(employeeDetail, 'name', '--'),
        }, {
          sm: 8,
          title: '学历',
          data: dot.get(employeeDetail, 'education', '--'),
        }, {
          sm: 8,
          title: '联系电话',
          data: dot.get(employeeDetail, 'phone', '--'),
        }, {
          sm: 8,
          title: '性别',
          data: Gender.description(employeeDetail.gender_id),
        }, {
          sm: 8,
          title: '民族',
          data: dot.get(employeeDetail, 'national', '--'),
        }, {
          sm: 8,
          title: '紧急联系人电话',
          data: dot.get(employeeDetail, 'emergency_contact_phone', '--'),
        }, {
          sm: 8,
          title: '身份证号',
          data: dot.get(employeeDetail, 'identity_card_id', '--'),
        }, {
          sm: 9,
          title: '所属平台录入身份证号',
          data: dot.get(employeeDetail, 'associated_identity_card_id', '--'),
        }],
      },
      certificateData: {
        topTitle: '证件信息',
        content: [{
          sm: 12,
          title: '身份证正面照',
          data: {
            url: dot.get(employeeDetail, 'identity_card_front', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '身份证反面照',
          data: {
            url: dot.get(employeeDetail, 'identity_card_back', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '银行卡号',
          data: dot.get(employeeDetail, 'bank_card_id', '--'),
        }, {
          sm: 12,
          title: '银行卡开户行',
          data: dot.get(employeeDetail, 'bank_branch', '--'),
        }, {
          sm: 12,
          title: '开户行所在地',
          data: dot.get(employeeDetail, 'bank_location', '--'),
        }, {
          sm: 12,
          title: '银行卡正面',
          data: {
            url: dot.get(employeeDetail, 'bank_card_front', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '半身照',
          data: {
            url: dot.get(employeeDetail, 'bust', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '健康证正面',
          data: {
            url: dot.get(employeeDetail, 'health_certificate', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '健康证背面',
          data: {
            url: dot.get(employeeDetail, 'health_certificate_back', ''),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }],
      },
      workData: {
        topTitle: '工作信息',
        content: [{
          sm: 8,
          title: '供应商名称',
          data: dot.get(employeeDetail, 'supplier_name', '--'),
        }, {
          sm: 8,
          title: '骑士ID',
          data: dot.get(employeeDetail, 'associated_knight_id', '--'),
        }, {
          sm: 8,
          title: '平台',
          data: (function () {
            let string = '';
            const params = dot.get(employeeDetail, 'platform_list', []);
            const len = params.length;
            params.map((item, index) => {
              string += `${item.platform_name}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '城市',
          data: (function () {
            let string = '';
            const params = dot.get(employeeDetail, 'city_list', []);
            const len = params.length;
            params.map((item, index) => {
              string += `${item.city_name_joint}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '商圈',
          data: (function () {
            let string = '';
            const params = dot.get(employeeDetail, 'biz_district_list', []);
            const len = params.length;
            params.map((item, index) => {
              string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '职位',
          data: authorize.poistionNameById(employeeDetail.position_id),
        }, {
          sm: 8,
          title: '骑士类型',
          data: dot.get(employeeDetail, 'knight_type_name', '--'),
        }, {
          sm: 8,
          title: '合同归属',
          data: dot.get(employeeDetail, 'contract_belong_name', '--'),
        }, {
          sm: 8,
          title: '招聘渠道',
          data: AccountRecruitmentChannel.description(dot.get(employeeDetail, 'recruitment_channel_id')),
        }, {
          sm: 8,
          title: '入职日期',
          data: dot.get(employeeDetail, 'entry_date', '--'),
        }, {
          sm: 8,
          title: '账户状态',
          data: AccountState.description(dot.get(employeeDetail, 'state')),
        }, {
          sm: 8,
          title: '在职状态',
          data: DutyState.description(dot.get(employeeDetail, 'state')),
        }],
      },
      cancelData: {
        edit: false,
        cancelUrl: '/#/Employee/Search',
      },
    };
    return userInfo;
  }

  // 点击发送按钮
  editEmployeeLeave = () => {
    this.props.form.validateFields((error, value) => {
      if (error) {

      } else {
        const values = this.props.form.getFieldsValue();
        values.state = 1;
        values.option = false;  // 此属性区别离职审批和编辑员工调用该接口
        values.permission_id = Modules.ModuleAccountResign.id;
        this.props.dispatch({
          type: 'system/leaveApplication',
          payload: values,
        });
        this.props.form.setFields();
      }
    });
  }

  // 展示离职进度条
  showProgress() {
    let progressPercent = dot.get(this, 'props.system.employeeDetail.state');
    switch (progressPercent) {
      case -50:
        progressPercent = 100;
      case 1:
        progressPercent = 50;
    }
    if (dot.get(this, 'state.detail.state') == 50
      && dot.get(this, 'state.detail.departure_log')
      && dot.get(this, 'state.detail.departure_log.length') > 0) {
      return (<Progress
        percent={progressPercent} showInfo format={() => null}
        strokeWidth={20} status="exception"
      />);
    } else if (dot.get(this, 'state.detail.state') != 50) {
      return (<Progress
        percent={progressPercent} showInfo format={() => null}
        strokeWidth={20}
      />);
    } else {
      return null;
    }
  }

  render() {
    const userInfors = this.getUserInfo();
    const contractPhotoList = dot.get(this, 'props.account.employeeDetail.contract_photo_list');
    const dutyState = dot.get(this, 'props.account.employeeDetail.state');
    const { getFieldDecorator } = this.props.form;
    const { approveList } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Row className="mg20" type="flex" justify="center">
          <Col sm={22}>
            <Col sm={20}>
              {
                this.showProgress()
              }
            </Col>
            {
              this.showProgress() != null ? <Col sm={4}>
                <div>{aoaoBossTools.enumerationConversion(dot.get(this, 'state.detail.state'))}</div>
              </Col> : null
            }
          </Col>
        </Row>
        <div className="mgb8">
          <span className="mgl8">
            <b style={{ fontSize: '16px' }}>{'信息确认'}</b>
          </span>
        </div>
        <Information {...userInfors.dataList} />
        <Information {...userInfors.workData} />
        {
          // 展示合同照片
          contractPhotoList && contractPhotoList.length !== 0 ? <ShowContractPhoto
            contractPhotos={contractPhotoList}
          /> : ''
        }
        <Certificate {...userInfors.certificateData} />
        <Form>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label={'离职原因'}>
                {getFieldDecorator('departure_reason', {
                  rules: [{ required: false, message: '请输入离职原因', trigger: 'onBlur', type: 'string' }],
                })(
                  <textarea style={{ width: '100%', height: 100 }} placeholder="请输入离职原因" disabled={this.state.flag} />,
                )}
              </FormItem>
            </Col>
            {
              // Operate.knightTypeShow(dot.get(this, 'state.employeeDetail.position_id')) !== true ? '' :
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'工作交接备注'}>
                  {getFieldDecorator('job_transfer_remark', {
                    rules: [{ required: false, message: '请输入工作交接备注内容', trigger: 'onBlur', type: 'string' }],
                  })(
                    <textarea
                      style={{ width: '100%', height: 100 }} placeholder="请输入工作交接备注内容"
                      disabled={this.state.flag}
                    />,
                  )}
                </FormItem>
              </Col>
            }
            <Col sm={12}>
              <FormItem {...formItemLayout} label={'审批人'}>
                {getFieldDecorator('departure_approver_account_id', {
                  rules: [{ required: true, message: '请选择审批人', trigger: 'onBlur', type: 'string' }],
                })(
                  <Select allowClear placeholder="请选择审批人" disabled={dot.get(this, 'state.flag')}>
                    {
                      approveList && approveList.superior_list && approveList.superior_list.map((item, index) => {
                        return (<Option
                          value={item._id}
                          key={item._id}
                        >{`${item.name}(${authorize.poistionNameById(item.gid)})`}</Option>);
                      })
                  }
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          {
            // 判断，如果是已经离职或者是离职待审核，则不显示提交按钮
            DutyState.onDuty !== dutyState ? '' :
            <Row>
              <Col className="textRight" sm={12}>
                <Button onClick={this.editEmployeeLeave} type="primary" disabled={this.state.flag}>发送</Button>
              </Col>
            </Row>
          }
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ account, system }) {
  return { account, system, approveList: system.approveList };
}
export default connect(mapStateToProps)(Form.create()(PersonalLeave));
