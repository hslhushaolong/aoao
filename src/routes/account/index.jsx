/**
 * Created by jay 2017/11/25
 * 我的账户模块 我的账户
 * */
import is from 'is_js';
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Button } from 'antd';

// import Information from '../../components/informationTemplate';
import Certificate from '../../components/certificateTemplate';
import aoaoBossTools from '../../utils/util';
// import Operate from '../../application/define/operate';
import Modules from '../../application/define/modules';
import { authorize } from '../../application';
import { Gender, AccountState, AccountRecruitmentChannel, DutyState } from '../../application/define';
import { CoreContent, CoreForm } from '../../components/core';
import ShowContractPhoto from './../employee/search/showContractPhoto';
import EditCertificate from './editCertificate';

class Account extends Component {
  constructor() {
    super();
    this.state = {
      employeeDetail: {},  // 员工详情
      editCertificate: false,  // 信息详情
      isShowEditTemp: false, // 是否显示编辑员工信息模板,超管、coo、运营、采购为true，其他false
    };
  }

  // 获取员工信息
  componentWillMount() {
    // 超管、coo、运营 通过account_id_list字段获取账户信息，其他员工通过staff_id字段获取员工信息，这两者调用接口不同
    const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
    const accountId = authorize.account.id;
    let result = false;
    if (staffId == '' || staffId == null) {
      result = true;
    }
    const type = result ? 'account/getAccountDetailByRoleIdE' : 'account/getAccountDetailByStaffIdE';
    const payload = result ? { account_id: accountId, account_id_list: [accountId], limit: 30, page: 1, state: 100, permission_id: Modules.ModuleAccount.id } : { staff_id: staffId, permission_id: Modules.ModuleAccount.id };
    this.setState({
      isShowEditTemp: result,
    });
    this.props.dispatch({
      type,
      payload,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { employeeDetail, editCertificate } = nextProps.account;
    this.setState({
      employeeDetail,
      editCertificate,
    });
  }

  // 点击编辑按钮
  handleEdit = () => {
    this.setState({ editCertificate: true });
  }

  // 点击取消
  handleCancle = () => {
    const { employeeDetail } = this.props.account;
    this.setState({
      editCertificate: false,
    });
  }

  // 点击保存
  handleSave = (values) => {
    // 编辑账户 & 个人离职 属于编辑: permission_id 为7-2
    Object.assign(values, { permission_id: Modules.ModuleAccountResign.id });
    this.props.dispatch({
      type: 'account/employeeEditE',
      payload: values,
    });
  }

  // 人员基本信息
  renderUserInfo = () => {
    const { employeeDetail } = this.props.account;
    const formItems = [
      {
        label: '姓名',
        form: dot.get(employeeDetail, 'name', '--'),
      }, {
        label: '学历',
        form: dot.get(employeeDetail, 'education', '--'),
      }, {
        label: '联系电话',
        form: dot.get(employeeDetail, 'phone', '--'),
      }, {
        label: '性别',
        form: Gender.description(employeeDetail.gender_id),
      }, {
        label: '民族',
        form: dot.get(employeeDetail, 'national', '--'),
      }, {
        label: '紧急联系人',
        form: dot.get(employeeDetail, 'emergency_contact', '--'),
      }, {
        label: '紧急联系人电话',
        form: dot.get(employeeDetail, 'emergency_contact_phone', '--'),
      }, {
        label: '身份证号',
        form: dot.get(employeeDetail, 'identity_card_id', '--'),
      }, {
        label: '所属平台录入身份证号',
        form: dot.get(employeeDetail, 'associated_identity_card_id', '--'),
      }, {
        label: '操作时间',
        form: employeeDetail.created_at ? moment(dot.get(employeeDetail, 'created_at')).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新修改时间',
        form: employeeDetail.updated_at ? moment(dot.get(employeeDetail, 'updated_at')).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新操作人',
        form: dot.get(employeeDetail, 'operator_name', '--'),
      },

    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="个人信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 工作信息
  renderWorkInfo = () => {
    const { employeeDetail } = this.props.account;
    const formItems = [
      {
        label: '供应商名称',
        form: dot.get(employeeDetail, 'supplier_name', '--'),
      }, {
        label: '骑士ID',
        form: dot.get(employeeDetail, 'associated_knight_id', '--'),
      }, {
        label: '平台',
        form: (function () {
          let string = '';
          const params = dot.get(employeeDetail, 'platform_list', []);
          const len = params.length;
          params.forEach((item, index) => {
            string += `${item.platform_name}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        label: '城市',
        form: (function () {
          let string = '';
          const params = dot.get(employeeDetail, 'city_list', []);
          const len = params.length;
          params.map((item, index) => {
            string += `${item.city_name_joint}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        label: '商圈',
        form: (function () {
          let string = '';
          const params = dot.get(employeeDetail, 'biz_district_list', []);
          const len = params.length;
          params.map((item, index) => {
            string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        label: '职位',
        form: (function () {
          if (is.existy(employeeDetail.gid)) {
            return authorize.poistionNameById(employeeDetail.gid);
          }
          if (is.existy(employeeDetail.position_id)) {
            return authorize.poistionNameById(employeeDetail.position_id);
          }
          return '未知的职位类型';
        }()),
      }, {
        label: '骑士类型',
        form: dot.get(employeeDetail, 'knight_type_name', '--'),
      }, {
        label: '合同归属',
        form: dot.get(employeeDetail, 'contract_belong_name', '--'),
      }, {
        label: '招聘渠道',
        form: AccountRecruitmentChannel.description(dot.get(employeeDetail, 'recruitment_channel_id')),
      }, {
        label: '入职日期',
        form: dot.get(employeeDetail, 'entry_date', '--'),
      }, {
        label: '账户状态',
        form: AccountState.description(dot.get(employeeDetail, 'state')),
      }, {
        label: '在职状态',
        form: DutyState.description(dot.get(employeeDetail, 'state')),
      },

    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="工作信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }


  // 获取用户信息
  getUserInfo = () => {
    const userInfo = {
      cancelData: {
        edit: false,
        cancelUrl: '/#/Employee/Search',
      },
    };
    return userInfo;
  }

  // 展示员工编辑模板
  renderCertifycateData = () => {
    // 是超管、coo、运营、采购不会显示编辑页
    // 不是超管 且编辑为false 则显示详情模板 ，不是超管 编辑为true 显示编辑模板
    const { editCertificate, isShowEditTemp } = this.state;
    const { employeeDetail } = this.props.account;
    const userInfors = {
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
          sm: 8,
          title: '银行卡号',
          data: dot.get(employeeDetail, 'bank_card_id', '--'),
        }, {
          sm: 8,
          title: '持卡人姓名',
          data: dot.get(employeeDetail, 'cardholder_name', '--'),
        }, {
          sm: 8,
          title: '银行卡开户行',
          data: dot.get(employeeDetail, 'bank_branch', '--'),
        }, {
          sm: 8,
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
    };

    let certificateElement = '';
    let ext = <Button type="primary" onClick={this.handleEdit}>编辑</Button>;
    // if (isShowEditTemp) {
    //   certificateElement = '';
    // }
    if (!isShowEditTemp && !editCertificate) {
      certificateElement = <Certificate {...userInfors.certificateData} editTitle={'编辑'} handleClick={this.handleEdit} />;
    }
    if (!isShowEditTemp && editCertificate) {
      ext = '';
      certificateElement = <EditCertificate dataList={employeeDetail} handleCancle={this.handleCancle} handleSave={this.handleSave} />;
    }


    return (
      certificateElement &&
      <CoreContent title="证件信息" titleExt={ext}>
        {certificateElement}
      </CoreContent>
    );
  }

  // 合同渲染
  renderContractData = () => {
    const contractPhotoList = dot.get(this, 'props.account.employeeDetail.contract_photo_list', []);
    const contractElement = contractPhotoList && contractPhotoList.length !== 0 ? (<ShowContractPhoto
      contractPhotos={contractPhotoList}
      title="合同照片"
    />) : '';
    return (
      contractElement &&
      <CoreContent title="合同照片" >
        {contractElement}
      </CoreContent>
    );
  }
  render() {
    return (
      <div>
        {this.renderUserInfo()}
        {this.renderWorkInfo()}
        {/* 展示合同照片*/}
        {this.renderContractData()}
        {/* 显示编辑员工信息*/}
        {this.renderCertifycateData()}
      </div>
    );
  }
}
const mapStateToProps = ({ account }) => {
  return { account };
};

export default connect(mapStateToProps)(Account);
