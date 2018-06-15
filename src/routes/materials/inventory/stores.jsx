/**
 * 库存信息-查看库存
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import moment from 'moment';
import { Form, Row, Col, Select, Button, DatePicker, message } from 'antd';
import Table from './../../../components/table';
import Operate from '../../../application/define/operate';

import aoaoBossTools from './../../../utils/util';
import { authorize } from '../../../application';

const { RangePicker } = DatePicker;
const [FormItem, Option] = [Form.Item, Select.Option];

class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],  // 城市
      columns: [{
        title: '品目ID',
        dataIndex: 'material_item_id',
        key: 'material_item_id',
      },
      {
        title: '物资名称',
        dataIndex: 'material_name',
        key: 'material_name',
      }, {
        title: '物资规格',
        dataIndex: 'material_type',
        key: 'material_type',
        render: (text) => {
          return text == '' ? '--' : text;
        },
      }, {
        title: '期初库存量（件）',
        dataIndex: 'begin_stock_amount',
        key: 'begin_stock_amount',
      }, {
        title: '期末库存量（件）',
        dataIndex: 'end_stock_amount',
        key: 'end_stock_amount',
      }, {
        title: '操作',
        dataIndex: '',
        key: 'id',
        render: (text, record) => {
          return (
            <div>
              {Operate.canOperateMaterielStoresLogDetailButton() ? <span
                className="systemTextColor pointer"
                onClick={this.showDetail.bind(this, record)}
              >变动明细</span> : ''}</div>
          );
        },
      }],
      // 物资库存数据
      dataSource: dot.get(props, 'materials.materialsList.material_stock_list') || [],
    };
  }

  // 清除查看库存的数据
  componentWillMount() {
    this.props.dispatch({
      type: 'materials/removeMaterialStockListR',
    });
  }

  // 接受父级数据
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'materials.materialsList.material_stock_list') || [],
    });
  }

  // 变动明细
  showDetail(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/getChangeDetailOfStoreE',
      payload: {
        platform_code: record.platform_code,
        city_spelling: record.city_spelling,
        start_date: record.start_date,
        end_date: record.end_date,
        material_item_id: record.material_item_id,
      },
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

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 收集查询条件 查询数据
  handleSubmit = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        if (values.platform_code === undefined) {
          return message.warning('请选择平台');
        }

        if (values.city_spelling === undefined) {
          return message.warning('请选择城市');
        }

        if (values.date && Object.values(values.date).length) {
          const startDate = aoaoBossTools.prctoMinute(values.date[0]._d, 0).substr(0, 10);
          const endDate = aoaoBossTools.prctoMinute(values.date[1]._d, 0).substr(0, 10);
          values.start_date = startDate;
          values.end_date = endDate;
        } else {
          message.warning('请选择日期');
          return;
        }
        delete values.date;
        dispatch({ type: 'materials/getStoreListE', payload: values });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const platformList = aoaoBossTools.getAllAreaFromPermission('platform_code');
    const cityList = this.state.cityList;
    return (
      <div className="mgt8">
        <Form>
          <Row>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'平台'}>
                {getFieldDecorator('platform_code', {
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
                      platformList.map((item, index) => {
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
                    required: false, message: '请选择城市',
                  }],
                })(
                  <Select placeholder="请选择城市" allowClear>
                    {
                      cityList && cityList.map((item, index) => {
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
              <FormItem label="选择日期" {...formItemLayout}>
                {getFieldDecorator('date', {
                  rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
                  initialValue: [moment(aoaoBossTools.GetDateStr(0), 'YYYY-MM-DD'), moment(aoaoBossTools.GetDateStr(0), 'YYYY-MM-DD')],
                })(
                  <RangePicker
                    format={'YYYY-MM-DD'}
                    disabledDate={this.disableDateOfMonth}
                  />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <Col sm={3} />
              <Button type="primary" className={'mgr8'} onClick={this.handleSubmit}>查询</Button>
            </Col>
          </Row>
        </Form>
        <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      </div>
    );
  }
}

const mapStateToProps = ({ materials }) => {
  return { materials };
};

export default connect(mapStateToProps)(Form.create()(Store));
