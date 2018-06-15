// 创建新的申请页面（默认的页面，选择条件，点击创建按钮）
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form, Select, Button, message } from 'antd';
import { CoreContent, CoreForm } from '../../../components/core';
import { ExpenseType } from '../../../application/define';

const { Option } = Select;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseType: dot.get(props, 'approval.typeNameList', []) || [], // 费用类型列表
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      expenseType: dot.get(props, 'approval.typeNameList', []) || [], // 费用类型列表
    });
  }


  onSubmit = (e) => {
    const { expenseType } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
      }
      const { type } = values;
      // 已id寻找对应模版
      const filter = expenseType && expenseType.filter(item => item._id === type);
      // 已id寻找对应模版
      const typeValue = dot.get(filter, '0.template');
      // 找模版对应名字
      const typeName = dot.get(filter, '0.name');
      // 找模版对应id
      const typeId = dot.get(filter, '0._id');
      if (typeValue !== ExpenseType.rent && typeValue !== ExpenseType.refund) {
        return message.error('请选择正确的模版类型');
      }
      // 跳转到对应的模版创建页面
      window.location.href = `/#/Expense/Manage/Template/Create?type=${typeValue}&name=${typeName}&id=${typeId}`;
    });
  }

  // 渲染创建信息
  renderCreateInfo = () => {
    const { expenseType } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '费用类型',
        form: getFieldDecorator('type', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择费用类型">
            {
            Array.isArray(expenseType) && expenseType.map((item) => {
              return <Option key={item._id} value={item._id}>{item.name}</Option>;
            })
            }
          </Select>,
        ),
      }, {
        form: (
          <Button type="primary" size="default" htmlType="submit">添加</Button>
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent>
        <Form layout="horizontal" onSubmit={this.onSubmit}>
          <CoreForm items={formItems} cols={3} layout={layout} />
        </Form>
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染创建信息 */}
        {this.renderCreateInfo()}
      </div>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
