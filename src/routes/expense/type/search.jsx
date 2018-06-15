// 费用类型列表-搜索栏目
import { connect } from 'dva';
import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import MySearch from '../components/mySearch';

const FormItem = Form.Item;
const Option = Select.Option;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          label: '类型名称',
          decorator: 'name',
          render: (<Input placeholder="请输入" />),
        },
        {
          label: '创建人',
          decorator: 'create_account',
          render: (<Input placeholder="请输入" />),
        },
        {
          label: '状态',
          decorator: 'state',
          render: (
            <Select placeholder="请选择">
              <Option value="1">正常</Option>
              <Option value="0">停用</Option>
            </Select>
          ),
        },
      ],
    };
  }
  toInit = (values) => {
    if (values.state) {
      values.state = parseFloat(values.state);
    }
    // antd bug 清空输入框不是undefined
    if (values.name == '') {
      values.name = undefined;
    }
    // antd bug 清空输入框不是undefined
    if (values.create_account == '') {
      values.create_account = undefined;
    }
    values.page = 1;
    values.limit = 30;
    return values;
  }
  handleSearch = (values) => {
    this.props.dispatch({ type: 'expense/getTypeListE', payload: this.toInit(values) });
  }
  render = () => {
    return (
      <div>
        <MySearch data={this.state.data} handleSearch={this.handleSearch} />
      </div>
    );
  }
}
const WrappedSearchComponent = Form.create()(Search);
function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(WrappedSearchComponent);
