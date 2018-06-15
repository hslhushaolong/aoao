/**
 * 采购|报废 -- 采购单报错
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Row, Col, Form, Button, Modal, InputNumber } from 'antd';
import { connect } from 'dva';

import style from './purchase.less';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import { renderReplaceAmount } from '../../../application/define';

const [FormItem] = [Form.Item];

class ErrorOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 对话框可见性
      type: '8001',  // 默认为采购
      collectTotal: '',  // 总量
      collectMoney: '',  // 总额
      title: '提示',  // 消息提示
      detail: dot.get(props, 'materials.pickDetail'),  // 详情
      columns: [{
        title: '操作城市',
        dataIndex: 'city_name_joint',
        key: 'city_name_joint',
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
        title: '采购数量（件）',
        dataIndex: 'procurement_amount',
        key: 'procurement_amount',
      }, {
        title: '实收数量（件）',
        dataIndex: 'real_procurement_amount',
        key: 'real_procurement_amount',
        render: (text, record, index) => {
          return (<InputNumber min={0} defaultValue={record.procurement_amount} onChange={this.handleNumberChange.bind(this, index)} />);
        },
      }],
      dataSource: dot.get(props, 'materials.pickDetail.material_list') || [],
    };
  }
  // 清空上次的数据
  componentDidMount() {
    this.props.dispatch({
      type: 'materials/removeErrorMaterialListR',
    });
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    this.setState({
      detail: dot.get(nextProps, 'materials.pickDetail'),
      dataSource: dot.get(nextProps, 'materials.pickDetail.material_list') || [],
    });
  }

  // 数量变化
  handleNumberChange(index, value) {
    const { dataSource } = this.state;
    dataSource[index].real_procurement_amount = value;
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
      if (!(item.hasOwnProperty('real_procurement_amount'))) {
        item.real_procurement_amount = item.procurement_amount;
      }
      // 总额等于购买单价乘于实际采购数量
      if (item.hasOwnProperty('real_procurement_amount')) {
        money += item.purchase_price * item.real_procurement_amount;
        total += item.real_procurement_amount;
        realDataSource.push(item);
      }
    });
    this.setState({
      visible: true,
      collectMoney: money,
      collectTotal: total,
    });
  };

  // 单子报错
  handleOk = () => {
    const { form, dispatch } = this.props;
    this.setState({
      visible: false,
    });
    form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        dispatch({
          type: 'materials/editOrderToErrorListE',
          payload: {
            order_id: dot.get(this, 'state.detail.order_id'),
            material_list: this.state.dataSource,
          },
        });
      }
    });
  };

  // 对话框隐藏
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (<div className="mgt16">
      <Row className={style.purchase}>
        <Row className={style.top}>
          <Col sm={12}>单号:{dot.get(this, 'state.detail.order_id')}</Col>
        </Row>
        <Col className={`ftw7 ft20 ${style.border}`}>
          <h3 className="mgl16 mgt16">操作信息</h3>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'类型'} className="ftw6">
            <span>{aoaoBossTools.enumerationConversion(dot.get(this, 'state.detail.handle_type'))}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'申请人'} className="ftw6">
            <span>{dot.get(this, 'state.detail.applicant_name')}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'申请人联系方式'} className="ftw6">
            <span>{dot.get(this, 'state.detail.applicant_phone')}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'采购总品数（种）'} className="ftw6">
            <span>{dot.get(this, 'state.detail.item_amount')}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'申请总数量（件）'} className="ftw6">
            <span>{dot.get(this, 'state.detail.handle_amount')}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'申请总金额（元）'} className="ftw6">
            <span>{renderReplaceAmount(dot.get(this, 'state.detail.total_money'))}</span>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem {...formItemLayout} label={'采购创建时间'} className="ftw6">
            <span>{ aoaoBossTools.prctoMinute(dot.get(this, 'state.detail.created_at'), 0)}</span>
          </FormItem>
        </Col>
        <Row>
          <Col className={`ftw7 ft20 ${style.border}`} sm={24}>
            <h3 className="mgl16 mgt16">物资清单</h3>
          </Col>
        </Row>
        <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      </Row>
      {
        // 数据源的数据量必须大于0条 才显示提交按钮
        dot.get(this, 'state.dataSource', []).length > 0 ? <Row type="flex" justify="center">
          <Col className="mgt16">
            <Button type="primary" className="mgl16" onClick={this.handleSubmit}>提交</Button>
          </Col>
        </Row> : ''
      }
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row type="flex" justify="center">
          <h3 className={'textCenter'}>请核对采购报错汇总信息</h3>
        </Row>
        <p className="mgt8">物资总品数（种）：{dot.get(this, 'state.detail.item_amount')}</p>
        <p className="mgt8">物资总数量（件）：{this.state.collectTotal}</p>
        <p className="mgt8">物资总金额（元）：{this.state.collectMoney}</p>
      </Modal>
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}

export default connect(mapStateToProps)(Form.create()(ErrorOrder));
