// 科目列表搜索栏目
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
      form: undefined,
      data: [
        {
          label: '科目名称',
          decorator: 'name',
          render: (<Input placeholder="请输入" />),
        },
        {
          label: '成本归属',
          decorator: 'cost_center',
          render: (
            <Select placeholder="请选择" mode="multiple">
              <Option value="1">项目主体</Option>
              <Option value="2">项目主体总部</Option>
              <Option value="3">城市</Option>
              <Option value="4">商圈</Option>
              <Option value="5">骑士</Option>
            </Select>),
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
        {
          label: '一级科目',
          decorator: 'level1',
          render: (
            <Select placeholder="请选择" onChange={this.handleChange}>
              {this.renderFirstSubject()}
            </Select>
          ),
        },
      ],
    };
  }
  // 获得组件内的form
  getMySearchForm = (form) => {
    this.setState({ form });
  }
  // 发给后台的数据格式转换
  toInit = (values) => {
    // 状态
    if (values.state) {
      values.state = parseFloat(values.state);
    }
    // 名字
    if (values.name == '') {
      values.name = undefined;
    }
    // 成本中心全部转换成Int类型
    if (values.cost_center) {
      values.cost_center = values.cost_center.map(item => (parseFloat(item)));
    }
    // 一级科目
    if (values.level1) {
      values._id = values.level1;
    }
    // 二级科目
    if (values.level2) {
      values._id = values.level2;
    }
    // 三级科目
    if (values.level3) {
      values._id = values.level3;
    }
    // 后台只要id 删除前端自定义的字段
    delete values.level1;
    delete values.level2;
    delete values.level3;
    // 一级搜索的时候后台需要二级科目的列表
    if (values.level2_list) {
      values.level2_list = values.level2_list;
    }
    values.page = 1;
    values.limit = 30;
    return values;
  }

  handleSearch = (values) => {
    // 兼容后端，产品要求搜索一级科目的时候要显示一级科目之下的所有二三级科目，
    // 后端要求搜索一级科目的时候把二级科目的id带上，字段为level2,数组类型
    if (values.level1 && !values.level2) {
      const level2 = [];
      // 二级科目数据
      this.props.expense.subjectSec.forEach((item) => {
        // 寻找该一级科目下的二级科目
        if (item.parent_id === values.level1) {
          level2.push(item._id);
        }
      });
      values.level2_list = level2;
    }
    this.props.dispatch({ type: 'expense/getSubjectListE', payload: this.toInit(values) });
  }
  // 一级科目change事件
  handleChange = (value) => {
    const data = this.state.data;
    const array = {
      label: '二级科目',
      decorator: 'level2',
      render: (
        <Select placeholder="请选择" onChange={this.handleChangeTwo}>
          {this.renderSecondSubject(value)}
        </Select>
      ),
    };
    // 从科目树中找到一级科目
    const obj = this.props.expense.subjectName.find((item) => {
      return item._id === value;
    });
    // 如果该一级科目下有二级科目
    if (obj.children.length > 0) {
      // 判断现在渲染的科目数，二级科目选项是否存在
      data.length === 4 ? data.splice(4, 0, array) : data.splice(4, data.length - 4, array);
      this.setState({
        data,
      });
    } else {
      // 如果没有二级科目，那就取消二级科目选项
      data.length === 4 ? data.splice(4, 1) : data.splice(4, 2);
      this.setState({
        data,
      });
    }
    // 重置二级科目和三级科目选项
    this.state.form.resetFields(['level2', 'level3']);
  }

  // 二级科目change事件
  handleChangeTwo = (value) => {
    const data = this.state.data;
    const array = {
      label: '三级科目',
      decorator: 'level3',
      render: (
        <Select placeholder="请选择">
          {this.renderThirdSubject(value)}
        </Select>
      ),
    };
    // 从二级科目数中找到对应的二级科目
    const obj = this.props.expense.subjectSec.find((item) => {
      return item._id === value;
    });
    // 如果该二级科目下有三级科目
    if (obj.children.length > 0) {
      // 判断是否已经渲染三级科目选项
      data.length === 5 ? data.splice(5, 0, array) : data.splice(5, 1, array);
      this.setState({
        data,
      });
    } else {
      // 如果没有三级科目，就将三级科目项截取掉
      data.length === 5 ? data.splice(5, 1) : data.splice(5, 2);
      this.setState({
        data,
      });
    }
    this.state.form.resetFields(['level2', 'level3']);
  }

  // 一级科目选项
  renderFirstSubject = () => {
    return (
      this.props.expense.subjectName.map((item) => {
        return (
          <Option value={item._id} key={item._id}>{item.name}</Option>
        );
      })
    );
  }

  // 二级科目选项
  renderSecondSubject = (value) => {
    return (
      this.props.expense.subjectSec.map((item) => {
        if (item.parent_id === value) {
          return (
            <Option value={item._id} key={item._id}>{item.name}</Option>
          );
        }
      })
    );
  }

  // 三级科目选项
  renderThirdSubject = (value) => {
    return (
      this.props.expense.subjectThr.map((item) => {
        if (item.parent_id === value) {
          return (
            <Option value={item._id} key={item._id}>{item.name}</Option>
          );
        }
      })
    );
  }

  render = () => {
    return (
      <div>
        <MySearch data={this.state.data} getForm={this.getMySearchForm} handleSearch={this.handleSearch} />
      </div>
    );
  }
}
const WrappedSearchComponent = Form.create()(Search);
function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(WrappedSearchComponent);
