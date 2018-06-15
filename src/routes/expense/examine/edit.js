// 编辑审批流页面
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm, Form } from 'antd';
import styles from './new.less';
import MyTransfor from './myTransfor';
import dot from 'dot-prop';

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVisible: false, // 弹窗
      process: dot.get(props, 'expense.examineDetail.examine_tree', []),      // 审批流名字
      value: dot.get(props, 'expense.examineDetail.examine_id', []),        // 审批流值
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      process: dot.get(props, 'expense.examineDetail.examine_tree', []),      // 审批流名字
      value: dot.get(props, 'expense.examineDetail.examine_id', []),        // 审批流值
    });
  }
  // 确认创建
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.value.length === 0) {
      message.error('审批流设置不能为空');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // antd bug 清空显示''
        if (values.desc == undefined || values.desc == '') {
          delete values.desc;
        }
        // 审批流设置后端字段
        values.examine_tree = this.state.value;
        if (values.name === this.props.expense.examineDetail.name) {
          delete values.name;
        }
        // 后台要_id
        values._id = this.props.expense.examineDetail._id;
        this.props.dispatch({ type: 'expense/editExamineNameE', payload: values });
      }
    });
  }
  // 点击新建
  onBuild = () => {
    this.setState({
      newVisible: true,
    });
  }
  // 点击取消
  onCancel = () => {
    this.setState({
      newVisible: false,
    });
  }
  // 确定选择
  onSelect = (newvalue, label) => {
    const process = this.state.process;   // 审批流前端展示名字
    const value = this.state.value;  // 审批流id
    process.push(label);  // 往数组里增加一项
    value.push(newvalue); // 往数组里增加一项
    this.setState({
      process, value,
    });
  }
  // 删除按钮
  deleteProcessName = (index) => {
    const array = this.state.process;     // 审批流的name
    const value = this.state.value;        // 审批流的value
    array.splice(index, 1);     // 在数组中去掉
    value.splice(index, 1);     // 在数组中去掉
    this.setState({ process: array, value });
  }
  // 审批流单组名字
  renderProcessName = (array) => {
    return array.map((item, index) => {
      return (
        <p key={index}>{item}</p>
      );
    });
  }
  // 审批流程名字
  renderProcessGroup = () => {
    return this.state.process.map((item, index) => {
      return (
        <div className={styles.longSquare} key={index}>
          <div className={styles.square}>
            <div className={styles.delete} onClick={() => { this.deleteProcessName(index); }}>x</div>
            {this.renderProcessName(item)}
          </div>
          <div className={styles.arrow}>---></div>
        </div>
      );
    });
  }
  // 渲染流程图
  renderProcess = () => {
    return (
      <div>
        <div>
          {this.renderProcessGroup()}
          {/* 加号点击之后增加一项审批流 */}
          <div className={styles.circle} onClick={this.onBuild} >+</div>
        </div>
      </div>
    );
  }
  render = () => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    const formItemLayoutOperate = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>新增审批流</h2><hr style={{ marginBottom: '30px', marginTop: '10px' }} />
        <FormItem
          {...formItemLayout}
          label={'审批流名称'}
          key={'name'}
        >
          {getFieldDecorator('name', {
            initialValue: dot.get(this.props, 'expense.examineDetail.name', undefined),
            rules: [
              { required: true, message: '必填项' },
              { max: 20, message: '字数过多' },
            ],
          })(
            <Input placeholder="请输入" />,
          )}
        </FormItem>,
        <FormItem
          {...formItemLayout}
          label={'审批流描述'}
          key={'desc'}
        >
          {getFieldDecorator('desc', {
            initialValue: dot.get(this.props, 'expense.examineDetail.desc', undefined),
            rules: [
              { max: 200, message: '字数过多' },
            ],
          })(
            <Input type="textarea" autosize={{ minRows: 10, maxRows: 10 }} />,
          )}
        </FormItem>,
        <FormItem
          {...formItemLayoutOperate}
          label={'审批流设置'}
          key={'operate'}
        >
          <div>
            {this.renderProcess()}
            <MyTransfor onCancel={this.onCancel} visible={this.state.newVisible} onSelect={this.onSelect} />
          </div>
        </FormItem>,
        <FormItem
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <Button type="primary" htmlType="submit">确定</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="default" onClick={() => { window.location.href = '/#/Expense/Examine'; }}>取消</Button>
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
