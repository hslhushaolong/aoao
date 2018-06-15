/**
 * 团建申请页面
 * @author Jay
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Input, Button } from 'antd';
import aoaoBossTools from './../../../../utils/util';
import UploadFile from './../travelApply/uploadFile';
import ConfirmModal from './../travelApply/confirmModal';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const { TextArea } = Input;

class TeamBuildApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],  // 上传文件
      confirmVisible: false,  // 确认弹窗
      amount: 0,  // 申请总额
      files_address: dot.get(props, 'finance.files_address', []),  // 文件地址
      cityList: [], // 城市列表
    };
  }

  // 页面刷新清空state的files_address
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/emptyImageListR',
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      files_address: dot.get(props, 'finance.files_address'),
    });
  }

  // 点击发送按钮,弹出modal框
  handleSend() {
    const total = this.props.form.getFieldValue('applications_amount');
    // 费用申请总额
    const amount = parseFloat(total) || 0;
    // 弹出模态框
    this.setState({
      confirmVisible: true,
      amount,
    });
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击modal的取消按钮
  handleCancel() {
    this.setState({
      confirmVisible: false,
    });
  }

  // 点击modal的确认按钮
  handleSubmit() {
    const { dispatch } = this.props;
    this.props.form.validateFields((error, values) => {
      if (error) {
        return false;
      } else {
        // 申请总额
        values.applications_amount = parseFloat(values.applications_amount);
        // 申请文件地址
        values.files_address = this.state.files_address;
        // 申请类型
        values.finance_apply_type = parseInt(dot.get(this.props, 'finance.applyType'));
        dispatch({
          type: 'finance/createFinanceOrderDetailE',
          payload: values,
        });
      }
    });
    this.setState({
      confirmVisible: false,
    });
  }

  // 生成平台下拉选项
  createPlatformList = () => {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 获取城市列表
  platformChange = (data) => {
    this.props.form.resetFields(['biz_district_id_list', 'city_spelling']);
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // 获取城市
    const platformList = this.createPlatformList();
    const { cityList } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const textAreaLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className="mgt16">
        <Form>
          <Row>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'平台'}>
                {getFieldDecorator('platform_code', {
                  rules: [{ required: true, message: '请选择平台', trigger: 'onBlur', type: 'string' }],
                })(
                  <Select placeholder="请选择平台" onChange={this.platformChange}>
                    {
                      platformList && platformList.map((item, index) => {
                        return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'申请城市'}>
                {getFieldDecorator('city_spelling', {
                  rules: [{
                    type: 'string', message: '请选择城市',
                  }, {
                    required: true, message: '请选择城市',
                  }],
                })(
                  <Select placeholder="请选择城市">
                    {
                      cityList.map((item, index) => {
                        return (<Option value={item.city_spelling} key={index}>{item.city_name}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'申请金额'}>
                {getFieldDecorator('applications_amount', {
                  rules: [{ required: true, message: '请输入其他费用', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入申请金额" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...textAreaLayout} label={'费用说明'}>
                {getFieldDecorator('note', {
                  rules: [{ required: true, message: '请输入费用说明', trigger: 'onBlur', type: 'string' }],
                })(
                  <TextArea placeholder="请输入费用说明" rows={3} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'收款人'}>
                {getFieldDecorator('payee_name', {
                  rules: [{ required: true, message: '请输入收款人', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入收款人" />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'收款账户'}>
                {getFieldDecorator('payee_credit_card_numbers', {
                  rules: [{
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
                  }],
                })(
                  <Input placeholder="请输入收款账户" />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'开户支行'}>
                {getFieldDecorator('payee_bank_address', {
                  rules: [{ required: true, message: '请输入开户支行', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入开户支行" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ paddingLeft: '40px' }}>
            <Col sm={8}>
              <UploadFile />
            </Col>
          </Row>
          <Row style={{ marginTop: '30px' }}>
            <Col className="textRight" sm={11}>
              <Button type="primary" onClick={this.handleSend.bind(this)}>发送</Button>
            </Col>
            <Col sm={2} />
            <Col className="textLeft" sm={11}>
              <Button onClick={this.handleBack.bind(this)}>返回</Button>
            </Col>
          </Row>
        </Form>
        <div>
          <ConfirmModal
            visible={this.state.confirmVisible}
            handleCancel={this.handleCancel.bind(this)}
            handleOk={this.handleSubmit.bind(this)}
            amount={this.state.amount}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps({ finance }) {
  return {
    finance,
  };
}
export default connect(mapStateToProps)(Form.create()(TeamBuildApply));
