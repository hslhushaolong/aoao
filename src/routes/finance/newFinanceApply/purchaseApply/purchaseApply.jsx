/**
 * 收购款申请页面
 * @author Jay
 *
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Input, Button, message } from 'antd';
import UploadFile from './../travelApply/uploadFile';
import ConfirmModal from './../travelApply/confirmModal';
import MoreInfo from './../../financeApply/moreInfo';
import aoaoBossTools from './../../../../utils/util';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const { TextArea } = Input;

class PurchaseApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],  // 上传文件列表
      confirmVisible: false,  // 对话款隐藏
      amount: 0,  // 申请总额
      moreInfoVisible: false,  // 更多信息弹窗
      moreInfoList: [],  // 更多信息列表
      files_address: dot.get(props, 'finance.files_address', []),  // 文件地址列表
      cityList: [],  // 城市列表
      editVisible: false,  // 编辑弹窗显示属性
      itemIndex: '',  // 编辑的那条更多信息下标
      itemVal: {},  // 编辑的那条更多信息值
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

  // 收款人费用总和
  receiverTotalFund() {
    switch (dot.get(this, 'state.moreInfoList').length) {
      case 0 :
        return 0;
      case 1 :
        return parseFloat(this.state.moreInfoList[0].amount);
      default : {
        // 其他收款人
        const list = dot.get(this, 'state.moreInfoList', []);
        if (list.length <= 0) {
          return 0;
        }
        let otherTotalFund = 0;
        // 其他费用累加
        list.forEach((item) => {
          otherTotalFund += Number(item.amount);
        });
        return otherTotalFund;
      }
    }
  }

  // 点击发送按钮,弹出模态框
  handleSend() {
    // 申请总额
    const amount = parseFloat(this.props.form.getFieldValue('applications_amount')) || 0;
    this.setState({
      confirmVisible: true,
      amount,
    });
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 点击模态取消
  handleCancel() {
    this.setState({
      confirmVisible: false,
      moreInfoVisible: false,
      editVisible: false,
    });
  }

  // 点击模态确定
  handleSubmit() {
    const { dispatch } = this.props;
    // 获取收款人信息列表中所有金额总和
    const receiverTotalAmount = this.receiverTotalFund();
    this.props.form.validateFields((error, values) => {
      if (error) {
        return false;
      } else if (receiverTotalAmount != values.applications_amount) {
        message.error('总金额不匹配');
        return false;
      } else {
        values.files_address = this.state.files_address;
        values.finance_apply_type = parseInt(dot.get(this.props, 'finance.applyType'));
        values.payeey_info_list = this.state.moreInfoList;
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

  // 点击添加收款人信息
  handleAddMoreInfo() {
    this.setState({
      moreInfoVisible: true,
    });
  }

  // 点击更多信息modal的确定
  handleOk(vals) {
    const arr = this.state.moreInfoList;
    this.setState({
      moreInfoVisible: false,
      moreInfoList: [vals, ...arr],
    });
  }

  // 点击cell的删除
  deleteInfo(index) {
    this.setState({
      moreInfoList: dot.get(this, 'state.moreInfoList').filter((item, idx) => {
        return idx != index;
      }),
    });
  }

  // 点击编辑按钮
  editInfo(index) {
    const itemVal = this.state.moreInfoList[index];
    this.setState({
      editVisible: true,
      itemIndex: index,
      itemVal,
    });
  }

  // 点击编辑模态框的确认按钮
  handleEditOk(value, index) {
    const { moreInfoList } = this.state;
    moreInfoList[index] = value;
    this.setState({
      editVisible: false,
      moreInfoList,
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
                      cityList && cityList.map((item, index) => {
                        return (<Option value={item.city_spelling} key={index}>{item.city_name_joint}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'被收购城市'}>
                {getFieldDecorator('takeover_city_name', {
                  rules: [{ required: true, message: '请输入收购城市', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入收购城市" />,
                                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'收购金额'}>
                {getFieldDecorator('applications_amount', {
                  rules: [{ required: true, message: '请输入收购金额', trigger: 'onBlur' }],
                })(
                  <Input placeholder="请输入收购金额" />,
                                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...textAreaLayout} label={'收购说明'}>
                {getFieldDecorator('note', {
                  rules: [{ required: true, message: '请输入收购说明', trigger: 'onBlur', type: 'string' }],
                })(
                  <TextArea placeholder="请输入收购说明" rows={3} />,
                                )}
              </FormItem>
            </Col>
          </Row>

          {
            dot.get(this, 'state.moreInfoList', []).map((item, index) => {
              return (<Row key={index} className="mgl8" style={{ background: '#FCF6FA', height: 40, lineHeight: '40px', marginBottom: '8px', padding: '0 16px' }}>
                <Col sm={6}>费用金额：{item.amount}</Col>
                <Col sm={5}>收款人：{item.payee_name}</Col>
                <Col sm={6}>收款账户：{item.payee_credit_card_numbers}</Col>
                <Col sm={5}>开户支行：{item.payee_bank_address}</Col>
                <Col sm={1}><span className="systemTextColor pointer" onClick={this.editInfo.bind(this, index)}>编辑</span></Col>
                <Col sm={1}><span className="systemTextColor pointer" onClick={this.deleteInfo.bind(this, index)}>删除</span></Col>
              </Row>);
            })
          }

          <Row style={{ margin: '16px 32px' }}>
            <Col className="mgl8">
              <Button type="primary" onClick={this.handleAddMoreInfo.bind(this)}>点击添加收款人信息</Button>
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
        <div>
          <MoreInfo
            handleCancel={this.handleCancel.bind(this)}
            visible={this.state.moreInfoVisible}
            handleOk={this.handleOk.bind(this)}
          />
        </div>
        {/** *********  更多信息编辑弹窗  ***********/}
        <div>
          <MoreInfo
            handleCancel={this.handleCancel.bind(this)}
            visible={this.state.editVisible}
            handleEditOk={this.handleEditOk.bind(this)}
            itemVal={this.state.itemVal}
            itemIndex={this.state.itemIndex}
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
export default connect(mapStateToProps)(Form.create()(PurchaseApply));
