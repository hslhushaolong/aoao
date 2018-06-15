// 新建科目弹窗
import { connect } from 'dva';
import React from 'react';
import { CostCenter } from '../transInt';
import { Form, Row, Col, Button, Modal, Input, Select, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class MyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 新建科目弹窗表单渲染字段
      selection: [
        {
          label: '科目名称',
          decorator: 'name',
          required: true,
          max: 20,   // 科目名字最多20个字
          render: (<Input placeholder="请输入" />),
        },
        {
          label: '科目级别',
          decorator: 'level',
          required: true,
          render: (
            <Select placeholder="请选择" onChange={this.selectLevel}>
              <Option value="1">一级</Option>
              <Option value="2">二级</Option>
              <Option value="3">三级</Option>
            </Select>),
        },
        {    // 一级科目的可以编辑，二三级科目不可以编辑，所以之后要根据科目渲染可否编辑的成本中心项
          label: '成本中心',
          decorator: 'cost_center',
          required: true,
          render: (
            <Select placeholder="请选择" mode="multiple">
              <Option value="1">项目主体</Option>
              <Option value="2">项目主体总部</Option>
              <Option value="3">城市</Option>
              <Option value="4">商圈</Option>
              <Option value="5">骑士</Option>
            </Select>
          ),
        },
        {
          label: '项目描述',
          decorator: 'desc',
          max: 200, // 项目描述最多200个字
          render: (
             // 文本框能改变的大小 antd文档
            <Input type="textarea" autosize={{ minRows: 3, maxRows: 10 }} />
          ),
        },
      ],
    };
  }
  // 渲染上级科目
  renderParentSubject = (values) => {
    return values.map((item) => {
      return (
        <Option value={item._id} key={item._id}>{item.name}</Option>
      );
    });
  }

  // 渲染成本中心
  renderCostCenter = (values) => {
    this.props.form.setFieldsValue({ cost_center: this.props.expense.subjectData.find(item => (item._id === values)).cost_center.map(item => (item.toString())) });
  }

  // 选择创建等级
  // 选择创建的科目是几级
  selectLevel = (values) => {
    this.props.form.resetFields(['parent_id', 'cost_center']);
    const data = this.state.selection;
    const array = [
      {   // 一级科目没有上级科目这一项，二三级科目要加上 这一项
        label: '上级科目',
        decorator: 'parent_id',
        required: true,
        render: (
          <Select placeholder="请选择">
            <Option value="1">一级</Option>
            <Option value="2">二级</Option>
            <Option value="3">三级</Option>
          </Select>),
      },
      {     // 这就是二三级的不可选的成本中心
        label: '成本中心',
        decorator: 'cost_center',
        required: true,
        render: (
          <Select placeholder="请选择" mode="multiple" disabled>
            <Option value="1">项目主体</Option>
            <Option value="2">项目主体总部</Option>
            <Option value="3">城市</Option>
            <Option value="4">商圈</Option>
            <Option value="5">骑士</Option>
          </Select>
        ),
      },
      { // 这是一级科目可编辑的成本中心
        label: '成本中心',
        decorator: 'cost_center',
        required: true,
        render: (
          <Select placeholder="请选择" mode="multiple">
            <Option value="1">项目主体</Option>
            <Option value="2">项目主体总部</Option>
            <Option value="3">城市</Option>
            <Option value="4">商圈</Option>
            <Option value="5">骑士</Option>
          </Select>
        ),
      },
    ];

    // 不同等级展示项不同，根据所选等级判断要展示的项，更改展示项数组
    // 一级科目没有上级科目选项并且成本中心可选择，二三级科目有上级科目选项，但是成本中心不可选
    // 以下判断都是根据对科目的选择，来切换弹窗选项的
    // 二级科目展示成本中心
    if (values === '2') {
      array[0].render = (
        <Select placeholder="请选择" onChange={this.renderCostCenter}>
          {this.renderParentSubject(this.props.expense.subjectName)}
        </Select>
      );
      // 看是否已展示成本中心项，根据现在弹窗数据的长度，如果长度是4说明没有上级科目项，只要将成本中心项替换，
      // 如果长度不是4，说明渲染了上级科目项，所以需要切掉两项
      data.length === 4 ? data.splice(2, 1, array[0], array[1]) : data.splice(2, 2, array[0], array[1]);
      this.setState({
        selection: data,
      });
    // 三级科目和二级科目逻辑一致
    } else if (values === '3') {
      array[0].render = (
        <Select placeholder="请选择" onChange={this.renderCostCenter}>
          {this.renderParentSubject(this.props.expense.subjectSec)}
        </Select>
      );
      // 看是否已展示成本中心项，根据现在弹窗数据的长度，如果长度是4说明没有上级科目项，只要将成本中心项替换，
      // 如果长度不是4，说明渲染了上级科目项，所以需要切掉两项
      data.length === 4 ? data.splice(2, 1, array[0], array[1]) : data.splice(2, 2, array[0], array[1]);
      this.setState({
        selection: data,
      });
    } else {
      // 如果是一级科目，如果长度是4说明没有上级科目项，只要将成本中心项替换，
      data.length === 4 ? data.splice(2, 1, array[2]) : data.splice(2, 2, array[2]);
      this.setState({
        selection: data,
      });
    }
  }

  // 初始化
  toInit = (values) => {
    if (values.name == undefined || values.name == '') {
      message.error('请输入科目名');
      return;
    }
    if (values.level == undefined || values.level == '') {
      message.error('请选择等级');
      return;
    }
    if (values.cost_center == undefined || values.cost_center == '') {
      message.error('请选择成本中心');
      return;
    }
    values.level = parseFloat(values.level);
    values.cost_center = values.cost_center.map(item => (parseFloat(item)));
    return values;
  }

  // 确定提交
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(this.toInit(values));
      }
      this.props.form.resetFields();
    });
  }

  // 取消弹窗
  handleCancel = () => {
    this.props.onCancel();
    this.props.form.resetFields();
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const children = [];
    // 遍历要传进来渲染的表单
    for (let i = 0; i < this.state.selection.length; i++) {
      children.push(
        <FormItem
          {...formItemLayout}
          label={this.state.selection[i].label}
          key={this.state.selection[i].decorator}
        >
          {
            // 表单封装判断是否是纯展示项
            this.state.selection[i].exhibition ?
              // 如果是存展示项则不需要getFieldDecorator
              this.state.selection[i].render :
              // 判断是否有最大值现在
              this.state.selection[i].max ?
                // 如果有就加上最大值限制
                getFieldDecorator(this.state.selection[i].decorator, {
                  initialValue: this.state.selection[i].initialValue,
                  rules: [
                    { required: this.state.selection[i].required, message: '必填项' },
                    { max: this.state.selection[i].max, message: '字数过多' },
                  ],
                })(this.state.selection[i].render)
              :
                // 附上默认值
                getFieldDecorator(this.state.selection[i].decorator, {
                  initialValue: this.state.selection[i].initialValue,
                  rules: [{ required: this.state.selection[i].required, message: '必填项' }],
                })(this.state.selection[i].render)
          }
        </FormItem>,
      );
    }
    return (
      <Modal
        title="新增科目" visible={this.props.visible}
        onOk={this.handleSubmit} onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          {children}
        </Form>
      </Modal>
    );
  }
}
const WrappedSearchComponent = Form.create()(MyModal);
function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(WrappedSearchComponent);
