/**
 * 员工编辑组件
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Input, Select, Radio, message, Button, Spin, DatePicker, Popconfirm, Cascader } from 'antd';
import { connect } from 'dva';
import style from './search.less';
import aoaoBossTools from './../../../utils/util';
import PicturesWall from './../../finance/newFinanceApply/rentHouseApply/uploadPic';
import AllSelect from './../../../components/AllSelect';
import EditContractPhoto from './editContractPhoto';
import openingBankCityList from './cityList.json';  // 开户行所在城市
import { authorize } from '../../../application';
import Operate from '../../../application/define/operate';
import Modules from '../../../application/define/modules';

moment.locale('zh-cn');
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];
const list = [
  {
    value: '汉族 ',
    key: '汉族 ',
  },
  {
    value: '壮族 ',
    key: '壮族 ',
  },
  {
    value: '满族 ',
    key: '满族 ',
  },
  {
    value: '回族 ',
    key: '回族 ',
  },
  {
    value: '苗族 ',
    key: '苗族 ',
  },
  {
    value: '维吾尔族 ',
    key: '维吾尔族 ',
  },
  {
    value: '土家族 ',
    key: '土家族 ',
  },
  {
    value: '彝族 ',
    key: '彝族 ',
  },
  {
    value: '蒙古族 ',
    key: '蒙古族 ',
  },
  {
    value: '藏族 ',
    key: '藏族 ',
  },
  {
    value: '布依族 ',
    key: '布依族 ',
  },
  {
    value: '侗族 ',
    key: '侗族 ',
  },
  {
    value: '瑶族 ',
    key: '瑶族 ',
  },
  {
    value: '朝鲜族 ',
    key: '朝鲜族 ',
  },
  {
    value: '白族 ',
    key: '白族 ',
  },
  {
    value: '哈尼族 ',
    key: '哈尼族 ',
  },
  {
    value: '哈萨克族 ',
    key: '哈萨克族 ',
  },
  {
    value: '黎族 ',
    key: '黎族 ',
  },
  {
    value: '傣族 ',
    key: '傣族 ',
  },
  {
    value: '畲族 ',
    key: '畲族 ',
  },
  {
    value: '傈僳族 ',
    key: '傈僳族 ',
  },
  {
    value: '仡佬族 ',
    key: '仡佬族 ',
  },
  {
    value: '东乡族 ',
    key: '东乡族 ',
  },
  {
    value: '高山族 ',
    key: '高山族 ',
  },
  {
    value: '拉祜族 ',
    key: '拉祜族 ',
  },
  {
    value: '水族 ',
    key: '水族 ',
  },
  {
    value: '佤族 ',
    key: '佤族 ',
  },
  {
    value: '纳西族 ',
    key: '纳西族 ',
  },
  {
    value: '羌族 ',
    key: '羌族 ',
  },
  {
    value: '土族 ',
    key: '土族 ',
  },
  {
    value: '仫佬族 ',
    key: '仫佬族 ',
  },
  {
    value: '锡伯族 ',
    key: '锡伯族 ',
  },
  {
    value: '柯尔克孜族 ',
    key: '柯尔克孜族 ',
  },
  {
    value: '达斡尔族 ',
    key: '达斡尔族 ',
  },
  {
    value: '景颇族 ',
    key: '景颇族 ',
  },
  {
    value: '毛南族 ',
    key: '毛南族 ',
  },
  {
    value: '撒拉族 ',
    key: '撒拉族 ',
  },
  {
    value: '布朗族 ',
    key: '布朗族 ',
  },
  {
    value: '塔吉克族 ',
    key: '塔吉克族 ',
  },
  {
    value: '阿昌族 ',
    key: '阿昌族 ',
  },
  {
    value: '普米族 ',
    key: '普米族 ',
  },
  {
    value: '鄂温克族 ',
    key: '鄂温克族 ',
  },
  {
    value: '怒族 ',
    key: '怒族 ',
  },
  {
    value: '京族 ',
    key: '京族 ',
  },
  {
    value: '基诺族 ',
    key: '基诺族 ',
  },
  {
    value: '德昂族 ',
    key: '德昂族 ',
  },
  {
    value: '保安族 ',
    key: '保安族 ',
  },
  {
    value: '俄罗斯族 ',
    key: '俄罗斯族 ',
  },
  {
    value: '裕固族 ',
    key: '裕固族 ',
  },
  {
    value: '乌孜别克族 ',
    key: '乌孜别克族 ',
  },
  {
    value: '门巴族 ',
    key: '门巴族 ',
  },
  {
    value: '鄂伦春族 ',
    key: '鄂伦春族 ',
  },
  {
    value: '独龙族 ',
    key: '独龙族 ',
  },
  {
    value: '塔塔尔族 ',
    key: '塔塔尔族 ',
  },
  {
    value: '赫哲族 ',
    key: '赫哲族 ',
  },
  {
    value: '珞巴族',
    key: '珞巴族',
  },
];
class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: dot.get(props, 'employee.employeeDetail'),  // 员工信息
      token: dot.get(props, 'employee.token'),  // 图片token
      path: dot.get(props, 'employee.path'),    // 图片路径
      loading: false,                           // 加载状态
      field: dot.get(props, 'employee.field'),    // 图片上传的field
      platformList: [],   // 平台
      cityList: [],               // 城市
      imgKeyList: dot.get(props, 'employee.imgKeyList'),      // 图片key列表
      contractBelong: [],     // 合同归属列表
      knightTypeList: [],     // 骑士类型
      contract_photo_key_list: props.employee.employeeDetail.contract_photo_key_list || [], // 合同照片key列表
      contract_photo_list: props.employee.employeeDetail.contract_photo_list || [],         // 合同照片url列表
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'employee/getEmployeeDetailE',
      payload: {
        staff_id: this.props.location.query.id,
        permission_id: Modules.ModuleEmployeeUpdate.id,
      },
    });
    // 获取合同归属
    this.props.dispatch({
      type: 'employee/getContractBelongE',
      payload: {
        permission_id: Modules.ModuleEmployeeUpdate.id,
        page: 1,
        limit: 30,
      },
    });

    // 获取骑士类型
    this.props.dispatch({
      type: 'employee/getKnightTypeListE',
      payload: {
        permission_id: Modules.ModuleAccount.id,
        page: 1,
        limit: 30,
        state: 60,
      },
    });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      dataList: nextProps.employee.employeeDetail, // 详情
      path: nextProps.employee.path,  // 路径
      token: nextProps.employee.token,  // 图片token
      loading: nextProps.employee.loading,  // 加载状态
      field: nextProps.employee.field,  // 文件field
      imgKeyList: nextProps.employee.imgKeyList,  // 图片上传key值列表
      contractBelong: nextProps.employee.contractBelong.data,  // 合同列表
      knightTypeList: nextProps.employee.knightTypeList.data, // 骑士类型
      contract_photo_key_list: nextProps.employee.employeeDetail.contract_photo_key_list,  // 合同照片key列表
      contract_photo_list: nextProps.employee.employeeDetail.contract_photo_list,  // 合同照片url列表
    });
  };
  // 点击弹窗确定按钮
  onConfirmCancle() {
    this.props.dispatch(routerRedux.push('Employee/Search'));
  }
  // 获取七牛的Token
  getToken(type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/getUploadTokenE',
      payload: type,
    });
  }

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

  // 点击保存
  handleSave = () => {
    const { dispatch, contract_photo_list } = this.props;
    const staff_id = dot.get(this, 'props.employee.employeeDetail._id');
    // 获取当前账号id
    const departure_approver_account_id = authorize.account.id;
    const account_id = authorize.account.id;
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('您有必填信息未完善');
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        // 身份证号、姓名、电话全局替换空格
        const trimArray = ['identity_card_id', 'name', 'phone'];
        trimArray.forEach((item) => {
          if (values[item] && Object.prototype.toString.call(values[item]) === '[object String]') {
            values[item] = values[item].replace(/\s/g, '');
          }
        });
        // 总监编辑城市经理，页面没有显示商圈选项框，需将商圈列表字段传给后台
        if (!values.biz_district_id_list) {
          // TODO: 函数从未定义过 ?? @佼燕
          values.biz_district_id_list = this.getAreaList();
        }
        values.position_id = Number(values.position_id);
        values.staff_id = staff_id;
        values.account_id = account_id;
        values.departure_approver_account_id = departure_approver_account_id;
        // 区分编辑员工和离职审批时调用该接口
        values.option = true;
        // 新上传的合同照片
        const newContractPhotoList = contract_photo_list && contract_photo_list.map((item) => { return item.address; });
        // 原来的合同照片
        const oldContractPhotoList = this.state.contract_photo_key_list;
        // 新老照片合并
        values.contract_photo_list = newContractPhotoList.concat(oldContractPhotoList);
        const value = Object.assign({}, values, this.state.imgKeyList);
        value.permission_id = Modules.ModuleEmployeeUpdate.id;
        // 删除平台和城市字段
        delete value.platform_code_list;
        delete value.city_spelling_list;

        dispatch({
          type: 'employee/employeeEditE',
          payload: value,
        });
      }
    });
  };

  // 删除原始的合同照片
  handleDelete = (index) => {
    const { contract_photo_list, contract_photo_key_list } = this.state;
    // 获取合同照片
    const photoList = contract_photo_list.filter((item, idx) => { return index !== idx; });
    // 获取合同照片key值列表
    const photoKeyList = contract_photo_key_list.filter((item, idx) => { return index !== idx; });
    this.setState({
      contract_photo_list: photoList,
      contract_photo_key_list: photoKeyList,
    });
    this.props.dispatch({
      type: 'employee/editContractPhotoR',
      payload: {
        contract_photo_list: photoList,
        contract_photo_key_list: photoKeyList,
      },
    });
  }

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
    const emergencyLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    const bankLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
    };
    const belongPlatform = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const { contract_photo_list } = this.state;
    // 当前合同照片数量
    const nowPicAmount = contract_photo_list.length || 0;
    // 最多上传20张
    const maxCount = 20 - nowPicAmount;
    const { getFieldDecorator } = this.props.form;
    // 职位列表
    const positionList = authorize.roles(true);
    // 工作类型列表
    const jobType = this.state.knightTypeList || [];
    // 合同归属列表
    const contractBelong = this.state.contractBelong || [];
    // 招聘渠道列表
    const recruitmentChannel = aoaoBossTools.readDataFromLocal(2, 'recruitment_channel') || [];
    const { platformList, cityList } = this.state;
    // 初始化平台、城市、商圈
    const initPlatform = dot.get(this.props, 'employee.employeeDetail.platform_list.0.platform_code');
    const initCity = [];
    dot.get(this.props, 'employee.employeeDetail.city_list', []).map((item, index) => {
      initCity.push(item.city_spelling);
    });
    const initArea = [];
    dot.get(this.props, 'employee.employeeDetail.biz_district_list', []).map((item, index) => {
      initArea.push(item.biz_district_id);
    });
    return (
      <div>
        <Form>
          <Spin tip="Loading..." style={{ height: '120%' }} spinning={this.state.loading}>
            <div className={style.information}>
              <div className={`${style.topColor} ${style.top}`}>
                <div className="mgb8">
                  <span className={style.greenLable} />
                  <span className="mgl8">
                    <b>个人信息</b>
                  </span>
                </div>
                <Row>
                  <Col sm={8}>
                    <FormItem label="姓名" {...formItemLayout}>
                      {getFieldDecorator('name', {
                        rules: [{
                          type: 'string', message: '请输入姓名',
                        }, {
                          required: true, message: '请输姓名',
                        }],
                        initialValue: dot.get(this, 'state.dataList.name'),
                      })(
                        <Input placeholder="请输入姓名" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="学历" {...formItemLayout}>
                      {getFieldDecorator('education', {
                        rules: [{
                          type: 'string', message: '请选择学历',
                        }, {
                          required: true, message: '请选择学历',
                        }],
                        initialValue: dot.get(this, 'state.dataList.education'),
                      })(
                        <Select placeholder="请选择学历">
                          <Option value={'本科以上'}>本科以上</Option>
                          <Option value={'本科'}>本科</Option>
                          <Option value={'大专'}>大专</Option>
                          <Option value={'高中'}>高中</Option>
                          <Option value={'中专'}>中专</Option>
                          <Option value={'初中及以下'}>初中及以下</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="联系电话" {...formItemLayout}>
                      {getFieldDecorator('phone', {
                        rules: [{
                          type: 'string',
                          required: true,
                          trigger: 'onBlur',
                          validateTrigger: 'onFous',
                          validator: (rule, value, callback) => {
                            if (value == '') {
                              callback('请输入手机号码');
                              return;
                            }
                            if (!(/^1[13456789]\d{9}$/.test(value))) {
                              callback('请输入正确的手机号码');
                              return;
                            }
                            callback();
                          },
                        }],
                        initialValue: dot.get(this, 'state.dataList.phone'),
                      })(
                        <Input placeholder="请输入手机号" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="性别" {...formItemLayout}>
                      {getFieldDecorator('gender_id', {
                        initialValue: dot.get(this, 'state.dataList.gender_id'),
                      })(
                        <RadioGroup>
                          <Radio value={10}>男</Radio>
                          <Radio value={20}>女</Radio>
                        </RadioGroup>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="民族" {...formItemLayout}>
                      {getFieldDecorator('national', {
                        rules: [{
                          type: 'string', message: '请选择民族',
                        }, {
                          required: true, message: '请选择民族',
                        }],
                        initialValue: dot.get(this, 'state.dataList.national'),
                      })(
                        <Select>
                          {
                            list.map((item, index) => {
                              return <Option value={item.key} key={item.key}>{item.value}</Option>;
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="紧急联系人" {...formItemLayout}>
                      {getFieldDecorator('emergency_contact', {
                        initialValue: dot.get(this, 'state.dataList.emergency_contact'),
                      })(
                        <Input placeholder="请输入紧急联系人" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="紧急联系人电话" {...emergencyLayout}>
                      {getFieldDecorator('emergency_contact_phone', {
                        rules: [{
                          type: 'string', message: '请输入紧急联系人电话',
                        }, {
                          required: true, message: '请输入紧急联系人电话',
                        }],
                        initialValue: dot.get(this, 'state.dataList.emergency_contact_phone'),
                      })(
                        <Input placeholder="请输入紧急联系人电话" />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="身份证号" {...formItemLayout}>
                      {getFieldDecorator('identity_card_id', {
                        rules: [{
                          type: 'string',
                          required: true,
                          trigger: 'onBlur',
                          validateTrigger: 'onFous',
                          validator: (rule, value, callback) => {
                            if (value === '') {
                              callback('请输入身份证号码');
                              return;
                            }
                            // 新增支持以xx开头的身份证号
                            if (!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(value))
                              && !(/^XX\d{16}$/.test(value))) {
                              callback('请输入正确的身份证号码');
                              return;
                            }
                            callback();
                          },
                        }],
                        initialValue: dot.get(this, 'state.dataList.identity_card_id'),
                      })(
                        <Input placeholder="请输入身份证号" />,
                      )}
                    </FormItem>
                  </Col>
                  {
                    Operate.hasPositionEmployeeEditIdCard(dot.get(this, 'state.dataList.position_id')) ?
                      <Col sm={8}>
                        <FormItem label="所属平台录入身份证号" {...belongPlatform}>
                          {getFieldDecorator('associated_identity_card_id', {
                            rules: [{
                              type: 'string', message: '请输入身份证号',
                            }, {
                              required: true, message: '请输入身份证号',
                            }],
                            initialValue: dot.get(this, 'state.dataList.associated_identity_card_id'),
                          })(
                            <Input placeholder="请输入身份证号" />,
                          )}
                        </FormItem>
                      </Col> :
                      <Col sm={12}>
                        <FormItem label="所属平台录入身份证号" {...belongPlatform} style={{ opacity: '0' }}>
                          <span>''</span>
                        </FormItem>
                      </Col>
                  }
                </Row>
              </div>
              <div className={`${style.top}`}>
                <div className="mgb8">
                  <span className={style.greenLable} />
                  <span className="mgl8">
                    <b>工作信息</b>
                  </span>
                </div>
                <Row>
                  <Col sm={8}>
                    <FormItem label="供应商名称" {...formItemLayout}>
                      {getFieldDecorator('supplier_name', {
                        rules: [{
                          type: 'string', message: '请选择供应商名称',
                        }, {
                          required: true, message: '请选择供应商名称',
                        }],
                        initialValue: dot.get(this, 'state.dataList.supplier_name'),
                      })(
                        <span>{dot.get(this, 'state.dataList.supplier_name')}</span>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="平台" {...formItemLayout}>
                      {getFieldDecorator('platform_code_list', {
                        rules: [{ required: true, message: '请选择平台' }],
                        initialValue: initPlatform,
                      })(
                        <Select mode="multiple" placeholder="请选择平台" onChange={this.platformChange}>
                          {
                            authorize.platform().map((item, index) => {
                              const key = item.id + index;
                              return (<Option value={item.id} key={key}>{item.name}</Option>);
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="城市" {...formItemLayout}>
                      {getFieldDecorator('city_spelling_list', {
                        rules: [{ required: true, message: '请选择城市' }],
                        initialValue: initCity,
                      })(
                        <AllSelect
                          placeholder="请选择城市" onChange={this.handleCityChange}
                          mode="multiple"
                        >
                          {
                            // cities参数是数组
                            authorize.cities(platformList && platformList.length > 0 ? platformList : [initPlatform]).map((item, index) => {
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
                  </Col>
                  <Col sm={8}>
                    <FormItem label="商圈" {...formItemLayout}>
                      {getFieldDecorator('biz_district_id_list', {
                        rules: [{
                          type: 'array', message: '请选择商圈',
                        }, {
                          required: true, message: '请选择商圈',
                        }],
                        initialValue: aoaoBossTools.getArrayFormObject(dot.get(this, 'state.dataList.biz_district_list'), 'biz_district_id'),
                      })(
                        <AllSelect placeholder="请选择商圈" mode="multiple" optionFilterProp="children">
                          {
                            authorize.districts(cityList && cityList.length > 0 ? cityList : initCity).map((item, index) => {
                              const key = item.id + index;
                              return (
                                <Option value={item.id} key={key} >{item.name}</Option>
                              );
                            })
                          }
                        </AllSelect>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="职位" {...formItemLayout}>
                      {getFieldDecorator('position_id', {
                        initialValue: `${dot.get(this, 'state.dataList.position_id', '')}`,
                      })(
                        <Select>
                          {
                            this.state.positionInfoList.map((item, index) => {
                              return (
                                <Option value={`${item.gid}`} key={index}>{item.name}</Option>);
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="第三方平台骑士ID" {...emergencyLayout}>
                      {getFieldDecorator('associated_knight_id', {
                        rules: [{
                          type: 'string', message: '',
                        }, {
                          required: false, message: '',
                        }],
                        initialValue: dot.get(this, 'state.dataList.associated_knight_id'),
                      })(
                        <span>
                          {
                            this.state.dataList.associated_knight_id_list && this.state.dataList.associated_knight_id_list.map((item, index) => {
                              return <span key={index}>{item}{index === this.state.dataList.associated_knight_id_list.length - 1 ? '' : '、'}</span>;
                            })
                          }
                        </span>,
                      )}
                    </FormItem>
                  </Col>
                  {
                    Operate.hasPositionEmployeeEditKnightType(dot.get(this, 'state.dataList.position_id')) ? <Col sm={8}>
                      <FormItem label="骑士类型" {...formItemLayout}>
                        {getFieldDecorator('knight_type_id', {
                          rules: [{
                            type: 'string', message: '请选择骑士类型',
                          }, {
                            required: true, message: '请选择骑士类型',
                          }],
                          initialValue: `${dot.get(this, 'state.dataList.knight_type_id', '')}`,
                        })(
                          <Select placeholder="请选择骑士类型">
                            {
                              jobType && jobType.length !== 0 && jobType.map((item, index) => {
                                return (
                                  <Option value={item._id && item._id.toString()} key={index} >{item.knight_type}</Option>
                                );
                              })
                            }
                          </Select>,
                        )}
                      </FormItem>
                    </Col> : ''
                  }
                  <Col sm={8}>
                    <FormItem label="合同归属" {...formItemLayout}>
                      {getFieldDecorator('contract_belong_id', {
                        rules: [{
                          type: 'string', message: '请选择合同归属',
                        }, {
                          required: true, message: '请选择合同归属',
                        }],
                        initialValue: `${dot.get(this, 'state.dataList.contract_belong_id')}`,
                      })(
                        <Select placeholder="请选择合同归属">
                          {
                            contractBelong && contractBelong.map((item, index) => {
                              return (
                                <Option
                                  value={item._id}
                                  key={index}
                                >{item.name}</Option>
                              );
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="招聘渠道" {...formItemLayout}>
                      {getFieldDecorator('recruitment_channel_id', {
                        rules: [{
                          type: 'string', message: '请选择招聘渠道',
                        }, {
                          required: true, message: '请选择招聘渠道',
                        }],
                        initialValue: `${dot.get(this, 'state.dataList.recruitment_channel_id')}`,
                      })(
                        <Select placeholder="请选择招聘渠道">
                          {
                            recruitmentChannel.map((item, index) => {
                              return (
                                <Option
                                  value={item.constant_id && item.constant_id.toString()}
                                  key={index}
                                >{item.constant_name}</Option>
                              );
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="入职日期" {...formItemLayout}>
                      {getFieldDecorator('entry_date', {
                        rules: [{
                          type: 'object', message: '请选择招聘渠道',
                        }, {
                          required: true, message: '请选择招聘渠道',
                        }],
                        initialValue: moment(dot.get(this, 'state.dataList.entry_date'), 'YYYY-MM-DD'),
                      })(
                        <DatePicker format={'YYYY-MM-DD'} />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={8}>
                    <FormItem label="员工状态" {...formItemLayout}>
                      {getFieldDecorator('state', {
                        rules: [{
                          type: 'string', message: '请选择招聘渠道',
                        }, {
                          required: true, message: '请选择招聘渠道',
                        }],
                        initialValue: `${dot.get(this, 'state.dataList.state')}`,
                      })(
                        <Select placeholder="请选择骑士状态">
                          <Option value={'50'} key={50} >在职</Option>
                          <Option value={'1'} key={1} >离职待审核</Option>
                          <Option value={'-50'} key={-50} >离职</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className="mgl8" style={{ marginTop: '16px' }}>
                  <p>合同照片</p>
                  <div style={{ marginLeft: '60px' }}>
                    <div style={{ float: 'left' }}>
                      {contract_photo_list && contract_photo_list.length !== 0 ? <EditContractPhoto
                        contractPhotos={contract_photo_list}
                        handleDelete={this.handleDelete}
                      /> : ''}
                    </div>
                    <div style={{ float: 'left' }}>
                      {
                        nowPicAmount < 20 ? <PicturesWall type={'contract_photo'} maxCount={maxCount} /> : ''
                      }
                    </div>
                  </div>
                </Row>
              </div>
              <div className={`${style.top}`}>
                <div className="mgb8">
                  <span className={style.greenLable} />
                  <span className="mgl8">
                    <b>证件信息</b>
                  </span>
                </div>
                <Row>
                  <Col sm={12}>
                    <FormItem label="身份证正面照" {...formItemLayout}>
                      {getFieldDecorator('identity_card_front', {
                        rules: [{
                          type: 'string', message: '请上传照片',
                        }, {
                          required: false, message: '请上传照片',
                        }],
                        // initialValue: dot.get(this, 'state.dataList.identity_card_front'),
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'identity_card_front')}
                          >
                            <img
                              src={dot.get(this, 'state.dataList.identity_card_front')} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem label="身份证反面照" {...formItemLayout}>
                      {getFieldDecorator('identity_card_back', {
                        rules: [{
                          type: 'string', message: '请上传图片',
                        }, {
                          required: false, message: '请上传图片',
                        }],
                        initialValue: dot.get(this, 'state.dataList.identity_card_back'),
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'identity_card_back')}
                          >
                            <img
                              src={dot.get(this, 'state.dataList.identity_card_back')} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem label="银行卡号" {...bankLayout}>
                      {getFieldDecorator('bank_card_id', {
                        rules: [{
                          type: 'string',
                          required: false,
                          trigger: 'onBlur',
                          validateTrigger: 'onFous',
                        }],
                        initialValue: dot.get(this, 'state.dataList.bank_card_id'),
                      })(
                        <Input placeholder="银行卡号" disabled />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem label="持卡人姓名" {...bankLayout}>
                      {getFieldDecorator('cardholder_name', {
                        rules: [{
                          type: 'string', message: '请输入持卡人',
                        }, {
                          required: false, message: '请输入持卡人',
                        }],
                        initialValue: dot.get(this, 'state.dataList.cardholder_name'),
                      })(
                        <Input placeholder="持卡人姓名" disabled />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem label="银行卡开户行" {...bankLayout}>
                      {getFieldDecorator('bank_branch', {
                        rules: [{
                          type: 'string', message: '请输入银行卡开户行',
                        }, {
                          required: false, message: '请输入银行卡开户行',
                        }],
                        initialValue: dot.get(this, 'state.dataList.bank_branch'),
                      })(
                        <Input placeholder="银行卡开户行" disabled />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem label="开户行所在地" {...bankLayout}>
                      {getFieldDecorator('bank_location', {
                        rules: [{
                          type: 'array', message: '请输入开户行所在地',
                        }, {
                          required: false, message: '请输入开户行所在地',
                        }],
                        initialValue: dot.get(this, 'state.dataList.bank_location', []).length > 0 ? dot.get(this, 'state.dataList.bank_location') : ['', ''],
                      })(
                        <Cascader options={openingBankCityList} placeholder="请选择开户行所在地" disabled />,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem label="银行卡正面" {...formItemLayout}>
                      {getFieldDecorator('bank_card_front', {
                        rules: [{
                          type: 'string', message: '请上传图片',
                        }, {
                          required: false, message: '请上传图片',
                        }],
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'bank_card_front')}
                          >
                            <img
                              src={dot.get(this, 'state.dataList.bank_card_front')} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem label="半身照" {...formItemLayout}>
                      {getFieldDecorator('bust', {
                        rules: [{
                          type: 'string', message: '请上传图片',
                        }, {
                          required: false, message: '请上传图片',
                        }],
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'bust')}
                          >
                            <img
                              src={dot.get(this, 'state.dataList.bust')} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <FormItem label="健康证" {...formItemLayout}>
                      {getFieldDecorator('health_certificate', {
                        rules: [{
                          type: 'string', message: '请上传图片',
                        }, {
                          required: false, message: '请上传图片',
                        }],
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'health_certificate')}
                          >
                            <img
                              src={dot.get(this, 'state.dataList.health_certificate')} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem label="健康证" {...formItemLayout}>
                      {getFieldDecorator('health_certificate_back', {
                        rules: [{
                          type: 'string', message: '请上传图片',
                        }, {
                          required: false, message: '请上传图片',
                        }],
                      })(
                        <div>
                          <div
                            className={`${style.imgBox} mgb8`}
                            onMouseUp={this.getToken.bind(this, 'health_certificate_back')}
                          >
                            <img
                              src={this.state.dataList.health_certificate_back} alt="暂无照片"
                              className={style.imgStyle}
                            />
                          </div>
                        </div>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col className="textRight" sm={11}>
                  <Popconfirm title="内容未保存，确定离开页面?" onConfirm={() => this.onConfirmCancle()}>
                    <a href={'/#/Employee/Search'}>
                      <Button>取消</Button>
                    </a>
                  </Popconfirm>
                </Col>
                <Col sm={2} />
                <Col className="textLeft" sm={11}>
                  <Button type="primary" onClick={this.handleSave}>保存</Button>
                </Col>
              </Row>
            </div>
          </Spin>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ employee, finance }) {
  return { employee, contract_photo_list: finance.contract_photo_list };
}
export default connect(mapStateToProps)(Form.create()(EditPage));
