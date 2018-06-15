import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import { Select, Form, Table, Pagination, Popconfirm, Modal, Message } from 'antd';
import { authorize } from '../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allAccounts: props.allAccounts,        // 列表数据
      visible: props.visible,                // 模态框
      optionIds: props.optionIds,            // 当前编辑数据
      options: [],            // 保存检索结果
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { visible, allAccounts, optionIds } = nextProps;
    this.setState({
      visible,
      allAccounts,
      optionIds,
    });
  }

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

  // 提交
  hanleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.hanleSubmit(values.editPhone);
      }
    });
  }

  // 取消
  handleCancel = () => {
    this.props.showModal('edit', false);
    // 清空表单数据
    this.props.form.resetFields();
  }

  // 渲染模态框
  renderModalComponent = () => {
    const { visible, allAccounts, optionIds, options } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
    };

    // 编辑时显示已关联账号
    const showAccounts = [];
    // 初始化账号id
    const initialAccoutsIs = [];
    allAccounts.forEach((item, index) => {
      // 显示全部账号
      // allSelect.push(<Option value={`${item.id}`} key={index}>{item.phone}({item.name}-{authorize.roleNameById(item.gid)})</Option>);

      // 展示已关联账号
      const accountIds = dot.get(optionIds, 'account_ids', []);
      // 寻找已关联账号
      for (let i = 0; i < accountIds.length; i++) {
        // 如果id一样则加入已关联账号列表
        if (accountIds[i] === item.id) {
          initialAccoutsIs.push(item.id);
          showAccounts.push(item);
        }
      }
    });
    // 合并初始化数据和检索结果
    const list = showAccounts.concat(showAccounts, options);
    return (
      <Modal
        title={'编辑关联账号'}
        visible={visible}
        onOk={this.hanleSubmit}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="关联账号" {...formItemLayout}>
            {getFieldDecorator('editPhone', {
              rules: [
                { required: true, message: '请输入关联账号' },
                // { pattern: PhoneRegExp, message: '请输入有效电话号' },
              ],
              initialValue: initialAccoutsIs,
            })(
              <Select
                placeholder="请输入关联账号"
                allowClear
                showSearch
                optionFilterProp="children"
                mode="multiple"
                onSearch={this.onSearch}
              >
                {
                  // 是否根据手机号检索
                  (options.length > 0 ? list : showAccounts).map((item, index) => {
                    const key = item.id + index;
                    // 显示搜索结果账号
                    return <Option value={item.id} key={key}>{item.phone}({item.name}-{authorize.roleNameById(item.gid)})</Option>;
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
export default connect(mapStateToProps)((Form.create()(Edit)));
