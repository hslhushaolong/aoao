// 审批流列表页搜索栏目
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
          label: '审批流名称',
          decorator: 'name',
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

  // 前端数据转换为后台需要的数据格式
  toInit = (values) => {
    // 枚举址需要int
    if (values.state) {
      values.state = parseFloat(values.state);
    }
    // antd bug 输入框删除之后不是undefined
    if (values.name == '') {
      values.name = undefined;
    }
    values.page = 1;
    values.limit = 30;
    return values;
  }

  handleSearch = (values) => {
    this.props.dispatch({ type: 'expense/getExamineListE', payload: this.toInit(values) });
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
