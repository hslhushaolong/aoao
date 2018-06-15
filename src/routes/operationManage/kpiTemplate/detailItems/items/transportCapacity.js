// 运力达成组件
import React, { Component } from 'react';
import { Row, Col } from 'antd';

class TransportCapacity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transport: props.transport || [],           // 运力达成
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      transport: nextProps.transport || [],      // 运力达成
    });
  }

  render() {
    const { transport } = this.state;
    return (
      <div>
        <Row style={{ marginBottom: '10px' }}>
          <Col>日有效出勤骑士数&gt;=运力计划下限</Col>
        </Row>
        {transport.map((item, index) => (
          <Row key={index} style={{ marginBottom: '10px' }}>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}dayspan`}>单循运力达成&gt;=</Col>
            <Col key={`${index}day`} span={4}>
              <span style={{ lineHeight: '28px' }}>{item.day}天</span>
            </Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
            <Col key={`${index}per`} span={6}><span style={{ lineHeight: '28px' }}>{item.per}元</span></Col>
          </Row>
        ))}
      </div>
    );
  }
}
export default TransportCapacity;
