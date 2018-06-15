// 房租表单的模版
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Select, Button, DatePicker, Input, message } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { CoreContent, CoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/upload';
import { ExpenseType, ExpenseHouseState, ExpenseCostCenter } from '../../../../../application/define';
import { authorize } from '../../../../../application';
import is from 'is_js';


// 科目设置
import CommonSubject from '../common/subject';
// 成本中心，成本归属
import CommonExpense from '../common/expense';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.query.type,         // 模版类型
      fileList: [],                   // 文件列表
      detail: props.typeApplyDetail,  // 编辑页面数据
      subjectOne: undefined,          // 当前数据选择的一级科目id
      dispatching: props.approval.dispatching,
    };
    this.private = {
      dispatch: this.props.dispatch,
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      type: props.query.type, // 模版类型
      detail: props.typeApplyDetail,        // 编辑页面数据
      dispatching: props.approval.dispatching,
    });
  }
  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
  }
  // 删除文件
  deleteOne = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      fileList: list,
    });
  }
  // 提交模版
  onSubmitTemplate = (e) => {
    const { dispatch } = this.private;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
        return;
      }
      // const data = this.transbehind(values);
      values.thing_state = 1,
      values.c_type = 1;
      values.costclass_id = this.props.query.id;
      values.type = this.props.query.type;
      values.house_num = this.props.approval.uniqueHouseNum;
      values.files_address = this.state.fileList;
      if (this.props.query.summaryId) {
        values.examine_id = this.props.query.summaryId;
      }
      this.props.dispatch({
        type: 'approval/submitTypeApplyE',
        payload: values,
      });
    });
  }


  // 基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '费用类型',
        form: this.props.query.name,
      }, {
        label: '房屋状态',
        form: ExpenseHouseState.description(dot.get(detail, 'houseState', ExpenseHouseState.new)),
      }, {
        label: '房屋编号',
        form: this.props.approval.uniqueHouseNum,
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

  // 费用信息
  renderRentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;

    const formItems = [
      {
        label: '用途',
        form: getFieldDecorator('usage', {
          initialValue: dot.get(detail, 'usage', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入用途" />,
          ),
      }, {
        label: '房屋面积',
        form: getFieldDecorator('area', {
          initialValue: dot.get(detail, 'area', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入房屋面积" addonAfter="㎡" />,
          ),
      }, {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          initialValue: dot.get(detail, 'hasInvoice', undefined) ? '1' : '0',
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择是否开票">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>,
          ),
      }, {
        label: '合同租期',
        form: getFieldDecorator('contractDateRanage', {
          initialValue: dot.get(detail, 'contractDateRanage', undefined),
          rules: [{ required: true, message: '请填写内容' }] })(
            <RangePicker />,
          ),
      }, {
        label: '月租金',
        form: getFieldDecorator('monthRent', {
          initialValue: dot.get(detail, 'monthRent', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="元" />,
          ),
      }, {
        label: '付款月数（月／次）',
        form: getFieldDecorator('month', {
          initialValue: `${dot.get(detail, 'month', 1)}`,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择付款月数">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </Select>,
          ),
      }, {
        label: '提前付款天数',
        form: getFieldDecorator('days', {
          initialValue: dot.get(detail, 'days', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="天" />,
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
  // 改变科目回调
  onChangeSubject = (value) => {
    // 设置当前选择的科目id值
    this.setState({
      subjectOne: value.subjectOne || undefined,
    });
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: dot.get(detail, 'note', undefined) })(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            {
            this.state.fileList.map((item, index) => {
              return (
                <p key={index}>{item}<span onClick={() => { this.deleteOne(index); }} style={{ color: 'red', cursor: 'pointer', margin: '0 5px' }}>删除</span></p>
              );
            })
          }
          </div>
        ),
      },
    ];
    return (
      <CoreContent title="项目信息">
        {/* 科目设置 */}
        {
          getFieldDecorator('subjects', {
            initialValue: dot.get(detail, 'subjects', {}),
          })(
            <CommonSubject onChange={this.onChangeSubject} />,
          )
        }

        {/* 成本中心，成本归属等等 */}
        {
          getFieldDecorator('expense', {
            initialValue: dot.get(detail, 'expense', {}),
          })(
            <CommonExpense subjectOne={this.state.subjectOne} />,
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
          initialValue: dot.get(detail, 'payee', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写房租收款人" />,
          ),
      }, {
        label: '收款账户',
        form: getFieldDecorator('payeeAccount', {
          initialValue: dot.get(detail, 'payeeAccount', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款账户" />,
          ),
      }, {
        label: '开户支行',
        form: getFieldDecorator('bankName', {
          initialValue: dot.get(detail, 'bankName', undefined),
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

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" htmlType="submit" disabled={this.state.dispatching} >提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval, expense }) {
  return { approval, expense };
}
export default connect(mapStateToProps)(Form.create()(Index));
