// 实效达成组件
import React, { Component } from 'react';
import { Row, Col } from 'antd';

class TimeReach extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescription: props.prescription || [],            // 实效达成
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      prescription: nextProps.prescription || [],      // 实效达成
    });
  }

  render() {
    const { prescription } = this.state;
    return (
      <div>
        <Row style={{ marginBottom: '10px' }} />
        {prescription.map((item, index) => (
          <Row key={index} style={{ marginBottom: '10px' }}>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}ontimespan`}>订单准时率&gt;=</Col>
            <Col span={4}><span style={{ lineHeight: '28px' }} key={`${index}ontime`}>{item.ontime}%</span></Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}averagespan`}>平均配送时长&lt;=</Col>
            <Col span={4}><span style={{ lineHeight: '28px' }} key={`${index}average`}>{item.average}分钟</span></Col>
            <Col span={3} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}dayspan`}>单循达成实效要求天数&gt;=</Col>
            <Col span={3}><span style={{ lineHeight: '28px' }} key={`${index}day`}>{item.day}天</span></Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
            <Col span={4}><span style={{ lineHeight: '28px' }} key={`${index}per`}>{item.per}元</span></Col>
          </Row>
        ))}
      </div>
    );
  }
}
export default TimeReach;
