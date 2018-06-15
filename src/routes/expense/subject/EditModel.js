// 编辑科目组件
import { connect } from 'dva';
import React from 'react';
import { CostCenter, Level } from '../transInt';
import { Form, Row, Col, Button, Modal, Input, Select, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [
        {
          label: '科目名称',
          decorator: 'name',
          initialValue: props.editData.name,
          required: true,
          max: 20,
          render: (<Input placeholder="请输入" />),
        },
        {
          label: '科目级别',
          exhibition: true,
          decorator: 'level',
          render: (
            <div>{this.renderLevel(props.editData.level)}</div>),
        },
        {
          label: '成本中心',
          exhibition: true,
          decorator: 'cost_center',
          render: (
            <div>{this.renderCost(props.editData.cost_center)}</div>
          ),
        },
        {
          label: '项目描述',
          decorator: 'desc',
          initialValue: props.editData.desc,
          max: 200,
          render: (
            <Input type="textarea" autosize={{ minRows: 3, maxRows: 10 }} />
          ),
        },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const selection = [
      {
        label: '科目名称',
        decorator: 'name',
        initialValue: nextProps.editData.name,
        required: true,
        max: 20,
        render: (<Input placeholder="请输入" />),
      },
      {
        label: '科目级别',
        exhibition: true,
        decorator: 'level',
        render: (
          <div>{this.renderLevel(nextProps.editData.level)}</div>),
      },
      {
        label: '成本中心',
        exhibition: true,
        decorator: 'cost_center',
        render: (
          <div>{this.renderCost(nextProps.editData.cost_center)}</div>
        ),
      },
      {
        label: '项目描述',
        decorator: 'desc',
        initialValue: nextProps.editData.desc,
        max: 200,
        render: (
          <Input type="textarea" autosize={{ minRows: 3, maxRows: 10 }} />
        ),
      },
    ];
    if (nextProps.editData.level > 1) {
      selection.splice(1, 0, {
        label: '上级科目',
        exhibition: true,
        decorator: 'parent_name',
        render: (
          <div>{nextProps.editData.parent_name}</div>),
      });
    }
    this.setState({
      selection,
    });
  }

  // 渲染科目级别
  renderLevel = (values) => {
    // 科目级别以数组形式展示
    return Level[`${values}`];
  }

  // 渲染成本归属
  renderCost = (values) => {
    if (values) {
      // 渲染成本归属的值
      return values.map(item => (` ${CostCenter[`${item}`]} `));
    }
  }

 // 提交
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 判断名字是否更改过
        if (values.name === this.props.editData.name) {
          delete values.name;
        }
        // 判断描述是否更改过
        if (values.desc === this.props.editData.desc) {
          delete values.desc;
        }
        values._id = this.props.editData._id;
        this.props.onSubmit(values);
      }
      this.props.form.resetFields();
    });
  }
  // 取消
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
    // TODO: ??
    for (let i = 0; i < this.state.selection.length; i++) {
      children.push(
        <FormItem
          {...formItemLayout}
          label={this.state.selection[i].label}
          key={this.state.selection[i].decorator}
        >
          {
            // 判断表单是否是纯展示项，是的话就不虚要渲染getFieldDecorator了
            this.state.selection[i].exhibition ? this.state.selection[i].render :
            getFieldDecorator(this.state.selection[i].decorator, {
              initialValue: this.state.selection[i].initialValue,
              rules: [{
                required: this.state.selection[i].required, message: '必填项',
              },
              { max: this.state.selection[i].max, message: '字数过多',
              }],
            })(
            this.state.selection[i].render,
  )}
        </FormItem>,
      );
    }
    return (
      <Modal
        title="编辑科目" visible={this.props.visible}
        onOk={this.handleSubmit} onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          {children}
        </Form>
      </Modal>
    );
  }
}
const WrappedSearchComponent = Form.create()(EditModal);
function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(WrappedSearchComponent);
