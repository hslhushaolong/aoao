/**
 * 盖章罚款详情页
 * @author Jay
 */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import style from '../../employee/search/search.less';
import Modules from '../../../application/define/modules';

class PunishmentDetail extends React.Component {
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
        permission_id: Modules.ModuleFinanceApplyPunishmentDetail.id,
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
              <span>申请总金额：{ financeOrderDetail.applications_amount && financeOrderDetail.applications_amount }元</span>
            </Col>
          </Row>
          {
            financeOrderDetail.order_list && financeOrderDetail.order_list.map((item, index) => {
              return (<div style={{ background: '#FCF6FA', margin: '8px 0px', padding: '8px 16px' }} key={index}>
                <Row>
                  <Col sm={6} style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                    <span>承担商圈：{item.biz_district_name}</span>
                  </Col>
                  <Col sm={6} style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                    <span>罚款总金额：{item.ticket_amount} 元</span>
                  </Col>
                  <Col sm={10} />
                </Row>
                {
                  item.undertaker_list && item.undertaker_list.map((article, idx) => {
                    return (<Row style={{ marginTop: '8px' }} key={idx}>
                      <Col sm={6}>
                        <span>承担人：{article.undertaker_name}</span>
                      </Col>
                      <Col sm={6}>
                        <span>罚款原因：{article.reason}</span>
                      </Col>
                      <Col sm={6}>
                        <span>罚款金额：{article.amount}元</span>
                      </Col>
                    </Row>);
                  })
                }
              </div>);
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
export default connect(mapStateToProps)(PunishmentDetail);
