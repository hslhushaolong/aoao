/**
 * 新租申请页面
 * @author Jay
 */
import React from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Input, DatePicker, Button, Form, Select } from 'antd';
import style from '../../../employee/search/search.less';
import aoaoBossTools from './../../../../utils/util';
import PicturesWall from './uploadPic';
import MoreInfo from './../../financeApply/moreInfo';
import ConfirmModal from './confirmModal';
import AllSelect from './../../../../components/AllSelect';
import UploadFile from './../travelApply/uploadFile';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class RentApply extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,  // 对话框是否可见
      confirmVisible: false,  // 确认对话框
      moreInfoList: [],  // 其他信息列表
      vals: {},  // 申请信息
      house_purpose: '',  // 房租用途
      contract_photo_list: [],  // 合同照片
      receipt_photo_list: [],   // 收据照片
      editVisible: false,  // 编辑弹窗显示属性
      itemIndex: '',  // 编辑的那条更多信息下标
      itemVal: {},  // 编辑的那条更多信息值
      cityList: [],  // 城市列表
      districtList: [],  // 商圈列表
      files_address: [],  // 上传文件
    };
  }

  // 修改默认申请类型
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/switchApplyTypeR',
      payload: '200001', // 默认申请类型
    });
  }

  // 修改获取的图片地址数组
  componentWillReceiveProps(props) {
    this.setState({
      contract_photo_list: dot.get(props, 'finance.contract_photo_list'), // 合同照片列表
      receipt_photo_list: dot.get(props, 'finance.receipt_photo_list'),  // 收据照片列表
      files_address: dot.get(props, 'finance.files_address'),  // 上传文件
    });
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 其他费用总和
  otherTotalFund() {
    switch (dot.get(this, 'state.moreInfoList').length) {
      case 0 :
        return 0;
      case 1 :
        return Number(this.state.moreInfoList[0].amount);
      default : {
        const list = dot.get(this, 'state.moreInfoList', []);
        if (list.length <= 0) {
          return 0;
        }
        let otherTotalFund = 0;
        list.forEach((item) => {
          otherTotalFund += Number(item.amount);
        });
        return otherTotalFund;
      }
    }
  }

  // 点击发送按钮,弹出确认对话框
  handleSend() {
    const someVals = this.props.form.getFieldsValue(['monthrent', 'deposit', 'pay_time']);
    // 添加默认值 支付租期默认一个月，月租金默认0，押金默认0
    someVals.pay_time = someVals.pay_time || 1;
    someVals.monthrent = someVals.monthrent || 0;
    someVals.deposit = someVals.deposit || 0;

    const vals = {};
    // 获取其他费用总和
    const otherTotalFund = this.otherTotalFund();
    vals.allTotal = (Number(someVals.monthrent) * Number(someVals.pay_time)) + Number(someVals.deposit) + otherTotalFund;

    // 获取合同期限的时间
    const date = this.props.form.getFieldValue('date');
    const startDate = aoaoBossTools.prctoMinute(date[0]._d, 0);
    // 获取开始时间的年份
    let endyear = Number(startDate.substr(0, 4));
    // 获得加上每次交租金的月份
    let endmonth = Number(startDate.substr(5, 2)) + Number(someVals.pay_time);
    if (endmonth < 10) {
      endmonth = `0${endmonth}`;
    } else if (endmonth > 12) {
      endmonth -= 12;
      endmonth = `0${endmonth}`;
      endyear += 1;
    }
    const endDate = `${endyear}-${endmonth}${startDate.substr(7)}`;
    vals.startDate = startDate.substr(0, 10);
    vals.endDate = endDate.substr(0, 10);
    this.setState({
      confirmVisible: true,
      vals,
    });
  }

  // 点击弹出的对话框的确定按钮，提交form表单的信息
  handleSubmit() {
    const { dispatch } = this.props;
    const { contract_photo_list, receipt_photo_list } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        const startDate = aoaoBossTools.prctoMinute(values.date[0]._d, 3);
        const endDate = aoaoBossTools.prctoMinute(values.date[1]._d, 3);
        values.start_date = startDate;
        values.end_date = endDate;
        // 将字符串转bool值
        values.has_invoice = eval(values.has_invoice.toLowerCase());
        // 租金支付日期
        const house_pay_interval = [dot.get(this, 'state.vals.startDate'), dot.get(this, 'state.vals.endDate')];
        values.house_pay_interval = house_pay_interval;
        // 将字符串转为数值
        values.house_purpose = parseInt(values.house_purpose);
        values.monthrent = parseFloat(values.monthrent);
        values.deposit = parseFloat(values.deposit);
        values.pay_time = parseInt(values.pay_time);
        values.floor_space = parseFloat(values.floor_space);
        values.contract_photo_list = contract_photo_list.map((item) => { return item.address; });
        values.receipt_photo_list = receipt_photo_list.map((item) => { return item.address; });
        values.finance_apply_type = parseInt(dot.get(this.props, 'finance.applyType'));
        values.other_expense = this.state.moreInfoList;
        values.files_address = this.state.files_address;
        delete values.date;
        dispatch({
          type: 'finance/submitRentApplyE',
          payload: values,
        });
      }
    });
    // 点击确定退出信息确认框
    this.setState({
      confirmVisible: false,
    });
  }

  // 点击额外费用模态框取消按钮
  handleCancel() {
    this.setState({
      visible: false,
      confirmVisible: false,
      editVisible: false,
    });
  }

  // 点击额外费用模态框确认按钮
  handleOk(values) {
    const arr = this.state.moreInfoList;
    this.setState({
      visible: false,
      moreInfoList: [values, ...arr],
    });
  }

  // 添加更多信息
  handleAddMoreInfo() {
    this.setState({
      visible: true,
    });
  }

  // 点击删除按钮
  deleteInfo(index) {
    this.setState({
      moreInfoList: dot.get(this, 'state.moreInfoList').filter((item, idx) => {
        return idx != index;
      }),
    });
  }

  // 点击编辑按钮
  editInfo(index) {
    const itemVal = this.state.moreInfoList[index];
    this.setState({
      editVisible: true,
      itemIndex: index,
      itemVal,
    });
  }
  // 点击编辑模态框的确认按钮
  handleEditOk(value, index) {
    const { moreInfoList } = this.state;
    moreInfoList[index] = value;
    this.setState({
      editVisible: false,
      moreInfoList,
    });
  }

  // 房屋用途改变
  changeHousePurpose(e) {
    this.setState({
      house_purpose: e,
    });
  }

  // 生成平台下拉选项
  createPlatformList = () => {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 获取城市列表
  platformChange = (data) => {
    this.props.form.resetFields(['biz_district_id_list', 'city_spelling']);
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    this.props.form.resetFields(['biz_district_id_list']);
    const cityData = this.state.cityList;
    const keyList = aoaoBossTools.getArrayItemIndex(cityData, [key], 'city_spelling');
    const areaArray = [];
    const areaData = [];
    keyList.forEach((item) => {
      areaArray.push(cityData[item].biz_district_list);
    });
    for (let i = 0; i < areaArray.length; i++) {
      areaArray[i].forEach((item) => {
        areaData.push(item);
      });
    }
    this.setState({
      districtList: areaData,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const platformList = this.createPlatformList();
    const { cityList, districtList } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    const textAreaLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className={style.information}>
        <Form>
          <div className="mgt16">
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>站点信息</b>
              </span>
            </div>
            <p className={`${style.top}`} />
            <Row >
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'物理站点名称'}>
                  {getFieldDecorator('house_name', {
                    rules: [{ required: true, message: '请输入站点', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入站点" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'平台'}>
                  {getFieldDecorator('platform_code', {
                    rules: [{ required: true, message: '请选择平台', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Select placeholder="请选择平台" onChange={this.platformChange}>
                      {
                        platformList && platformList.map((item, index) => {
                          return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'城市'}>
                  {getFieldDecorator('city_spelling', {
                    rules: [{
                      type: 'string', message: '请选择城市',
                    }, {
                      required: true, message: '请选择城市',
                    }],
                  })(
                    <Select placeholder="请选择城市" onChange={this.handleCityChange}>
                      {
                        cityList.map((item, index) => {
                          return (<Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'房屋用途'}>
                  {getFieldDecorator('house_purpose', {
                    rules: [{
                      type: 'string', message: '请选择房屋用途',
                    }, {
                      required: true, message: '请选择房屋用途',
                    }],
                    initialValue: '20021',
                  })(
                    <Select placeholder="请选择房屋用途" onChange={this.changeHousePurpose.bind(this)}>
                      <Option value={'20021'}>办公室</Option>
                      <Option value={'20022'}>站点</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {
                this.state.house_purpose == '20022' ? <Col sm={8}>
                  <FormItem {...formItemLayout} label={'覆盖商圈'}>
                    {getFieldDecorator('biz_district_id_list', {
                      rules: [{
                        type: 'array', message: '',
                      }, {
                        required: true, message: '请选择商圈',
                      }],
                    })(
                      <AllSelect placeholder="请选择商圈" mode="multiple">
                        {
                          districtList.map((item, index) => {
                            return <Option key={index} value={item.biz_district_id}>{item.biz_district_name}</Option>;
                          })
                        }
                      </AllSelect>,
                    )}
                  </FormItem>
                </Col> : ''
              }
            </Row>
          </div>

          <div className="mgt16">
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>合同信息</b>
              </span>
            </div>
            <p className={`${style.top}`} />
            <Row className="mgl8">
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'是否开具发票'}>
                  {getFieldDecorator('has_invoice', {
                    rules: [{ required: true, message: '请选择', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Select>
                      <Option value={'True'}>是</Option>
                      <Option value={'False'}>否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'月租金'}>
                  {getFieldDecorator('monthrent', {
                    rules: [{ required: true, message: '请输入月租金', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="元" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'合同租期'}>
                  {getFieldDecorator('date', {
                    rules: [{ required: true, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
                    initialValue: [moment(aoaoBossTools.GetDateStr(0), 'YYYY-MM-DD'), moment(aoaoBossTools.GetDateStr(1), 'YYYY-MM-DD')],
                  })(
                    <RangePicker
                      format={'YYYY-MM-DD'}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'押金'}>
                  {getFieldDecorator('deposit', {
                    rules: [{ required: true, message: '请输入押金', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="元" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className="mgl8" style={{ marginTop: '30px' }}>
              <Col sm={8}>
                <Col sm={21}>
                  <FormItem {...formItemLayout} label={'每次付款月数'}>
                    {getFieldDecorator('pay_time', {
                      rules: [{ required: true, message: '请选择付款月数', trigger: 'onBlur', type: 'string' }],
                      initialValue: '3',
                    })(
                      <Select initialValue="1" placeholder="1">
                        <Option value={'1'}>1</Option>
                        <Option value={'2'}>2</Option>
                        <Option value={'3'}>3</Option>
                        <Option value={'4'}>4</Option>
                        <Option value={'5'}>5</Option>
                        <Option value={'6'}>6</Option>
                        <Option value={'7'}>7</Option>
                        <Option value={'8'}>8</Option>
                        <Option value={'9'}>9</Option>
                        <Option value={'10'}>10</Option>
                        <Option value={'11'}>11</Option>
                        <Option value={'12'}>12</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={3}>
                  <span style={{ lineHeight: '30px', float: 'right' }} className="mgl8">月/次</span>
                </Col>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'房屋地址'}>
                  {getFieldDecorator('house_address', {
                    rules: [{ required: true, message: '请输入地址', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入地址" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'房屋面积'}>
                  {getFieldDecorator('floor_space', {
                    rules: [{ required: true, message: '请输入面积', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="面积/m2" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className="mgl8" style={{ marginTop: '30px' }}>
              <p>合同拍照</p>
              <div style={{ marginLeft: '60px' }}>
                <PicturesWall type={'contract_photo'} />
              </div>
            </Row>
            <Row className={'mgl8'} style={{ marginTop: '30px' }}>
              <p>收据拍照</p>
              <div style={{ marginLeft: '60px' }}>
                <PicturesWall type={'receipt_photo'} />
              </div>
            </Row>
          </div>

          <div className="mgt16">
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>支付信息</b>
              </span>
            </div>
            <p className={`${style.top}`} />
            <Row>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'房租收款人'}>
                  {getFieldDecorator('payee_name', {
                    rules: [{ required: true, message: '请输入收款人', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入收款人" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'收款账户'}>
                  {getFieldDecorator('payee_credit_card_numbers', {
                    rules: [{
                      type: 'string',
                      required: true,
                      trigger: 'onBlur',
                      validateTrigger: 'onFous',
                      validator: (rule, value, callback) => {
                        if (value == '') {
                          callback('请输入卡号');
                          return;
                        }
                        if (!(/^(\d{16}|\d{19})$/.test(value))) {
                          callback('请输入正确的卡号');
                          return;
                        }
                        callback();
                      },
                    }],
                  })(
                    <Input placeholder="请输入卡号" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="开户支行" {...formItemLayout}>
                  {getFieldDecorator('payee_bank_address', {
                    rules: [{
                      type: 'string', message: '请输入开户行',
                    }, {
                      required: true, message: '请输入开户行',
                    }],
                  })(
                    <Input placeholder="请输入全称" />)}
                </FormItem>
              </Col>
            </Row>
            {
              // 这里要添加的是点击添加更多信息要出现的组件
              dot.get(this, 'state.moreInfoList', []).map((item, index) => {
                return (<Row key={index} className="mgl8" style={{ background: '#FCF6FA', height: 40, lineHeight: '40px', marginBottom: '8px', padding: '0 16px' }}>
                  <Col sm={4}>费用金额：{item.amount}</Col>
                  <Col sm={4}>收款人：{item.payee_name}</Col>
                  <Col sm={6}>收款账户：{item.payee_credit_card_numbers}</Col>
                  <Col sm={8}>开户支行：{item.payee_bank_address}</Col>
                  <Col sm={1}><span className="systemTextColor pointer" onClick={this.editInfo.bind(this, index)}>编辑</span></Col>
                  <Col sm={1}><span className="systemTextColor pointer" onClick={this.deleteInfo.bind(this, index)}>删除</span></Col>
                </Row>);
              })
            }
            <Row style={{ paddingLeft: '40px', marginTop: '16px' }}>
              <Col>
                <Button type="primary" onClick={this.handleAddMoreInfo.bind(this)}>点击添加其他费用信息</Button>
              </Col>
            </Row>
            <Row style={{ paddingLeft: '40px', marginTop: '16px' }}>
              <Col>
                <UploadFile />
              </Col>
            </Row>
            <Row style={{ marginTop: '30px' }} className="mgl8">
              <Col sm={20}>
                <FormItem {...textAreaLayout} label={'备注'}>
                  {getFieldDecorator('note', {
                    rules: [{ required: true, message: '请输入备注', trigger: 'onBlur', type: 'string' }],
                  })(
                    <TextArea placeholder="请输入备注" rows={4} />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row style={{ marginTop: '30px' }}>
            <Col className="textRight" sm={11}>
              <Button type="primary" onClick={this.handleSend.bind(this)}>发送</Button>
            </Col>
            <Col sm={2} />
            <Col className="textLeft" sm={11}>
              <Button onClick={this.handleBack.bind(this)}>返回</Button>
            </Col>
          </Row>
        </Form>
        {/** *********  更多信息输入弹窗  ***********/}
        <div>
          <MoreInfo
            handleCancel={this.handleCancel.bind(this)}
            visible={this.state.visible}
            handleOk={this.handleOk.bind(this)}
          />
        </div>
        {/** *********  确认对话框  ***********/}
        <div>
          <ConfirmModal
            visible={this.state.confirmVisible}
            handleCancel={this.handleCancel.bind(this)}
            handleOk={this.handleSubmit.bind(this)}
            amount={this.state.vals}
          />
        </div>
        {/** *********  更多信息编辑弹窗  ***********/}
        <div>
          <MoreInfo
            handleCancel={this.handleCancel.bind(this)}
            visible={this.state.editVisible}
            handleEditOk={this.handleEditOk.bind(this)}
            itemVal={this.state.itemVal}
            itemIndex={this.state.itemIndex}
          />
        </div>
      </div>
    );
  }

}

function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(Form.create()(RentApply));
