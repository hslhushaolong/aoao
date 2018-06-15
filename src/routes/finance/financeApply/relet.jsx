/**
 * Created by chang 2017/09/24
 * 新租申请详情页
 *
 * */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Input, Button, Form } from 'antd';
import style from '../../employee/search/search.less';
import MoreInfo from './moreInfo';
import aoaoBossTools from './../../../utils/util';
import ConfirmModal from './../newFinanceApply/rentHouseApply/confirmModal';
import UploadFile from './../newFinanceApply/travelApply/uploadFile';
import Modules from '../../../application/define/modules';
import { authorize } from '../../../application';

const FormItem = Form.Item;

class FinanceApplyRelet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,    // 其他费用信息弹窗
      confirmVisible: false,  // 消息确认弹窗
      moreInfoList: [],  // 其他费用消息列表
      vals: {},  // 提交内容
      houseRentDetail: dot.get(props, 'finance.houseRentDetail') || {},  // 租房详情
      contract_photo_list: dot.get(props, 'finance.houseRentDetail.contract_photo_list') || [],  // 合同照片列表
      receipt_photo_list: dot.get(props, 'finance.houseRentDetail.receipt_photo_list') || [],  // 收据照片列表
      end_date: dot.get(props, 'finance.houseRentDetail.contract_end_date'),  // 合同租期结束时间
      pay_time: dot.get(props, 'finance.houseRentDetail.pay_time'),  // 每次付款月数
      contractStartDate: '',  // 合同起始时间
      contractEndDate: '',  // 合同结束时间
      deadlineTime: '',  // 租期结束时间
      payEndDate: '',  // 租期开始时间
      editVisible: false,  // 编辑弹窗显示属性
      itemIndex: '',  // 编辑的那条更多信息下标
      itemVal: {},  // 编辑的那条更多信息值
      files_address: [],  // 上传文件
    };
  }

  componentDidMount() {
    // 获取订单id
    const order_id = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getHouseRentDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyRelet.id,
      },
    });
  }

  componentWillReceiveProps(props) {
    //  解构房屋租期、支付日期、合同截止日期
    const { house_pay_interval, pay_time, contract_start_date, contract_end_date } = dot.get(props, 'finance.houseRentDetail');
    const pay_interval = house_pay_interval;
    // 计算支付租期
    const payEndDate = pay_interval[pay_interval.length - 1];
    // 计算截止日期时间
    const deadlineTime = this.calcDeadlineTime(payEndDate, pay_time);
    // 剪切合同时间
    const contractStartDate = this.subTimeString(contract_start_date);
    // 剪切合同时间
    const contractEndDate = this.subTimeString(contract_end_date);
    this.setState({
      // 租房详情
      houseRentDetail: dot.get(props, 'finance.houseRentDetail'),
      // 合同照片
      contract_photo_list: dot.get(props, 'finance.houseRentDetail.contract_photo_list') || [],
      // 收据照片
      receipt_photo_list: dot.get(props, 'finance.houseRentDetail.receipt_photo_list') || [],
      // 结束日期
      end_date: dot.get(props, 'finance.houseRentDetail.contract_end_date'),
      // 租期
      pay_time: dot.get(props, 'finance.houseRentDetail.pay_time'),
      deadlineTime,  // 租期结束时间
      payEndDate,  // 租期开始时间
      contractStartDate,  // 合同开始时间
      contractEndDate,    // 合同结束时间
      files_address: dot.get(props, 'finance.files_address', []), // 上传文件
    });
  }

  // 计算支付租期
  calcDeadlineTime = (payEndDate, pay_time) => {
    // 获取开始时间的年份
    let deadlineYear = Number(payEndDate.substr(0, 4));
    // 获得加上每次交租金的月份
    let endmonth = Number(payEndDate.substr(5, 2)) + Number(pay_time);
    // 计算月份
    if (endmonth < 10) {
      endmonth = `0${endmonth}`;
    } else if (endmonth > 12) {
      endmonth -= 12;
      endmonth = `0${endmonth}`;
      deadlineYear += 1;
    }
    const endDate = `${deadlineYear}-${endmonth}-${payEndDate.substr(8)}`;
    return endDate.substr(0, 10);
  }

  // 剪切时间字符串
  subTimeString=(timeStr) => {
    timeStr = timeStr || '--';
    return timeStr.substr(0, 10);
  }

  // 其他费用信息总和
  otherTotalFund() {
    // 根据更多信息列表长度计算其他费用总和
    switch (dot.get(this, 'state.moreInfoList.length')) {
      case 0 :
        return 0;
      case 1 :  // 只有一条数据
        return Number(dot.get(this, 'state.moreInfoList.0.amount'));
      default :  // 超过一条
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

  // 点击发送按钮,弹出消息确认框
  handleSend() {
    // 获取其他费用总和
    const vals = {};
    const otherTotalFund = this.otherTotalFund();
    // 获取要缴的租金费用 月租金 * 缴的月数
    const { houseRentDetail } = this.props.finance;
    const monthrent = houseRentDetail.month_rent || 0;
    const pay_time = houseRentDetail.pay_time || 1;
    const rentAmount = parseFloat(monthrent) * parseInt(pay_time);
    vals.allTotal = rentAmount + otherTotalFund;
    // 支付的期限
    vals.startDate = this.state.payEndDate;
    vals.endDate = this.state.deadlineTime;
    this.setState({
      confirmVisible: true,
      vals,
    });
  }

  // 点击弹出的对话框的确定按钮，提交form表单的信息
  handleSubmit() {
    // 获取当前订单的id
    const order_id = dot.get(this, 'props.location.query.id');
    const { vals } = this.state;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        values.apply_order_id = order_id;
        values.other_expense = this.state.moreInfoList;
        values.finance_apply_type = 200002;  // 申请类型为续租
        values.house_pay_interval = [vals.startDate, vals.endDate];
        values.files_address = this.state.files_address;
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

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击添加更多信息
  handleAddMoreInfo() {
    this.setState({
      visible: true,
    });
  }

  // 点击模态框的取消按钮
  handleCancel() {
    this.setState({
      visible: false,
      confirmVisible: false,
      editVisible: false,
    });
  }

// 点击模态框确认按钮
  handleOk(values) {
    const arr = this.state.moreInfoList;
    this.setState({
      visible: false,
      moreInfoList: [values, ...arr],
    });
  }

  // 点击更多信息的删除按钮
  deleteInfo(index) {
    this.setState({
      moreInfoList: dot.get(this, 'state.moreInfoList').filter((item, idx) => {
        return idx !== index;
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { houseRentDetail, contract_photo_list, receipt_photo_list } = this.state;
    return (
      <div className={style.information}>
        <div className="mgt16">
          <div className="mgb8">
            <span className={style.greenLable} />
            <span className="mgl8">
              <b>站点信息</b>
            </span>
            <span style={{ float: 'right' }}>
              <b>申请日期：{ aoaoBossTools.prctoMinute(houseRentDetail.created_at, 2)}</b>
            </span>
          </div>
          <p className={`${style.top}`} />
          <Row className="mgl32">
            <Col sm={6}>
              <span>物理站点名称：{houseRentDetail.house_name}</span>
            </Col>
            <Col sm={6}>
              <span>平台：{houseRentDetail.platform_name && houseRentDetail.platform_name}</span>
            </Col>
            <Col sm={6}>
              <span>城市：{houseRentDetail.city_name}</span>
            </Col>
            <Col sm={6}>
              <span>房屋类型：{aoaoBossTools.enumerationConversion(houseRentDetail.house_purpose)}</span>
            </Col>
            {
              houseRentDetail.house_purpose === 20022 ? <Col sm={6}>
                <span>覆盖商圈：{
                  houseRentDetail.biz_district_name_list && houseRentDetail.biz_district_name_list.map((item, idx) => {
                    return <span key={idx} className={'mgr8'}>{`${item}${idx !== houseRentDetail.biz_district_name_list.length - 1 ? '、' : ''}`}</span>;
                  })
                }</span>
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
          <Row className="mgl32">
            <Col sm={6}>
              <span>是否开具发票：{houseRentDetail.has_invoice ? '是' : '否'}</span>
            </Col>
            <Col sm={6}>
              <span>月租金（含税）：{houseRentDetail.month_rent} 元</span>
            </Col>
            <Col sm={6}>
              <span>合同租期：{this.state.contractStartDate} ~ {this.state.contractEndDate} </span>
            </Col>
            <Col sm={6}>
              <span>押金：{houseRentDetail.deposit}元</span>
            </Col>
          </Row>

          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>每次付款月数：{houseRentDetail.pay_time}月/次</span>
            </Col>
            <Col sm={6}>
              <span>房屋地址：{houseRentDetail.house_address}</span>
            </Col>
            <Col sm={6}>
              <span>房屋面积：{houseRentDetail.floor_space} m2</span>
            </Col>
          </Row>

          <Row className="mgl32" style={{ marginTop: '30px' }}>
            {
              contract_photo_list.length !== 0 ? <p>合同拍照</p> : ' '
            }
            <div style={{ marginLeft: 50 }}>
              {
                contract_photo_list && contract_photo_list.map((item, index) => {
                  return (<span style={{ width: 100, height: 120, display: 'inline-block', textAlign: 'center', marginRight: 30 }} key={index}>
                    <img alt={''} style={{ width: 100, height: 100 }} src={item} />
                  </span>);
                })
              }
            </div>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            {
              receipt_photo_list.length !== 0 ? <p>收据照片</p> : ' '
            }
            <div style={{ marginLeft: 50 }}>
              {
                receipt_photo_list && receipt_photo_list.map((item, index) => {
                  return (<span style={{ width: 100, height: 120, display: 'inline-block', textAlign: 'center', marginRight: 30 }} key={index}>
                    <img alt={''} style={{ width: 100, height: 100 }} src={item} />
                  </span>);
                })
              }
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
          <Form>
            <Row>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'房租收款人'}>
                  {getFieldDecorator('payee_name', {
                    rules: [{ required: true, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入姓名" />,
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
                        if (value === '') {
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
                      type: 'string', message: '请选择开户行',
                    }, {
                      required: true, message: '请选择开户行',
                    }],
                  })(
                    <Input placeholder="请输入全称" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              dot.get(this, 'state.moreInfoList', []).map((item, index) => {
                return (<Row key={index} className="mgl8" style={{ background: '#FCF6FA', height: 40, lineHeight: '40px', marginBottom: '8px', padding: '0 16px' }}>
                  <Col sm={6}>费用金额：{item.amount}</Col>
                  <Col sm={5}>收款人：{item.payee_name}</Col>
                  <Col sm={6}>收款账户：{item.payee_credit_card_numbers}</Col>
                  <Col sm={5}>开户支行：{item.payee_bank_address}</Col>
                  <Col sm={1}><span className="systemTextColor pointer" onClick={this.editInfo.bind(this, index)}>编辑</span></Col>
                  <Col sm={1}><span className="systemTextColor pointer" onClick={this.deleteInfo.bind(this, index)}>删除</span></Col>
                </Row>);
              })
            }

            <Row style={{ paddingLeft: '40px', marginTop: '16px' }}>
              <Col className="mgl16">
                <Button type="primary" onClick={this.handleAddMoreInfo.bind(this)}>点击添加其他费用信息</Button>
              </Col>
            </Row>
            <Row style={{ paddingLeft: '40px', marginTop: '16px' }}>
              <Col>
                <UploadFile />
              </Col>
            </Row>

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
        </div>
        <div>
          <MoreInfo
            handleCancel={this.handleCancel.bind(this)}
            visible={this.state.visible}
            handleOk={this.handleOk.bind(this)}
          />
        </div>
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
export default connect(mapStateToProps)(Form.create()(FinanceApplyRelet));
