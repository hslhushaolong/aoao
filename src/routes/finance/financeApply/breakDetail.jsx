/**
 * Created by Jay 2017/09/22
 * 断租详情页
 *
 * */
import React from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Row, Col, Button } from 'antd';
import style from '../../employee/search/search.less';
import Modules from '../../../application/define/modules';

class FinanceApplyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      houseRentDetail: dot.get(props, 'finance.houseRentDetail') || {},  // 租房详情
    };
  }

  componentDidMount() {
    // 获取详情单id
    const orderId = dot.get(this, 'props.location.query.id');
    this.props.dispatch({
      type: 'finance/getHouseRentDetailE',
      payload: {
        order_id: orderId,
        permission_id: Modules.ModuleFinanceApplyBreakDetail.id,
      },
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      houseRentDetail: dot.get(props, 'finance.houseRentDetail', {}),
    });
  }

  render() {
    const { houseRentDetail } = this.state;
    return (
      <div className={style.information}>
        <div className="mgt16">
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>断租日期：{houseRentDetail.relet_break_date}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>断租原因：{houseRentDetail.note}</span>
            </Col>
          </Row>
          <Row className="mgl32" style={{ marginTop: '30px' }}>
            <Col sm={6}>
              <span>结余金额：{houseRentDetail.house_remaining_sum}元</span>
            </Col>
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
