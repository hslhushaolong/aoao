/**
 * 证件详情信息模板
 * @params props.certificateData {object}
 * @params props.certificateData.topTitle {string}
 * @params props.certificateData.content {array}
 * @params props.certificateData.content[i].sm {string}
 * @params props.certificateData.content[i].title {string}
 * @params props.certificateData.content[i].data {string||object}
 *
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import style from './components.less';
import Image from './imageTemplate';

class Certificate extends Component {
  constructor(props) {
    super();
    this.state = {
      certificate: props,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      certificate: nextProps,
    });
  }

  // 点击编辑按钮
  handleClick = () => {
    this.props.handleClick();
  }

  render() {
    return (
      <div className={style.information}>
        <div className={style.content}>
          {/* <div className="mgb8">
            <span className={style.greenLable} />
            <span className="mgl8">
              <b>{dot.get(this, 'state.certificate.topTitle', '')}</b>
            </span>
            <span className="mgr8 mgb8" style={{ float: 'right' }}>
              <b>{this.props.editTitle ? <Button type={'primary'} onClick={this.handleClick}>{this.props.editTitle}</Button> : ''}</b>
            </span>
          </div> */}
          <Row>
            {
              dot.get(this, 'state.certificate.content', []).map((item, index) => {
                return (
                  <Col sm={item.sm} className="mgb8" key={`${item.title}${index}`}>
                    <Col sm={6} className="textRight">
                      <span className="mgr8 ftw3">{`${item.title}${item.title != '' ? ': ' : ''}`}</span>
                    </Col>
                    <Col sm={18} className="textLeft">
                      <b>
                        {
                          item.data.hasOwnProperty('url') == true ? <Image {...item.data} /> :
                          <span>{`${item.data} `}</span>
                        }
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
export default Certificate;
