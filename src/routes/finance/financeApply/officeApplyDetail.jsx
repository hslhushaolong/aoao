/**
 * Created by Jay 2017/12/21
 * 办公费用申请详情页
 *
 * */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Icon } from 'antd';
import style from '../../employee/search/search.less';
import aoaoBossTools from './../../../utils/util';
import Modules from '../../../application/define/modules';
import { authorize } from '../../../application';

class FinanceApplyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financeOrderDetail: dot.get(props, 'finance.financeOrderDetail'),  // 财务申请详情
      files_address: dot.get(props, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
    };
  }

  componentDidMount() {
    // 获取路由参数
    const order_id = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getFinanceOrderDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyOfficeDetail.id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      financeOrderDetail: dot.get(nextProps, 'finance.financeOrderDetail'),  // 财务申请详情
      files_address: dot.get(nextProps, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
    });
  }

  // 点击返回按钮
  handleBack() {
    // 使用reactRouter 提供的方法实现路由跳转
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  render() {
    const { financeOrderDetail, files_address } = this.state;
    return (
      <div className={style.information}>
        <div className="mgt16">
          <div className="mgb8">
            <span className={style.greenLable} />
            <span className="mgl8">
              <b>基础信息</b>
            </span>
          </div>
          <p className={`${style.top}`} />
          <Row className="mgl32">
            <Col sm={6}>
              <span>平台：{financeOrderDetail.platform_name && financeOrderDetail.platform_name}</span>
            </Col>
            <Col sm={6}>
              <span>城市：{financeOrderDetail.city_name && financeOrderDetail.city_name}</span>
            </Col>
            <Col sm={6}>
              <span>用途：{aoaoBossTools.enumerationConversion(financeOrderDetail.office_expenses_purpose)}</span>
            </Col>
            {
              financeOrderDetail.biz_district_name_list ? <Col sm={6}>
                <span>覆盖商圈：{
                  financeOrderDetail.biz_district_name_list && financeOrderDetail.biz_district_name_list.map((item, idx) => {
                    return <span key={idx} className={'mgr8'}>{`${item}${idx !== financeOrderDetail.biz_district_name_list.length - 1 ? '、' : ''}`}</span>;
                  })
              }</span>
              </Col> : ''
            }
            <Col sm={6}>
              <span>费用明细科目：{aoaoBossTools.enumerationConversion(financeOrderDetail.office_expenses_item)}</span>
            </Col>
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
          <Row className="mgl32">
            <Col sm={6}>
              <span>收款人姓名：{financeOrderDetail.payee_name}</span>
            </Col>
            <Col sm={6}>
              <span>收款人银行卡号：{financeOrderDetail.payee_credit_card_numbers}</span>
            </Col>
            <Col sm={6}>
              <span>开户行：{financeOrderDetail.payee_bank_address}</span>
            </Col>
          </Row>
          <Row className="mgl32 mgt16">
            <Col sm={6}>
              <span>备注：{financeOrderDetail.note}</span>
            </Col>
          </Row>
          <Row className="mgl32 mgt16">
            <Col sm={6}>
              <span>总金额：{financeOrderDetail.applications_amount}</span>
            </Col>
          </Row>
        </div>
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
export default connect(mapStateToProps)(FinanceApplyDetail);
