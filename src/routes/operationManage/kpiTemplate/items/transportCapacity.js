// 运力达成组件
import React, { Component } from 'react';
import { Button, InputNumber, Row, Col, Popconfirm, Select } from 'antd';

const Option = Select.Option;
class TransportCapacity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      X1Options: props.X1Options || [],                    // 选项 X1可选择范围
      transport: props.transport || [],                    // 数据 运力达成x1
      getTransport: props.getTransport || undefined,       // 改变值回调
      addTransport: props.addTransport || undefined,       // 增加一条
      removeTransport: props.removeTransport || undefined, // 删除一条
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      X1Options: nextProps.X1Options || [],                    // 选项 X1可选择范围
      transport: nextProps.transport || [],                    // 数据 运力达成x1
      getTransport: nextProps.getTransport || undefined,       // 改变值回调
      addTransport: nextProps.addTransport || undefined,       // 增加一条
      removeTransport: nextProps.removeTransport || undefined, // 删除一条
    });
  }

  // 渲染选项
  renderOptions = () => {
    const { X1Options } = this.state;
    return (
      X1Options.map((item, index) => (
        <Option value={`${item}`} key={index}>{`${item}天`}</Option>
      ))
    );
  }

  // 改变值回调
  getTransport = (value, index) => {
    // 向外抛出改变值的回调
    if (this.state.getTransport) {
      this.state.getTransport(value, index);
    }
  }

  // 增加一条
  addTransport = () => {
    // 向外抛出增加一条数据
    if (this.state.addTransport) {
      this.state.addTransport();
    }
  }

 // 删除一条
  removeTransport = () => {
    // 向外抛出删除一条数据
    if (this.state.removeTransport) {
      this.state.removeTransport();
    }
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
              <Select
                value={item.day}
                onChange={(value) => { this.getTransport(value, { id: index, flag: 'day' }); }}
              >
                {this.renderOptions()}
              </Select>
            </Col>
            <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} key={`${index}perspan`}>每单：</Col>
            <Col key={`${index}per`} span={6}><InputNumber value={item.per} onChange={(value) => { this.getTransport(value, { id: index, flag: 'per' }); }} />元</Col>
          </Row>
        ))}
        <Row>
          <Col span={12} />
          <Col span={6}>
            {
              // 最多能添加10条数据
              transport.length < 10 ? <Button onClick={this.addTransport}>添加</Button> : null
            }
            <Popconfirm
              title={<p>你确定要删除该项吗？</p>}
              onConfirm={this.removeTransport}
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
export default TransportCapacity;
