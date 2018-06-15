// 报销表单的模版
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import { Form, Select, Button, Tooltip, Input, Icon, message } from 'antd';
import React, { Component } from 'react';

import { CoreContent, CoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/upload';
import { renderReplaceAmount } from '../../../../../application/define';
import { authorize } from '../../../../../application';


// 科目设置
import CommonSubject from '../common/subject';
// 成本中心，成本归属
import CommonExpense from '../common/expense';

const { Option } = Select;
const { TextArea } = Input;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],           // 文件列表
      subjectOne: undefined,          // 当前数据选择的一级科目id
      dispatching: props.approval.dispatching,
    };
    // this.private = {
    //   dispatch: this.props.dispatch,
    // };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dispatching: nextProps.approval.dispatching,
    });
  }
  // 提交模版
  onSubmitTemplate = (e) => {
    // const { dispatch } = this.private;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
      }
      // const data = this.transbehind(values);
      values.c_type = 1;
      values.costclass_id = this.props.query.id;
      values.type = this.props.query.type;
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
        label: '费用金额',
        form: getFieldDecorator('money', {
          initialValue: renderReplaceAmount(dot.get(detail, 'money', undefined)),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入费用金额" addonAfter="元" />,
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
        label: (
          <span> 房屋编号
            <Tooltip title="如此项费用与房屋关联可填写编号绑定" arrowPointAtCenter> <Icon type="question-circle-o" /> </Tooltip>
          </span>
        ),
        form: getFieldDecorator('houseNum', {
          initialValue: dot.get(detail, 'houseNum', undefined),
        })(
          <Input placeholder="请输入房屋编号" />,
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
  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    setTimeout(() => {
      this.setState({
        fileList: list,
      });
    }, 0);
  }
  // 删除文件
  deleteOne = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      fileList: list,
    });
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail, fileList } = this.state;
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
            initialValue: dot.get(detail, 'subjects', {

            }),
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
        label: '收款人',
        form: getFieldDecorator('payee', {
          initialValue: dot.get(detail, 'payee', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款人" />,
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
          <Button type="primary" htmlType="submit" disabled={this.state.dispatching}>提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ expense, approval }) {
  return { expense, approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
