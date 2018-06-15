/**
 * 采购|报废 - 新建采购|报废单
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, InputNumber, Modal, message } from 'antd';

import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import { renderReplaceAmount } from '../../../application/define';

const [FormItem, Option] = [Form.Item, Select.Option];

class PurchaseOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 对话框属性
      type: '8001',  // 默认采购
      collectTotal: '',  // 总量
      collectMoney: '',  // 总额
      modalContent: '',  // 对话框内容
      title: '提示',  // 提示
      cityList: [],  // 城市列表
      columns: [{
        title: '品目ID',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '物资名称',
        dataIndex: 'material_name',
        key: 'material_name',
      }, {
        title: '物资规格',
        dataIndex: 'material_type',
        key: 'material_type',
      }, {
        title: '物资采购价（元）',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        render: (text) => {
          // 将数字转为金额格式
          return renderReplaceAmount(text);
        },
      }, {
        title: '当前库存数量（件）',
        dataIndex: 'stock_amount',
        key: 'stock_amount',
      }, {
        title: '采购数量（件）',
        dataIndex: 'procurement_amount',
        key: 'procurement_amount',
        render: (text, record, index) => {
          return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)} />);
        },
      }, {
        title: '紧急程度',
        dataIndex: 'emergency_degree',
        key: 'emergency_degree',
        render: (text, record, index) => {
          return (
            <Select allowClear defaultValue="601" onChange={this.levelChange.bind(this, index)}>
              <Option value="601">紧急</Option>
              <Option value="602">一般</Option>
              <Option value="603">不急</Option>
            </Select>);
        },
      }],
      dataSource: dot.get(props, 'materials.itemModules.material_list') || [],
      realDataSource: [],
    };
  }

  // 每次进入页面清空上次的数据
  componentDidMount() {
    this.props.dispatch({
      type: 'materials/removeMaterialListR',
    });
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    const data = dot.get(nextProps, 'materials.itemModules.material_list', []);
    this.setState({
      dataSource: data,
    });
  }

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 获取城市列表
  platformChange = (data) => {
    this.props.form.resetFields(['city_spelling']);
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 更改单子类型
  orderTypeChange = (value) => {
    if (value === '8001') {  // 采购
      const columns = [{
        title: '品目ID',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '物资名称',
        dataIndex: 'material_name',
        key: 'material_name',
      }, {
        title: '物资规格',
        dataIndex: 'material_type',
        key: 'material_type',
      }, {
        title: '物资采购价（元）',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        render: (text) => {
          // 将数字转为金额格式
          return renderReplaceAmount(text);
        },
      }, {
        title: '当前库存数量（件）',
        dataIndex: 'stock_amount',
        key: 'stock_amount',
      }, {
        title: '采购数量（件）',
        dataIndex: 'procurement_amount',
        key: 'procurement_amount',
        render: (text, record, index) => {
          return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)} />);
        },
      }, {
        title: '紧急程度',
        dataIndex: 'emergency_degree',
        key: 'emergency_degree',
        render: (text, record, index) => {
          return (
            <Select allowClear defaultValue="601" onChange={this.levelChange.bind(this, index)}>
              <Option value="601">紧急</Option>
              <Option value="602">一般</Option>
              <Option value="603">不急</Option>
            </Select>);
        },
      }];
      this.setState({
        columns,
        type: value,
      });
    } else if (value === '8002') {  // 报废
      const columns = [{
        title: '品目ID',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '物资名称',
        dataIndex: 'material_name',
        key: 'material_name',
      }, {
        title: '物资规格',
        dataIndex: 'material_type',
        key: 'material_type',
      }, {
        title: '物资采购价（元）',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        render: (text) => {
          // 将数字转为金额格式
          return renderReplaceAmount(text);
        },
      }, {
        title: '历史采购数量',
        dataIndex: 'quantity_historical_purchases',
        key: 'quantity_historical_purchases',
      }, {
        title: '库存数量',
        dataIndex: 'stock_amount',
        key: 'stock_amount',
      }, {
        title: '报废数量（件）',
        dataIndex: 'procurement_amount',
        key: 'procurement_amount',
        render: (text, record, index) => {
          return (<span>
            <InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)} />
          </span>);
        },
      }];
      this.setState({
        columns,
        type: value,
      });
    }
    this.props.dispatch({
      type: 'materials/removeMaterialListR',
    });
  };

  // 查询模板
  handleSearch = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        let payload = {
          platform_code: values.platform_code,
        };

        // 报废
        if (values.handle_type === '8002') {
          payload.option = true;
          payload.city_spelling = values.city_spelling;
        }
        if (values.handle_type === '8001') {
          payload.city_spelling = values.city_spelling;
        }
        dispatch({
          type: 'materials/createBaseItemListE',
          payload,
        });
      }
    });
  };

  // 数量变化
  handleNumberChange(index, value) {
    const { dataSource, type } = this.state;
    dataSource[index].procurement_amount = value || 0;
    const historyAmount = dataSource[index].quantity_historical_purchases;
    if (value > historyAmount && type === '8002') {  // 报废
      message.error('报废数不能大于历史采购数量', 1);
    }
    this.setState({
      dataSource,
    });
  }

  // 紧急程度变化
  levelChange(index, value) {
    const { dataSource } = this.state;
    const data = Number(value);
    dataSource[index].emergency_degree = data;
    this.setState({
      dataSource,
    });
  }

  // 提交添加的采购或者报废单
  handleSubmit = () => {
    let money = 0;
    let total = 0;
    const { dataSource } = this.state;
    const realDataSource = [];
    dataSource.forEach((item, index) => {
      if (item.hasOwnProperty('procurement_amount')) {
        money += item.purchase_price * item.procurement_amount;
        total += item.procurement_amount;
        realDataSource.push(item);
      }
    });
    this.setState({
      visible: true,
      collectMoney: money,
      collectTotal: total,
    });

    // 判断单子类型去修改汇总信息模板
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        if (values.handle_type == '8002') {  // 报废
          this.setState({
            modalContent: '',
          });
        } else {
          this.setState({
            modalContent: <p className="mgt8">物资总金额：{money}</p>,
          });
        }
      }
    });
  };

  // 创建单子
  handleOk = () => {
    const { form, dispatch } = this.props;
    this.setState({
      visible: false,
    });
    if (this.state.collectTotal === 0) {
      // 判断类型是否为采购
      const err = this.state.type === '8001' ? '您未采购任何物资' : '您未报废任何物资';
      message.error(err);
      return;
    }
    form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        // 赋值初始化紧急程度
        dot.get(this, 'state.dataSource', []).forEach((item, index) => {
          if (item.hasOwnProperty('emergency_degree') == false) {
            item.emergency_degree = 601;  // 紧急程度设置为紧急
          }
        });
        dispatch({
          type: 'materials/createNewOrderE',
          payload: {
            handle_type: Number(values.handle_type),
            platform_code: values.platform_code,
            city_spelling: values.city_spelling,
            material_list: this.state.dataSource,
            procurement_reason: values.procurement_reason,
            return_money: values.return_money,
          },
        });
        this.setState({
          dataSource: [],
        });
      }
    });
  };

  // 返回
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={'平台'}>
              {getFieldDecorator('platform_code', {
                rules: [{
                  type: 'string', message: '请选择平台',
                }, {
                  required: true, message: '请选择平台',
                }],
              })(
                <Select
                  placeholder="请选择平台"
                  onChange={this.platformChange}
                  allowClear
                >
                  {
                    this.createPlatformList().map((item, index) => {
                      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label="城市" {...formItemLayout}>
              {getFieldDecorator('city_spelling', {
                rules: [{
                  type: 'string', message: '请选择城市',
                }, {
                  required: true, message: '请选择城市',
                }],
              })(
                <Select placeholder="请选择城市" allowClear>
                  {
                    dot.get(this, 'state.cityList', []).map((item, index) => {
                      return (<Option
                        value={item.city_spelling}
                        key={index}
                      >{item.city_name_joint}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label="操作类型" {...formItemLayout}>
              {getFieldDecorator('handle_type', {
                rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'string' }],
                initialValue: '8001',
              })(
                <Select allowClear placeholder="请选择城市" onChange={this.orderTypeChange}>
                  <Option value="8001">采购</Option>
                  <Option value="8002">报废</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <Col sm={3} />
            <Button type="primary" className={'mgr8'} onClick={this.handleSearch}>查询</Button>
          </Col>
        </Row>
      </Form>
      <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      {
        dot.get(this, 'state.dataSource', []).length > 0 ? <Form className="mgt16">
          <Row>
            {
              this.state.type == '8001' ? <Col sm={6}>
                <FormItem {...formItemLayout} label={'原因'}>
                  {getFieldDecorator('procurement_reason', {
                    rules: [{ required: false, message: '请输采购原因', trigger: 'onBlur', type: 'string' }],
                  })(
                    <textarea
                      style={{ width: '100%', height: 100 }} placeholder="请输采购原因备注内容"
                      disabled={this.state.flag}
                    />,
                  )}
                </FormItem>
              </Col> :
              <Col sm={8}>
                <FormItem {...formItemLayout} label={'回收金额 (元)'}>
                  {getFieldDecorator('procurement_reason', {
                    rules: [{ required: false, message: '请输入回收金额', trigger: 'onBlur', type: 'string' }],
                  })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
            }
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Col>
          </Row>
        </Form> : ''
      }
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row type="flex" justify="center">
          <h3 className={'textCenter'}>请核对汇总信息</h3>
        </Row>
        <p className="mgt8">物资总数量：{this.state.collectTotal}</p>
        {this.state.modalContent}
      </Modal>
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}

export default connect(mapStateToProps)(Form.create()(PurchaseOrder));
