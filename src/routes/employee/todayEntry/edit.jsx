/**
 * 待入职员工编辑模块
 */
import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, Radio, DatePicker, Button, Icon, Tooltip } from 'antd';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';

import { CoreContent } from '../../../components/core';
import { Position, PhoneRegExp } from '../../../application/define';
import Operate from '../../../application/define/operate';
import { authorize } from '../../../application';
import { isProperIdCardNumber } from '../../../application/utils';
import AllSelect from '../../../components/AllSelect';
import aoaoBossTools from '../../../utils/util';

import PicturesWall from './../../finance/newFinanceApply/rentHouseApply/uploadPic';
import HistoryWorkInformation from './history';

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

class TodayEntryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 初始化获取
      knightTypeList: [], // 骑士类型
      contractBelong: [], // 合同归属列表
      waitEntryStaffDetail: dot.get(props, 'employee.waitEntryStaffDetail'), // 初始化数据
      employeeHistoryDetail: dot.get(props, 'employee.employeeHistoryDetail'), // 历史工作信息
      // 选项
      knightOption: false,  // 骑士选项
      centreOption: false,  // 站长选项
      cityOption: false,  // 城市选项
      isCentre: false, // 非站长
      mode: Operate.canOperateEmployeeAddEmployeePlatForm() ? 'multiple' : '', // 城市商圈是否多选
      // 级联数据
      noMasterDistrictList: {}, // 未被站长选择的商圈
      platformList: [], // 平台数据源
      cityList: [], // 城市下拉框数据源
      areaList: [], // 商圈下拉框数据源
      // select菜单默认值
      platformInitValue: [], // 平台下拉默认值
      cityInitValue: [], // 城市下拉默认值
      areaInitValue: [], // 商圈下拉默认值
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
    };
    this.private = {
      formLayout: {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 6,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 14,
          },
        },
      },
      supplier: [authorize._vendor.data],
    };
  }

  componentWillReceiveProps(nextProps) {
    const waitEntryStaffDetail = dot.get(nextProps, 'employee.waitEntryStaffDetail');
    let basicParams = {
      waitEntryStaffDetail,        // 员工初始化数据
      contractBelong: dot.get(nextProps, 'employee.contractBelong.data'),           // 合同归属
      knightTypeList: dot.get(nextProps, 'employee.knightTypeList.data'),          // 骑士类型
      noMasterDistrictList: dot.get(nextProps, 'employee.noMasterDistrictList'),  // 未选中商圈信息
      employeeHistoryDetail: dot.get(nextProps, 'employee.employeeHistoryDetail'), // 历史工作信息
    };
    // 初始化城市列表和商圈列表
    if (!this.state.inited) {
      const { cityList, areaList } = this.initLoactionInfo(waitEntryStaffDetail);
      const { mode } = this.state;
      basicParams = {
        ...basicParams,
        cityList,
        areaList,
        platformInitValue: arrayByCause(mode, waitEntryStaffDetail.platform_code),
        cityInitValue: arrayByCause(mode, waitEntryStaffDetail.city_spelling),
        areaInitValue: arrayByCause(mode, waitEntryStaffDetail.biz_district_id),
        inited: true,
      };
      // 设置相应的职位权限，来确认对应的模式
      this.onPositionChange(`${waitEntryStaffDetail.position_id}`);
    }
    this.setState(basicParams);
    // 根据当前模式来封装数据
    function arrayByCause(mode, result) {
      return mode === 'multiple' ? [result] : result;
    }
  }
  // 职位切换钩子
  onPositionChange = (value) => {
    const knightPool = [`${Position.postmanManager}`, `${Position.postman}`]; // 骑士和骑士长
    const centrePool = [`${Position.dispatcher}`, `${Position.stationManager}`]; // 调度和站长
    if (knightPool.indexOf(value) !== -1) {
      // 选择的是骑士或骑士长，显示身份证和骑士类型输入框
      this.setState({ knightOption: true, centreOption: true, cityOption: false });
    } else if (centrePool.indexOf(value) !== -1) {
      // 选择的是站长或者调度不显示身份证输入框
      this.setState({ knightOption: false, centreOption: true, cityOption: false });
    } else {
      // 选择的是其他角色显示城市选项
      this.setState({ knightOption: false, centreOption: false, cityOption: true });
    }
    // 如果选择是站长，调用接口获取平台、城市、商圈
    if (`${value}` === `${Position.stationManager}`) {
      this.setState({
        isCentre: true, // 选择的是站长
      });
      this.props.dispatch({ type: 'employee/gainNoMasterDistrictListE', payload: {} });
    } else {
      this.setState({
        isCentre: false, // 不是站长
      });
    }
  };
  // 平台切换
  onPlatformChange = (data) => {
    // 添加站长和调度时，data为字符串，需要转为数组
    let copyData = data;
    if (!Array.isArray(copyData)) {
      copyData = [copyData];
    }
    // 清空城市和商圈列表
    this.props.form.resetFields(['city_spelling_list', 'biz_district_id_list']);
    let cityList = [];
    if (this.state.isCentre) {
      // 是站长，获取没有被选择的商圈列表
      const region = this.state.noMasterDistrictList.result;
      // 根据所选平台将NoMaterDistrictList中对应平台的所有城市组装成一个数组
      cityList = aoaoBossTools.getArrayFromIndex(region, copyData, 'city_name_joint');
    } else {
      // 非站长
      cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
    }
    const fromPlatform = this.props.form.getFieldValue('platform_code_list');
    if (fromPlatform && fromPlatform.length > copyData.length) {
      this.setState({ cityList });
    } else {
      this.setState({ platformList: data, cityList });
    }
  };
  // 生成商圈下拉选项
  onCityChange = (key) => {
    // 添加骑士和骑士长时，key为字符串，需要转为数组
    let copyKey = key;
    if (!Array.isArray(copyKey)) {
      copyKey = [copyKey];
    }
    this.props.form.resetFields(['biz_district_id_list']);
    const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, copyKey, 'city_spelling');
    const cityData = this.state.cityList;
    const areaData = aoaoBossTools.getAreaListFromCityList(keyList, cityData);
    const fromCity = this.props.form.getFieldValue('city_spelling_list');
    if (fromCity && fromCity.length > copyKey.length) {
      this.setState({
        areaList: areaData,
      });
    } else {
      this.setState({ areaList: areaData });
    }
  };

  initLoactionInfo = (waitEntryStaffDetail) => {
    let cityList = [];
    let areaList = [];
    if (waitEntryStaffDetail !== {}) {
      // 获取城市列表
      if (this.state.isCentre) {
        // 是站长，获取没有被选择的商圈列表
        const region = this.state.noMasterDistrictList.result;
        // 根据所选平台将NoMaterDistrictList中对应平台的所有城市组装成一个数组
        cityList = aoaoBossTools.getArrayFromIndex(region, [waitEntryStaffDetail.platform_code], 'city_name_joint');
      } else {
        // 非站长
        cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [waitEntryStaffDetail.platform_code], 'city_name_joint');
      }
      // 获取区域列表
      const keyList = aoaoBossTools.getArrayItemIndex(cityList, [waitEntryStaffDetail.city_spelling], 'city_spelling');
      areaList = aoaoBossTools.getAreaListFromCityList(keyList, cityList);
    }
    return {
      cityList,
      areaList,
    };
  }

  // 添加员工
  addEmployee = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { mode } = this.state;
        // 处理根据权限不同导致的位置数据类型可能不为array的情况
        if (mode !== 'multiple') {
          values.platform_code_list = [values.platform_code_list];
          values.city_spelling_list = [values.city_spelling_list];
          values.biz_district_id_list = [values.biz_district_id_list];
        }
        this.props.dispatch({
          type: 'employee/addWaitEntryStaffE',
          payload: {
            ...values,
            _id: this.state.waitEntryStaffDetail._id,
            entry_date: moment(values.entry_date).format('YYYY-MM-DD'),
            supplier_id: values.supplier_id[0],
            contract_photo_list: this.props.contract_photo_list.map(item => item.address),
          },
        });
      }
    });
  }
  // 重置表单
  resetFormValue = () => {
    this.props.form.resetFields();
  };
  /*
    根据角色类型来渲染不同的选择器
    isCenter : !isCenter === true 为站长，其他为非站长
    placeholder : 选择器默认显示文字
    handleCall : 选择器的onChange回调函数
    traverseCall : 渲染选项的回调函数
   */
  isAllSelect = (isCenter, placeholder, handleCall, traverseCall) => {
    return !isCenter ? (
      <Select style={{ width: '100%' }} placeholder={placeholder} onChange={handleCall}>
        {traverseCall()}
      </Select>) :
      (
        <AllSelect style={{ width: '100%' }} placeholder={placeholder} onChange={handleCall} mode="multiple" optionFilterProp="children">
          {traverseCall()}
        </AllSelect>
      );
  }
  // 生成平台下拉选项
  createPlatformList = () => {
    let dataList = [];
    if (this.state.isCentre) { // 添加站长，dataList是调用接口获取的数据
      dataList = this.state.noMasterDistrictList && this.state.noMasterDistrictList.result;
    } else { // 不是站长，平台从本地获取
      dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    }
    return (dataList.map((item, index) => {
      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
    }));
  }
  // 个人信息
  renderPersonalInfo = () => {
    const formItemLayout = this.private.formLayout;
    const { getFieldDecorator } = this.props.form;
    const { waitEntryStaffDetail } = this.state;
    return (<CoreContent title="个人信息">
      <Row style={{ marginTop: 34 }}>
        <Col sm={8}>
          <FormItem label="手机号" {...formItemLayout}>
            {getFieldDecorator('phone', {
              rules: [
                {
                  type: 'string',
                  required: true,
                  trigger: 'onBlur',
                  validateTrigger: 'onFous',
                  validator: (rule, value, callback) => {
                    if (value === '') {
                      callback('请输入手机号码');
                      return;
                    }
                    if (!(PhoneRegExp.test(value))) {
                      callback('请输入正确的手机号码');
                      return;
                    }
                    callback();
                  },
                },
              ],
              initialValue: waitEntryStaffDetail.phone,
            })(
              <Input placeholder="请输入手机号" />)}
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  type: 'string',
                  message: '请输入姓名',
                }, {
                  required: true,
                  message: '请输姓名',
                },
              ],
              initialValue: waitEntryStaffDetail.name,
            })(
              <Input placeholder="请输入姓名" />)}
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('gender_id', { initialValue: 10 })(
              <RadioGroup>
                <Radio value={10}>男</Radio>
                <Radio value={20}>女</Radio>
              </RadioGroup>)}
          </FormItem>
        </Col>
      </Row>
    </CoreContent>);
  }
  // 职位信息
  renderPostInfo = () => {
    const formItemLayout = this.private.formLayout;
    const { getFieldDecorator } = this.props.form;
    const { waitEntryStaffDetail, platformInitValue, cityInitValue, areaInitValue, mode } = this.state;
    const jobType = this.state.knightTypeList || []; // 工作类型列表
    /*
     * 城市经理和助理添加站长和调度，是单平台，单城市，多商圈
     * 站长和调度添加骑士和骑士长，是单平台、单城市、单商圈
     * 城市经理\助理\站长\调度 做限制
     */
    // 判断平台和城市是否多选
    // NOTE:新增3
    // 添加员工,平台是否多选(城市经理以上多选)
    const type = mode === 'multiple' ? 'array' : 'string';
    // 根据角色判断城市选项是多选还是单选
    const cityType = Operate.canOperateEmployeeCreateCityModeButton() ? 'array' : 'string';
    // 判断商圈是否多选
    // NOTE: 新增4
    // 添加员工,商圈是否多选(站长以上多选)
    const areaMode = Operate.canOperateEmployeeAddEmployeeDistrict() ? 'multiple' : '';
    const areaType = areaMode === 'multiple' ? 'array' : 'string';
    /**
     * 添加骑士平台和商圈不能有多选
     */
    // NOTE: 新增5
    // 添加员工,批量上传骑士(站长，调度)
    // const isCenter = Operate.canOperateEmployeeUploadKnight(); // 非站长
    // 是城市选项
    const isCityMode = Operate.canOperateEmployeeCreateCityModeButton();
    // 是商圈选项
    const isDistrictMode = Operate.canOperateEmployeeAddEmployeeDistrict();
    // 显示城市列表
    const showCityList = this.isAllSelect(isCityMode, '请选择城市', this.onCityChange, () => {
      return dot.get(this, 'state.cityList', []).map((item, index) => {
        return (
          <Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>
        );
      });
    },
    );
    // 显示商圈列表
    const showBizDistrictList = this.isAllSelect(isDistrictMode, '请选择商圈', null, () => {
      return dot.get(this, 'state.areaList', []).map((item) => {
        return (
          <Option value={item.biz_district_id} key={item.biz_district_id}>{item.biz_district_name}</Option>
        );
      });
    });
    return (
      <CoreContent title="职位信息">
        <Row style={{ marginTop: 34 }}>
          <Col sm={8}>
            <FormItem label="职位" {...formItemLayout}>
              {
                getFieldDecorator('position_id', {
                  rules: [
                    {
                      type: 'string',
                      message: '请选择职位',
                    }, {
                      required: true,
                      message: '请选择职位',
                    },
                  ],
                  initialValue: `${waitEntryStaffDetail.position_id}`,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择职位" onChange={this.onPositionChange}>
                    {this.state.positionInfoList.map((item, index) => {
                      return (
                        <Option value={`${item.gid}`} key={index}>{item.name}</Option>
                      );
                    })}
                  </Select>)}
            </FormItem>
          </Col>
          {this.state.knightOption === true &&
            <Col sm={8}>
              <FormItem label="骑士类型" {...formItemLayout}>
                {getFieldDecorator('knight_type_id', {
                  rules: [
                    {
                      type: 'string',
                      message: '请选择骑士类型',
                    }, {
                      required: true,
                      message: '请选择骑士类型',
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择骑士类型">
                    {jobType && jobType.length !== 0 && jobType.map((item, index) => {
                      return (
                        <Option value={item._id.toString()} key={index}>{item.knight_type}</Option>
                      );
                    })
                    }
                  </Select>)}
              </FormItem>
            </Col>
          }
          <Col sm={8}>
            <FormItem label="负责供应商" {...formItemLayout}>
              {getFieldDecorator('supplier_id', {
                rules: [
                  {
                    type: `${type}`,
                    message: '请选择供应商',
                  },
                  {
                    required: true,
                    message: '请选择供应商',
                  },
                ],
                initialValue: type === 'multiple' ? waitEntryStaffDetail.supplier_list : waitEntryStaffDetail.supplier_list[0],
              })(
                <Select style={{ width: '100%' }} mode={mode} placeholder="请选择供应商">
                  {
                    this.private.supplier.map((item) => {
                      return (<Option value={`${item.supplierId}`} key={`${item.supplierId}`}>{item.supplierName}</Option>);
                    })
                  }
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            <FormItem label="负责平台" {...formItemLayout}>
              {getFieldDecorator('platform_code_list', {
                rules: [
                  {
                    type: `${type}`,
                    message: '请选择平台',
                  }, {
                    required: true,
                    message: '请选择平台',
                  },
                ],
                initialValue: platformInitValue,
              })(
                <Select style={{ width: '100%' }} mode={mode} placeholder="请选择平台" onChange={this.onPlatformChange}>
                  {this.createPlatformList()
                  }
                </Select>)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="负责城市" {...formItemLayout}>
              {getFieldDecorator('city_spelling_list', {
                rules: [
                  {
                    type: `${cityType}`,
                    message: '请选择城市',
                  }, {
                    required: true,
                    message: '请选择城市',
                  },
                ],
                initialValue: cityInitValue,
              })(showCityList)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="负责商圈" {...formItemLayout}>
              {getFieldDecorator('biz_district_id_list', {
                rules: [
                  {
                    type: `${areaType}`,
                    message: '请选择商圈',
                  }, {
                    required: true,
                    message: '请选择商圈',
                  },
                ],
                initialValue: areaInitValue,
              })(showBizDistrictList)}
            </FormItem>
          </Col>
        </Row>
      </CoreContent>
    );
  }
  // 身份信息
  renderIdenticalInfo = () => {
    const formItemLayout = this.private.formLayout;
    const { getFieldDecorator } = this.props.form;
    const { waitEntryStaffDetail } = this.state;
    return (
      <CoreContent title="身份信息">
        <Row style={{ marginTop: 34 }}>
          <Col sm={8}>
            <FormItem label="个人身份证" {...formItemLayout}>
              {getFieldDecorator('identity_card_id', {
                rules: [
                  {
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
                  },
                ],
              })(
                <Input placeholder="请输入身份证号" onBlur={this.handleSearchHistoryInfo} />)}
            </FormItem>
          </Col>
          {this.state.knightOption === true &&
            [
              <Col key="1" sm={8}>
                <FormItem label="平台身份证" {...formItemLayout}>
                  {getFieldDecorator('associated_identity_card_id', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        trigger: 'onBlur',
                        validateTrigger: 'onFous',
                        validator: (rule, value, callback) => {
                          if (value === '') {
                            callback('请输入身份证号');
                            return;
                          }
                          if (!isProperIdCardNumber(value)) {
                            callback('请输入正确的身份证号码');
                            return;
                          }
                          callback();
                        },
                      },
                    ],
                    initialValue: waitEntryStaffDetail.identity_card_id,
                  })(<Input disabled placeholder="请输入身份证号" />)}
                </FormItem>
              </Col>,
              <Row key="2" style={{ height: 33 }} align="middle" type="flex">
                <Col sm={24}>
                  <Tooltip placement="right" title={'请与骑士确认，若不匹配，则无法生成工资单'}>
                    <Icon type="exclamation-circle" />
                  </Tooltip>
                </Col>
              </Row>]
        }
        </Row>
      </CoreContent>);
  }
  // 工作信息
  renderWorkInfo = () => {
    const formItemLayout = this.private.formLayout;
    const { getFieldDecorator } = this.props.form;

    const contractBelong = this.state.contractBelong; // 合同归属列表
    const recruitmentChannel = aoaoBossTools.readDataFromLocal(2, 'recruitment_channel') || []; // 招聘渠道列表
    return (
      <CoreContent title="工作信息">
        <Row style={{ marginTop: 34 }}>
          <Col sm={8}>
            <FormItem label="合同归属" {...formItemLayout}>
              {getFieldDecorator('contract_belong_id', {
                rules: [
                  {
                    type: 'string',
                    message: '请输入合同归属',
                  }, {
                    required: true,
                    message: '请输入合同归属',
                  },
                ],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择合同归属方">
                  {contractBelong && contractBelong.map((item, index) => {
                    return (
                      <Option value={item._id} key={index}>{item.name}</Option>
                    );
                  })
                  }
                </Select>)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="入职日期" {...formItemLayout}>
              {getFieldDecorator('entry_date', {
                rules: [
                  {
                    type: 'object',
                    message: '请输入入职日期',
                  }, {
                    required: true,
                    message: '请输入入职日期',
                  },
                ],
              })(
                <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="招聘渠道" {...formItemLayout}>
              {getFieldDecorator('recruitment_channel_id', {
                rules: [
                  {
                    type: 'string',
                    message: '请选择招聘渠道',
                  }, {
                    required: true,
                    message: '请选择招聘渠道',
                  },
                ],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择招聘渠道" onChange={this.handlechannel}>
                  {recruitmentChannel.map((item) => {
                    return (
                      <Option value={item.constant_id.toString()} key={item.constant_id}>{item.constant_name}</Option>
                    );
                  })
                  }
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row className="mgl8">
          <Col sm={8}>
            <span className={'ant-col-sm-6'} style={{ paddingLeft: '30px', color: 'rgba(0, 0, 0, 0.85)' }}>合同照片:</span>
            <div style={{ marginLeft: '60px' }}>
              <PicturesWall type={'contract_photo'} />
            </div>
          </Col>
        </Row>
      </CoreContent>
    );
  }
  // 历史工作信息
  renderWorkHistoryInfo = () => {
    const { employeeHistoryDetail } = this.state; // 员工历史工作信息
    return (
      <CoreContent title={'历史工作信息'}>
        <HistoryWorkInformation informations={employeeHistoryDetail.data} />
      </CoreContent>
    );
  }
  // 操作区
  renderOperate = () => {
    return (
      <div>
        <Row>
          <Col className="textCenter" sm={24}>
            <Button type="primary" onClick={this.addEmployee}>提交</Button>
          </Col>
        </Row>
      </div>
    );
  }
  render = () => {
    return (
      <div>
        {/* 个人信息 */}
        {this.renderPersonalInfo()}
        {/* 职位信息 */}
        {this.renderPostInfo()}
        {/* 身份信息 */}
        {this.renderIdenticalInfo()}
        {/* 工作信息 */}
        {this.renderWorkInfo()}
        {/* 历史工作信息 */}
        {this.state.employeeHistoryDetail.data.length > 0 && this.renderWorkHistoryInfo()}
        {/* 操作区 */}
        {this.renderOperate()}
      </div>
    );
  }
}

function mapStateToProps({ employee, finance }) {
  return { employee, contract_photo_list: finance.contract_photo_list };
}
export default connect(mapStateToProps)(Form.create()(TodayEntryEdit));
