// 实效达成组件
import React, { Component } from 'react';
import { Button, InputNumber, Row, Col, Popconfirm } from 'antd';

class TimeReach extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescription: props.prescription || [],                       // 实效达成
      getPrescription: props.getPrescription || undefined,          // 改变数据回调
      addPrescription: props.addPrescription || undefined,          // 增加一条
      removePrescription: props.removePrescription || undefined,    // 删除一条
    };
    this.private = {

    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      prescription: nextProps.prescription || [],                       // 实效达成
      getPrescription: nextProps.getPrescription || undefined,          // 改变数据回调
      addPrescription: nextProps.addPrescription || undefined,          // 增加一条
      removePrescription: nextProps.removePrescription || undefined,    // 删除一条
    });
  }

  // 改变数据回调
  getPrescription = (value, index) => {
    // 父组件传进来的改变数据的回调函数
    if (this.state.getPrescription) {
      this.state.getPrescription(value, index);
    }
  }

  // 增加一条
  addPrescription = () => {
    // 父组件传进来的增加数据的回调函数
    if (this.state.addPrescription) {
      this.state.addPrescription();
    }
  }

  // 删除一条
  removePrescription = () => {
    // 父组件传进来的减少数据的回调函数
    if (this.state.removePrescription) {
      this.state.removePrescription();
    }
  }

  render() {
    const { prescription } = this.state;
    return (
      <div>
        <Row style={{ marginBottom: '10px' }} />
        {prescription.map((item, index) => (
          <Row key={index} style={{ marginBottom: '10px' }}>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}ontimespan`}>订单准时率&gt;=</Col>
            <Col span={4}><InputNumber precision={0} key={`${index}ontime`} value={item.ontime} min={0} onChange={(value) => { this.getPrescription(value, { id: index, flag: 'ontime' }); }} />%</Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}averagespan`}>平均配送时长&lt;=</Col>
            <Col span={4}><InputNumber precision={0} key={`${index}average`} value={item.average} min={0} onChange={(value) => { this.getPrescription(value, { id: index, flag: 'average' }); }} />分钟</Col>
            <Col span={3} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}dayspan`}>单循达成实效要求天数&gt;=</Col>
            <Col span={3}><InputNumber precision={0} key={`${index}day`} value={item.day} min={0} onChange={(value) => { this.getPrescription(value, { id: index, flag: 'day' }); }} />天</Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
            <Col span={4}><InputNumber key={`${index}per`} value={item.per} onChange={(value) => { this.getPrescription(value, { id: index, flag: 'per' }); }} />元</Col>
          </Row>
        ))}
        <Row>
          <Col span={22} />
          <Col span={2}>
            <Button onClick={this.addPrescription}>添加</Button>
            <Popconfirm
              title={<p>你确定要删除该项吗？</p>}
              onConfirm={this.removePrescription}
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
export default TimeReach;
