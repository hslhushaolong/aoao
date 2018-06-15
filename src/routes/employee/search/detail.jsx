/**
 * 员工详情页面
 * @class React.Component
 * @extends EmployeeDetail
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import Information from './../../../components/informationTemplate';
import Certificate from './../../../components/certificateTemplate';
import Cancel from './cancel';
import aoaoBossTools from './../../../utils/util';
import HistoryWorkInformation from './historyInformation';
import ShowContractPhoto from './showContractPhoto';
import { authorize } from '../../../application';

let count = 0;
class EmployeeDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      // 个人信息栏
      dataList: {
        color: true,
        topTitle: '个人信息',
        content: [{
          sm: 8,
          title: '姓名',
          data: dot.get(props, 'employee.employeeDetail.name', '--'),
        }, {
          sm: 8,
          title: '学历',
          data: dot.get(props, 'employee.employeeDetail.education', '--'),
        }, {
          sm: 8,
          title: '联系电话',
          data: dot.get(props, 'employee.employeeDetail.phone', '--'),
        }, {
          sm: 8,
          title: '性别',
          data: dot.get(props, 'employee.employeeDetail.gender_id') == 10 ? '男' : '女' || '--',
        }, {
          sm: 8,
          title: '民族',
          data: dot.get(props, 'employee.employeeDetail.national', '--'),
        }, {
          sm: 8,
          title: '紧急联系人',
          data: dot.get(props, 'employee.employeeDetail.emergency_contact') || '--',
        }, {
          sm: 8,
          title: '紧急联系人电话',
          data: dot.get(props, 'employee.employeeDetail.emergency_contact_phone', '--'),
        }, {
          sm: 8,
          title: '身份证号',
          data: dot.get(props, 'employee.employeeDetail.identity_card_id', '--'),
        }, {
          sm: 8,
          title: '所属平台录入身份证号',
          data: dot.get(props, 'employee.employeeDetail.associated_identity_card_id', '--'),
        }, {
          sm: 8,
          title: '创建时间',
          data: dot.get(props, 'employee.employeeDetail.created_at', '--') === '--' ? '--' : moment(dot.get(props, 'employee.employeeDetail.created_at')).format('YYYY-MM-DD HH:mm'),
        }, {
          sm: 8,
          title: '最新修改时间',
          data: dot.get(props, 'employee.employeeDetail.updated_at', '--') === '--' ? '--' : moment(dot.get(props, 'employee.employeeDetail.updated_at')).format('YYYY-MM-DD HH:mm'),
        }, {
          sm: 8,
          title: '最新操作人',
          data: dot.get(props, 'employee.employeeDetail.operator_name', '--'),
        }],
      },
      // 证件信息栏
      certificateData: {
        topTitle: '证件信息',
        content: [{
          sm: 12,
          title: '身份证正面照',
          data: {
            url: dot.get(props, 'employee.employeeDetail.identity_card_front', '--'),
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
            url: dot.get(props, 'employee.employeeDetail.identity_card_back', '--'),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 6,
          title: '银行卡号',
          data: dot.get(props, 'employee.employeeDetail.bank_card_id', '--'),
        }, {
          sm: 6,
          title: '持卡人姓名',
          data: dot.get(props, 'employee.employeeDetail.cardholder_name', '--'),
        }, {
          sm: 6,
          title: '银行卡开户行',
          data: dot.get(props, 'employee.employeeDetail.bank_branch', '--'),
        }, {
          sm: 6,
          title: '开户行所在地',
          data: `${dot.get(props, 'employee.employeeDetail.bank_location.0', '--')} / ${dot.get(props, 'employee.employeeDetail.bank_location.1', '--')}`,
        }, {
          sm: 12,
          title: '银行卡正面',
          data: {
            url: dot.get(props, 'employee.employeeDetail.bank_card_front', '--'),
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
            url: dot.get(props, 'employee.employeeDetail.bust', '--'),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '健康证',
          data: {
            url: dot.get(props, 'employee.employeeDetail.health_certificate', '--'),
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        },
          // {
          //   sm: 12,
          //   title: '合同照片',
          //   data: {
          //     url: dot.get(props, 'employee.employeeDetail.contract_photo') || '',
          //     style: {
          //       width: 400,
          //       height: 300,
          //       background: '#e8e8e8',
          //     },
          //   },
          // },
        ],
      },
      // 工作信息栏
      workData: {
        topTitle: '工作信息',
        content: [{
          sm: 8,
          title: '供应商名称',
          data: dot.get(props, 'employee.employeeDetail.supplier_name', '--'),
        }, {
          sm: 8,
          title: '平台',
          data: (function () {
            let string = '';
            const params = dot.get(props, 'employee.employeeDetail.platform_list') || [];
            const len = dot.get(props, 'employee.employeeDetail.platform_list', []).length || 0;
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
            const params = dot.get(props, 'employee.employeeDetail.city_list') || [];
            const len = dot.get(props, 'employee.employeeDetail.city_list', []).length || 0;
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
            const params = dot.get(props, 'employee.employeeDetail.biz_district_list') || [];
            const len = dot.get(props, 'employee.employeeDetail.biz_district_list', []).length || 0;
            params.map((item, index) => {
              string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '职位',
          data: authorize.poistionNameById(dot.get(props, 'employee.employeeDetail.position_id')),
        }, {
          sm: 8,
          title: '第三方平台骑士ID',
          data: (function () {
            let string = '';
            const params = dot.get(props, 'employee.employeeDetail.associated_knight_id_list', []);
            const len = dot.get(props, 'employee.employeeDetail.associated_knight_id_list', []).length || 0;
            params.forEach((item, index) => {
              string += `${item}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '骑士类型',
          data: dot.get(props, 'employee.employeeDetail.knight_type_name') || '--',
        }, {
          sm: 8,
          title: '合同归属',
          data: dot.get(props, 'employee.employeeDetail.contract_belong_name') || '--',
        }, {
          sm: 8,
          title: '招聘渠道',
          data: aoaoBossTools.enumerationConversion(dot.get(props, 'employee.employeeDetail.recruitment_channel_id')) || '--',
        }, {
          sm: 8,
          title: '入职日期',
          data: dot.get(props, 'employee.employeeDetail.entry_date') || '--',
        }, {
          sm: 8,
          title: '在职状态',
          data: aoaoBossTools.enumerationConversion(dot.get(props, 'employee.employeeDetail.state')) || '--',
        }, {
          sm: 8,
          title: '离职日期',
          data: dot.get(props, 'employee.employeeDetail.departure_date') || '--',
        }],
      },
      cancelData: {
        edit: false,
        cancelUrl: '/#/Employee/Search',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { employeeDetail } = nextProps.employee;
    this.setState({
      employeeDetail,  // 员工详情
      dataList: {
        color: true,
        topTitle: '个人信息',
        content: [{
          sm: 8,
          title: '姓名',
          data: dot.get(nextProps, 'employee.employeeDetail.name') || '--',
        }, {
          sm: 8,
          title: '学历',
          data: dot.get(nextProps, 'employee.employeeDetail.education') || '--',
        }, {
          sm: 8,
          title: '联系电话',
          data: dot.get(nextProps, 'employee.employeeDetail.phone') || '--',
        }, {
          sm: 8,
          title: '性别',
          data: dot.get(nextProps, 'employee.employeeDetail.gender_id') == 10 ? '男' : '女' || '--',
        }, {
          sm: 8,
          title: '民族',
          data: dot.get(nextProps, 'employee.employeeDetail.national') || '--',
        }, {
          sm: 8,
          title: '紧急联系人',
          data: dot.get(nextProps, 'employee.employeeDetail.emergency_contact') || '--',
        }, {
          sm: 8,
          title: '紧急联系人电话',
          data: dot.get(nextProps, 'employee.employeeDetail.emergency_contact_phone') || '--',
        }, {
          sm: 8,
          title: '身份证号',
          data: dot.get(nextProps, 'employee.employeeDetail.identity_card_id') || '--',
        }, {
          sm: 8,
          title: '所属平台录入身份证号',
          data: dot.get(nextProps, 'employee.employeeDetail.associated_identity_card_id') || '--',
        }, {
          sm: 8,
          title: '创建时间',
          data: dot.get(nextProps, 'employee.employeeDetail.created_at', '--') === '--' ? '--' : moment(dot.get(nextProps, 'employee.employeeDetail.created_at')).format('YYYY-MM-DD HH:mm'),
        }, {
          sm: 8,
          title: '最新修改时间',
          data: dot.get(nextProps, 'employee.employeeDetail.updated_at', '--') === '--' ? '--' : moment(dot.get(nextProps, 'employee.employeeDetail.updated_at')).format('YYYY-MM-DD HH:mm'),
        }, {
          sm: 8,
          title: '最新操作人',
          data: dot.get(nextProps, 'employee.employeeDetail.operator_name', '--'),
        }],
      },
      certificateData: {
        topTitle: '证件信息',
        content: [{
          sm: 12,
          title: '身份证正面照',
          data: {
            url: dot.get(nextProps, 'employee.employeeDetail.identity_card_front') || '',
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
            url: dot.get(nextProps, 'employee.employeeDetail.identity_card_back') || '',
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 6,
          title: '银行卡号',
          data: dot.get(nextProps, 'employee.employeeDetail.bank_card_id', '--'),
        }, {
          sm: 6,
          title: '持卡人姓名',
          data: dot.get(nextProps, 'employee.employeeDetail.cardholder_name', '--'),
        }, {
          sm: 6,
          title: '银行卡开户行',
          data: dot.get(nextProps, 'employee.employeeDetail.bank_branch', '--'),
        }, {
          sm: 6,
          title: '开户行所在地',
          data: `${dot.get(nextProps, 'employee.employeeDetail.bank_location.0', '--')} / ${dot.get(nextProps, 'employee.employeeDetail.bank_location.1', '--')}`,
        }, {
          sm: 12,
          title: '银行卡正面',
          data: {
            url: dot.get(nextProps, 'employee.employeeDetail.bank_card_front') || '',
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
            url: dot.get(nextProps, 'employee.employeeDetail.bust') || '',
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '健康证',
          data: {
            url: dot.get(nextProps, 'employee.employeeDetail.health_certificate') || '',
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        }, {
          sm: 12,
          title: '健康证',
          data: {
            url: nextProps.employee.employeeDetail.health_certificate_back || '',
            style: {
              width: 400,
              height: 300,
              background: '#e8e8e8',
            },
          },
        },
          // , {
          //   sm: 12,
          //   title: '合同照片',
          //   data: {
          //     url: dot.get(nextProps, 'employee.employeeDetail.contract_photo') || '',
          //     style: {
          //       width: 400,
          //       height: 300,
          //       background: '#e8e8e8',
          //     },
          //   },
          // }
        ],
      },
      workData: {
        topTitle: '工作信息',
        content: [{
          sm: 8,
          title: '供应商名称',
          data: dot.get(nextProps, 'employee.employeeDetail.supplier_name') || '--',
        }, {
          sm: 8,
          title: '平台',
          data: (function () {
            let string = '';
            const params = dot.get(nextProps, 'employee.employeeDetail.platform_list') || [];
            const len = dot.get(nextProps, 'employee.employeeDetail.platform_list', []).length || 0;
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
            const params = dot.get(nextProps, 'employee.employeeDetail.city_list') || [];
            const len = dot.get(nextProps, 'employee.employeeDetail.city_list', []).length || 0;
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
            const params = dot.get(nextProps, 'employee.employeeDetail.biz_district_list') || [];
            const len = dot.get(nextProps, 'employee.employeeDetail.biz_district_list', []).length || 0;
            params.map((item, index) => {
              string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '职位',
          data: authorize.poistionNameById(dot.get(nextProps, 'employee.employeeDetail.position_id')),
        }, {
          sm: 8,
          title: '第三方平台骑士ID',
          data: (function () {
            let string = '';
            const params = dot.get(nextProps, 'employee.employeeDetail.associated_knight_id_list', []);
            const len = dot.get(nextProps, 'employee.employeeDetail.associated_knight_id_list', []).length || 0;
            params.forEach((item, index) => {
              string += `${item}${index < len - 1 ? '、' : ''}`;
            });
            return string;
          }()),
        }, {
          sm: 8,
          title: '骑士类型',
          data: dot.get(nextProps, 'employee.employeeDetail.knight_type_name') || '--',
        }, {
          sm: 8,
          title: '合同归属',
          data: dot.get(nextProps, 'employee.employeeDetail.contract_belong_name') || '--',
        }, {
          sm: 8,
          title: '招聘渠道',
          data: aoaoBossTools.enumerationConversion(dot.get(nextProps, 'employee.employeeDetail.recruitment_channel_id')) || '--',
        }, {
          sm: 8,
          title: '入职日期',
          data: dot.get(nextProps, 'employee.employeeDetail.entry_date') || '--',
        }, {
          sm: 8,
          title: '在职状态',
          data: aoaoBossTools.enumerationConversion(dot.get(nextProps, 'employee.employeeDetail.state')) || '--',
        }, {
          sm: 8,
          title: '离职日期',
          data: dot.get(nextProps, 'employee.employeeDetail.departure_date') || '--',
        }],
      },
      cancelData: {
        edit: false,
        cancelUrl: '/#/Employee/Search',
      },
    });
     // 获取员工历史工作信息
    // 员工身份证存在时请求员工历史信息
    if (dot.get(employeeDetail, 'identity_card_id') && count === 0) {
      count += 1;
      this.props.dispatch({
        type: 'employee/getEmployeeHistoryDetailE',
        payload: {
          identity_card_id: dot.get(employeeDetail, 'identity_card_id'),
          limit: 30,
          page: 1,
          sort: -1,
        },
      });
    }
  }

  render() {
    const { employeeHistoryDetail, employeeDetail } = this.props.employee;
    const { contract_photo_list } = employeeDetail;
    return (
      <div>
        <Information {...this.state.dataList} />
        <Information {...this.state.workData} />
        {
          // 展示合同照片
          contract_photo_list && contract_photo_list.length !== 0 ? <ShowContractPhoto
            contractPhotos={contract_photo_list}
            title="合同照片"
          /> : ''
        }
        <Certificate {...this.state.certificateData} />
        {
          // 展示历史工作信息
          employeeHistoryDetail && employeeHistoryDetail.data && employeeHistoryDetail.data.length !== 0 ? <HistoryWorkInformation
            informations={employeeHistoryDetail.data}
          /> : ''
        }
        <Cancel {...this.state.cancelData} gather={this.gatherForm} />
      </div>
    );
  }
}

function mapStateToProps({ employee }) {
  return { employee };
}
export default connect(mapStateToProps)(EmployeeDetail);
