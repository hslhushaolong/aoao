import React, { Component } from 'react';
import dot from 'dot-prop';
import { Form, Input, Radio, Modal, Row, Col, Select, Button } from 'antd';

import AllSelect from './../../../components/AllSelect';
import { authorize } from '../../../application';
import { DutyState, PhoneRegExp } from '../../../application/define';
import Operate from '../../../application/define/operate';
import Modules from '../../../application/define/modules';

const FormItem = Form.Item;
const [RadioGroup, Option] = [Radio.Group, Select.Option];

class ModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,             // 弹框状态
      title: props.title,                 // 弹窗标题
      platformList: [],   // 平台数据
      cityList: [],
      areaList: [],
      // platformInitValue: [],  // 平台下拉默认值
      // cityInitValue: [],      // 城市下拉默认值
      // areaInitValue: [],      // 商圈下拉默认值
      supplierList: props.supplierList,         // 供应商列表
      employeeDetail: props.employeeDetail,     // 员工信息
      staffId: '',     // 员工id
      positionInfoList: props.positionInfoList, // 职位信息
      loading: props.loading,  // 添加用户loading状态
    };
    this.private = {
      getSupplierListByRole: props.getSupplierListByRole,  // 根据角色获取可选供应商
    };
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      visible: nextProps.visible,
      title: nextProps.title,
      employeeDetail: nextProps.employeeDetail,
      supplierList: nextProps.supplierList,
      loading: nextProps.loading,
    });
  };

  // 弹窗确认事件
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        params.staff_id = this.state.staffId;
        if (params.staff_id === '') {
          delete params.staff_id;
        }
        this.props.handleOk(params);
        // this.props.form.resetFields();
      }
    });
  };

  // 弹窗取消事件
  handleCancel = (e) => {
    this.props.handleCancel();
    this.props.form.resetFields();
  };

  // 平台 -> 城市
  platformChange = (e) => {
    this.setState({
      platformList: e,
    });
    this.props.form.setFields({ city_spelling_list: [], biz_district_id_list: [] });
  }

  // 城市 -> 商圈
  handleCityChange = (e) => {
    this.setState({
      cityList: e,
    });
    this.props.form.setFields({ biz_district_id_list: [] });
  };

  // 名字更改后查询员工列表
  employeeSearch = (value) => {
    value.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {};
        params.permission_id = Modules.OperateSystemUserSearch.id;
        params.name = values.name;
        params.phone = values.phone;
        params.biz_district_id_list = (values.biz_district_id_list.length > 0
          ? values.biz_district_id_list : []);
        params.limit = 500;
        params.page = 1;
        params.state = DutyState.onDuty;
        this.props.getEmployeeList(params);
      }
    });
  };

  // 存储staffId
  staffIdChange = (value) => {
    this.setState({
      staffId: value,
    });
  };
  // 选择角色
  onChangeRole = (roleId) => {
    // 根据角色获取供应商列表-option:是否过滤供应商
    this.private.getSupplierListByRole(roleId, true);
    // 切换角色时，清除供应商
    this.props.form.setFields({ supplier_id: [] });
  };

  render() {
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
    const { getFieldDecorator } = this.props.form;
    const { platformList, cityList, visible, loading } = this.state;
    return (
      <div>
        <Modal
          title={this.state.title} visible={visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          okText="确认" cancelText="取消"
          confirmLoading={loading}
        >
          <Form>
            <Row>
              <Col>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{
                      type: 'string', message: '请输入姓名',
                    }, {
                      required: true, message: '请输入姓名',
                    }],
                    trigger: 'onChange',
                  })(
                    <Input placeholder="请输入姓名" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [{
                      validator: (rule, value, callback) => {
                        if (value == '') {
                          callback();
                          return;
                        }

                        if (!(PhoneRegExp.test(value))) {
                          callback('请输入手机号');
                          return;
                        }
                        callback();
                      },
                    }, {
                      required: true, message: '请输入手机号',
                    }],
                  })(
                    <Input placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
              <FormItem label="角色" {...formItemLayout}>
                {getFieldDecorator('gid', {
                  rules: [{
                    type: 'string', message: '请选择角色',
                  }, {
                    required: true, message: '请选择角色',
                  }],
                })(
                  <Select placeholder="请选择角色" onChange={this.onChangeRole}>
                    {
                      // 只能添加下一级
                      this.state.positionInfoList.filter((item) => {
                        return item.operable === true;
                      }).map((item, index) => {
                        return (
                          <Option value={`${item.gid}`} key={index}>{item.name}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              {/* 供应商权限 roleId:1001 只可以对coo设置供应商*/}
              {
                // Operate.canOperateSystemUserSupplier()
                <FormItem label="供应商" {...formItemLayout}>
                  {getFieldDecorator('supplier_id', {
                    rules: [{
                      type: 'string', message: '请选择供应商',
                    }, {
                      required: true, message: '请选择供应商',
                    }],
                  })(
                    <Select placeholder="请选择供应商">
                      {
                        dot.get(this, 'state.supplierList', []).map((item, index) => {
                          // 不可用自定义id:supplier_id
                          return (<Option value={item.supplier_id} key={index + item.supplier_id} >{item.supplier_name}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              }
              {/* 需要添加默认所有*/}
              <FormItem label="平台" {...formItemLayout}>
                {getFieldDecorator('platform_code_list', {
                  rules: [{
                    type: 'array', message: '请选择平台',
                  }, {
                    required: true, message: '请选择平台',
                  }],
                })(
                  <Select
                    mode="multiple" placeholder="请选择平台"
                    onChange={this.platformChange}
                  >
                    {
                      authorize.platform().map((item, index) => {
                        const key = item.id + index;
                        return (<Option value={item.id} key={key}>{item.name}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              {/* 需要添加默认所有*/}
              <FormItem label="城市" {...formItemLayout} >
                {getFieldDecorator('city_spelling_list', {
                  rules: [{
                    type: 'array', message: '请选择城市',
                  }, {
                    required: true, message: '请选择城市',
                  }],
                })(
                  <AllSelect
                    placeholder="请选择城市" onChange={this.handleCityChange}
                    mode="multiple"
                  >
                    {
                      authorize.cities(platformList).map((item, index) => {
                        const key = item.id + index;
                        return (<Option
                          value={item.id}
                          key={key}
                        >{item.description}</Option>);
                      })
                    }
                  </AllSelect>,
                )}
              </FormItem>
              {/* 商圈 需要添加默认所有*/}
              <FormItem label="商圈" {...formItemLayout}>
                {getFieldDecorator('biz_district_id_list', {
                  rules: [{
                    type: 'array', message: '请选择商圈',
                  }, {
                    required: true, message: '请选择商圈',
                  }],
                })(
                  <AllSelect placeholder="请选择商圈" mode="multiple">
                    {
                      authorize.districts(cityList).map((item, index) => {
                        const key = item.id + index;
                        return (
                          <Option
                            value={item.id}
                            key={key}
                          >{item.name}</Option>
                        );
                      })
                    }
                  </AllSelect>,
                )}
              </FormItem>
              {/* 管理员工权限 roleId:1002 运营以下需要管理自己的员工*/}
              {
                Operate.canOperateSystemUserSearch() ? <FormItem label="员工信息确认" {...formItemLayout}>
                  {getFieldDecorator('staff_id', {
                    rules: [{
                      type: 'string', message: '请输确认员工信息',
                    }, {
                      required: false,
                      message: '请输确认员工信息',
                      initialValue: dot.get(this, 'state.employeeDetail.data.0._id'),
                    }],
                  })(
                    <Row>
                      <Col sm={18}>
                        <Select placeholder="请完成上面各项确认员工" onChange={this.staffIdChange}>
                          {
                            dot.get(this, 'state.employeeDetail.data', []).map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>{item.name}</Option>
                              );
                            })
                          }
                        </Select>
                      </Col>
                      <Col sm={1} />
                      <Col sm={4}>
                        <Button type="primary" onClick={this.employeeSearch}>查询</Button>
                      </Col>
                    </Row>,
                  )}
                </FormItem> : ''
              }
              <FormItem label="状态" {...formItemLayout}>
                {getFieldDecorator('state', {
                  initialValue: 100,
                })(
                  <RadioGroup>
                    <Radio value={100}>启用</Radio>
                    <Radio value={-100}>禁用</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ModalPage);
