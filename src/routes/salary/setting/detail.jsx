/**
 * 薪资模板详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Row } from 'antd';
import moment from 'moment';
import { CoreContent, CoreForm } from '../../../components/core';
import { SalaryCondition, SalaryFormula, SalaryPaymentCricle, SalaryVerifyState } from './../../../application/define';
import { authorize } from '../../../application';
import { SalarySpecifications } from './define';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: dot.get(props, 'salaryModel.salarySetupDetail'),
      isShowCreateFormulaModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      detail: dot.get(nextProps, 'salaryModel.salarySetupDetail'),
    });
  }

  // 渲染基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '职位',
        form: <span>{authorize.poistionNameById(detail.position_id)}</span>,
      },
      {
        label: '骑士类型',
        form: <span>
          {dot.get(detail, 'knight_type_list', []).map((item) => {
            return `${item.name} `;
          })}
        </span>,
      },
      {
        label: '平台',
        form: <span>{detail.platform_name}</span>,
      },
      {
        label: '城市',
        form: <span>
          {dot.get(detail, 'city_list', []).map((item) => {
            return `${item.city_name_joint} `;
          })}
        </span>,
      },
      {
        label: '商圈',
        form: <span>
          {dot.get(detail, 'biz_district_list', []).map((item) => {
            return `${item.name} `;
          })}
        </span>,
      },
      {
        label: '薪资计算周期',
        form: <span>{SalaryPaymentCricle.description(detail.pay_salary_cycle)}</span>,
      },
      {
        label: '创建日期',
        form: <span>{detail.date ? moment(detail.date).format('YYYY-MM-DD HH:mm') : '--'}</span>,
      },
      {
        label: '生效日期',
        form: <span>
          {
            // 如果是待审核状态，或者是审核不通过，不显示生效日期
            (detail.state === SalaryVerifyState.pendding || detail.state === SalaryVerifyState.reject) ?
              '--' : (detail.enabled_time ? moment(detail.enabled_time).format('YYYY-MM-DD HH:mm') : '--')
          }
        </span>,
      },
      {
        label: '失效日期',
        form: <span>
          {
            // 停用状态下才会显示
            (detail.state !== SalaryVerifyState.stoping) ?
              '--' : (detail.disabled_time ? moment(detail.disabled_time).format('YYYY-MM-DD HH:mm') : '--')
          }
        </span>,
      },
      {
        label: '创建人',
        form: <span>{detail.creater_name}</span>,
      },
      {
        label: '提审人',
        form: <span>{detail.operator_name}</span>,
      },
      {
        label: '审核人',
        form: <span>{detail.auditor_name}</span>,
      },
    ];

    // 饿了么平台
    if (detail.platform_code === 'elem') {
      formItems.push({
        label: '有效出勤',
        form: <span> >= {detail.valid_attendance}单／天</span>,
      });
    }

    // 百度平台
    if (detail.platform_code === 'baidu') {
      formItems.push({
        label: '夜班应在岗时长',
        form: <span>{detail.night_shift_should_be_on_duty}小时</span>,
      });
    }

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="基础信息" style={{ backgroundColor: '#FAFAFA' }} >
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染薪资项目
  renderSalarySubjects = () => {
    const { detail } = this.state;
    const { renderSubject } = this;

    const content = [];
    // 遍历整个薪资项目数据，渲染项目
    dot.get(detail, 'salary_formula_list', []).forEach((item) => {
      const { formula_name, sub_item } = item;
      content.push(
        <CoreContent key={formula_name + Math.random()} title={formula_name} style={{ backgroundColor: '#FFFFFF' }} >
          {renderSubject(sub_item)}
        </CoreContent>,
      );
    });

    return (<div>{content}</div>);
  }

  // 渲染薪资子项目
  renderSubject = (subject) => {
    const { renderFormulas } = this;

    const content = [];
    // 遍历整个薪资项目数据，渲染项目
    subject.forEach((item) => {
      const { name } = item;
      const title = (
        <span>
          {name}
          <span>开始于: 第{dot.get(item, 'belong_time.0')}天  截止到: 第{dot.get(item, 'belong_time.1')}天</span>
        </span>
      );
      content.push(
        <CoreContent key={name + Math.random()} title={title} style={{ backgroundColor: '#FFFFFF' }} >
          {renderFormulas(item)}
        </CoreContent>,
      );
    });

    return (<div>{content}</div>);
  }

  // 渲染情况
  renderFormulas = (subject) => {
    const { detail } = this.state;
    const dataSource = Object.values(subject.logics);

    const columns = [{
      title: '情况',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => { return `情况${index + 1}`; },
    }, {
      title: '条件关系',
      dataIndex: 'condition_type',
      key: 'condition_type',
      render: (text) => {
        return SalaryCondition.description(text);
      },
    }, {
      title: '条件',
      dataIndex: 'conditions',
      key: 'conditions',
      render: (text, record) => {
        // // 获取平台参数
        const platform = detail.platform_code;
        const content = [];
        text.forEach((item) => {
          // 获取指标的中文解释
          const specification = SalarySpecifications.description(platform, item.specifications);
          // 根据指标和条件设置，显示具体的指标条件内容
          const description = SalaryFormula.formula(item.logic_symbol, { x: item.first, y: item.end }, specification);
          content.push(<Row key={`formulaKey${Math.random()}`}>{description}</Row>);
        });
        return <div>{content}</div>;
      },
    }, {
      title: '公式',
      dataIndex: 'formula',
      key: 'formula',
      render: (text) => { return text; },
    }];

    return (
      <Table rowKey={() => { return Math.random(); }} dataSource={dataSource} columns={columns} pagination={false} bordered />
    );
  }

  // 渲染备注项目
  renderNote = () => {
    const { detail } = this.state;
    return (
      <CoreContent title="备注项" style={{ backgroundColor: '#FAFAFA' }} >
        {detail.note}
      </CoreContent>
    );
  }

  render() {
    const { renderBaseInfo, renderNote, renderSalarySubjects } = this;

    return (
      <div>
        {/* 基本信息 */}
        {renderBaseInfo()}

        {/* 薪资项目 */}
        {renderSalarySubjects()}

        {/* 渲染备注 */}
        {renderNote()}
      </div>
    );
  }
}
function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Detail);
