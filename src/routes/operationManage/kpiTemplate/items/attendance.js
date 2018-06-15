// 运力奖励扣罚组件
import React, { Component } from 'react';
import { Button, InputNumber, Row, Col, Popconfirm } from 'antd';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceNum: props.attendanceNum || [],                          // 运力奖励扣罚
      getattendanceNum: props.getattendanceNum || undefined,             // 改变值回调
      addattendanceNum: props.addattendanceNum || undefined,             // 增加一条
      removeattendanceNum: props.removeattendanceNum || undefined,       // 减少一条
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      attendanceNum: nextProps.attendanceNum || [],                      // 运力奖励扣罚
      getattendanceNum: nextProps.getattendanceNum || undefined,         // 改变值回调
      addattendanceNum: nextProps.addattendanceNum || undefined,         // 增加一条
      removeattendanceNum: nextProps.removeattendanceNum || undefined,   // 减少一条
    });
  }

  // 取值回调函数
  getattendanceNum = (value, index) => {
    // 父组件传进来的改变数据的回调函数
    if (this.state.getattendanceNum) {
      this.state.getattendanceNum(value, index);
    }
  }

  // 增加一条
  addattendanceNum = () => {
    // 父组件传进来的增加数据的回调函数
    if (this.state.addattendanceNum) {
      this.state.addattendanceNum();
    }
  }

  // 减少一条
  removeattendanceNum = () => {
    // 父组件传进来的减少数据的回调函数
    if (this.state.removeattendanceNum) {
      this.state.removeattendanceNum();
    }
  }

  render() {
    const { attendanceNum } = this.state;
    return (
      <div>
        {attendanceNum.map((item, index) => (
          <Row key={index} style={{ marginBottom: '10px' }}>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}dayspan`}>日均出单骑士数：</Col>
            <Col key={`${index}day`} span={6}><InputNumber value={item.day} precision={0} min={0} onChange={(value) => { this.getattendanceNum(value, { id: index, flag: 'day' }); }} />人</Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
            <Col key={`${index}per`} span={6}><InputNumber value={item.per} onChange={(value) => { this.getattendanceNum(value, { id: index, flag: 'per' }); }} />元</Col>
          </Row>
        ))}
        <Row>
          <Col span={12} />
          <Col span={6}>
            <Button onClick={this.addattendanceNum}>添加</Button>
            <Popconfirm
              title={<p>你确定要删除该项吗？</p>}
              onConfirm={this.removeattendanceNum}
              okText="确认"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Attendance;
