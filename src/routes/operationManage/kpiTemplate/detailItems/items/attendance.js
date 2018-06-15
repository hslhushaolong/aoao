// 运力奖励扣罚
import React, { Component } from 'react';
import { Row, Col } from 'antd';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceNum: props.attendanceNum || [],      // 运力奖励扣罚
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      attendanceNum: nextProps.attendanceNum || [],    // 运力奖励扣罚
    });
  }

  render() {
    const { attendanceNum } = this.state;
    return (
      <div>
        {
          // 运力奖励扣罚数据遍历展示
          attendanceNum.map((item, index) => (
            <Row key={index} style={{ marginBottom: '10px' }}>
              <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}dayspan`}>日均出单骑士数：</Col>
              <Col key={`${index}day`} span={6}><span style={{ lineHeight: '28px' }}>{item.day}人</span></Col>
              <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
              <Col key={`${index}per`} span={6}><span style={{ lineHeight: '28px' }}>{item.per}元</span></Col>
            </Row>
          ))
        }
      </div>
    );
  }
}
export default Attendance;
