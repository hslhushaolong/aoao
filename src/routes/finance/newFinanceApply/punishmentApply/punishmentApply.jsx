/**
 * 盖章罚款申请页面
 * @author Jay
 *
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Button, Input } from 'antd';
import aoaoBossTools from './../../../../utils/util';
import UploadFile from './../travelApply/uploadFile';
import { authorize } from '../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];

class PunishmentApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddUndertakerInfo: false,  // 显示费用承担人信息
      undertakerInfoList: [],  // 承担人信息列表
      addUndertakerInfoList: [],  // 点击确定，显示承担人信息
      knightList: [],  // 骑士列表
      files_address: dot.get(props, 'finance.files_address', []), // 文件地址
      districtList: [],  // 商圈列表
      selectedCity: '',  // 选择的城市
      selectedBizDistrict: '',  // 选择的商圈
      allKnightList: [],  // 获取的所有骑士
    };
  }

  // 页面刷新清空state的files_address
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/emptyImageListR',
    });
  }

  componentWillReceiveProps(nextProps) {
    // 骑士列表
    const oldKnightList = this.state.knightList;
    // 请求对骑士列表
    const newKnightList = nextProps.finance.knightList.data;
    // 每次获取的骑士添加进来
    const allKnightList = [...oldKnightList, ...newKnightList];
    this.setState({
      knightList: dot.get(nextProps, 'finance.knightList.data', []),
      allKnightList,
      files_address: dot.get(nextProps, 'finance.files_address'),
    });
  }

  // 选择城市,获取商圈
  cityChange=(data) => {
    const cityList = aoaoBossTools.getAllAreaFromPermission('city_list');
    this.props.form.resetFields(['biz_district_id']);
    let areaList = [];  // 商圈列表
    cityList.forEach((item) => {
      if (item.city_spelling === data) {
        areaList = item.biz_district_list;
      }
    });
    this.setState({
      selectedCity: data,  // 选择的城市
      districtList: areaList,  // 选择的城市下的所有商圈
    });
  }

  // 选择商圈，获取职位列表
  knightChange=(data) => {
    this.props.dispatch({
      type: 'finance/getKnightListE',
      payload: {
        limit: 1000,  // 请求数据最大数量
        state: 50,  // 在职状态
        page: 1,
        biz_district_id_list: [data],  // 商圈id列表
      },
    });
    this.setState({
      selectedBizDistrict: data, // 选择的商圈
    });
    // 重置输入框
    this.props.form.resetFields();
  }

  // 添加罚单信息
  handleAddMoreInfo() {
    this.setState({
      showAddUndertakerInfo: true,
    });
  }

  // 添加承担人信息
  addUndertakerInfo() {
    const arr = this.state.undertakerInfoList;
    // 往数组中添加一条
    this.setState({
      undertakerInfoList: [1, ...arr],
    });
  }

  // 点击取消
  handleCancle() {
    this.setState({
      showAddUndertakerInfo: false,
      undertakerInfoList: [],  // 清空数组
    });
  }

  // 点击确定
  handleSubmit() {
    const districtList = aoaoBossTools.getAllAreaFromPermission('biz_district_list');
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        values.undertaker_list = this.state.undertakerInfoList;
        const districtId = values.biz_district_id;
        let districtName = '';
        districtList.forEach((item) => {
          if (item.biz_district_id === districtId) {
            districtName = item.biz_district_name;
          }
        });
        const arr = this.state.addUndertakerInfoList;
        values.biz_district_name = districtName;  // 给values添加biz_district_name属性，方便在页面上展示
        this.setState({
          addUndertakerInfoList: [values, ...arr],  // 添加承担人
          showAddUndertakerInfo: false,  // 隐藏对话框
          undertakerInfoList: [],  // 清空数组
        });
      }
    });
  }

  // 点击删除
  deleteInfo(index) {
    this.setState({
      addUndertakerInfoList: dot.get(this, 'state.addUndertakerInfoList').filter((item, idx) => {
        return idx != index;
      }),
    });
  }

  // 点击发送按钮
  handleSend() {
    const { dispatch } = this.props;
    const load = {};
    const order_list = [];   // 所有的承担人信息列表
    const undertaker_list = [];  // 定义所有承担人数组
    let applications_amount = 0;  // 定义申请额
    // 每遍历一次创建一个对象，存储当前的承担人
    dot.get(this, 'state.addUndertakerInfoList', []).forEach((value, idx) => {
      const values = {  // 每条承担人信息
        biz_district_id: '',
        ticket_amount: '',
        undertaker_list: [],
      };
      // 申请总额累增
      applications_amount += Number(value.ticket_amount);
      // 承担人id
      values.biz_district_id = value.biz_district_id;
      // 每条罚款的罚款总金额
      values.ticket_amount = Number(value.ticket_amount);

      // 遍历value内部的 undertaker_list,从表单上搜集的所有的承担人信息
      value.undertaker_list && value.undertaker_list.forEach((item, index) => {
        // 每条承担人信息，需要添加到undertaker_list
        const undertaker = {
          undertaker_id: value[`undertaker_id${index}`],
          reason: value[`reason${index}`],
          amount: Number(value[`amount${index}`]),
        };
        // 填入对象数组
        values.undertaker_list.push(undertaker);
      });
      // 装入总承担人的数组
      order_list.push(values);
    });
    // 承担人数组
    load.order_list = order_list;
    // 申请类型转数字
    load.finance_apply_type = parseInt(dot.get(this.props, 'finance.applyType'));
    // 获取城市
    load.city_spelling = this.props.form.getFieldValue('city_spelling');
    // 申请总额
    load.applications_amount = applications_amount;
    // 文件地址
    load.files_address = this.state.files_address;
    dispatch({
      type: 'finance/createFinanceOrderDetailE',
      payload: load,
    });
  }

  // 点击返回按钮
  handleBack() {
    this.props.dispatch(routerRedux.push('Finance/FinanceApply'));
  }

  // 承担人id转为name
  idToName = (id) => {
    return dot.get(this, 'state.knightList', []).map((item, index) => {
      if (item._id === id) {
        return item.name;
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // 获取城市
    const cityList = aoaoBossTools.getAllAreaFromPermission('city_list');
    // 获取商圈
    const districtList = this.state.districtList;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={'申请城市'}>
              {getFieldDecorator('city_spelling', {
                rules: [{
                  type: 'string', message: '请选择城市',
                }, {
                  required: true, message: '请选择城市',
                }],
                initialValue: this.state.selectedCity,
              })(
                <Select placeholder="请选择城市" onChange={this.cityChange}>
                  {
                    cityList && cityList.map((item, index) => {
                      return (<Option value={item.city_spelling} key={index}>{item.city_name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        {   // 这里显示额外承担人信息
          dot.get(this, 'state.addUndertakerInfoList', []).map((item, index) => {
            return (<div style={{ background: '#FCF6FA', marginBottom: '8px', padding: '8px 16px' }} key={index}>
              <Row>
                <Col sm={9} style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                  <span>承担商圈：{item.biz_district_name}</span>
                </Col>
                <Col sm={8} style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                  <span>罚款总金额：{item.ticket_amount} 元</span>
                </Col>
                <Col sm={5} />
                <Col sm={2}>
                  <span className="systemTextColor pointer" onClick={this.deleteInfo.bind(this, index)}>删除</span>
                </Col>
              </Row>
              {
                item.undertaker_list && item.undertaker_list.map((article, idx) => {
                  return (<Row style={{ marginTop: '8px' }} key={idx}>
                    <Col sm={9}>
                      <span>承担人：{this.idToName(item[`undertaker_id${idx}`])}</span>
                    </Col>
                    <Col sm={8}>
                      <span>罚款原因：{item[`reason${idx}`]}</span>
                    </Col>
                    <Col sm={6}>
                      <span>罚款金额：{item[`amount${idx}`]}元</span>
                    </Col>
                  </Row>);
                })
              }
            </div>);
          })
        }
        {
          // 这里添加额外承担人信息
          this.state.showAddUndertakerInfo ? <div style={{ background: '#FCF6FA', marginBottom: '8px', padding: '8px 0' }}>
            <Row >
              <Col sm={6}>
                <FormItem {...formItemLayout} label={'承担商圈'}>
                  {getFieldDecorator('biz_district_id', {
                    rules: [{
                      type: 'string', message: '请选择商圈',
                    }, {
                      required: true, message: '请选择商圈',
                    }],
                  })(
                    <Select placeholder="请选择商圈" onChange={this.knightChange}>
                      {
                        districtList && districtList.map((item, index) => {
                          return (<Option value={item.biz_district_id} key={index}>{item.biz_district_name}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem {...formItemLayout} label={'罚款金额'}>
                  {getFieldDecorator('ticket_amount', {
                    rules: [{ required: true, message: '请输入罚款金额', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入罚款金额" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              dot.get(this, 'state.undertakerInfoList', []).map((item, index) => {
                return (<Row key={index}>
                  <Col sm={6}>
                    <FormItem label="选择承担人" {...formItemLayout}>
                      {getFieldDecorator(`undertaker_id${index}`, {
                        rules: [{ required: true, message: '请选择承担人', trigger: 'onBlur', type: 'string' }],
                      })(
                        <Select
                          placeholder="请选择承担人"
                          showSearch
                          optionFilterProp="children"
                        >
                          {
                            dot.get(this, 'state.knightList', []).map((item, index) => {
                              return (<Option value={item._id} key={index}>{ item.name && item.name}</Option>);
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem {...formItemLayout} label={'罚款原因'}>
                      {getFieldDecorator(`reason${index}`, {
                        rules: [{ required: true, type: 'string', message: '请输入卡号' }],
                      })(
                        <Input placeholder="请输入罚款原因" />,
                    )}
                    </FormItem>
                  </Col>
                  <Col sm={6}>
                    <FormItem label="罚款金额" {...formItemLayout}>
                      {getFieldDecorator(`amount${index}`, {
                        rules: [{
                          type: 'string', message: '请输入金额',
                        }, {
                          required: true, message: '请输入金额',
                        }],
                      })(
                        <Input placeholder="请输入罚款金额" />,
                    )}
                    </FormItem>
                  </Col>
                </Row>);
              })
            }
            <Row style={{ marginTop: '2px' }}>
              <Col className="mgl16">
                <Button type="primary" onClick={this.addUndertakerInfo.bind(this)}>添加承担人信息</Button>
              </Col>
            </Row>
            <Row style={{ marginTop: '16px' }}>
              <Col className="textRight" sm={21}>
                <Button onClick={this.handleCancle.bind(this)}>取消</Button>
              </Col>
              <Col sm={1} />
              <Col className="textLeft" sm={2}>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
              </Col>
            </Row>
          </div> : ''
        }
        <Row style={{ marginTop: '16px' }}>
          <Col className="mgl16">
            <Button type="primary" onClick={this.handleAddMoreInfo.bind(this)}>添加罚单信息</Button>
          </Col>
        </Row>
        <Row style={{ paddingLeft: '16px', marginTop: '30px' }}>
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
    );
  }
}
function mapStateToProps({ finance }) {
  return {
    finance,
  };
}
export default connect(mapStateToProps)(Form.create()(PunishmentApply));
