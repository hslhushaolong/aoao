/**
 * 收购款详情页
 * @author Jay
 * @class OtherApplyDetail
 *
 */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import style from '../../employee/search/search.less';
import Modules from '../../../application/define/modules';

class PurchaseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financeOrderDetail: dot.get(props, 'finance.financeOrderDetail'),  // 申请单详情
      files_address: dot.get(props, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
    };
  }

  componentDidMount() {
    // 获取详情id
    const order_id = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getFinanceOrderDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyPurchaseDetail.id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      financeOrderDetail: dot.get(nextProps, 'finance.financeOrderDetail'),  // 申请单详情
      files_address: dot.get(nextProps, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
    });
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
              <span>被收购城市：{financeOrderDetail.takeover_city_name && financeOrderDetail.takeover_city_name }</span>
            </Col>
            <Col sm={6}>
              <span>申请收购金额：{financeOrderDetail.applications_amount && financeOrderDetail.applications_amount }元</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>收购说明：{financeOrderDetail.note && financeOrderDetail.note}</span>
            </Col>
          </Row>
          {
            financeOrderDetail.payeey_info_list && financeOrderDetail.payeey_info_list.map((item, idx) => {
              return (<Row className="mgl32" style={{ background: '#FCF6FA', height: 40, lineHeight: '40px', marginTop: '8px', padding: '0 16px' }} key={idx}>
                <Col sm={6}>
                  <span>金额：{item.amount}元</span>
                </Col>
                <Col sm={6}>
                  <span>收款人：{item.payee_name}</span>
                </Col>
                <Col sm={6}>
                  <span>收款账户：{item.payee_credit_card_numbers}</span>
                </Col>
                <Col sm={6}>
                  <span>开户行：{item.payee_bank_address}</span>
                </Col>
              </Row>);
            })
          }

          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <div >
              <div style={{ float: 'left' }}>
                {
                  files_address.length !== 0 ? <span>附件：</span> : ''
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
export default connect(mapStateToProps)(PurchaseDetail);
