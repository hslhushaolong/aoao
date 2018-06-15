import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Form, Table, Pagination, Popconfirm, Modal, Message } from 'antd';
import { authorize } from '../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],                           // 可用账号
      visible: props.visible,                // 控制模态框
      allAccounts: props.allAccounts,        // 所有账号
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { visible, allAccounts } = nextProps;
    this.setState({
      visible,
      allAccounts,
    });
  }

  // 提交
  hanleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.hanleSubmit(values.addPhone);
      }
    });
  }

  // 取消
  handleCancel = () => {
    // 清空表单数据
    this.props.showModal('add', false);
    this.props.form.resetFields();
  }

  // 前端本地搜索
  onSearch = (e) => {
    const { allAccounts, options } = this.state;
    // 最新检索结果
    const optionsTemp = allAccounts.filter((item) => {
      if (item.phone === e) {
        return item;
      }
    });
    // 合并所有检索结果
    const optionsList = options.concat(optionsTemp);
    this.setState({ options: optionsList });
  }

  // 渲染模态框
  renderModalComponent = () => {
    const { visible, options } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
    };

    return (
      <Modal
        title={'添加关联账号'}
        visible={visible}
        onOk={this.hanleSubmit}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="关联账号" {...formItemLayout}>
            {getFieldDecorator('addPhone', {
              rules: [
                { required: true, message: '请输入关联账号' },
                // { pattern: PhoneRegExp, message: '请输入有效电话号' },
              ],
            })(
              <Select
                placeholder="请输入关联账号"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={false}
                mode="multiple"
                onSearch={this.onSearch}
              >
                {
                  // 显示搜索结果账号
                  options.map((item, index) => {
                    // 显示搜索结果账号
                    return <Option value={item.id} key={index}>{item.phone}({item.name}-{authorize.roleNameById(item.gid)})</Option>;
                  })
                }
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染添加关联账号 */}
        {this.renderModalComponent()}
      </div>
    );
  }
}
function mapStateToProps({ system }) {
  return { system };
}
export default connect(mapStateToProps)(Form.create()(Add));
