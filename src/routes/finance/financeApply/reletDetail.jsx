/**
 * Created by jay
 * 续租申请详情页
 *
 * */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Form, Icon } from 'antd';
import style from '../../employee/search/search.less';
import aoaoBossTools from './../../../utils/util';
import Modules from '../../../application/define/modules';
import { authorize } from '../../../application';

class ReletDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false, // 预览图片
      url: '', // 预览图片的地址
      houseRentDetail: dot.get(props, 'finance.houseRentDetail', []),  // 续租详情
      contract_photo_list: dot.get(props, 'finance.houseRentDetail.contract_photo_list') || [], // 合同照片
      receipt_photo_list: dot.get(props, 'finance.houseRentDetail.receipt_photo_list') || [], // 收据照片
      deadlineTime: '', // 支付租期的截止时间
      payEndDate: '',  // 支付租期的开始时间
      contractStartDate: '', // 合同开始时间
      contractEndDate: '',  // 合同结束时间
    };
  }

  // 加载数据,获取租房财务申请
  componentDidMount() {
    // 获取订单id
    const order_id = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getHouseRentDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyReletDetail.id,
      },
    });
  }

  componentWillReceiveProps(props) {
    const { houseRentDetail } = props.finance;
    const { house_pay_interval, pay_time, contract_start_date, contract_end_date } = dot.get(props, 'finance.houseRentDetail');
    const pay_interval = house_pay_interval || ['1', '2'];
    // 计算支付租期
    const payEndDate = pay_interval[0];
    const deadlineTime = pay_interval[1];
    // 计算合同时间
    const contractStartDate = this.subTimeString(contract_start_date);
    const contractEndDate = this.subTimeString(contract_end_date);
    this.setState({
      houseRentDetail: dot.get(props, 'finance.houseRentDetail', []),  // 租房详情
      contract_photo_list: dot.get(props, 'finance.houseRentDetail.contract_photo_list') || [], // 合同照片
      receipt_photo_list: dot.get(props, 'finance.houseRentDetail.receipt_photo_list') || [],  // 收据照片
      deadlineTime, // 支付租期的截止时间
      payEndDate, // 支付租期的开始时间
      contractStartDate,  // 合同开始时间
      contractEndDate,  // 合同结束时间
    });
  }

  // 计算合同时间
  subTimeString=(timeStr) => {
    timeStr = timeStr || '--';
    return timeStr.substr(0, 10);
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击图片
  imgClick(url) {
    this.setState({
      previewVisible: true,
      url,
    });
  }

  // 计算合同租期
  payRentTime() {
    const { houseRentDetail } = this.state;
    const date = houseRentDetail.start_date;
    const startDate = aoaoBossTools.prctoMinute(date, 2);
    // 获取结束时间的年份
    let endyear = Number(startDate.substr(0, 4));
    // 获得加上每次交租金的月份
    const pay_time = houseRentDetail.pay_time || 1;
    let endmonth = Number(startDate.substr(5, 2)) + Number(pay_time);
    // 月份大于12的情况
    if (endmonth > 12) {
      endmonth -= 12;
      endyear += 1;
    }
    let endDate = `${endyear}-${endmonth}${startDate.substr(7)}`;
    endDate = aoaoBossTools.prctoMinute(endDate, 2);
    return endDate;
  }

  render() {
    const { houseRentDetail } = this.props.finance;
    const { contract_photo_list, receipt_photo_list, files_address } = dot.get(this.props, 'finance.houseRentDetail');
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
              houseRentDetail.house_purpose == 20022 ? <Col sm={6}>
                <span>覆盖商圈：{
                  houseRentDetail.biz_district_name_list && houseRentDetail.biz_district_name_list.map((item, idx) => {
                    return <span key={idx} className={'mgr8'}>{`${item}${idx != houseRentDetail.biz_district_name_list.length - 1 ? '、' : ''}`}</span>;
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
              <span>月租金（含税）：{houseRentDetail.month_rent}元</span>
            </Col>
            <Col sm={6}>
              <span>合同租期：{ this.state.contractStartDate} ~ { this.state.contractEndDate } </span>
            </Col>
            <Col sm={6}>
              <span>押金：{houseRentDetail.deposit}元</span>
            </Col>
          </Row>

          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>次付款月数：{houseRentDetail.pay_time}月/次</span>
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
              contract_photo_list && contract_photo_list.length != 0 ? <p>合同照片 :</p> : ''
            }
            <div style={{ marginLeft: 50 }}>
              {
              contract_photo_list && contract_photo_list.map((item, idx) => {
                return (<span style={{ width: 100, height: 120, display: 'inline-block', textAlign: 'center', marginRight: 25 }} key={idx} title="点击查看大图">
                  <img style={{ width: 100, height: 100 }} src={item} className="pointer" onClick={this.imgClick.bind(this, item)} />
                </span>);
              })
            }
            </div>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            {
              receipt_photo_list && receipt_photo_list.length != 0 ? <p>收据照片 :</p> : ''
            }
            <div style={{ marginLeft: 50 }}>
              {
                receipt_photo_list && receipt_photo_list.map((item, idx) => {
                  return (<span style={{ width: 100, height: 120, display: 'inline-block', textAlign: 'center', marginRight: 25 }} key={idx} title="点击查看大图">
                    <img style={{ width: 100, height: 100 }} src={item} className="pointer" onClick={this.imgClick.bind(this, item)} />
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
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>房租收款人：{houseRentDetail.payee_name}</span>
            </Col>
            <Col sm={6}>
              <span>银行卡号：{houseRentDetail.payee_credit_card_numbers}</span>
            </Col>
            <Col sm={6}>
              <span>开户行：{houseRentDetail.payee_bank_address}</span>
            </Col>

          </Row>
          {
            houseRentDetail.other_expense && houseRentDetail.other_expense.map((item, idx) => {
              return (<Row className="mgl32" style={{ background: '#FCF6FA', height: 40, lineHeight: '40px', marginTop: '16px', padding: '0 16px' }} key={idx}>
                <Col sm={6}>
                  <span>其他费用金额：{item.amount && item.amount}元</span>
                </Col>
                <Col sm={6}>
                  <span>收款人：{ item.payee_name && item.payee_name}</span>
                </Col>
                <Col sm={6}>
                  <span>收款人银行卡号：{ item.payee_credit_card_numbers && item.payee_credit_card_numbers}</span>
                </Col>
                <Col sm={6}>
                  <span>开户行：{item.payee_bank_address && item.payee_bank_address}</span>
                </Col>
              </Row>);
            })
          }
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>备注：{houseRentDetail.note}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>总金额：{houseRentDetail.total_money}元</span>
            </Col>
            <Col sm={6}>
              <span>支付租期：{this.state.payEndDate} ~ {this.state.deadlineTime}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <div >
              <div style={{ float: 'left' }}>
                {
                  files_address && files_address.length !== 0 ? <span>附件：</span> : ''
                }
              </div>
              <div style={{ float: 'left' }}>
                {
                  files_address && files_address.map((item, index) => {
                    return <label key={index}><p style={{ marginBottom: 10 }} title={'点击下载附件'}><a href={`${item.address}`} download={`${item.name}`}><Icon type="link" /> {item.name} <input type="checkBox" className="mgl8" /></a></p></label>;
                  })
                }
              </div>
            </div>
          </Row>
        </div>
        <Row style={{ marginTop: '30px' }}>
          <Col className="textRight" sm={12}>
            <Button type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(Form.create()(ReletDetail));
