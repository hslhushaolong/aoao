/**
 * 详情信息模板
 * @params props.dataList {object}
 * @params props.dataList.topTitle {string}
 * @params props.dataList.content {array}
 * @params props.dataList.content[i].sm {string}
 * @params props.dataList.content[i].title {string}
 * @params props.dataList.content[i].data {string}
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Col, Row } from 'antd';
import style from './components.less';

class Information extends Component {
  constructor(props) {
    super();
    this.state = {
      dataList: props,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataList: nextProps,
    });
  }

  render() {
    return (
      <div className={style.information}>
        <div className={`${style.top} ${dot.get(this, 'state.dataList.color') == true ? style.topColor : ''}`}>
          <div className="mgb8">
            <span className={style.greenLable} />
            <span className="mgl8">
              <b>{dot.get(this, 'state.dataList.topTitle')}</b>
            </span>
          </div>
          <Row>
            {
              dot.get(this, 'state.dataList.content', []).map((item, index) => {
                return (
                  <Col sm={item.sm} className="mgb8" key={index}>
                    <Col sm={8} className="textRight">
                      <span className="mgr8 ftw3">{`${item.title}${item.title != '' ? ': ' : ''}`}</span>
                    </Col>
                    <Col sm={16} className="textLeft">
                      <b>
                        <span>{`${item.data} `}</span>
                      </b>
                    </Col>
                  </Col>
                );
              })
            }
          </Row>
        </div>
      </div>
    );
  }
}
export default Information;
