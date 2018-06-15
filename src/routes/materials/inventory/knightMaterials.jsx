/**
 * 库存信息-查看骑士物资
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, Button, Pagination } from 'antd';
import Table from './../../../components/table';
import { Position } from '../../../application/define';
import Modules from './../../../application/define/modules';

const [FormItem, Option] = [Form.Item, Select.Option];

class KnightMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: dot.get(props, 'materials.knightList._meta.result_count') || 0,  // 总量
      page: 1,   // 默认页码
      current: 1,  // 默认的高亮页码
      pageSize: 30,  // 每页数据量
      searchValue: {  // 搜索条件
        position_id_list: [Position.postmanManager, Position.postman],
      },
      columns: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
      }, {
        title: '平台',
        dataIndex: 'platform_list',
        key: 'platform_list',
        render: (text, record) => {
          return (
            <span>{text.map((item, index) => {
              return (<span key={index}>{item.platform_name}</span>);
            })}</span>
          );
        },
      }, {
        title: '城市',
        dataIndex: 'city_list',
        key: 'city_list',
        render: (text, record) => {
          return (
            <span>{text.map((item, index) => {
              return (<span key={index}>{item.city_name}</span>);
            })}</span>
          );
        },
      }, {
        title: '商圈',
        dataIndex: 'district_description',
        key: 'district_description',
        render: (text, record) => {
          return (
            <span>{text.join(',')}</span>
          );
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: '_id',
        render: (text, record) => {
          return <Link to={`Materiel/Stores/Knight/Detail?id=${record._id}`}><span className="systemTextColor pointer">查看物资详情</span></Link>;
        },
      }],
      dataSource: dot.get(props, 'materials.knightList.data', []),
    };
  }

  // 父级数据传递
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'materials.knightList.data') || [],
      total: dot.get(nextProps, 'materials.knightList._meta.result_count') || 0,
    });
  }

  // 查询骑士
  handleSearch = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        this.setState({
          searchValue: values,
          current: 1,
        });
        values.limit = this.state.pageSize;
        values.position_id_list = [Position.postmanManager, Position.postman];
        values.page = this.state.page;
        values.permission_id = Modules.ModuleMaterielStoresKnight.id;
        dispatch({
          type: 'materials/getKnightListE',
          payload: values,
        });
      }
    });
  };

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
    value.permission_id = Modules.ModuleMaterielStoresKnight.id;
    dispatch({
      type: 'materials/getKnightListE',
      payload: value,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    return (<div>
      <Form>
        <Row>
          <Col sm={8}>
            <FormItem {...formItemLayout} label={'骑士姓名'}>
              {getFieldDecorator('name', {
                rules: [{
                  type: 'string', message: '请输入骑士姓名',
                }, {
                  required: false, message: '请输入骑士姓名',
                }],
              })(
                <Input placeholder="请输入骑士姓名" />,
              )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem {...formItemLayout} label={'骑士手机号'}>
              {getFieldDecorator('phone', {
                rules: [{
                  type: 'string', message: '请输入骑士手机号',
                }, {
                  required: false, message: '请输入骑士手机号',
                }],
              })(
                <Input placeholder="请输入骑士手机号" />,
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

export default connect(mapStateToProps)(Form.create()(KnightMaterials));
