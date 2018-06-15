/**
 * 采购|报废 -- 单号详情
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router';

import style from './purchase.less';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Operate from '../../../application/define/operate';
import { renderReplaceAmount } from '../../../application/define';

const [FormItem] = [Form.Item];

class PickRecord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 定义列表表头栏
      columns: (function (props) {
        const type = dot.get(props, 'materials.pickDetail.handle_type');  // 操作类型
        let list = [];
        switch (type) {
          case 8001:  // 采购
            return list = [{
              title: '申请城市',
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
              title: '当前库存量（件）',
              dataIndex: 'stock_amount',
              key: 'stock_amount',
            }, {
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '物资总金额（元）',
              dataIndex: 'money',
              key: 'money',
              render: (text) => {
                // 将数字转为金额格式
                return renderReplaceAmount(text);
              },
            }, {
              title: '紧急程度',
              dataIndex: 'emergency_degree',
              key: 'emergency_degree',
              render: (text) => {
                return (<span>
                  {aoaoBossTools.enumerationConversion(text)}
                </span>);
              },
            }];
            break;
          case 8002: // 报废
            return list = [{
              title: '申请城市',
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
              title: '历史采购数量',
              dataIndex: 'quantity_historical_purchases',
              key: 'quantity_historical_purchases',
            }, {
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '物资采购价（元）',
              dataIndex: 'purchase_price',
              key: 'purchase_price',
              render: (text) => {
                // 将数字转为金额格式
                return renderReplaceAmount(text);
              },
            }];
            break;
          case 8003:  // 报错
            return list = [{
              title: '申请城市',
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
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '实际物资数量（件）',
              dataIndex: 'real_procurement_amount',
              key: 'real_procurement_amount',
            }];
            break;
          default:
            return list = [{
              title: '申请城市',
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
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '实际物资数量（件）',
              dataIndex: 'real_procurement_amount',
              key: 'real_procurement_amount',
            }];
        }
      }(props)),
      // 获取详情
      detail: dot.get(props, 'materials.pickDetail'),
      // 数据源
      dataSource: dot.get(props, 'materials.pickDetail.material_list', []),
    };
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    const that = this;
    this.setState({
      columns: (function (nextProps) {
        const type = dot.get(nextProps, 'materials.pickDetail.handle_type');
        let list = [];
        switch (type) {
          case 8001:  // 采购
            return list = [{
              title: '申请城市',
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
              title: '当前库存量（件）',
              dataIndex: 'stock_amount',
              key: 'stock_amount',
            }, {
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '物资总金额（元）',
              dataIndex: 'money',
              key: 'money',
              render: (text) => {
                // 将数字转为金额格式
                return renderReplaceAmount(text);
              },
            }, {
              title: '紧急程度',
              dataIndex: 'emergency_degree',
              key: 'emergency_degree',
              render: (text) => {
                return (<span>
                  {aoaoBossTools.enumerationConversion(text)}
                </span>);
              },
            }];
          case 8002:  // 报废
            return list = [{
              title: '申请城市',
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
              title: '历史采购数量',
              dataIndex: 'quantity_historical_purchases',
              key: 'quantity_historical_purchases',
            }, {
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '物资采购价（元）',
              dataIndex: 'purchase_price',
              key: 'purchase_price',
              render: (text) => {
                // 将数字转为金额格式
                return renderReplaceAmount(text);
              },
            }];
            break;
          case 8003:  // 报错
            return list = [{
              title: '申请城市',
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
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '实际物资数量（件）',
              dataIndex: 'real_procurement_amount',
              key: 'real_procurement_amount',
            }];
            break;
          default:
            return list = [{
              title: '申请城市',
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
              title: '物资数量（件）',
              dataIndex: 'procurement_amount',
              key: 'procurement_amount',
            }, {
              title: '实际物资数量（件）',
              dataIndex: 'real_procurement_amount',
              key: 'real_procurement_amount',
            }];
        }
      }(nextProps)),
      detail: dot.get(nextProps, 'materials.pickDetail'),
      dataSource: dot.get(nextProps, 'materials.pickDetail.material_list'),
    });
  }

  // 判断权限
  whichPermission = (value) => {
    if (value == 9001) { // 采购待审核
      return Operate.canOperateMaterielPurchaseVerifyButton();
    }
    if (value == 9004) { // 报错待审核
      return Operate.canOperateMaterielPurchaseWrongVerifyButton();
    }
    if (value == 9007) { // 报废待审核
      return Operate.canOperateMaterielPurchaseVerifyButton();
    }
    return false;
  }

  // 驳回
  reject = () => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const { handle_type, _id } = detail;
    let flowState = '';
    switch (handle_type) {
      case 8001:  // 采购
        flowState = 9003;  // 采购单驳回
        break;
      case 8002:  // 报废
        flowState = 9009;  // 报废单驳回
        break;
      case 8003:  // 报错
        flowState = 9006;  // 报错单驳回
        break;
    }
    dispatch({
      type: 'materials/auditSingleE',
      payload: {
        order_id: _id,
        flow_state: flowState,
      },
    });
  };
  
  // 审核通过
  agree = () => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const { handle_type, _id } = detail;
    let flowState = '';
    switch (handle_type) {
      case 8001:  // 采购
        flowState = 9002;  // 采购审核通过
        break;
      case 8002:  // 报废
        flowState = 9008;  // 报废单审核通过
        break;
      case 8003:  // 报错
        flowState = 9005;  // 报错单审核通过
        break;
    }
    dispatch({
      type: 'materials/auditSingleE',
      payload: {
        order_id: _id,
        flow_state: flowState,
      },
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // 8001 采购
    const label = dot.get(this, 'state.detail.handle_type') === 8001 ? '采购总品数（种）' : '报废总品数（种）';
    return (<div className="mgt16">
      <Row className={style.purchase}>
        <Row className={style.top}>
          <Col sm={12}>单号:{dot.get(this, 'state.detail.order_id')}</Col>
          <Col sm={12} className="textRight">创建时间:{aoaoBossTools.prctoMinute(dot.get(this, 'state.detail.created_at'), 3)}</Col>
        </Row>
        <Col className={`ftw7 ft20 ${style.border}`}>
          <h4 className="mgl16 mgt16">基本信息</h4>
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
          <FormItem {...formItemLayout} label={label} className="ftw6">
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
            {/*  将数字转为金额格式 */}
            <span>{renderReplaceAmount(dot.get(this, 'state.detail.total_money'))}</span>
          </FormItem>
        </Col>
        <div>
          {
            // 8003 报错
            dot.get(this, 'state.detail.handle_type') == 8003 ?
              <div>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'实际总品数（种）'} className="ftw6">
                    <span>{dot.get(this, 'state.detail.real_item_amount')}</span>
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'实际总数量（件）'} className="ftw6">
                    <span>{dot.get(this, 'state.detail.real_handle_amount')}</span>
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'实际总金额（元）'} className="ftw6">
                    {/* 将数字转为金额格式 */}
                    <span>{renderReplaceAmount(dot.get(this, 'state.detail.real_total_money'))}</span>
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'采购创建时间'} className="ftw6">
                    <span>{ aoaoBossTools.prctoMinute(dot.get(this, 'state.detail.created_at'), 0)}</span>
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'报错人'} className="ftw6">
                    <span>{dot.get(this, 'state.detail.error_account_name')}</span>
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem {...formItemLayout} label={'报错人联系方式'} className="ftw6">
                    <span>{dot.get(this, 'state.detail.error_account_phone')}</span>
                  </FormItem>
                </Col>
              </div> : ''
            }
        </div>
        <Col className={`ftw7 ft20 ${style.border}`}>
          <h4 className="mgl16 mgt16">物资清单</h4>
        </Col>
        <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
        {
          // 8001 采购
          dot.get(this, 'state.detail.handle_type') === 8001 && dot.get(this, 'state.detail.procurement_reason') ? <p
            style={{ margin: '20px' }}
          >
            原因：{dot.get(this, 'state.detail.procurement_reason')}
          </p> : ''
        }
      </Row>
      <Row type="flex" justify="center">
        <Col className="mgt16">
          <Button className="mgl16"><Link to="Materiel/Purchase/Log">返回</Link></Button>
          {
            this.whichPermission(dot.get(this, 'state.detail.flow_state')) == true ?
              <span>
                <Button className="mgl16" onClick={this.reject}>驳回</Button>
                <Button type="primary" className="mgl16" onClick={this.agree}>同意</Button>
              </span> : ''
          }
        </Col>
      </Row>
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}

export default connect(mapStateToProps)(PickRecord);
