/**
 * 差旅报销申请页
 * @author Jay
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Select, Row, Col, Input, DatePicker, Button } from 'antd';
import UploadFile from './uploadFile';
import ConfirmModal from './confirmModal';
import aoaoBossTools from './../../../../utils/util';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class TravelApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],  // 上传文件
      confirmVisible: false,  // 弹窗可见属性
      amount: 0,  // 申请总额
      files_address: dot.get(props, 'finance.files_address') || [],  // 文件地址
      cityList: [],  // 城市列表
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

  // 点击发送按钮
  handleSend() {
    // 获取 申请总金额 = 住宿费 + 交通费 + 其他费用
    const someVals = this.props.form.getFieldsValue(['accommodation_fee', 'transport_expense', 'other_expense']);
    // 住宿费
    someVals.accommodation_fee = someVals.accommodation_fee || 0;
    // 交通费用
    someVals.transport_expense = someVals.transport_expense || 0;
    // 其他开销
    someVals.other_expense = someVals.other_expense || 0;
    // 申请费用总额
    const amount = Number(someVals.accommodation_fee) + Number(someVals.transport_expense) + Number(someVals.other_expense);
    this.setState({
      confirmVisible: true,
      amount,
    });
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击modal框确定按钮
  handleSubmit() {
    // 必传参数 account_id 、city_spelling 、 finance_apply_type 、 applications_amount
    const { dispatch } = this.props;
    const { files_address } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        // 费用申请类型
        values.finance_apply_type = parseInt(dot.get(this.props, 'finance.applyType'));
        // 开始日期
        const startDate = aoaoBossTools.prctoMinute(values.mission_date[0]._d, 0);
        // 结束日期
        const endDate = aoaoBossTools.prctoMinute(values.mission_date[1]._d, 0);
        // 转换为后台需要字段
        values.mission_start_date = startDate;
        values.mission_end_date = endDate;
        delete values.mission_date; // 删除 mission_date 属性
        // 类型转换
        values.accommodation_fee = parseFloat(values.accommodation_fee);
        values.transport_expense = parseFloat(values.transport_expense);
        values.other_expense = parseFloat(values.other_expense);
        values.applications_amount = values.accommodation_fee + values.transport_expense + values.other_expense;
        values.files_address = files_address;
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

  // 点击modal框取消按钮
  handleCancel() {
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
              <FormItem {...formItemLayout} label={'出差地点'}>
                {getFieldDecorator('mission_address', {
                  rules: [{ required: true, message: '请输入出差地点', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入出差地点" />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'出差时间'}>
                {getFieldDecorator('mission_date', {
                  rules: [{ required: true, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
                  initialValue: [moment(aoaoBossTools.GetDateStr(0), 'YYYY-MM-DD'), moment(aoaoBossTools.GetDateStr(2), 'YYYY-MM-DD')],
                })(
                  <RangePicker
                    format={'YYYY-MM-DD'}
                  />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'住宿费'}>
                {getFieldDecorator('accommodation_fee', {
                  rules: [{ required: true, message: '请输入住宿费用', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入住宿费用" />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'交通费'}>
                {getFieldDecorator('transport_expense', {
                  rules: [{ required: true, message: '请输入交通费', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入交通费" />,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'其他费用'}>
                {getFieldDecorator('other_expense', {
                  rules: [{ required: true, message: '请输入其他费用', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入其他费用" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...textAreaLayout} label={'出差原因'}>
                {getFieldDecorator('mission_cause', {
                  rules: [{ required: true, message: '请输入出差原因', trigger: 'onBlur', type: 'string' }],
                })(
                  <TextArea placeholder="请输入出差原因" rows={3} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...textAreaLayout} label={'费用说明'}>
                {getFieldDecorator('note', {
                  rules: [{ required: true, message: '请输入费用原因', trigger: 'onBlur', type: 'string' }],
                })(
                  <TextArea placeholder="请输入费用原因" rows={3} />,
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
export default connect(mapStateToProps)(Form.create()(TravelApply));
