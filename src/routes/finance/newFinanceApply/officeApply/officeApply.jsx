/**
 * 办公费用申请页面
 * @author Jay
 * @class OtherApply
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Input, Button, Popconfirm, message, Icon } from 'antd';
import style from '../../../employee/search/search.less';
import aoaoBossTools from './../../../../utils/util';
import ConfirmModal from './../travelApply/confirmModal';
import UploadFile from './../travelApply/uploadFile';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const { TextArea } = Input;

class OtherApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      house_purpose: '',  // 房屋用途
      cityList: [],  // 城市列表
      districtList: [],  // 商圈列表
      confirmVisible: false,  // 确认弹窗
      amount: '',  // 申请金额
      files_address: [],  // 文件地址列表
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      // 更新文件地址
      files_address: dot.get(props, 'finance.files_address', []),
    });
  }

  // 获取城市列表
  platformChange = (data) => {
    // 重置表单
    this.props.form.resetFields(['biz_district_id_list', 'city_spelling']);
    // 获取城市
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    // 重置表单
    this.props.form.resetFields(['biz_district_id_list']);
    const cityData = this.state.cityList;
    // 获取商圈key值列表
    const keyList = aoaoBossTools.getArrayItemIndex(cityData, [key], 'city_spelling');
    const areaArray = [];
    const areaData = [];
    keyList.forEach((item) => {
      areaArray.push(cityData[item].biz_district_list);
    });
    for (let i = 0; i < areaArray.length; i++) {
      areaArray[i].forEach((item) => {
        areaData.push(item);
      });
    }
    this.setState({
      districtList: areaData,
    });
  };

  // 生成平台下拉选项
  createPlatformList = () => {
    // 获取当前角色的商圈
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 房屋用途改变
  changeHousePurpose(value) {
    this.setState({
      house_purpose: value,
    });
  }

  // 点击发送
  handleSend = () => {
    const amount = this.props.form.getFieldValue('applications_amount');
    this.setState({
      confirmVisible: true,
      amount,
    });
  }

  // 点击返回
  onConfirmBack = () => {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击modal取消
  handleCancel() {
    this.setState({
      confirmVisible: false,
    });
  }

  // 点击modal确认，提交
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('请完善信息');
      } else {
        if (values.biz_district_id_list) {
          // 参数转为数组
          values.biz_district_id_list = [values.biz_district_id_list];
        }
        // 申请总额
        values.applications_amount = parseFloat(values.applications_amount);
        // 申请类型
        values.finance_apply_type = parseInt(this.props.finance.applyType, 10);
        // 费用用途
        values.office_expenses_purpose = parseInt(values.office_expenses_purpose, 10);
        // 费用明细
        values.office_expenses_item = parseInt(values.office_expenses_item, 10);
        // 文件地址
        values.files_address = this.state.files_address;
        this.props.dispatch({
          type: 'finance/createFinanceOrderDetailE',
          payload: values,
        });
      }
    });
    this.setState({
      confirmVisible: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const platformList = this.createPlatformList();
    const portPurpose = this.state.house_purpose === '20031';
    // 获取城市, 商圈
    const { cityList, districtList } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const textAreaLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className={style.information}>
        <Form>
          <div className="mgt16">
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>基础信息</b>
              </span>
            </div>
            <p className={`${style.top}`} />
            <Row className="mgl8">
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
                <FormItem {...formItemLayout} label={'城市'}>
                  {getFieldDecorator('city_spelling', {
                    rules: [{ required: true, message: '请选择城市', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Select placeholder="请选择城市" onChange={this.handleCityChange}>
                      {
                        cityList && cityList.map((item, index) => {
                          return (<Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'用途'}>
                  {getFieldDecorator('office_expenses_purpose', {
                    rules: [{ required: true, message: '请选择房屋用途', trigger: 'onBlur', type: 'string' }],
                    initialValue: '20032',
                  })(
                    <Select placeholder="请选择房屋用途" onChange={this.changeHousePurpose.bind(this)}>
                      <Option value={'20032'}>办公室</Option>
                      <Option value={'20031'}>站点</Option>
                    </Select>,
                  )}
                </FormItem>
                <span style={{ display: 'table', marginTop: '-21px', marginLeft: '56px', paddingRight: '32px', color: '#aaa' }}>
                  <Icon type="exclamation-circle-o" style={{ fontSize: 12, color: '#08c' }} />
                  &nbsp;提示：无法明确费用的“用途”选择标准：能落实到具体商圈即选择“站点”
                </span>
              </Col>
              {
                portPurpose ? <Col sm={8}>
                  <FormItem {...formItemLayout} label={'覆盖商圈'}>
                    {getFieldDecorator('biz_district_id_list', {
                      rules: [{ required: true, message: '请选择商圈', trigger: 'onBlur', type: 'string' }],
                    })(
                      <Select placeholder="请选择商圈">
                        {
                          districtList && districtList.map((item, index) => {
                            return <Option key={index} value={item.biz_district_id}>{item.biz_district_name}</Option>;
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col> : ''
              }
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'费用明细科目'}>
                  {getFieldDecorator('office_expenses_item', {
                    rules: [{ type: 'string', message: '费用明细科目', required: true }],
                    initialValue: '20041',
                  })(
                    <Select placeholder="费用明细科目">
                      <Option value={'20041'}>站点水电网物业费</Option>
                      <Option style={{ display: portPurpose ? 'none' : 'block' }} value={'20042'}>快递打印</Option>
                      <Option style={{ display: portPurpose ? 'none' : 'block' }} value={'20043'}>维修搬运</Option>
                      <Option style={{ display: portPurpose ? 'none' : 'block' }} value={'20044'}>骑士福利</Option>
                      <Option value={'20045'}>其他</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="mgt16">
            <div className="mgb8">
              <span className={style.greenLable} />
              <span className="mgl8">
                <b>支付信息</b>
              </span>
            </div>
            <p className={`${style.top}`} />
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
                      validateTrigger: 'onBlur',
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
                    <Input placeholder="请输入卡号" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="金额" {...formItemLayout}>
                  {getFieldDecorator('applications_amount', {
                    rules: [{ required: true, message: '请输入金额', type: 'string' }],
                  })(
                    <Input placeholder="请输入金额" />)}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label="开户支行" {...formItemLayout}>
                  {getFieldDecorator('payee_bank_address', {
                    rules: [{ required: true, message: '请输入开户行', type: 'string' }],
                  })(
                    <Input placeholder="请输入全称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className="mgl8 mgt16" style={{ paddingLeft: '10px' }}>
              <Col sm={20}>
                <FormItem {...textAreaLayout} label={'备注'}>
                  {getFieldDecorator('note', {
                    rules: [{ required: true, message: '请输入备注', trigger: 'onBlur', type: 'string' }],
                  })(
                    <TextArea placeholder="请输入备注" rows={4} />,
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
                <Popconfirm title="内容未保存，确定离开页面?" onConfirm={() => this.onConfirmBack()}>
                  <Button>返回</Button>
                </Popconfirm>
              </Col>
            </Row>
          </div>
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
export default connect(mapStateToProps)(Form.create()(OtherApply));
