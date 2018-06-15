/**
 * 员工添加模块
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Radio, DatePicker, Button, Icon, Tooltip, message, Modal } from 'antd';
import style from './../search/search.less';
import aoaoBossTools from './../../../utils/util';
import HistoryWorkInformation from '../search/historyInformation';
import PicturesWall from './../../finance/newFinanceApply/rentHouseApply/uploadPic';
import AllSelect from './../../../components/AllSelect';
import { authorize } from '../../../application';
import Operate from '../../../application/define/operate';
import { Position, PhoneRegExp } from '../../../application/define';
import Modules from '../../../application/define/modules';
// 手机校验正则
// import { PhoneRegExp } from '../../../application/define';

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

class EmployeeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [], // 城市下拉框数据源
      areaList: [], // 商圈下拉框数据源
      knightOption: false,  // 骑士选项
      centreOption: false,  // 站长选项
      cityOption: false,  // 城市选项
      platformInitValue: [], // 平台下拉默认值
      cityInitValue: [], // 城市下拉默认值
      areaInitValue: [], // 商圈下拉默认值
      platformList: [], // 平台数据源
      contractBelong: [], // 合同归属列表
      knightTypeList: [], // 骑士类型
      isCentre: false, // 非站长
      noMasterDistrictList: {}, // 未被站长选择的商圈
      titleError: false,  // 标题错误提示
      uploadKnightErrList: [], // 错误信息列表
      detailErr: false, // 错误详情弹窗
      channel: '', // 记录招聘渠道
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
    };
  }

  componentDidMount() {
    // 添加员工,获取合同归属列表(除超管外都可见)
    this.props.dispatch({
      type: 'employee/getContractBelongE',
      payload: {
        permission_id: Modules.ModuleEmployeeCreate.id,
        page: 1,
        limit: 30,
        state: 60, // 查询启用
      },
    });

    // 获取骑士类型
    this.props.dispatch({
      type: 'employee/getKnightTypeListE',
      payload: {
        permission_id: Modules.ModuleEmployeeCreate.id,
        page: 1,
        limit: 30,
        state: 60,  // 查询启用
      },
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      contractBelong: dot.get(props, 'employee.contractBelong.data'),           // 合同归属
      knightTypeList: dot.get(props, 'employee.knightTypeList.data'),           // 骑士类型
      noMasterDistrictList: dot.get(props, 'employee.noMasterDistrictList'),    // 未被站长选择的商圈
      titleError: dot.get(props, 'employee.title_error'),                       // 批量上传表头是否错误
      uploadKnightErrList: dot.get(props, 'employee.uploadKnightErrList', []),  // 批量上传错误信息列表
      detailErr: dot.get(props, 'employee.detailErr'),                          // 错误详情弹窗
      positionInfoList: dot.get(props, 'employee.positionInfoList', []), // 职位信息
    });
  }

  // 清空历史工作信息
  componentWillUnmount() {
    this.props.dispatch({ type: 'employee/removeEmployeeHistoryDetailR' });
  }

  // 获取城市列表
  platformChange = (data) => {
    const { form } = this.props;
    // 添加站长和调度时，data为字符串，需要转为数组
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.props.form.resetFields(['city_spelling_list', 'biz_district_id_list']);
    let cityList = [];
    if (this.state.isCentre) {
      // 是站长，获取没有被选择的商圈列表
      const region = this.state.noMasterDistrictList.result;
      cityList = aoaoBossTools.getArrayFromIndex(region, data, 'city_name_joint');
    } else {
      // 非站长
      cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
    }
    const value = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling'); // 城市id列表
    this.handleCityChange(value);
    if (this.props.form.getFieldValue('platform_code_list').length > data.length) {
      const platformValue = this.props.form.getFieldValue('platform_code_list'); // 平台改变之前的数据
      const cityValue = this.props.form.getFieldValue('city_spelling_list'); // 城市当前的数据
      const diffItem = aoaoBossTools.filterDiffOfArray(platformValue, data); // 平台更改后的差异数据
      const cityListFromPlatform = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), diffItem, 'city_name_joint'); // 平台下城市信息列表
      const value = aoaoBossTools.getArrayFormObject(cityListFromPlatform, 'city_spelling'); // 城市id列表
      const setCityValue = aoaoBossTools.removeItemOfFilter(cityValue, value); // 过滤更改前后的差异id数据
      this.props.form.setFields({
        city_spelling_list: {
          value: setCityValue,
        },
      });
      this.setState({ cityList });
    } else {
      this.setState({ platformList: data, cityList });
    }
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    // 添加骑士和骑士长时，key为字符串，需要转为数组
    if (!Array.isArray(key)) {
      key = [key];
    }
    this.props.form.resetFields(['biz_district_id_list']);
    const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
    const cityData = this.state.cityList;
    const areaData = aoaoBossTools.getAreaListFromCityList(keyList, cityData);
    if (this.props.form.getFieldValue('city_spelling_list').length > key.length) {
      const cityValue = this.props.form.getFieldValue('city_spelling_list'); // 城市change之前的数据
      const areaValue = this.props.form.getFieldValue('biz_district_id_list'); // 商圈当前的数据
      if (areaValue !== undefined) {
        const diffItem = aoaoBossTools.filterDiffOfArray(cityValue, key); // 城市更改后的差异数据
        const areaListFromCity = aoaoBossTools.getArrayItemIndex(cityData, diffItem, 'city_spelling'); // 城市下商圈信息列表
        const areaKeyValueList = aoaoBossTools.getAreaListFromCityList(areaListFromCity, cityData); // 整理后的数商圈数据
        const value = aoaoBossTools.getArrayFormObject(areaKeyValueList, 'biz_district_id'); // 商圈id列表
        const setAreaValue = aoaoBossTools.removeItemOfFilter(areaValue, value);
        this.props.form.setFields({
          biz_district_id_list: {
            value: setAreaValue,
          },
        });
      }
      this.setState({
        areaList: areaData,
      });
    } else {
      this.setState({ areaList: areaData });
    }
  };

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

  // 重置表单
  resetFormValue = () => {
    this.props.form.resetFields();
  };

  // 添加员工
  addEmployee = () => {
    const { dispatch, contract_photo_list } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) { } else {
        const values = this.props.form.getFieldsValue();
        // 添加站长、采购、骑士、骑士长，平台单选的情况，转为数组
        // if (!Array.isArray(values.platform_code_list)) {
        //   values.platform_code_list = [values.platform_code_list];
        // }
        // 添加站长、采购、骑士、骑士长，城市单选的情况，转为数组
        // if (!Array.isArray(values.city_spelling_list)) {
        //   values.city_spelling_list = [values.city_spelling_list];
        // }
        // 身份证号、姓名、电话全局替换空格
        const trimArray = ['identity_card_id', 'name', 'phone'];
        trimArray.forEach((item) => {
          if (values[item] && Object.prototype.toString.call(values[item]) === '[object String]') {
            values[item] = values[item].replace(/\s/g, '');
          }
        });
        // 添加骑士和骑士长，商圈为单选，转为数组
        if (values.biz_district_id_list) {
          if (!Array.isArray(values.biz_district_id_list)) {
            values.biz_district_id_list = [values.biz_district_id_list];
          }
        }
        // 商圈为空时， 默认为全部商圈
        if (values.biz_district_id_list === undefined) {
          const bizDistrictIds = [];
          this.state.areaList.forEach((item, index) => {
            bizDistrictIds.push(item.biz_district_id);
          });
          Object.assign(values, { biz_district_id_list: bizDistrictIds });
        }
        // 合同照片
        values.contract_photo_list = contract_photo_list && contract_photo_list.map((item) => {
          return item.address;
        });
        // 删除平台和城市字段
        delete values.platform_code_list;
        delete values.city_spelling_list;
        dispatch({ type: 'employee/employeeAddE', payload: values });
      }
    });
  };

  // 根据不同的职位选项显示不同的输入项
  filterOption = (value) => {
    const knightPool = [`${Position.postmanManager}`, `${Position.postman}`]; // 骑士和骑士长
    const centrePool = [`${Position.dispatcher}`, `${Position.stationManager}`]; // 调度和站长
    if (knightPool.indexOf(value) != -1) {
      // 选择的是骑士或骑士长，显示身份证和骑士类型输入框
      this.setState({ knightOption: true, centreOption: true, cityOption: false });
    } else if (centrePool.indexOf(value) != -1) {
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

  // 查询历史工作信息
  handleSearchHistoryInfo = (e) => {
    this.props.form.validateFields(['identity_card_id'], (err) => {
      if (err) { } else {
        const identity_card_id = e.target.value;
        this.props.dispatch({
          type: 'employee/getEmployeeHistoryDetailE',
          payload: {
            identity_card_id,
            limit: 30,
            page: 1,
            sort: -1,
          },
        });
      }
    });
  }

  // 显示城市类型
  showCityList = (isCenter, mode) => {
    let result = '';
    if (!isCenter) { // 站长
      result = (
        <Select placeholder="请选择城市" onChange={this.handleCityChange}>
          {dot.get(this, 'state.cityList', []).map((item, index) => {
            return (
              <Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>
            );
          })
          }
        </Select>
      );
    } else {  // 非站长
      result = (
        <AllSelect placeholder="请选择城市" onChange={this.handleCityChange} mode="multiple">
          {dot.get(this, 'state.cityList', []).map((item, index) => {
            return (
              <Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>
            );
          })
          }
        </AllSelect>
      );
    }
    return result;
  }

  // 显示商圈类型
  showBizDistrictList = (isCenter, areaMode) => {
    let result = '';
    if (!isCenter) { // 是站长
      result = (
        <Select placeholder="请选择商圈" optionFilterProp="children">
          {dot.get(this, 'state.areaList', []).map((item, index) => {
            return (
              <Option value={item.biz_district_id} key={item.biz_district_id}>{item.biz_district_name}</Option>
            );
          })
          }
        </Select>
      );
    } else {  // 非站长
      result = (
        <AllSelect placeholder="请选择商圈" mode="multiple" optionFilterProp="children">
          {dot.get(this, 'state.areaList', []).map((item, index) => {
            return (
              <Option value={item.biz_district_id} key={item.biz_district_id}>{item.biz_district_name}</Option>
            );
          })
          }
        </AllSelect>
      );
    }
    return result;
  }

  // 批量上传文件成功,请求接口
  onUploadSuccess = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/batchUploadingKnightE',
      payload: {
        file_path: key,
      },
    });
  }

  // 批量上传文件失败
  onUploadFailure = () => {
    message.error('上传失败，请检查网络');
  }

  // 更换招聘渠道
  handlechannel = (value) => {
    if (value == 5002) {     // 内部推荐
      this.setState({ channel: 5002 });
    }
  }

  // 表头错误模态框
  handleTitleErrCancel = () => {
    this.setState({ titleError: false });
    this.props.dispatch({
      type: 'employee/batchUploadTitleErrorR',
      payload: {
        title_error: false,
      },
    });
  }

  // 内容错误模态框
  handleDetailErrCancel = () => {
    this.setState({ detailErr: false });
    this.props.dispatch({
      type: 'employee/changeKnightErrListStateR',
      payload: {
        detailErr: false,
      },
    });
  }

  render() {
    const formItemLayout = {
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
    };
    const idCardLayout = {
      labelCol: {
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        sm: {
          span: 10,
        },
      },
    };
    const belongPlatformId = {
      labelCol: {
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        sm: {
          span: 13,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const jobType = this.state.knightTypeList || []; // 工作类型列表
    const contractBelong = this.state.contractBelong; // 合同归属列表
    const recruitmentChannel = aoaoBossTools.readDataFromLocal(2, 'recruitment_channel') || []; // 招聘渠道列表
    const { employeeHistoryDetail } = this.props.employee; // 员工历史工作信息
    /*
     * 城市经理和助理添加站长和调度，是单平台，单城市，多商圈
     * 站长和调度添加骑士和骑士长，是单平台、单城市、单商圈
     * 城市经理\助理\站长\调度 做限制
     */
    // 判断平台和城市是否多选
    // NOTE:新增3
    // 添加员工,平台是否多选(城市经理以上多选)
    const mode = Operate.canOperateEmployeeAddEmployeePlatForm() ? 'multiple' : '';
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
    const isCenter = Operate.canOperateEmployeeUploadKnight(); // 非站长
    // 是城市选项
    const isCityMode = Operate.canOperateEmployeeCreateCityModeButton();
    // 是商圈选项
    const isDistrictMode = Operate.canOperateEmployeeAddEmployeeDistrict();
    // 显示城市列表
    const showCityList = this.showCityList(isCityMode, mode);
    // 显示商圈列表
    const showBizDistrictList = this.showBizDistrictList(isDistrictMode, areaMode);
    return (
      <Form>
        <div className={style.information}>
          {/* 站长、调度可批量上传 */
            /**
               * 批量上传功能，暂时不做
              !isCenter ? <Row>
                <Col sm={6} className={'ant-col-sm-8 mgb8 fltr textRight'}>
                  <CoreUpload title="批量上传" onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
                  <span className="mgl8"><a href={uploadTemplate} download={'模板'}>下载模板</a></span>
                </Col>
              </Row> : ''
               **/
          }
          <div className={`${style.top} ${style.topColor}`}>
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>职位信息</b>
              </span>
            </div>
            <Row>
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
                    })(
                      <Select placeholder="请选择职位" onChange={this.filterOption}>
                        {this.state.positionInfoList.filter((item) => {
                          return item.operable === true;
                        }).map((item, index) => {
                          return (
                            <Option value={`${item.gid}`} key={index}>{item.name}</Option>
                          );
                        })}
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className={`${style.top}`}>
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
                    rules: [
                      {
                        type: 'string',
                        message: '请输入姓名',
                      }, {
                        required: true,
                        message: '请输姓名',
                      },
                    ],
                  })(
                    <Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col sm={16}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('gender_id', { initialValue: 10 })(
                    <RadioGroup>
                      <Radio value={10}>男</Radio>
                      <Radio value={20}>女</Radio>
                    </RadioGroup>)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="联系电话" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        trigger: 'onBlur',
                        validateTrigger: 'onFous',
                        validator: (rule, value, callback) => {
                          if (value == '') {
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
                  })(
                    <Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>
              <Col sm={16}>
                <FormItem label="个人身份证号" {...idCardLayout}>
                  {getFieldDecorator('identity_card_id', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        trigger: 'onBlur',
                        validateTrigger: 'onFous',
                        validator: (rule, value, callback) => {
                          if (value == '') {
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
              {this.state.knightOption == true
                ? <Col sm={12}>
                  <FormItem label="所属平台录入身份证号" {...belongPlatformId}>
                    {getFieldDecorator('associated_identity_card_id', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          trigger: 'onBlur',
                          validateTrigger: 'onFous',
                          validator: (rule, value, callback) => {
                            if (value == '') {
                              callback('请输入身份证号');
                              return;
                            }
                            if (!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(value))) {
                              callback('请输入正确的身份证号码');
                              return;
                            }
                            callback();
                          },
                        },
                      ],
                    })(
                      <Row>
                        <Col sm={23}>
                          <Input placeholder="请输入身份证号" />
                        </Col>
                        <Col sm={1} className={style.ft18}>
                          <Tooltip placement="right" title={'请与骑士确认，若不匹配，则无法生成工资单'}>
                            <Icon type="exclamation-circle" />
                          </Tooltip>
                        </Col>
                      </Row>)}
                  </FormItem>
                </Col>
                : ''
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
                <FormItem label="平台" {...formItemLayout}>
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
                    initialValue: this.state.platformInitValue,
                  })(
                    <Select mode={mode} placeholder="请选择平台" onChange={this.platformChange}>
                      {this.createPlatformList()
                      }
                    </Select>)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="城市" {...formItemLayout}>
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
                    initialValue: this.state.cityInitValue,
                  })(showCityList)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="商圈" {...formItemLayout}>
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
                    initialValue: this.state.areaInitValue,
                  })(showBizDistrictList)}
                </FormItem>
              </Col>
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
                    <Select placeholder="请选择合同归属方">
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
                    <DatePicker format={'YYYY-MM-DD'} />)}
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
                    <Select placeholder="请选择招聘渠道" onChange={this.handlechannel}>
                      {recruitmentChannel.map((item, index) => {
                        return (
                          <Option value={item.constant_id.toString()} key={item.constant_id}>{item.constant_name}</Option>
                        );
                      })
                      }
                    </Select>)}
                </FormItem>
              </Col>
              {/* {this.state.channel == 5002
                ? <Col sm={8}>
                    <FormItem label="推荐人" {...formItemLayout}>
                      {getFieldDecorator('knight_person', {
                        rules: [
                          {
                            type: 'string',
                            message: '请选择推荐人'
                          }, {
                            required: true,
                            message: '请选择推荐人'
                          }
                        ]
                      })(
                        <Select placeholder="请选择推荐人">

                            <Option value={'1231223'} key={'12312'}>123321</Option>

                      </Select>,)}
                    </FormItem>
                  </Col>
                : ''
} */}
              {this.state.knightOption == true
                ? <Col sm={8}>
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
                      <Select placeholder="请选择骑士类型">
                        {jobType && jobType.length !== 0 && jobType.map((item, index) => {
                          return (
                            <Option value={item._id.toString()} key={index}>{item.knight_type}</Option>
                          );
                        })
                        }
                      </Select>)}
                  </FormItem>
                </Col>
                : ''
              }
            </Row>
            <Row
              className="mgl8" style={{
                marginTop: '30px',
              }}
            >
              <p>合同照片</p>
              <div
                style={{
                  marginLeft: '60px',
                }}
              >
                <PicturesWall type={'contract_photo'} />
              </div>
            </Row>
          </div>
          {// 展示历史工作信息
            employeeHistoryDetail && employeeHistoryDetail.data && employeeHistoryDetail.data.length !== 0
              ? <HistoryWorkInformation informations={employeeHistoryDetail.data} />
              : ''
          }
          <Row>
            <Col className="textRight" sm={11}>
              <Button onClick={this.resetFormValue}>重置</Button>
            </Col>
            <Col sm={2} />
            <Col className="textLeft" sm={11}>
              <Button type="primary" onClick={this.addEmployee}>保存</Button>
            </Col>
          </Row>
        </div>
        {/** *  表头错误提示信息   ***/}
        <div>
          <Modal visible={this.state.titleError} title="表头错误" footer={null} onCancel={this.handleTitleErrCancel.bind(this)}>
            <span className="mgl16">请下载模版格式，重新上传</span>
          </Modal>
        </div>
        {/** *  上传内容错误提示信息列表   ***/}
        <div>
          <Modal visible={this.state.detailErr} title="错误" footer={null} onCancel={this.handleDetailErrCancel.bind(this)}>
            {this.state.uploadKnightErrList && this.state.uploadKnightErrList.map((item, index) => {
              return (
                <span className="mgl16" key={index}>第{item.line_number}行 员工 {item.error_details}</span>
              );
            })
            }
          </Modal>
        </div>
      </Form>
    );
  }
}
EmployeeAdd = Form.create()(EmployeeAdd);

function mapStateToProps({ employee, finance }) {
  return { employee, contract_photo_list: finance.contract_photo_list };
}
export default connect(mapStateToProps)(EmployeeAdd);
