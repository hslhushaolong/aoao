/**
 * 用户编辑
 * describe：
 * 可以编辑以下信息
 *   1.用户的姓名  name
 *   2.用户的手机号  phone
 *   3.用户的角色  gid
 *   4.用户账号的状态  state
 *
 * */

import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Input, Radio, Modal, Select } from 'antd';
import aoaoBossTools from './../../../utils/util';
import { authorize } from '../../../application';
import Operate from '../../../application/define/operate';
import AllSelect from './../../../components/AllSelect';
import Modules from '../../../application/define/modules';
// 手机校验正则
import { PhoneRegExp } from '../../../application/define';

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

class EditModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,                     // 弹框状态
      userDetail: props.userDetail,
      supplierList: props.supplierList,  // 供应商列表
      employeeDetail: [],                // 员工信息
      platformList: [],                  // 平台信息
      cityList: props.cityList || [],          // 城市信息
      areaList: props.areaList || [],          // 商圈信息
      roleId: '',                        // 保存当前选中角色
      employeeSearchFlag: false,  // 员工查找
      areaFlag: false,  // 商圈
      cityFlag: false,  // 城市
      platformFlag: false,  // 平台
      positionInfoList: this.props.positionInfoList || [],
      loading: props.loading,  // 编辑loading
    };
    this.private = {
      dispatch: props.dispatch,
      getSupplierListByRole: props.getSupplierListByRole,   // 根据角色获取供应商
    };
  }
  componentWillMount = () => {
    // 根据角色获取供应商列表-option:true表示过滤添加过的供应商
    this.private.getSupplierListByRole(this.state.userDetail.gid, true);
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      userDetail: nextProps.userDetail,
      supplierList: nextProps.supplierList,
      loading: nextProps.loading,
    });
  };
  // 弹窗确认事件
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleOk(values);
        this.setState({
          visible: false,
        });
        this.props.form.resetFields();
      }
    });
  };

  // 弹窗取消事件
  handleCancel = (e) => {
    e.preventDefault();
    this.props.handleCancel();
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  // 平台 -> 城市
  platformChange = (e) => {
    if (e.length < 1) {
      // 平台为空时，清空城市和商圈
      this.props.form.setFieldsValue({ city_spelling_list: [], biz_district_id_list: [] });
    }
    this.setState({
      platformList: e,
    });
  };

  // 城市 -> 商圈
  handleCityChange = (e) => {
    if (e.length < 1) {
      // 城市为空时，清空商圈
      this.props.form.setFieldsValue({ biz_district_id_list: [] });
    }
    this.setState({
      cityList: e,
    });
  };
  // 选择角色
  onChangeRole = (roleId) => {
    this.setState({
      employeeSearchFlag: false,  // 员工查找
      areaFlag: false,  // 商圈
      cityFlag: false,  // 城市
      platformFlag: false,  // 平台
      roleId,
    });
    // 切换角色时，清除供应商、平台、城市、商圈数据
    this.props.form.setFieldsValue({ supplier_id: [] });
    // 根据角色获取供应商列表
    this.private.getSupplierListByRole(roleId, true);
  };

  render() {
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
    const { platformList, cityList, supplierList, userDetail, roleId } = this.state;

    // 可选平台、城市、商圈是登录时获取到的全部平台->城市->商圈
    const userPlatformIds = dot.get(userDetail, 'platform_list').map((item, index) => {
      return item.platform_code;
    });

    const userCityIds = dot.get(userDetail, 'city_list').map((item, index) => {
      return item.city_spelling;
    });
    // 构造供应商数据supplierList + 该条数据的供应商；超管不能被编辑
    if (!(roleId && roleId !== userDetail.gid) && supplierList.length === 0) {
      const { supplier_id, supplier_name } = userDetail;
      supplierList.push({ _id: supplier_id, supplier_id, supplier_name });
      // const { supplier_list } = userDetail;
      // supplier_list.forEach((item) => {
      //   supplierList.push({ _id: item._id, supplier_id: item._id, supplier_name: item.supplier_name });
      // });
    }
    return (
      <div>
        <Modal
          title={'编辑用户'} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          okText="确认" cancelText="取消"
          confirmLoading={this.state.loading}
        >
          <Form>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{
                  type: 'string', message: '请输入姓名',
                }, {
                  required: true, message: '请输姓名',
                }],
                initialValue: dot.get(this, 'state.userDetail.name'),
              })(
                <Input placeholder="请输入姓名" />,
              )}
            </FormItem>
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
                initialValue: dot.get(this, 'state.userDetail.phone'),
              })(
                <Input placeholder="请输入手机号" />,
              )}
            </FormItem>

            <FormItem label="角色" {...formItemLayout}>
              {getFieldDecorator('gid', {
                rules: [{
                  required: true, message: '请选择角色',
                }],
                initialValue: `${dot.get(this, 'state.userDetail.gid')}`,
              })(
                <Select placeholder="请选择角色" onChange={this.onChangeRole}>
                  {
                    this.state.positionInfoList.map((item, index) => {
                      const key = item.id + index;
                      return (
                        <Option value={`${item.gid}`} key={key}>{item.name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem label="供应商" {...formItemLayout}>
              {getFieldDecorator('supplier_id', {
                rules: [{ required: true, message: '请选择供应商' }],
                initialValue: dot.get(this, 'state.userDetail.supplier_name'),
              })(
                <Select placeholder="请选择供应商">
                  {
                    dot.get(this, 'state.supplierList').map((item, index) => {
                      // _id是供应商id,supplierId是用户自定义id
                      const key = item._id + index;
                      return (<Option
                        value={item._id}
                        key={key}
                      >{item.supplier_name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
            {/* 平台权限 roleId:1003 总监级别以上不需要添加默认所有*/}
            <FormItem label="平台" {...formItemLayout}>
              {getFieldDecorator('platform_code_list', {
                rules: [{
                  type: 'array', message: '请选择平台',
                }, {
                  required: true, message: '请选择平台',
                }],
                initialValue: aoaoBossTools.getArrayFormObject(dot.get(this, 'state.userDetail.platform_list'), 'platform_code'),
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择平台"
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
            {/* 城市权限 roleId:1003 总监级别以上不需要添加默认所有*/}
            <FormItem label="城市" {...formItemLayout}>
              {getFieldDecorator('city_spelling_list', {
                rules: [{
                  type: 'array', message: '请选择城市',
                }, {
                  required: true, message: '请选择城市',
                }],
                initialValue: aoaoBossTools.getArrayFormObject(dot.get(this, 'state.userDetail.city_list'), 'city_name_joint'),
              })(
                <AllSelect
                  placeholder="请选择城市" onChange={this.handleCityChange}
                  mode="multiple"
                >
                  {
                    authorize.cities(platformList && platformList.length > 0 ? platformList : userPlatformIds).map((item, index) => {
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
            {/* 商圈权限 roleId:1006 调度级别以上不需要添加默认所有*/}
            <FormItem label="商圈" {...formItemLayout}>
              {getFieldDecorator('biz_district_id_list', {
                rules: [{
                  type: 'array', message: '请选择商圈',
                }, {
                  required: true, message: '请选择商圈',
                }],
                initialValue: aoaoBossTools.getArrayFormObject(dot.get(this, 'state.userDetail.biz_district_list'), 'biz_district_id'),
              })(
                <AllSelect placeholder="请选择商圈" mode="multiple">
                  {
                    authorize.districts(cityList && cityList.length > 0 ? cityList : userCityIds).map((item, index) => {
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
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('state', {
                initialValue: dot.get(this, 'state.userDetail.state'),
              })(
                <RadioGroup>
                  <Radio value={100}>启用</Radio>
                  <Radio value={-100}>禁用</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            <span>
              {getFieldDecorator('_id', {
                initialValue: dot.get(this, 'state.userDetail._id'),
              })}
            </span>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}
export default Form.create()(connect(mapStateToProps)(EditModalPage));
