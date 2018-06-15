// 报销表单的模版(编辑)
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Select, Button, Tooltip, Input, Icon } from 'antd';
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/upload';

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
      subjectOne: undefined,                               // 科目一id
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
      fileList: this.transFileList(dot.get(props, 'approval.typeApplyDetail.files_address', [])), // TODO: ??
    };
    this.private = {
      dispatch: this.props.dispatch,
    };
  }

  // 将文件格式{name:value}转换为{name:name,value:value}
  transFileList = (value) => {
    const fileList = [];
    if (value == null) {
      return [];
    }
    value.forEach((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          fileList.push(key);
        }
      }
    });
    return fileList;
  }

  componentWillReceiveProps(props) {
    this.setState({
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
      fileList: this.transFileList(dot.get(props, 'approval.typeApplyDetail.files_address', [])),
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
      values.type = this.state.detail.costclass_type;
      values.order_id = this.state.detail._id;
      values.files_address = this.state.fileList;
      this.props.dispatch({
        type: 'approval/typeApplyEditE',
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
        form: dot.get(detail, 'costclass_name', '--'),
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
  // 改变科目回调
  onChangeSubject = (value) => {
    // 设置当前选择的科目id值
    this.setState({
      subjectOne: value.subjectOne || undefined,
    });
  }
  // 编辑科目一id初始化展示转换
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

    const formItems = [
      {
        label: '费用金额',
        form: getFieldDecorator('money', {
          initialValue: dot.get(detail, 'reimb_money', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入费用金额" addonAfter="元" />,
          ),
      }, {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          initialValue: dot.get(detail, 'has_invoice', undefined) ? '1' : '0',
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
          initialValue: dot.get(detail, 'house_num', undefined),
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
    const { detail } = this.state;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: dot.get(detail, 'desc', undefined) })(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload files={dot.get(detail, 'files_address', undefined)} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
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
    // TODO: ???
    const subject = dot.get(detail, 'catalog_id', []);
    // TODO: ???
    const subjects = {

    };
    // TODO: ???
    subject.forEach((item) => {
      if (item.level == 1) {
        subjects.subjectOne = item.catalog_id;
      }
      if (item.level == 2) {
        subjects.subjectTwo = item.catalog_id;
      }
      if (item.level == 3) {
        subjects.subjectThree = item.catalog_id;
      }
    });

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
        {/* 科目设置 */}
        {
          getFieldDecorator('subjects', { initialValue: subjects })(
            <CommonSubject onChange={this.onChangeSubject} />,
          )
        }

        {/* 成本中心，成本归属等等 */}
        {
          getFieldDecorator('expense', { initialValue: expense })(
            <CommonExpense subjectOne={this.transSubjectEdit(this.state.subjectOne)} />,
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
          initialValue: dot.get(detail, 'payee_info.name', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款人" />,
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
          <Button type="primary" htmlType="submit">提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ expense, approval }) {
  return { expense, approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
