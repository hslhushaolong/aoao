/**
 * 图片渲染模板
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import style from './components.less';
import { Col, Row } from 'antd';

class Image extends Component {
  constructor(props) {
    super();
    this.state = {
      imgData: props,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imgData: nextProps,
    });
  }

  render() {
    return (
      <span>
        {
          dot.get(this, 'state.imgData.url') != '' ?
            <img src={dot.get(this, 'state.imgData.url')} alt="暂无照片" style={dot.get(this, 'state.imgData.style')} /> :
            <div className={`${style.imgBox} mgb8`}>暂无照片</div>
        }

      </span>
    );
  }
}
export default Image;
