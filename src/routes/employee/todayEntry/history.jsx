/**
 * 员工详情，历史工作信息组件
 * @author Jay
 * @class HistoryWorkInformation
 */

import React, { Component } from 'react';
import { Col, Row, Icon } from 'antd';
import Information from './../../../components/informationTemplate';
import HistoryInfoDetail from './../search/historyInfoDetail';

class HistoryWorkInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informations: props.informations,  // 所有的数据
      hasMoreInfo: props.informations.length > 1, // 是否有更多数据
      showMore: false,  // 是否显示更多
    };
  }

  // 点击收起或展开
  handleClick = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  }

  // 显示数据数据
  showHistoryInfo = () => {
    const { informations, hasMoreInfo, showMore } = this.state;
    // 初始 显示第一条(有更多，显示展开按钮，没有不显示)，点击展开按钮，显示所有信息
    if (showMore) {  // 显示所有，则展开所有信息,状态显示‘隐藏’
      return informations.map((item, index) => {
        return (
          <div key={index} className="mgt16">
            <HistoryInfoDetail information={item} />
          </div>
        );
      });
    } else {  // 否则，只显示第一条
      if (hasMoreInfo) { // 有更多信息，显示‘展开’
        return informations.slice(0, 1).map((item, index) => {
          return (
            <div key={index}>
              <HistoryInfoDetail information={informations[0]} />
              <Row><Col sm={22} /><span onClick={this.handleClick} className="historyInfoFolder">更多<Icon type="down" /></span></Row>
            </div>
          );
        });
      } else {  // 没有更多，不显示‘展开’
        return informations.map((item, index) => {
          return (
            <div key={index}>
              <HistoryInfoDetail information={item} />
            </div>
          );
        });
      }
    }
  }

  // 展示操作项
  showHandleTitle = () => {
    const { hasMoreInfo, showMore } = this.state;
    if (hasMoreInfo && showMore) {
      return (
        <Row>
          <Col sm={22} />
          <span onClick={this.handleClick} className="historyInfoFolder">收起<Icon type="up" /></span>
        </Row>
      );
    }
  }

  render() {
    // const dataList = {
    //   topTitle: '历史工作信息',
    //   content: [],
    // };
    return (
      <div>
        {/* <Information {...dataList} /> */}
        {this.showHistoryInfo()}
        {this.showHandleTitle()}
      </div>
    );
  }
}
export default HistoryWorkInformation;
