/**
 * 用户搜索组件
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input } from 'antd';
import Modules from '../../../application/define/modules';

const [FormItem, Option] = [Form.Item, Select.Option];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionInfoList: this.props.positionInfoList || [],
    };
  }

  // 收集查询条件 查询数据
  handleSubmit = (e) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const values = this.props.form.getFieldsValue();
        if (values.gid_list) {
          values.gid_list = values.gid_list.map((item) => {
            return Number(item);
          });
        }
        const [limit, page] = [30, 1];
        values.limit = limit;
        values.page = page;
        values.permission_id = Modules.ModuleSystemUser.id;
        values.state = Number(values.state);
        dispatch({
          type: 'system/getAccountListE',
          payload: values,
        });
        // 修改父级组件的查询条件
        this.props.changeSearchValue(values);
      }
    });
  };

  // 添加用户
  handleAddUser = () => {
    this.props.showModal();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <div className="mgt8">
          <Form>
            <Row>
              <Col sm={6}>
                <FormItem>
                  <div>
                    <Col sm={6} className="textCenter">
                      <span>用户状态：</span>
                    </Col>
                    <Col sm={16}>
                      {getFieldDecorator('state', {
                        rules: [{ required: false, message: '请选择平台', trigger: 'onBlur', type: 'string' }],
                        initialValue: '100',
                      })(
                        <Select
                          allowClear
                          onChange={this.stateChange}
                          placeholder="请选择账户状态"
                        >
                          <Option value={'100'} key={100} >启用</Option>
                          <Option value={'-100'} key={-100} >禁用</Option>
                        </Select>,
                      )}
                    </Col>
                  </div>
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{
                      required: false, type: 'string', message: '请输入姓名',
                    }],
                  })(
                    <Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [{
                      required: false, type: 'string', message: '请输入手机号',
                    }],
                  })(
                    <Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem label="角色" {...formItemLayout}>
                  {getFieldDecorator('gid_list', {
                    rules: [{
                      required: false, type: 'array', message: '请选择角色',
                    }],
                  })(
                    <Select placeholder="请选择角色" mode="multiple">
                      {
                        this.state.positionInfoList.map((item, index) => {
                          return <Option key={index} value={`${item.gid}`}>{item.name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={6} className={'ant-col-sm-8 mgb8'}>
                <Button type="primary" onClick={this.handleAddUser}>添加用户</Button>
                <Button className="mgl8" type="primary" onClick={this.handleSubmit}>查询</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}

export default Form.create()(connect(mapStateToProps)(Search));
