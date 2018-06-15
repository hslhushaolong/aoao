// 搜索框组件 -------- 在expense费用类型中的科目管理(subject),审批流设置(examine),费用类型设置(type)
// 解决了原搜索组件不能动态设置选项的问题
import React from 'react';
import styles from './style.less';
import { Form, Row, Col, Button, Icon } from 'antd';

const FormItem = Form.Item;
// 搜索框组件
class MySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,           // 展开按钮--控制搜索项超过6条之后是否隐藏其余项
    };
  }
  componentDidMount = () => {
    // 将表单的form丢出去，以便在父组件中调用表单方法
    if (this.props.getForm) { this.props.getForm(this.props.form); }
  }
  // 确认搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 将获取的搜索数据传给父组件的回调函数
      this.props.handleSearch(values);
    });
  }

  // 重置内容
  handleReset = () => {
    this.props.form.resetFields();
  }

  // 展开缩回
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // 父组件传入的搜索数据数组格式
    const array = this.props.data;

    const children = [];
    // 循环渲染传入的json
    // 将父组件的搜索项以表单getFieldDecoratoran函数加工处理
    for (let i = 0; i < array.length; i++) {
      children.push(
        <Col span={8} key={i}>
          <FormItem {...formItemLayout} label={array[i].label}>
            {getFieldDecorator(array[i].decorator, {
              initialValue: array[i].initialValue,
            })(
              array[i].render,
            )}
          </FormItem>
        </Col>,
      );
    }

    const expand = this.state.expand;
    const shownCount = expand ? children.length : 6;
    return (
      <Form
        className={styles['ant-advanced-search-form']}
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          {children.slice(0, shownCount)}
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              展开 <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedSearchComponent = Form.create()(MySearch);
module.exports = WrappedSearchComponent;
