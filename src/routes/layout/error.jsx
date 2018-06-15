/**
 * 404 错误页面
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

class Error extends Component {
  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/loginClear',
      payload: '',
    });
  };
  render() {
    return (
      <div>
        <div style={{ width: '100%', height: '100%' }}>
          <div className="errorWrapper">
            <div className="errorPin" />
            <div className="errorCode"> 错误 <span>404</span></div>
            <p>你所找的页面已进入外太空</p>
            <p>请刷新页面或者<Button type="primary"><a href="#/" onClick={this.logout}>返回首页</a></Button></p>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ login }) {
  return { login };
}

export default connect(mapStateToProps)(Error);
