/**
 * 分发退货记录 -- 新建物资分发
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, message, InputNumber, Modal } from 'antd';

import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import { Position, renderReplaceAmount } from '../../../application/define';
import Modules from '../../../application/define/modules';

const [FormItem, Option] = [Form.Item, Select.Option];

class PurchaseOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 对话框默认不可见
      type: '8001',  // 默认类型为采购
      knightId: '',  // 骑士id
      knightList: dot.get(props, 'materials.knightList.data') || [],  // 骑士列表
      collectTotal: '',  // 总量
      collectMoney: '',  // 总额
      collectKind: '',  // 总共种类
      title: '提示',  // 消息提示
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
        title: '当前库存数量（件）',
        dataIndex: 'stock_amount',
        key: 'stock_amount',
      }, {
        title: '分发数量（件）',
        dataIndex: 'procurement_amount',
        key: 'procurement_amount',
        render: (text, record, index) => {
          return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)} />);
        },
      }, {
        title: '付款方式',
        dataIndex: 'payment_way',
        key: 'payment_way',
        width: '300px',
        render: (text, record, index) => {
          return (
            <Select defaultValue="301" onChange={this.levelChange.bind(this, index)} allowClear>
              <Option value="301">一次性</Option>
              <Option value="302">月付</Option>
              <Option value="303">押金</Option>
            </Select>);
        },
      }],
      dataSource: dot.get(props, 'materials.itemModules.material_list') || [],
      realDataSource: [],  // 物资列表
      platform: '',       // 选择的平台
      cityList: [],       // 城市列表
      city: '',       // 选择的城市
      areaList: [],  // 商圈列表
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'materials/removeMaterialListR',
    });
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'materials.itemModules.material_list', []),
      knightList: dot.get(nextProps, 'materials.knightList.data', []),
    });
  }

  // 骑士改变
  knightChange = (value) => {
    this.setState({
      knightId: value,
    });
  };

  // 查询模板
  handleSearch = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        dispatch({
          type: 'materials/createBaseItemListE',
          payload: {
            platform_code: values.platform_code,
            city_spelling: values.city_spelling,
          },
        });
      }
    });
  };

  // 数量变化
  handleNumberChange(index, value) {
    const { dataSource } = this.state;
    dataSource[index].distribute_amount = value;
    this.setState({
      dataSource,
    });
  }

  // 付款方式变化
  levelChange(index, value) {
    const { dataSource } = this.state;
    const data = Number(value);
    dataSource[index].payment_way = data;
    this.setState({
      dataSource,
    });
  }

  // 提交添加的采购或者报废单
  handleSubmit = () => {
    const { knightId } = this.state;
    let traverseFlag = true;

    if (knightId == '') {
      message.error('请选择一名骑士');
    } else {
      let money = 0;
      let total = 0;
      let kind = 0;
      const { dataSource } = this.state;
      const realDataSource = [];
      dataSource.forEach((item, index) => {
        if (item.hasOwnProperty('distribute_amount') && item.distribute_amount > item.stock_amount) {
          message.error('分发数量不能大于库存数量');
          traverseFlag = false;
          return false;
        }
        if (item.hasOwnProperty('distribute_amount')) {
          switch (item.payment_way) {
            case 301:  // 一次性
              money += item.purchase_price * item.distribute_amount;
              break;
            case 302:  // 月付
              money += item.monthly_fee * item.distribute_amount;
              break;
            case 303:  // 押金
              money += item.deposit * item.distribute_amount;
              break;
            default:
              // 默认情况，总额为采购单价乘上分发数量
              money += item.purchase_price * item.distribute_amount;
              break;
          }
          if (item.distribute_amount > 0) {
            kind++;
          }
          total += item.distribute_amount;
          realDataSource.push(item);
        }
      });
      if (!traverseFlag) {
        return false;
      }
      this.setState({
        visible: true,
        collectMoney: money,
        collectTotal: total,
        collectKind: kind,
      });
    }
  };

// 创建单子
  handleCreateOk = () => {
    this.setState({
      visible: false,
    });
    if (this.state.collectTotal === 0) {
      message.error('未选择分发数量');
      return false;
    }
    const { dispatch } = this.props;
    const { dataSource, knightId } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        if (values.platform_code_list) {
          delete values.platform_code_list;
        }
        if (values.city_spelling_list) {
          delete values.city_spelling_list;
        }
        for (let i = 0; i < dataSource.length; i++) {
          if (dataSource[i].hasOwnProperty('payment_way') == false) {
            dataSource[i].payment_way = 301;
          }
        }
        dispatch({
          type: 'materials/createDistributeOrderE',
          payload: {
            staff_id: knightId,
            city_spelling: this.state.city,
            material_list: dataSource,
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

  // 选择平台,获取城市列表
  platformChange = (data) => {
    // data 是选择的平台
    this.props.form.resetFields(['city_spelling_list', 'biz_district_id_list', 'staff_id']);
    const { form } = this.props;
    const regionList = aoaoBossTools.readDataFromLocal(1, 'region');
    let cityList = [];
    regionList.forEach((item, index) => {
      if (item.platform_code === data) {
        cityList = item.city_list;
      }
    });
    this.setState({
      platform: data,
      cityList,
    });
  };

  // 选取城市
  handleCityChange = (val) => {
    this.props.form.resetFields(['biz_district_id_list', 'staff_id']);
    if (val) {
      this.props.dispatch({
        type: 'materials/createBaseItemListE',
        payload: {
          city_spelling: val,
          platform_code: this.state.platform,
          option: true,
        },
      });
      this.setState({
        city: val,
      });
      // 从选取的城市中获取商圈
      this.getAreaList(val);
    }
  }

	// 获取商圈
  getAreaList=(val) => {
    if (val) {
      let areaList = [];
      dot.get(this, 'state.cityList', []).forEach((item, index) => {
        if (item.city_spelling === val) {
          areaList = item.biz_district_list;
        }
      });
      this.setState({
        areaList,
      });
    }
  }

  // 选择商圈,查询骑士列表
  handleSearchKnight = (value) => {
    this.props.form.resetFields(['staff_id']);
    const { dispatch } = this.props;
    if (value) {
      dispatch({
        type: 'materials/getKnightListE',
        payload: {
          state: 50,  // 在职骑士
          position_id_list: [Position.postmanManager, Position.postman],
          biz_district_id_list: [value],
          limit: 1000,
          page: 1,
          permission_id: Modules.ModuleEmployeeSearch.id,
        },
      });
    }
  };

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return (dataList.map((item, index) => {
      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
    }));
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const areaList = this.state.areaList;
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem label="平台" {...formItemLayout}>
              {getFieldDecorator('platform_code_list', {
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
                    this.createPlatformList()
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label="城市" {...formItemLayout}>
              {getFieldDecorator('city_spelling_list', {
                rules: [{
                  type: 'string', message: '请选择城市',
                }, {
                  required: true, message: '请选择城市',
                }],
              })(
                <Select
                  placeholder="请选择城市" onChange={this.handleCityChange} allowClear
                >
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
            <FormItem label="商圈" {...formItemLayout}>
              {getFieldDecorator('biz_district_id_list', {
                rules: [{
                  type: 'string', message: '请选择商圈',
                }, {
                  required: true, message: '请选择商圈',
                }],
              })(
                <Select
                  placeholder="请选择商圈"
                  onChange={this.handleSearchKnight}
                  allowClear
                >
                  {
                    areaList.map((item, index) => {
                      return (<Option
                        value={item.biz_district_id}
                        key={index}
                      >{item.biz_district_name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label="骑士" {...formItemLayout}>
              {getFieldDecorator('staff_id', {
                rules: [{
                  type: 'string', message: '请选择骑士',
                }, {
                  required: true, message: '请选择骑士',
                }],
              })(
                <Select
                  placeholder="请选择骑士" onChange={this.knightChange}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {
                    dot.get(this, 'state.knightList', []).map((item, index) => {
                      return (<Option value={item._id} key={index}>{`${item.name}-${item.phone}`}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      {
        dot.get(this, 'state.dataSource', []).length > 0 ? <Form className="mgt16">
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
        onOk={this.handleCreateOk}
        onCancel={this.handleCancel}
      >
        <Row type="flex" justify="center">
          <h3 className={'textCenter'}>请核对汇总信息</h3>
        </Row>
        <p className="mgt8">物资总品数（种）：{this.state.collectKind}</p>
        <p className="mgt8">物资总数量（件）：{this.state.collectTotal}</p>
        <p className="mgt8">支付金额（元）：{renderReplaceAmount(this.state.collectMoney)}</p>
      </Modal>
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}

export default connect(mapStateToProps)(Form.create()(PurchaseOrder));
