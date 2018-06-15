// 编辑费用类型页面
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm, Form } from 'antd';
import tempalteOne from '../../../static/templateOne.png';
import tempalteTwo from '../../../static/templateTwo.png';

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: true,    // 是否显示模版图片
      whitchPicture: props.expense.typeDetail.template == 1 ? tempalteOne : tempalteTwo,   // 显示模版一还是模版二的图片
    };
  }

  // 确认编辑
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values.template;
        // 没改过名字不能床给后台
        if (values.name === this.props.expense.typeDetail.name) {
          message.error('费用类型名字重复');
          return;
        }
        values._id = this.props.expense.typeDetail._id;
        // 编辑
        this.props.dispatch({ type: 'expense/editTypeNameE', payload: values });
      }
    });
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>新增审批流</h2><hr style={{ marginBottom: '30px', marginTop: '10px' }} />
        <Row>
          <Col span={8} key="1">
            <FormItem
              {...formItemLayout}
              label={'费用类型名称'}
              key={'name'}
            >
              {getFieldDecorator('name', {
                initialValue: this.props.expense.typeDetail.name,
                rules: [
                  { required: true, message: '必填项' },
                  { max: 20, message: '字数过多' },
                ],
              })(
                <Input placeholder="请输入" />,
          )}
            </FormItem>
          </Col>
          <Col span={8} key="2">
            <FormItem
              {...formItemLayout}
              label={'选择模版'}
              key={'desc'}
            >
              {getFieldDecorator('template', {
                initialValue: this.props.expense.typeDetail.template.toString(),
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <Select placeholder="请选择" disabled>
                  <Option value="1">模版一</Option>
                  <Option value="2">模版二</Option>
                </Select>,
          )}
            </FormItem>
          </Col>
        </Row>
        <img style={{ width: '100%' }} src={this.state.whitchPicture} />
        <FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">确定</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="default" onClick={() => { window.location.href = '/#/Expense/Type'; }}>取消</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

function mapStateToProps({ expense }) {
  return { expense };
}
const WrappedSearchComponent = Form.create()(Index);
export default connect(mapStateToProps)(WrappedSearchComponent);
