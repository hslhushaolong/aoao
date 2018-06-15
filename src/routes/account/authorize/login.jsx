/**
 * 登录业务组件
 **/
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Button, Form, Input, Row, Col, Icon } from 'antd';
import styles from './style/login.less';
import logo from './static/logo.png';
import { PhoneRegExp } from '../../../application/define';

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: '',      // 验证码
      firstGetCode: true,   // 是否第一次点击获取验证码
      count: 60,           // 倒计时
      closeState: false,   // 清除按钮状态
    };
    this.private = {
      timer: null,       // 保存计时器
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      verifyCode: dot.get(nextProps, 'login.verifyCode', ''),
    });
  }
  // 组件卸载时清除计时器
  componentWillUnmount = () => {
    // 清除计时器
    clearInterval(this.private.timer);
  }
  // 清除input数据&隐藏清除按钮
  onClear = () => {
    const { resetFields } = this.props.form;
    // 清除手机号和验证码
    resetFields();
    this.setState({
      closeState: false,
    });
  }
  // 聚焦 显示清除按钮
  onCloseFocus = () => {
    this.setState({
      closeState: true,
    });
  }
  // 倒计时
  onChangeCountdown = () => {
    const { count } = this.state;
    // 60s倒计时
    let total = count;
    // 清除计时器
    clearInterval(this.private.timer);

    this.private.timer = setInterval(() => {
      total--;
      this.setState({
        count: total,
      });
      if (total === 0) {
        // 倒计时结束
        clearInterval(this.private.timer);
      }
    }, 1000);
  }
  // 获取验证码
  getVerificationCode = () => {
    const { dispatch } = this.props;
    const { getFieldsValue, validateFields } = this.props.form;

    validateFields(['phone'], (error) => {
      if (!error) {
        const value = getFieldsValue();
        this.setState({
          firstGetCode: false,    // 点击获取验证码后，制否，显示重新获取验证码
          count: 60,             // 重新发送验证码时，初始化count
        }, () => {
          // 倒计时
          this.onChangeCountdown();
        });
        dispatch({ type: 'login/getVerifyCodeE', payload: { phone: value.phone } });
      }
    });
  };

  // 登录
  handleSubmit = () => {
    const { dispatch } = this.props;
    const { getFieldsValue, validateFields } = this.props.form;
    validateFields((error) => {
      if (!error) {
        const data = getFieldsValue();
        dispatch({
          type: 'login/loginE',
          payload: {
            phone: data.phone,
            verify_code: data.verifyCode,
            app_code: 'aoao_boss',
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { verifyCode, count, closeState } = this.state;

    return (
      <Form>
        <div className={styles.logoBox}>
          <img src={logo} alt="" className={styles.logo} />
        </div>
        <div id={styles.title}>
          <div className="textCenter">
            <span className={styles.line} />
            <p>嗷嗷BOSS系统</p>
            <span className={styles.line} />
          </div>
        </div>
        <FormItem className={styles.input}>
          {getFieldDecorator('phone', {
            rules: [{
              required: true,
              trigger: 'onBlur',
              validateTrigger: 'onFous',
              validator: (rule, value, callback) => {
                if (value == '') {
                  callback('请输入手机号码');
                  return;
                }

                if (!(PhoneRegExp.test(value))) {
                  callback('请输入正确的手机号码');
                  return;
                }
                callback();
              },
            }],
          })(
            <Input
              placeholder="请输入手机号"
              suffix={closeState && <div onClick={this.onClear} ><Icon type="close-circle" /></div>}
              onFocus={this.onCloseFocus}
            />,
          )}
        </FormItem>
        <Row className={styles.input}>
          <Col sm={15}>
            <FormItem>
              {getFieldDecorator('verifyCode', {
                initialValue: verifyCode,
                rules: [{ required: true, message: '您输入的验证码有误,请重新输入！' }],
              })(
                <Input placeholder="请输入验证码" />,
              )}
            </FormItem>
          </Col>
          <Col sm={1} />
          <Col sm={8}>
            <FormItem>
              {
                this.state.firstGetCode ?
                  <Button className={styles.barCode} onClick={this.getVerificationCode}>获取验证码</Button>
                  :
                  count === 0 ?
                    // 重发验证码
                    <Button className={styles.barCode} onClick={this.getVerificationCode}>重发验证码</Button>
                    :
                    // 倒计时
                    <Button className={styles.barCode} disabled>{count}s</Button>
              }
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" className={`${styles.input} loginBtn`} onClick={this.handleSubmit}>
            <span>登录</span>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const mapStateToProps = ({ login }) => {
  return { login };
};

export default connect(mapStateToProps)(Form.create()(Login));
