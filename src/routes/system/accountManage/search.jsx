/**
 * Created by hejiaoyan 2018/03/13
 * 多账号index
 *
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Select, Form, Button, Table, Pagination, Popconfirm, Modal, Input } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Modules from '../../../application/define/modules';
import { authorize } from '../../../application';
import { PhoneRegExp } from '../../../application/define';
import { CoreSearch, CoreContent } from '../../../components/core/index';

const [FormItem, Option] = [Form.Item, Select.Option];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',              // 检索手机号
      allAccounts: dot.get(props, 'allAccounts', []),   // 所有有效账号
    };
    this.private = {
      dispatch: props.dispatch,
      showModal: props.showModal,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { allAccounts } = nextProps;
    this.setState({
      allAccounts,
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 重置
  onReset = () => {
    this.setState({
      account_id: '',     // 重置手机号
    });
  }

  // select
  onChangePhone = (e) => {
    this.setState({
      id: e,
    });
  }
  // 收集查询条件 查询数据
  onSearch = () => {
    const { dispatch } = this.private;
    const { id } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 获取关联账号列表
        dispatch({
          type: 'system/getAccountsListE',
          payload: {
            account_id: id,
            page: 1,
            limit: 10,
          },
        });
      }
    });
  };

  // 渲染检索
  renderSearchComponent = () => {
    const { allAccounts } = this.state;
    const { showModal } = this.private;

    // 所有已选择账号
    const allSelect = [];
    allAccounts.forEach((item, index) => {
      const key = item.id + index;
      allSelect.push(<Option value={item.id} key={key}>{item.phone}({item.name})</Option>);
    });

    const formItems = [
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('account_id')(
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            // mode="tags"
            placeholder="请输入手机号"
            onChange={this.onChangePhone}
          >
            {allSelect}
          </Select>,
        )),
      },
    ];

    const props = {
      items: formItems,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };

    const titleExt = <Button onClick={() => { showModal('add', true); }}>添加账号关联</Button>;
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} operations={titleExt} />
      </CoreContent >
    );
  }

  // 渲染
  render() {
    return (
      <div>
        {/* 渲染检索条件 */}
        {this.renderSearchComponent()}
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}
export default connect(mapStateToProps)(Form.create()(Search));
