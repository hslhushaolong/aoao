/**
 * 采购|报废 -- 采购 | 报废记录
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker, Badge, Pagination, Popconfirm } from 'antd';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Operate from '../../../application/define/operate';

const { RangePicker } = DatePicker;
const [FormItem, Option] = [Form.Item, Select.Option];

class PickRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: dot.get(props, 'materials.pickOrderList._meta.result_count') || 0,  // 总量
      cityList: [],  // 城市列表
      page: 1,  // 默认页码
      current: 1,  // 默认的高亮页码
      pageSize: 30,  // 每页数据量
      searchValue: {},  // 搜索条件
      columns: [{
        title: '单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '城市',
        dataIndex: 'city_name_joint',
        key: 'city_name_joint',
      }, {
        title: '操作类型',
        dataIndex: 'handle_type',
        key: 'handle_type',
        render: (text) => {
          return (<span>
            {aoaoBossTools.enumerationConversion(text)}
          </span>);
        },
      }, {
        title: '操作数量',
        dataIndex: 'handle_amount',
        key: 'handle_amount',
      }, {
        title: '申请创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return (<span>
            {aoaoBossTools.prctoMinute(text, 3)}
          </span>);
        },
      }, {
        title: '状态',
        dataIndex: 'flow_state',
        key: 'flow_state',
        render: (text, record) => {
          let status = 'success';
          // 9002 采购审核通过 、9005 报错审核通过、9008 报废审核通过、9014 退货申请审核通过
          const success = [9002, 9005, 9008, 9014];

          // 9003 采购审核不通过 、9006 报错审核不通过 、9009 报废审核不通过、9015 退货申请审核不通过
          const error = [9003, 9006, 9009, 9015];
          if (success.indexOf(text) != -1) {
            status = 'success';
          } else if (error.indexOf(text) != -1) {
            status = 'error';
          } else {
            status = 'warning';
          }
          return (<span>
            <Badge status={status} text={aoaoBossTools.enumerationConversion(text)} />
          </span>);
        },
      }, {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          return (
            <span>
              <span><Link
                to={`Materiel/Purchase/Detail?id=${record._id}`}
                className="mgl8 systemTextColor pointer"
              >查看详情</Link></span>
              {
                // 报错按钮(城市经理，城市助理)
                Operate.canOperateMaterielPurchaseErrorVerifyButton() == true && record.flow_state === 9002 ?
                  <span><Link
                    to={`Materiel/Purchase/ErrorOrder?id=${record._id}`}
                    className="mgl8 systemTextColor pointer"
                  >报错</Link></span> : ''
              }
              {
                // 同意采购及报错以及报废审批 (coo,采购)
                this.whichPermission(record.flow_state) == true ?
                  <span>
                    <span>
                      <Popconfirm title="确认通过审批?" onConfirm={this.agree.bind(this, record)} okText="确认" cancelText="取消">
                        <Link className="mgl8 systemTextColor pointer" href="#">同意</Link>
                      </Popconfirm>
                    </span>
                    <span>
                      <Popconfirm title="确认驳回审批?" onConfirm={this.reject.bind(this, record)} okText="确认" cancelText="取消">
                        <Link className="mgl8 systemTextColor pointer" href="#">驳回</Link>
                      </Popconfirm>
                    </span>
                  </span>
                  : ''
              }
            </span>
          );
        },
      }],
      dataSource: dot.get(props, 'materials.pickOrderList.data') || [],  // 采购 | 报废记录数据
    };
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    this.setState({
      total: dot.get(nextProps, 'materials.pickOrderList._meta.result_count') || 0,
      dataSource: dot.get(nextProps, 'materials.pickOrderList.data') || [],
    });
  }

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
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

  // 获取城市列表
  platformChange = (data) => {
    this.props.form.resetFields(['city_spelling_list']);
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 查询
  handleSearch = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        if (values.platform_code_list) {
          values.platform_code_list = [`${values.platform_code_list}`];
        }
        if (values.order_id) {
          values.order_id = values.order_id.toString();
        }
        if (values.date && Object.values(values.date).length) {
          const startDate = aoaoBossTools.prctoMinute(values.date[0]._d, 0).substr(0, 10);
          const endDate = aoaoBossTools.prctoMinute(values.date[1]._d, 0).substr(0, 10);
          values.start_date = startDate;
          values.end_date = endDate;
        }
        delete values.date;

        // 判断字段id是否是空，为空则不传递该参数
        if (values.order_id === '') {
          delete values.order_id;
        }

        this.setState({
          searchValue: values,
          current: 1,
        });
        values.limit = this.state.pageSize;
        values.page = this.state.page;
        dispatch({
          type: 'materials/getPickOrderListE',
          payload: values,
        });
      }
    });
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
  };

  // 驳回
  reject(record) {
    const { dispatch } = this.props;
    const { handle_type, _id } = record;
    let flowState = 9003;
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
  }

  // 审核通过
  agree(record) {
    const { dispatch } = this.props;
    const { handle_type, _id } = record;
    let flowState = '';
    // 判断操作类型
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
      default :
        break;
    }

    dispatch({
      type: 'materials/auditSingleE',
      payload: {
        order_id: _id,
        flow_state: flowState,
      },
    });
  }

  // 分页
  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    this.setState({
      current: page,
      pageSize,
    });
    const value = this.state.searchValue;
    value.limit = pageSize;
    value.page = page;
    dispatch({
      type: 'materials/getPickOrderListE',
      payload: value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={'单号'}>
              {getFieldDecorator('order_id', {
                rules: [{ required: false, message: '请输入单号', trigger: 'onBlur', type: 'string' }],
              })(
                <Input placeholder="请输入单号" />,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={'平台'}>
              {getFieldDecorator('platform_code_list', {
                rules: [{
                  type: 'string', message: '请选择平台',
                }, {
                  required: false, message: '请选择平台',
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
              {getFieldDecorator('city_spelling_list', {
                rules: [{
                  type: 'array', message: '请选择城市',
                }, {
                  required: false, message: '请选择城市',
                }],
              })(
                <Select
                  placeholder="请选择城市" onChange={this.handleCityChange}
                  mode="multiple"
                  allowClear
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
            <FormItem label="申请状态" {...formItemLayout}>
              {getFieldDecorator('flow_state_list', {
                rules: [{
                  type: 'array', message: '请选择需要查询的状态',
                }, {
                  required: false, message: '请选择需要查询的状态',
                }],
              })(
                <Select placeholder="请选择需要查询的状态" mode="multiple" allowClear>
                  <Option value={'9001'}>采购待审核</Option>
                  <Option value={'9002'}>采购审核通过</Option>
                  <Option value={'9003'}>采购审核不通过</Option>
                  <Option value={'9004'}>报错待审核</Option>
                  <Option value={'9005'}>报错审核通过</Option>
                  <Option value={'9006'}>报错审核不通过</Option>
                  <Option value={'9007'}>报废待审核</Option>
                  <Option value={'9008'}>报废审核通过</Option>
                  <Option value={'9009'}>报废审核不通过</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label="选择日期" {...formItemLayout}>
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
              })(
                <RangePicker format={'YYYY-MM-DD'} disabledDate={this.disableDateOfMonth} />,
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <Col sm={3} />
            <Button type="primary" className={'mgr8'} onClick={this.handleSearch}>查询</Button>
            <Button className={'mgr8'} onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
      <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      <div className="fltr">
        {
          this.state.total > 0 ?
            <Pagination
              onChange={this.pageChange}
              className="mgt8"
              total={this.state.total}
              showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
              pageSize={this.state.pageSize}
              current={this.state.current}
            />
            : ''
        }
      </div>
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}
export default connect(mapStateToProps)(Form.create()(PickRecord));
