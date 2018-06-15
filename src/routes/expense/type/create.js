// 新建费用类型页面
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
      picture: false,     // 是否显示模版图片
      whitchPicture: '',  // 显示哪张模版图片
    };
  }
  // 改变显示的模版图片
  changePhoto = (value) => {
    // 1 模版一 2 模版二
    if (value === '1') {   // 显示模版一的图片
      this.setState({
        picture: true,
        whitchPicture: tempalteOne,  // 模版一的图片
      });
    } else {    // 显示模版二的图片
      this.setState({
        picture: true,
        whitchPicture: tempalteTwo,  // 模版二的图片
      });
    }
  }
  // 确认创建
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.template = parseFloat(values.template);  // 模版 1/2
        this.props.dispatch({ type: 'expense/buildTypeE', payload: values });
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
        <h2>新增费用类型</h2><hr style={{ marginBottom: '30px', marginTop: '10px' }} />
        <Row>
          <Col span={8} key="1">
            <FormItem
              {...formItemLayout}
              label={'费用类型名称'}
              key={'name'}
            >
              {getFieldDecorator('name', {
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
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <Select placeholder="请选择" onChange={this.changePhoto}>
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
