/**
 * 登录相关路由
 */
import React from 'react';
import styles from './style/login.less';
import logo from './static/logo.png';
import LoginComponent from './login';
import AuthComponent from './auth';
import { authorize } from '../../../application';

// 模块内部路由
const AuthorizeRouter = {
  login: 'login',       // 登陆
  auth: 'auth',         // 验证
};
class AuthorizeComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      childrenComponent: '',
    };

    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillMount() {
    const { route } = this.props.params;

    this.setState({
      childrenComponent: this.renderComponentByRoute(route),
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const { route } = nextProps.params;
    // const route = nextProps.location.pathname;
    // 如果当前在登陆页面，但未获取到登陆数据，则跳转到登录页面
    if (route === AuthorizeRouter.login && authorize.isLogin() === false) {
      nextProps.history.go('authorize/login');
      return;
    }

    // 如果当前在授权页面，但没有获取到授权数据，则跳转到授权页面
    if (route === AuthorizeRouter.auth && authorize.isAuth() === false) {
      nextProps.history.go('authorize/auth');
      return;
    }

    this.setState({
      childrenComponent: this.renderComponentByRoute(route),
    });
  }

  // 根据路由获取模块
  renderComponentByRoute = (route) => {
    switch (route) {
      case AuthorizeRouter.auth:
        return <AuthComponent />;

      case AuthorizeRouter.login:
      default:
        return <LoginComponent />;
    }
  }

  render() {
    const { childrenComponent } = this.state;

    return (
      <div id={styles.login} className="login">
        <div className={styles.centerBox}>
          {/* 子模块 */}
          {childrenComponent}
        </div>
      </div>
    );
  }
}

module.exports = AuthorizeComponent;
