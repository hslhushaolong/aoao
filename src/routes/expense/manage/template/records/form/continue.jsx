// 续租表单模块
import dot from 'dot-prop';
import { connect } from 'dva';
import is from 'is_js';
import moment from 'moment';
import { Form, Select, Button, DatePicker, Input, message } from 'antd';
import React, { Component } from 'react';
import { CoreContent, CoreForm, CoreUpload } from '../../../../../../components/core';
import { ExpenseHouseState } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';

// 成本中心，成本归属
import CommonExpense from '../../common/expense';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordId: props.query.recordId, // 单条数据id
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
    };
    this.private = {
      dispatch: this.props.dispatch,
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      recordId: props.query.recordId, // 单条数据id
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
    });
  }

  // 提交模版
  onSubmitTemplate = (e) => {
    const { dispatch } = this.private;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
      }
      values.order_id = this.state.recordId;
      const transKey = (value) => {
        if (value === 'platform') {
          return 'platform_code';
        }
        if (value === 'vendor') {
          return 'supplier_id';
        }
        if (value === 'city') {
          return 'city_spelling';
        }
        if (value === 'district') {
          return 'biz_id';
        }
        if (value === 'costCount') {
          return 'custom_money';
        }
      };
      const transPayload = (values) => {
        const data = {};
        function existy(value) {
          if (value == null || value === '') {
            return false;
          }
          return true;
        }

        if (existy(values.contractDateRanage) && !is.empty(values.contractDateRanage) && Array.isArray(values.contractDateRanage)) {
          data.contract_start_date = moment(values.contractDateRanage[0]).format('YYYY-MM-DD');
          data.contract_end_date = moment(values.contractDateRanage[1]).format('YYYY-MM-DD');
        }
        if (existy(values.monthRent) && !is.empty(values.monthRent)) {
          data.month_rent = values.monthRent;
        }

        if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
          data.cost_center = parseFloat(values.expense.costCenter);
        }
        if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
          data.cost_belong = parseFloat(values.expense.costBelong);
        }
        if (is.existy(values.expense.costItems) && !is.empty(values.expense.costItems)) {
          const items = values.expense.costItems;
          const cost = [];
          items.forEach((item) => {
            const per = {};
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                if (item[key] != undefined) {
                  per[transKey(key)] = item[key];
                }
              }
            }
            cost.push(per);
          });
          data.cost_belong_items = cost;
        }
        if (existy(values.note) && !is.empty(values.note)) {
          data.desc = values.note;
        }

        if (existy(values.bankName) && !is.empty(values.bankName)) {
          data.payee_info = {
            address: values.bankName,
            card_num: values.payeeAccount,
            name: values.payee,
          };
        }
        // 非表单获得项

        if (existy(values.order_id) && !is.empty(values.order_id)) {
          data.order_id = values.order_id;
        }

        // 断租相关-------------------
        // 余额
        if (existy(values.leftMoney) && !is.empty(values.leftMoney)) {
          data.remain_money = parseFloat(values.leftMoney);
        }
        // 断租时间
        // if (existy(values.contractDateRanage) && !is.empty(values.contractDateRanage)) {
        //   data.relet_break_date = moment(values.contractDateRanage).format('YYYY-MM-DD');
        // }
        return data;
      };
      this.props.dispatch({
        type: 'approval/typeApplyEditRentE',
        payload: transPayload(values),
      });
    });
  }


  // 基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.continue),
      }, {
        label: '申请人',
        form: dot.get(detail, 'applyName', authorize.account.name),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 编辑一级科目id初始化展示转换
  transSubjectEdit = (value) => {
    // 如果value是undefined证明是第一次进来还没有操作
    if (value == undefined) {
      // 获得科目数据数组
      const subjectList = dot.get(this.state, 'detail.catalog_id', []);
      let subjectOneId = '';  // 一级科目id
      // 得到一级科目的id
      subjectList.forEach((item) => {
        if (item.level === 1) {
          subjectOneId = item.catalog_id;
        }
      });
      return subjectOneId;  // 一级科目id
    } else {
      return value;
    }
  }

  // 费用信息
  renderRentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    // 合同日期范围
    let contractDateRanage = [];
    if (dot.has(detail, 'relet_start_time') && dot.has(detail, 'relet_end_time')) {
      contractDateRanage = [
        moment(dot.get(detail, 'relet_start_time'), 'YYYY-MM-DD'),
        moment(dot.get(detail, 'relet_end_time'), 'YYYY-MM-DD'),
      ];
    }
    const formItems = [
      {
        label: '租金',
        form: getFieldDecorator('monthRent', {
          initialValue: dot.get(detail, 'month_rent', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input disabled placeholder="" addonAfter="元" />,
          ),
      }, {
        label: '续租时间段',
        form: getFieldDecorator('contractDateRanage', {
          initialValue: contractDateRanage,
          rules: [{ required: true, message: '请填写内容' }] })(
            <RangePicker disabled />,
          ),
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
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: undefined })(
          <TextArea rows={2} />,
          ),
      },
    ];
    // 成本中心
    const expense = {
      costCenter: dot.get(detail, 'cost_center', undefined),  // 成本中心
      costBelong: dot.get(detail, 'cost_belong', undefined),  // 成本归属
      // 子项目
      costItems: dot.get(detail, 'cost_belong_items', []).map((item) => {
        return {
          platform: dot.get(item, 'platform_code', undefined),    // 平台
          vendor: dot.get(item, 'supplier_id', undefined),        // 供应商
          city: dot.get(item, 'city_spelling', undefined),        // 城市
          district: dot.get(item, 'biz_id', undefined),           // 商圈
          costCount: dot.get(item, 'custom_money', undefined),    // 自定义分配金额
        };
      }),
    };
    return (
      <CoreContent title="项目信息">
        {/* 成本中心，成本归属等等 */}
        {
          getFieldDecorator('expense', {
            initialValue: expense,
          })(
            <CommonExpense subjectOne={this.transSubjectEdit(undefined)} />,
          )
        }

        {/* 备注，上传 */}
        <CoreForm items={formItems} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />
      </CoreContent>
    );
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;

    const formItems = [
      {
        label: '房租收款人',
        form: getFieldDecorator('payee', {
          initialValue: dot.get(detail, 'payee_info.name', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写房租收款人" />,
          ),
      }, {
        label: '收款账户',
        form: getFieldDecorator('payeeAccount', {
          initialValue: dot.get(detail, 'payee_info.card_num', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款账户" />,
          ),
      }, {
        label: '开户支行',
        form: getFieldDecorator('bankName', {
          initialValue: dot.get(detail, 'payee_info.address', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写开户支行" />,
          ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 历史信息
  renderHistoryInfo = () => {
    const { detail } = this.state;
    const list = dot.get(detail, 'history_id_list', []);
    return (
      <CoreContent title="历史信息">
        {list.map((item, index) => {
          return <DetailRent key={index} detail={item} />;
        })}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 基础信息 */}
        {this.renderBaseInfo()}

        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 项目信息 */}
        {this.renderExpenseInfo()}

        {/* 支付信息 */}
        {this.renderPaymentInfo()}

        {/* 历史信息 */}
        {this.renderHistoryInfo()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" htmlType="submit">提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
