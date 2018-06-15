// 新建审批流页面
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm, Form } from 'antd';
import styles from './new.less';
import MyTransfor from './myTransfor';

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVisible: false, // 弹窗
      process: [],      // 审批流名字
      value: [],        // 审批流值
    };
  }
  // 确认创建
  handleSubmit = (e) => {
    e.preventDefault();
    // 判断审批流值是否为空
    if (this.state.value.length === 0) {
      message.error('审批流设置不能为空');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // antd bug 删除之后不是undefined
        if (values.desc == undefined || values.desc == '') {
          delete values.desc;
        }
        values.examine_tree = this.state.value;
        this.props.dispatch({ type: 'expense/buildExamineE', payload: values });
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
    const process = this.state.process;
    // 获取当前的审批流数组的值
    const value = this.state.value;
    // 将最近值加入数组然后从新负值
    process.push(label);
    value.push(newvalue);
    this.setState({
      process, value,
    });
  }

  // 删除按钮
  deleteProcessName = (index) => {
    const array = this.state.process;// 渲染的审批流名称
    const value = this.state.value;  // 审批流的value
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

  // 名字
  // 渲染审批流设置
  renderProcessGroup = () => {
    // 将审批人列表循环
    return this.state.process.map((item, index) => {
      return (
        <div className={styles.longSquare} key={index}>
          <div className={styles.square}>
            <div className={styles.delete} onClick={() => { this.deleteProcessName(index); }}>x</div>
            {/* 生成单组审批人名字 */}
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
          {/* 加号点击新增审批流 */}
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
