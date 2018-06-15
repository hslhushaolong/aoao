/**
 * 意外支出详情页面
 * @author Jay
 * @class UnexpectedDetail
 *
 */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import style from '../../employee/search/search.less';
import Modules from '../../../application/define/modules';

class UnexpectedDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financeOrderDetail: dot.get(props, 'finance.financeOrderDetail'),  //  财务详情
      files_address: dot.get(props, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
      unforeseenDate: '',  // 事故时间
    };
  }

  componentDidMount() {
    // 获取申请单id
    const order_id = dot.get(this.props, 'location.query.id');
    this.props.dispatch({
      type: 'finance/getFinanceOrderDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyUnexpectedDetail.id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    // 计算事故时间
    const { unforeseen_date } = dot.get(nextProps, 'finance.financeOrderDetail');
    const unforeseenDate = this.subTimeString(unforeseen_date);
    this.setState({
      financeOrderDetail: dot.get(nextProps, 'finance.financeOrderDetail'),  // 申请单详情
      files_address: dot.get(nextProps, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
      unforeseenDate,  // 事故时间
    });
  }

  // 剪切时间字符串
  subTimeString=(timeStr) => {
    timeStr = timeStr || '--';
    return timeStr.substr(0, 10);
  }

  render() {
    const { financeOrderDetail, files_address } = this.state;
    return (
      <div className={style.information}>
        <div className="mgt16">
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>平台：{financeOrderDetail.platform_name && financeOrderDetail.platform_name}</span>
            </Col>
            <Col sm={6}>
              <span>申请城市：{financeOrderDetail.city_name && financeOrderDetail.city_name}</span>
            </Col>
            <Col sm={6}>
              <span>申请金额：{ financeOrderDetail.applications_amount && financeOrderDetail.applications_amount }元</span>
            </Col>
            <Col sm={6}>
              <span>事故时间：{ this.state.unforeseenDate }</span>
            </Col>

          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>事故骑士：{ financeOrderDetail.knight_name }</span>
            </Col>
            <Col sm={6}>
              <span>骑士所在商圈：{financeOrderDetail.knight_biz_district_name}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>备注：{ financeOrderDetail.note }</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>收款人：{financeOrderDetail.payee_name}</span>
            </Col>
            <Col sm={6}>
              <span>收款账户：{financeOrderDetail.payee_credit_card_numbers}</span>
            </Col>
            <Col sm={6}>
              <span>开户行：{financeOrderDetail.payee_bank_address}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <div >
              <div style={{ float: 'left' }}>
                {
                  files_address.length != 0 ? <span>附件：</span> : ''
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
        <Row justify={'center'} type="flex" className={'mgt16'}>
          <Col sm={12} className={'textCenter'}><Button type="primary"><Link
            to="Finance/FinanceApply"
          >返回</Link></Button></Col>
        </Row>
      </div>
    );
  }

}

function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(UnexpectedDetail);
