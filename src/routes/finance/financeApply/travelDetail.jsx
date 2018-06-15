/**
 * 差旅报销页面
 * @author Jay
 */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import style from '../../employee/search/search.less';
import Modules from '../../../application/define/modules';

class FinanceApplyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financeOrderDetail: dot.get(props, 'finance.financeOrderDetail'),  // 申请单详情
      files_address: dot.get(props, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
      startDate: '', // 开始时间
      endDate: '', // 结束时间
    };
  }

  componentDidMount() {
    // 获取申请单id
    const order_id = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getFinanceOrderDetailE',
      payload: {
        order_id,
        permission_id: Modules.ModuleFinanceApplyTravelDetail.id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    // 剪切出差时间
    const { start_date, end_date } = dot.get(nextProps, 'finance.financeOrderDetail');
    const startDate = this.subTimeString(start_date);  // 出差时间
    const endDate = this.subTimeString(end_date);
    this.setState({
      financeOrderDetail: dot.get(nextProps, 'finance.financeOrderDetail'),  // 申请单详情
      files_address: dot.get(nextProps, 'finance.financeOrderDetail.files_address') || [], // 附件地址列表
      startDate,  // 开始时间
      endDate,  // 结束时间
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
              <span>出差地点：{financeOrderDetail.address}</span>
            </Col>
            <Col sm={6}>
              <span>出差时间：{this.state.startDate} ~ {this.state.endDate}</span>
            </Col>

          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>住宿：{ financeOrderDetail.house_rent }元</span>
            </Col>
            <Col sm={6}>
              <span>交通：{ financeOrderDetail.transport_expense }元</span>
            </Col>
            <Col sm={6}>
              <span>其他：{ financeOrderDetail.other_expense }元</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>出差原因：{ financeOrderDetail.mission_cause }</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>费用说明：{financeOrderDetail.mission_explain}</span>
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
            <div>
              <div style={{ float: 'left' }}>
                {
                  files_address.length != 0 ? <span>附件：</span> : ''
                }
              </div>
              <div style={{ float: 'left' }}>
                {
                  files_address.map((item, index) => {
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
export default connect(mapStateToProps)(FinanceApplyDetail);
