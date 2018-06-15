/**
 * 薪资查询明细
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import { CoreContent, CoreForm } from '../../../components/core';
import { RecruitmentChannel, DutyState, renderReplaceAmount } from '../../../application/define';
import { authorize, system } from '../../../application';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 详情数据
      detail: dot.get(props, 'salaryModel.salaryDetail'),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      detail: dot.get(nextProps, 'salaryModel.salaryDetail'),
    });
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '姓名',
        form: dot.get(detail, 'name'),
      }, {
        label: '身份证号码',
        form: dot.get(detail, 'identity_card_id'),
      }, {
        label: '联系方式',
        form: dot.get(detail, 'phone'),
      }, {
        label: '银行卡号',
        form: dot.get(detail, 'bank_card_id'),
      }, {
        label: '开户行',
        form: dot.get(detail, 'bank_branch'),
      }, {
        label: '开户行所在省市',
        form: dot.get(detail, 'bank_location'),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="基本信息" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 工作信息
  renderWorkInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '平台',
        form: dot.get(detail, 'platform_name'),
      }, {
        label: '城市',
        form: dot.get(detail, 'city_name_joint'),
      }, {
        label: '商圈',
        form: dot.get(detail, 'biz_district_name'),
      }, {
        label: '职位',
        form: authorize.poistionNameById(dot.get(detail, 'position_id')),
      }, {
        label: '状态',
        form: DutyState.description(dot.get(detail, 'work_state')),
      }, {
        label: '骑士类型',
        form: dot.get(detail, 'knight_type_name'),
      }, {
        label: '应聘渠道',
        form: RecruitmentChannel.description(dot.get(detail, 'recruitment_channel_id')),
      }, {
        label: '合同归属',
        form: dot.get(detail, 'contract_belong'),
      }, {
        label: '入职时间',
        form: dot.get(detail, 'entry_date'),
      },
    ];
    // 判断离职时间是否有数据
    if (dot.get(detail, 'departure_date')) {
      formItems.push({
        label: '离职时间',
        form: dot.get(detail, 'departure_date'),
      });
    }

    // 判断上次离职时间是否有数据
    if (dot.get(detail, 'last_departure_date')) {
      formItems.push({
        label: '上次离职时间',
        form: dot.get(detail, 'last_departure_date'),
      });
    }
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <CoreContent title="工作信息" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 业务数据
  renderBusinessInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '完成单量（单）',
        form: dot.get(detail, 'order_count'),
      }, {
        label: '出单天数',
        form: dot.get(detail, 'issue_days', 0),
      }, {
        label: '准时单量（单）',
        form: dot.get(detail, 'time_limit_complete_order_count'),
      }, {
        label: '超时单量（单）',
        form: dot.get(detail, 'timeout_order_count'),
      }, {
        label: '人效（单/人日）',
        form: dot.get(detail, 'efficiency'),
      }, {
        label: '有效出勤（天）',
        form: dot.get(detail, 'valid_attendance_days'),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="业务数据" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染薪资信息
  renderSalaryInfo = () => {
    const { detail } = this.state;
    const dataSource = dot.get(detail, 'specification_list', []);

    const content = [];
    dataSource.forEach((item) => {
      // 父项目名称
      const name = dot.get(item, 'item_name', '');
      // 子项目
      const subItem = dot.get(item, 'sub_item', []);
      const formItems = [];
      // 遍历子项目
      subItem.forEach((sub) => {
        formItems.push({
          label: sub.name,
          form: renderReplaceAmount(sub.value),
        });
      });
      const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };

      // 模块内容
      content.push(
        <CoreContent title={name} style={{ backgroundColor: '#FFFFFF' }} key={name}>
          <CoreForm items={formItems} cols={4} layout={layout} />
        </CoreContent>,
      );
    });

    const standContent = this.renderStandContent();

    return (
      <CoreContent title="薪资组成" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreContent>
          <p>应发工资=底薪总额+提成总额+奖金总额+扣罚总额+新项目总额+骑士补款总额-骑士扣款总额-物资扣款总额</p>
          <p>实发工资=应发工资-人事扣款总额</p>
        </CoreContent>
        {content}
        {standContent}
      </CoreContent>
    );
  }

  // 渲染固定的核算数据
  renderStandContent = () => {
    const detail = this.state.detail;
    const standItmes = [
      {
        name: '线下扣补款',
        formItems: [
          { name: '骑士扣款', value: renderReplaceAmount(dot.get(detail, 'knight_deduction_amount', 0)) },
          { name: '骑士补款', value: renderReplaceAmount(dot.get(detail, 'knight_payment_amount', 0)) },
          { name: '物资扣款', value: renderReplaceAmount(dot.get(detail, 'material_deduction_amount', 0)) },
        ],
      },
      {
        name: '应发工资',
        formItems: [
          { name: '应发工资', value: renderReplaceAmount(dot.get(detail, 'real_pay_salary_amount', 0)) },
        ],
      },
      {
        name: '人事扣款',
        formItems: [
          { name: '跨行费用', value: renderReplaceAmount(dot.get(detail, 'real_inter_bank_transfer_amount', 0)) },
          { name: '装备扣款', value: renderReplaceAmount(dot.get(detail, 'real_equipment_deduction_amount', 0)) },
          { name: '装备保证金', value: renderReplaceAmount(dot.get(detail, 'real_equipmen_cash_deposit_amount', 0)) },
          { name: '三方扣款', value: renderReplaceAmount(dot.get(detail, 'real_three_sides_deduction_amount', 0)) },
        ],
      },
      {
        name: '实发工资',
        formItems: [
          { name: '实发工资', value: renderReplaceAmount(dot.get(detail, 'actual_pay_salary_amount', 0)) },
        ],
      },
    ];

    const content = [];
    standItmes.forEach((item) => {
      // 父项目名称
      const name = dot.get(item, 'name', '');
      // 子项目
      const subItem = dot.get(item, 'formItems', []);
      const formItems = [];
      // 遍历子项目
      subItem.forEach((sub) => {
        formItems.push({
          label: sub.name,
          form: sub.value,
        });
      });
      const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };

      // 模块内容
      content.push(
        <CoreContent key={name} title={name} style={{ backgroundColor: '#FFFFFF' }}>
          <CoreForm items={formItems} cols={4} layout={layout} />
        </CoreContent>,
      );
    });

    return content;
  }

  render() {
    const { detail } = this.state;
    // 月份
    const ext = (
      <div>
        <span>薪资时间段 : {dot.get(detail, 'compute_time_slot')}</span>
        <span style={{ marginLeft: '10px' }}>更新时间 : {moment(dot.get(detail, 'update_time')).format('YYYY-MM-DD HH:mm')}</span>
      </div>
    );
    return (
      <div>
        <Row style={{ width: '100%', backgroundColor: '#e4e4e4', lineHeight: '40px' }}>
          <Col span={18} style={{ paddingLeft: '20px' }}>
            { ext }
          </Col>
          <Col span={6}>
            {/* 跳转到薪资设置-薪资模板详情页 */}
            <a target='_blank' href={`/#/Salary/Setting/Detail?id=${dot.get(detail, 'salary_template_id')}`}>查看骑士所在商圈薪资规则</a>
            {/* {
              dot.has(detail, 'salary_template_id.description')&& 
              <a target='_blank' href={`/#/Salary/Setting/Detail?id=${dot.get(detail, 'salary_template_id')}`}>查看骑士所在商圈薪资规则</a>
                || '骑士暂无所在商圈薪资规则'              
            } */}
          </Col>
        </Row>
        {this.renderBaseInfo()}
        {this.renderWorkInfo()}
        {this.renderBusinessInfo()}
        {this.renderSalaryInfo()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Detail);
