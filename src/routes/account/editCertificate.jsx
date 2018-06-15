/**
 * 账户信息，编辑员工信息 上传图片页面
 * @author Jay
 * @class EditCertificate
 * @extends {Component}
 */

import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Upload,
  Icon,
  Spin,
  message,
  Button,
  Cascader,
  Select,
} from 'antd';
import style from './../employee/search/search.less';
import aoaoBossTools from './../../utils/util';
import cityList from './cityList.json';
import { authorize } from '../../application';
import { getBankName, getBankKind } from './define';

const [FormItem] = [Form.Item];
const Option = Select.Option;

class EditCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: props.dataList,
      token: dot.get(props, 'employee.token'),
      path: dot.get(props, 'employee.path'),
      loading: false,
      field: dot.get(props, 'employee.field'),
      imgKeyList: dot.get(props, 'employee.imgKeyList'),
      bankInfo: dot.get(props, 'employee.whichBank'), // 银行卡信息
      bankOption: [],                                  // 自动选择银行
    };
  }

  componentWillMount() {
    const { dataList, dispatch } = this.props;
    dispatch({ type: 'employee/initDataListR', payload: dataList });
  }

  componentWillReceiveProps(nextProps) {
    const value = [];
    if (dot.get(nextProps, 'employee.whichBank').validated) {
      value.push(
        this.setBankOption(dot.get(nextProps, 'employee.whichBank').bank,
        dot.get(nextProps, 'employee.whichBank').card_type));
    }
    this.setState({
      dataList: dot.get(nextProps, 'employee.employeeDetail'),
      path: dot.get(nextProps, 'employee.path'),
      token: dot.get(nextProps, 'employee.token'),
      loading: dot.get(nextProps, 'employee.loading'),
      field: dot.get(nextProps, 'employee.field'),
      imgKeyList: dot.get(nextProps, 'employee.imgKeyList'),
      bankInfo: dot.get(nextProps, 'employee.whichBank'), // 银行卡信息
      bankOption: value,
    });
  }

  // 清空详情
  // componentWillUnmount() {
  //   this.props.dispatch({
  //     type: 'employee/emptyDataListR',
  //   });
  // }

  // 设置银行卡选项
  setBankOption = (name, kind) => {
    if (!getBankKind(kind)) {
      message.warning('只能绑定借记卡');
      return [];
    }
    if (getBankName(name)) {
      return {
        value: getBankName(name),
        name: getBankName(name),
      };
    }
    message.warning('无法识别开户行');
    return [];
  }

  // 渲染银行卡选项
  renderBankOption = () => {
    if (this.state.bankOption.length === 0) {
      return null;
    } else {
      return (
        this.state.bankOption.map(item => (
          <Option value={item.value} key={item.value}>{item.name}</Option>
        ))
      );
    }
  }

  // 获得位置信息信息
  getPosition = (value) => {}

  // 获得银行信息
  getBank = (value) => {
    this.props.dispatch({
      type: 'employee/getBankE',
      payload: {
        card_num: value.target.value,
        account_id: authorize.account.id,
      },
    });
  }

  // 获取token
  getToken(type) {
    const { dispatch } = this.props;
    dispatch({ type: 'employee/getUploadTokenE', payload: type });
  }

  // 点击取消按钮
  onConfirmCancle() {
    if (this.props.handleCancle) {
      this.props.handleCancle();
    }
  }

  // 点击保存
  handleSave() {
    this.props.form.validateFields((err, values) => {
      if (err) {} else {
        const values = this.props.form.getFieldsValue();
        const dataList = this.state.dataList;
        const staff_id = dataList._id;
        const account_id = authorize.account.id;
        values.staff_id = staff_id;
        values.account_id = account_id;
        values.option = true; // 编辑为true，离职为false
        if (getBankName(this.state.bankInfo.bank)) {
          values.bank_branch = getBankName(this.state.bankInfo.bank);
        } else {
          message.warning('请填写正确的银行卡号');
          return;
        }
        const value = Object.assign({}, values, this.state.imgKeyList);
        if (this.props.handleSave) {
          this.props.handleSave(value);
        }
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 14,
        },
      },
    };
    const formItemLayout_location = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
    };
    const { dispatch, dataList } = this.props;
    const staffId = dataList._id;
    const { token, path, field } = this.state;
    const { getFieldDecorator } = this.props.form;
    const props = {
      name: 'file',
      action: '',
      showUploadList: false,
      listType: 'picture',
      data(file) {
        return { token: 'token', key: 'path', file };
      },
      beforeUpload(file) {
        if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) == -1) {
          message.error('只能上传图片');
          return false;
        }
        dispatch({ type: 'employee/getUploadLoadingR', payload: true });
        // 如果文件正确则创建任务
        const Timer = setTimeout(() => {
          dispatch({
            type: 'employee/postFileToQINIUE',
            payload: {
              file,
              token,
              key: path,
              field,
              id: staffId,
            },
          });
          clearTimeout(Timer);
        }, 1000);
      },
    };
    const styles = {
      greenLabel: {
        width: '5px',
        height: '12px',
        display: 'inline-block',
        background: '#72DE00',
      },
      top: {
        padding: '8px 16px 8px 16px',
        // borderTop: '1px solid #E9E9E9',
      },
    };
    return (
      <div
        style={{
          ...styles.top,
        }}
      >
        <Form>
          <Spin
            tip="图片上传中..." style={{
              height: '120%',
            }} spinning={this.state.loading}
          >
            {/* <div className="mgb8">
              <span
                style={{
                  ...styles.greenLabel,
                  borderRadius: '4px',
                }}
              />
              <span className="mgl8">
                <b>证件信息</b>
              </span>
            </div> */}
            <Row>
              <Col sm={12}>
                <FormItem label="身份证正面照" {...formItemLayout}>
                  {getFieldDecorator('identity_card_front', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传照片',
                      }, {
                        required: true,
                        message: '请上传照片',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.identity_card_front'),
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'identity_card_front')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={dot.get(this, 'state.dataList.identity_card_front')} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="身份证反面照" {...formItemLayout}>
                  {getFieldDecorator('identity_card_back', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传图片',
                      }, {
                        required: true,
                        message: '请上传图片',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.identity_card_back'),
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'identity_card_back')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={dot.get(this, 'state.dataList.identity_card_back')} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="银行卡号" {...formItemLayout}>
                  {getFieldDecorator('bank_card_id', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        trigger: 'onBlur',
                        validateTrigger: 'onFous',
                        validator: (rule, value, callback) => {
                          if (value == '') {
                            callback('请输入卡号');
                            return;
                          }
                          if (!(/^(\d{16}|\d{19})$/.test(value))) {
                            callback('请输入正确的卡号');
                            return;
                          }
                          callback();
                        },
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.bank_card_id'),
                  })(
                    <Input placeholder="请输入银行卡号" onBlur={this.getBank} />)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="持卡人姓名" {...formItemLayout}>
                  {getFieldDecorator('cardholder_name', {
                    rules: [{
                      type: 'string', message: '请输入持卡人姓名',
                    }, {
                      required: false, message: '请输入持卡人姓名',
                    }],
                    initialValue: dot.get(this, 'state.dataList.cardholder_name'),
                  })(
                    <Input placeholder="请输入持卡人姓名" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="开户行" {...formItemLayout}>

                  <Select value={this.state.bankInfo.bank ? getBankName(this.state.bankInfo.bank) : ''} placeholder="填写银行卡号自动识别开户行">
                    {this.renderBankOption()}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="开户行所在地" {...formItemLayout_location}>
                  {getFieldDecorator('bank_location', {
                    rules: [
                      {
                        required: true,
                        message: '请选择开户行所在地',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.bank_location'),
                  })(<Cascader options={cityList} placeholder="请选择开户行所在地" onChange={this.getPosition} showSearch />)}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="银行卡正面" {...formItemLayout}>
                  {getFieldDecorator('bank_card_front', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传图片',
                      }, {
                        required: true,
                        message: '请上传图片',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.bank_card_front'),
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'bank_card_front')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={dot.get(this, 'state.dataList.bank_card_front')} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="半身照" {...formItemLayout}>
                  {getFieldDecorator('bust', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传图片',
                      }, {
                        required: true,
                        message: '请上传图片',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.bust'),
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'bust')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={dot.get(this, 'state.dataList.bust')} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="健康证" {...formItemLayout}>
                  {getFieldDecorator('health_certificate', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传图片',
                      }, {
                        required: true,
                        message: '请上传图片',
                      },
                    ],
                    initialValue: dot.get(this, 'state.dataList.health_certificate'),
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'health_certificate')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={dot.get(this, 'state.dataList.health_certificate')} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="健康证" {...formItemLayout}>
                  {getFieldDecorator('health_certificate_back', {
                    rules: [
                      {
                        type: 'string',
                        message: '请上传图片',
                      }, {
                        required: true,
                        message: '请上传图片',
                      },
                    ],
                    initialValue: this.state.dataList.health_certificate_back,
                  })(
                    <div>
                      <div className={`${style.imgBox} mgb8`} onMouseUp={this.getToken.bind(this, 'health_certificate_back')}>
                        <Upload {...props} className={`${style.editUploadIcon} ${style.complateBox}`}>
                          <img src={this.state.dataList.health_certificate_back} alt="暂无照片" className={style.imgStyle} />
                          <span className={style.editIconBox}>
                            <Icon type="edit" />
                          </span>
                        </Upload>
                      </div>
                    </div>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              {/*
                <Col className="textRight" sm={11}>
                <Popconfirm title="内容未保存，确定取消编辑?" onConfirm={() => this.onConfirmCancle()}>
                  <Button>取消</Button>
                </Popconfirm>
              </Col>
              <Col sm={2} />
              */}
              <Col className="textRight" sm={12}>
                <Button type="primary" onClick={this.handleSave.bind(this)}>保存</Button>
              </Col>
            </Row>
          </Spin>
        </Form>
      </div>
    );
  }
}
function mapStateToProps({ employee }) {
  return { employee };
}
export default connect(mapStateToProps)(Form.create()(EditCertificate));
