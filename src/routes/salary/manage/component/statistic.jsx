/**
 * 汇总页面
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CoreContent } from '../../../../components/core';
import { renderReplaceAmount } from '../../../../application/define';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      event: this.props.event,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    });
  }
  // 修复小数加法精度不准问题
  addNum = (num1, num2) => {
    let sq1 = 0;
    let sq2 = 0;
    let m = 0;
    try {
      sq1 = num1.toString().split('.')[1].length;
    } catch (e) {
      sq1 = 0;
    }
    try {
      sq2 = num2.toString().split('.')[1].length;
    } catch (e) {
      sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return ((num1 * m) + (num2 * m)) / m;
  }
  render = () => {
    const { data } = this.state;
    // 从数据源进行数据汇总
    const finalData = data.reduce((accumulator, item) => {
      if (item.city.length > 0 && item.deductAmount.length > 0 && item.deductEvent.length > 0) {
        if (accumulator[item.deductEvent]) {
          accumulator[item.deductEvent] = `${this.addNum(Number(accumulator[item.deductEvent]), Number(item.deductAmount))}`;
        } else {
          accumulator[item.deductEvent] = item.deductAmount;
        }
      }
      return accumulator;
    }, {});
    // 按照数据数量的多少来动态定义数据间距
    const dataLength = Object.keys(finalData).length;
    const gapSize = dataLength > 5 ? 2 : 4;
    return (
      <CoreContent>
        <Row >
          <Col sm={gapSize}>
            {'汇总项'}
          </Col>
          {
            Object.keys(finalData).slice(0, 10).map((item, index) => {
              return (<Col key={index} sm={gapSize}>
                {this.state.event.description(Number(item))}
              </Col>);
            })
          }
        </Row>
        <Row >
          <Col sm={gapSize} className="mgt16">
            {'城市'}
          </Col>
          {
            Object.keys(finalData).slice(0, 10).map((item, index) => {
              return (<Col key={index} sm={gapSize} className="mgt16">
                {renderReplaceAmount(finalData[item])}
              </Col>);
            })
          }
        </Row>
        {/* 多于十行时显示 */}
        {
          dataLength > 10 &&
          <div>
            <Row>
              <Col sm={gapSize} className="mgt16" />
              {
                Object.keys(finalData).slice(10).map((item, index) => {
                  return (<Col key={index} sm={gapSize} sm={gapSize} className="mgt16">
                    {this.state.event.description(Number(item))}
                  </Col>);
                })
              }
            </Row>
            <Row>
              <Col sm={gapSize} className="mgt16" />
              {
                Object.keys(finalData).slice(10).map((item, index) => {
                  return (<Col key={index} sm={gapSize} className="mgt16">
                    {renderReplaceAmount(finalData[item])}
                  </Col>);
                })
              }
            </Row>
          </div>
        }
      </CoreContent>
    );
  }
}
export default Statistic;
