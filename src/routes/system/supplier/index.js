/**
 * 供应商管理模块
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import moment from 'moment';
import { connect } from 'dva';
import {
  Select,
  Form,
  Button,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import TableModel from './../../../components/table';
import { supplierState } from './define';
import Modules from '../../../application/define/modules';
import { EINVAL } from 'constants';

const [FormItem,
  Option] = [Form.Item, Select.Option];

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,  // 数据总量
      page: 1, // 默认页码
      current: 1, // 默认的高亮页码
      pageSize: 30,  // 每页显示条数
      searchValue: '',  // 搜索条件
      supplierList: dot.get(props, 'system.allSupplierList.data') || [],  // 供应商列表
      areaList: dot.get(props, 'system.areaList.biz_district_list') || [], // 商圈列表
      columns: [
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name',
        }, {
          title: '供应商ID',
          dataIndex: 'supplier_id',
          key: 'supplier_id',
        }, {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          render: (text) => {
            return <span>{supplierState.description(text)}</span>;
          },
        }, {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (text) => {
            return <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>;
          },
        }, {
          title: '操作人',
          dataIndex: 'operator_name',
          key: 'operator_name',
          render: (text) => {
            return <span>{text || '--'}</span>;
          },
        }, {
          title: '操作',
          dataIndex: '_id',
          key: '_id',
          render: (text, record) => {
            // 启用供应商
            let title = <h2>你确定要启用供应商吗?</h2>;
            // 禁用供应商
            if (record.state === supplierState.normal) {
              title = (
                <div >
                  <h2 style={{ marginBottom: '10px' }}>你确定要禁用供应商吗?</h2>
                  <p>你确定要禁用该供应商？禁用后供应商下所</p>
                  <p>有系统用户禁用，禁 用期间不可启用，供应</p>
                  商启用后，对应系统用户再次启用。请慎重！！
                </div>
              );
            }
            // 停用供应商
            const stopTitle = (
              <div>
                <h2 style={{ marginBottom: '10px' }}>你确定要停用供应商吗?</h2>
                <p>你确定要停用该供应商？停用后该供应商下</p>
                <p>所有系统用户禁用，商圈释放，您还要继续</p>
                吗？该供应商停用后不可再启用，请慎重！
            </div>
            );
            return (
              <span>
                {
                  // 停用的供应商不能编辑，判断该供应商是否被停用
                  record.state != supplierState.disabled
                    ?
                    <span className="systemTextColor">
                      <Link to={`System/Supplier/Detail?id=${record._id}`}>
                        <span className="mgl8 systemTextColor pointer">
                          详情
                          </span>
                      </Link>
                      <span className="mgl8 systemTextColor">|</span>
                      <Link to={`System/EditSupplier?id=${record._id}`}>
                        <span className="mgl8 systemTextColor pointer">
                          编辑
                          </span>
                      </Link>
                      <span className="mgl8 systemTextColor">|</span>
                      {/* // 根基状态转换弹窗标题，是禁用供应商还是启用供应商 */}
                      <Popconfirm
                        title={title}
                        onConfirm={this.deleteSupplier.bind(this, record)}
                        onCancel={this.cancel}
                        okText="确认"
                        cancelText="取消"
                      >
                        <span className="mgl8 systemTextColor pointer">
                          {/* // 对比供应商状态，看是显示禁用还是启用状态 */}
                          {record.state == supplierState.normal ? '禁用' : '启用'}
                        </span>
                      </Popconfirm>
                      <span />
                      {/* 判断是否是禁用状态 */}
                      <span className="mgl8 systemTextColor">|</span>
                      {/* // 根基状态转换弹窗标题，是禁用供应商还是启用供应商 */}
                      <Popconfirm
                        title={stopTitle}
                        onConfirm={this.deleteSupplier.bind(this, record, supplierState.disabled)}
                        onCancel={this.cancel}
                        okText="确认"
                        cancelText="取消"
                      >
                        <span className="mgl8 systemTextColor pointer">
                          停用
                          </span>
                      </Popconfirm>
                      <span />
                    </span>
                    :
                    <Link to={`System/Supplier/Detail?id=${record._id}`}>
                      <span className="mgl8 systemTextColor pointer">
                        详情
                      </span>
                    </Link>
                }
              </span>
            );
          },
        },
      ],
      dataSource: dot.get(props, 'system.supplierList.data') || [], // 供应商id列表
    };
  }

  // 接受父级的值
  componentWillReceiveProps(nextProps) {
    this.setState({
      supplierList: dot.get(nextProps, 'system.allSupplierList.data') || [],    // 供应商列表
      dataSource: dot.get(nextProps, 'system.supplierList.data') || [],         // 供应商id列表
      areaList: dot.get(nextProps, 'system.areaList.biz_district_list') || [],  // 商圈列表
    });
  }

  // 禁用or启用 停用 供应商功能
  cancel = () => {
  };

  // 禁用供应商
  deleteSupplier(record, state) {
    const { dispatch } = this.props;
    const searchParam = {
      page: this.state.page,
      limit: 1000,
      option: false,
      permission_id: Modules.ModuleSystemSupplier.id,
    };
    const data = {
      _id: record._id,
      supplier_id: record.supplier_id,      // 供应商id
      supplier_name: record.supplier_name,  // 供应商名字
      searchParam: this.state.searchValue === '' ? searchParam : this.state.searchValue, // 搜索参数
    };

    if (state == -61) {
      // 停用
      data.state = state;
    } else {
      // 禁用or启用
      data.state = -(record.state);             // 60启用,-60禁用,-61停用,   如果是启用或则禁用状态，就每次点击都取反，60 -- -60， -60 -- 60
    }
    // 禁用／启用供应商
    dispatch({ type: 'system/disableSupplierE', payload: data });
  }

  // 收集查询条件 查询数据
  handleSubmit = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const values = this.props.form.getFieldsValue();
        if (values.state) {
          values.state = Number(values.state);
        } else {
          delete values.state;
        }
        values.page = this.state.page;
        values.limit = 30;
        values.permission_id = Modules.ModuleSystemSupplier.id;
        this.setState({ searchValue: values, current: 1 });
        dispatch({ type: 'system/getSupplierListE', payload: values });
      }
    });
  };

  // 分页
  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    this.setState({ current: page, pageSize });
    const value = this.state.searchValue;
    value.limit = pageSize;
    value.page = page;
    value.permission_id = Modules.ModuleSystemSupplier.id;
    dispatch({ type: 'system/getSupplierListE', payload: value });
  };

  // 渲染
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 15,
      },
    };
    return (
      <div className="mgt8">
        <Form>
          <Row>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'供应商名称'}>
                {getFieldDecorator('_id', {
                  rules: [
                    {
                      required: false,
                      message: '请选择供应商名称',
                      trigger: 'onBlur',
                      type: 'string',
                    },
                  ],
                })(
                  <Select allowClear showSearch optionFilterProp="children" placeholder="请选择供应商">
                    {dot.get(this, 'state.supplierList', []).map((item, index) => {
                      return <Option value={item._id} key={index}>{item.supplier_name}</Option>;
                    })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            {/* 新增id */}
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'供应商ID'}>
                {getFieldDecorator('supplier_id', {
                  rules: [
                    {
                      required: false,
                      message: '请选择供应商ID',
                      trigger: 'onBlur',
                      type: 'string',
                    },
                  ],
                })(
                  <Select allowClear showSearch optionFilterProp="children" placeholder="请选择供应商ID">
                    {dot.get(this, 'state.supplierList', []).map((item, index) => {
                      return <Option value={item.supplier_id} key={index}>{item.supplier_id}</Option>;
                    })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'商圈名称'}>
                {getFieldDecorator('biz_district_id_list', {
                  rules: [
                    {
                      required: false,
                      message: '请选择商圈名称',
                      trigger: 'onBlur',
                      type: 'array',
                    },
                  ],
                })(
                  <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择商圈" >
                    {dot.get(this, 'state.areaList', []).map((item, index) => {
                      return (<Option
                        value={item.biz_district_id}
                        key={index}
                      >{item.state === 0 ? `${item.biz_district_name}【禁用】` : item.biz_district_name}
                      </Option>);
                    })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...formItemLayout} label={'状态'}>
                {getFieldDecorator('state', {
                  rules: [
                    {
                      required: false,
                      message: '请选择供应商名称',
                      trigger: 'onBlur',
                      type: 'string',
                    },
                  ],
                })(
                  <Select allowClear placeholder="全部">
                    <Option key={1} value={'60'}>{'启用'}</Option>
                    <Option key={2} value={'-60'}>{'禁用'}</Option>
                    <Option key={3} value={'-61'}>{'停用'}</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={16}>
              <Button type="primary" className="mgl16" onClick={this.handleSubmit}>查询</Button>
              <Button type="primary" className="mgl16">
                <Link to={'System/AddSupplier'}>添加供应商</Link>
              </Button>
              <Button className="mgl16 mgt8">
                <Link to={'System/Range/Supplier'}>业务分布情况（商圈）</Link>
              </Button>
              <Button className="mgl16 mgt8">
                <Link to={'System/Range/City'}>业务分布情况（城市）</Link>
              </Button>
            </Col>
          </Row>
        </Form>
        <TableModel columns={this.state.columns} dataSource={this.state.dataSource} bordered />
        <div className="fltr">
          {this.state.total > 0
            ? <Pagination onChange={this.pageChange} className="mgt8" total={this.state.total} showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `} pageSize={this.state.pageSize} current={this.state.current} />
            : ''
          }
        </div>
      </div>
    );
  }
}
Supplier = Form.create()(Supplier);

function mapStateToProps({ system }) {
  return { system };
}
export default connect(mapStateToProps)(Supplier);
