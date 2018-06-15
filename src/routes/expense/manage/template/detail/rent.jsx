// 房租详情模版
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from 'antd';
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { ExpenseHouseState, ExpenseCostCenter, ExpenseCostBelong, renderReplaceAmount } from '../../../../../application/define';

class Index extends Component {
  constructor(props) {
    super(props);

    let detail;
    if (props.detail !== undefined) {
      // 判断详情数据是从模块加载传入
      detail = dot.get(props, 'detail', {});
    } else {
      // 详情数据从model层获取，通过url链接传入id获取
      detail = dot.get(props, 'approval.typeApplyDetail', {}); // 详情数据
    }

    this.state = {
      detail,
    };
  }

  componentWillReceiveProps(props) {
    let detail;
    if (props.detail !== undefined) {
      // 判断详情数据是从模块加载传入
      detail = dot.get(props, 'detail', {});
    } else {
      // 详情数据从model层获取，通过url链接传入id获取
      detail = dot.get(props, 'approval.typeApplyDetail', {}); // 详情数据
    }

    this.setState({
      detail,
    });
  }

  // 基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '费用类型',
        form: dot.get(detail, 'costclass_name', '--'),
      }, {
        label: '房屋状态',
        form: ExpenseHouseState.description(dot.get(detail, 'thing_state')),
      }, {
        label: '房屋编号',
        form: dot.get(detail, 'house_num', '--'),
      }, {
        label: '申请人',
        form: dot.get(detail, 'apply_account', '--'),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }
  // 转换附件浏览格式
  transFile = (values) => {
    if (values == null) {
      values = [];
    }
    const list = [];
    values.forEach && values.forEach((item) => {
      const obj = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          obj.name = key;
          obj.value = item[key];
        }
      }
      list.push(obj);
    });
    return (
      <div>
        {
          list.map((item, index) => {
            return (
              <a style={{ display: 'block' }} target="_blank" key={index} href={item.value}>{item.name}</a>
            );
          })
        }
      </div>
    );
  }
  // 费用信息
  renderRentInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '用途',
        form: dot.get(detail, 'use', '--'),
      }, {
        label: '房屋面积',
        form: dot.get(detail, 'area', '--'),
      }, {
        label: '是否开票',
        form: dot.get(detail, 'has_invoice') ? '是' : '否',
      }, {
        label: '合同租期',
        form: (() => {
          const start = dot.get(detail, 'contract_start_date');
          const end = dot.get(detail, 'contract_end_date');
          if (start == null || end == null) {
            return '--';
          }
          return `${start} ~ ${end}`;
        })(),
      }, {
        label: '月租金',
        form: renderReplaceAmount(dot.get(detail, 'month_rent', '--')),
      }, {
        label: '付款月数',
        form: dot.get(detail, 'pay_time', '--'),
      }, {
        label: '提前付款天数',
        form: dot.get(detail, 'payment_date', '--'),
      }, {
        label: '备注',
        form: dot.get(detail, 'desc', '--'),
      }, {
        label: '上传附件',
        form: this.transFile(dot.get(detail, 'files_address', [])),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="费用信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { detail } = this.state;
    const subjects = {};
    dot.get(detail, 'catalog_id', []).forEach((item) => {
      if (item.level === 1) {
        subjects.subjectOne = item.name;
      }
      if (item.level === 2) {
        subjects.subjectTwo = item.name;
      }
      if (item.level === 3) {
        subjects.subjectThree = item.name;
      }
    });
    const formItems = [
      {
        label: '一级科目',
        form: dot.get(subjects, 'subjectOne', '--'),
      }, {
        label: '二级科目',
        form: dot.get(subjects, 'subjectTwo', '--'),
      }, {
        label: '三级科目',
        form: dot.get(subjects, 'subjectThree', '--'),
      }, {
        label: '成本中心',
        form: ExpenseCostCenter.description(dot.get(detail, 'cost_center')),
      }, {
        label: '成本归属',
        form: ExpenseCostBelong.description(dot.get(detail, 'cost_belong')),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    // 子项目信息
    const costItems = dot.get(detail, 'cost_belong_items_zh', []) || [];

    return (
      <CoreContent title="项目信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
        {/* 渲染子项目信息 */}
        {
          costItems.map((item, key) => {
            return this.renderCostItems(item, key);
          })
        }
      </CoreContent>
    );
  }

  // 渲染子项目信息
  renderCostItems = (items, key) => {
    const formItems = [
      {
        label: '平台',
        form: dot.get(items, 'platform_code', '--'),
      }, {
        label: '供应商',
        form: dot.get(items, 'supplier_id', '--'),
      }, {
        label: '城市',
        form: dot.get(items, 'city_spelling', '--'),
      }, {
        label: '商圈',
        form: dot.get(items, 'biz_id', '--'),
      },
    ];
    if (items.custom_money) {
      formItems.push({
        label: '分摊金额',
        form: renderReplaceAmount(dot.get(items, 'custom_money', '--')),
      });
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreForm key={key} items={formItems} cols={6} layout={layout} />
    );
  }


  // 支付信息
  renderPaymentInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '房租收款人',
        form: dot.get(detail, 'payee_info.name', '--'),
      }, {
        label: '收款账户',
        form: dot.get(detail, 'payee_info.card_num', '--'),
      }, {
        label: '开户支行',
        form: dot.get(detail, 'payee_info.address', '--'),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
          {/* 基础信息 */}
          {this.renderBaseInfo()}

          {/* 费用信息 */}
          {this.renderRentInfo()}

          {/* 项目信息 */}
          {this.renderExpenseInfo()}

          {/* 支付信息 */}
          {this.renderPaymentInfo()}
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Index);
