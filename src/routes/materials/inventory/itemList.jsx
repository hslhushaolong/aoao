/**
 * 库存信息-品目明细
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, message } from 'antd';

import Table from './../../../components/table';
import Modal from './../../../components/modal';
import aoaoBossTools from './../../../utils/util';
import Operate from '../../../application/define/operate';
import { renderReplaceAmount } from '../../../application/define';

const [FormItem, Option] = [Form.Item, Select.Option];

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      platformCode: '',  // 平台
      id: dot.get(props, 'materials.itemDetail._id'),  // 物资品目id
      columns: [{
        title: '品目ID',
        dataIndex: '_id',
        key: '_id',
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
        title: '物资单价（元）',
        dataIndex: 'purchase_price',
        key: 'purchase_price',
        render: (text) => {
          return renderReplaceAmount(text);
        },
      }, {
        title: '押金（元）',
        dataIndex: 'deposit',
        key: 'deposit',
        render: (text) => {
          return renderReplaceAmount(text);
        },
      }, {
        title: '月使用费（元）',
        dataIndex: 'monthly_fee',
        key: 'monthly_fee',
        render: (text) => {
          return renderReplaceAmount(text);
        },
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return (<span>{aoaoBossTools.enumerationConversion(text)}</span>);
        },
      }, {
        title: '操作',
        dataIndex: '',
        key: 'id',
        render: (text, record) => {
          return (<span>
            {
              // 编辑品目按钮(采购) && 品目未被编辑过(state为80)才显示编辑
              Operate.canOperateMaterielStoresItemEditButton() == true && record.state === 80 ?
                <span className="systemTextColor pointer" onClick={this.showModal.bind(this, record)}>编辑</span> : '--'
            }
          </span>);
        },
      }],
      dataSource: dot.get(props, 'materials.itemList.material_list'),  // 物资品目列表
      addFlag: false,  // 添加品目
      addModalDataSource: {  // 添加品目对话框
        title: '添加品目',
        visible: false,
        content: [{
          label: '物资名称',
          id: 'material_name',
          message: '请输入物资名称',
          required: true,
          placeholder: '请输入物资名称',
          initialValue: null,
        }, {
          label: '物资规格',
          id: 'material_type',
          message: '请输入物资规格',
          required: true,
          placeholder: '请输入物资规格',
          initialValue: null,
        }, {
          label: '物资采购价（元）',
          id: 'purchase_price',
          message: '请输入物资采购价',
          required: true,
          placeholder: '请输入物资采购价',
          initialValue: null,
          checkValue: {
            rule: 'number',
            message: '请输入数字',
          },
        }, {
          label: '押金（元）',
          id: 'deposit',
          message: '请输入押金',
          required: true,
          placeholder: '请输入押金',
          initialValue: null,
          checkValue: {
            rule: 'number',
            message: '请输入数字',
          },
        }, {
          label: '月使用费（元）',
          id: 'monthly_fee',
          message: '请输入月使用费',
          required: true,
          placeholder: '请输入月使用费',
          initialValue: null,
          checkValue: {
            rule: 'number',
            message: '请输入数字',
          },
        }, {
          label: '状态',
          id: 'state',
          message: '请选择状态',
          required: true,
          placeholder: '请选择状态',
          initialValue: 80,
          Radio: [{
            name: '启用',
            value: 80,
          }, {
            name: '禁用',
            value: -80,
          }],
        }],
      },
      editFlag: false,
      editModalDataSource: {
        title: '编辑品目',
        visible: false,
        content: [{
          label: '物资名称',
          id: 'material_name',
          message: '请输入物资名称',
          required: false,
          placeholder: '请输入物资名称',
          disabled: false,
          initialValue: dot.get(props, 'materials.itemDetail.material_name') || null,
        }, {
          label: '物资规格',
          id: 'material_type',
          message: '请输入物资规格',
          required: false,
          placeholder: '请输入物资规格',
          disabled: true,
          initialValue: dot.get(props, 'materials.itemDetail.material_type') || null,
        }, {
          label: '物资采购价（元）',
          id: 'purchase_price',
          message: '请输入物资采购价',
          required: false,
          placeholder: '请输入物资采购价',
          initialValue: dot.get(props, 'materials.itemDetail.purchase_price') || null,
        }, {
          label: '押金（元）',
          id: 'deposit',
          message: '请输入押金',
          required: false,
          placeholder: '请输入押金',
          initialValue: dot.get(props, 'materials.itemDetail.deposit') || null,
        }, {
          label: '月使用费（元）',
          id: 'monthly_fee',
          message: '请输入月使用费',
          required: true,
          placeholder: '请输入月使用费',
          initialValue: dot.get(props, 'materials.itemDetail.monthly_fee') || null,
        }, {
          label: '状态',
          id: 'state',
          message: '请选择状态',
          required: false,
          placeholder: '请选择状态',
          initialValue: dot.get(props, 'materials.itemDetail.state') || null,
          Radio: [{
            name: '启用',
            value: 80,
          }, {
            name: '禁用',
            value: -80,
          }],
        }],
      },
    };
  }

// 页面载入前，清除上次加载的数据
  componentWillMount() {
    this.props.dispatch({
      type: 'materials/removeItemListR',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { editModalDataSource } = this.state;
    editModalDataSource.content = [{
      label: '物资名称',
      id: 'material_name',
      message: '请输入物资名称',
      required: false,
      disabled: true,
      placeholder: '请输入物资名称',
      initialValue: dot.get(nextProps, 'materials.itemDetail.material_name') || null,
    }, {
      label: '物资规格',
      id: 'material_type',
      message: '请输入物资规格',
      required: false,
      disabled: true,
      placeholder: '请输入物资规格',
      initialValue: dot.get(nextProps, 'materials.itemDetail.material_type') || null,
    }, {
      label: '物资采购价（元）',
      id: 'purchase_price',
      message: '请输入物资采购价',
      required: false,
      placeholder: '请输入物资采购价',
      initialValue: renderReplaceAmount(dot.get(nextProps, 'materials.itemDetail.purchase_price')) || null,
    }, {
      label: '押金（元）',
      id: 'deposit',
      message: '请输入押金',
      required: false,
      placeholder: '请输入押金',
      initialValue: renderReplaceAmount(dot.get(nextProps, 'materials.itemDetail.deposit')) || null,
    }, {
      label: '月使用费（元）',
      id: 'monthly_fee',
      message: '请输入月使用费',
      required: false,
      placeholder: '请输入月使用费',
      initialValue: renderReplaceAmount(dot.get(nextProps, 'materials.itemDetail.monthly_fee')) || null,
    }, {
      label: '状态',
      id: 'state',
      message: '请选择状态',
      required: false,
      placeholder: '请选择状态',
      initialValue: dot.get(nextProps, 'materials.itemDetail.state') || 80,
      Radio: [{
        name: '启用',
        value: 80,
      }, {
        name: '禁用',
        value: -80,
      }],
    }];
    this.setState({
      editModalDataSource,
      dataSource: dot.get(nextProps, 'materials.itemList.material_list', []),
      id: dot.get(nextProps, 'materials.itemDetail._id'),
    });
  }

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 根据平台获取相应的采购模板
  platformChange(value) {
    const { dispatch } = this.props;
    this.setState({
      platformCode: value,
    });
    dispatch({
      type: 'materials/getItemListE',
      payload: {
        platform_code: value,
      },
    });
  }

  // 编辑条目
  showModal(record) {
    const { editModalDataSource } = this.state;
    const { dispatch } = this.props;
    editModalDataSource.visible = true;
    this.setState({
      editModalDataSource,
    });
    dispatch({
      type: 'materials/bundleItemDetailR',
      payload: record,
    });
  }

  // 添加条目
  addModal = () => {
    const { addModalDataSource, platformCode } = this.state;
    // 判断平台是否选择
    if (platformCode === '') {
      message.warning('请先选择平台');
      return;
    }
    // 显示添加对话框
    addModalDataSource.visible = true;
    this.setState({
      addModalDataSource,
    });
  };

  // 取消回调
  handleCancel = () => {
    const { addModalDataSource, editModalDataSource } = this.state;
    // 将添加对话框和修改对话框隐藏
    addModalDataSource.visible = false;
    editModalDataSource.visible = false;
    this.setState({
      addModalDataSource,
    });
  };

  // 添加确认回调
  handleOk = (values) => {
    const { addModalDataSource, editModalDataSource, platformCode } = this.state;
    const { dispatch } = this.props;
    // 隐藏添加对话框和修改对话框
    addModalDataSource.visible = false;
    editModalDataSource.visible = false;
    values.platform_code = platformCode;
    this.setState({
      addModalDataSource,
      editModalDataSource,
    });
    dispatch({
      type: 'materials/addItemOfTemplateE',
      payload: values,
    });
  };

  // 编辑确认回调
  handleOks = (values) => {
    const { dispatch } = this.props;
    const { addModalDataSource, editModalDataSource, platformCode } = this.state;
    addModalDataSource.visible = false;
    editModalDataSource.visible = false;
    this.setState({
      addModalDataSource,
      editModalDataSource,
    });
    values._id = this.state.id;
    values.platformCode = platformCode;
    dispatch({
      type: 'materials/editItemDetailE',
      payload: values,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const platformList = aoaoBossTools.getAllAreaFromPermission('platform_code');
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={'平台'}>
              {getFieldDecorator('platform_code_list', {
                rules: [{
                  type: 'string', message: '请选择平台',
                }, {
                  required: false, message: '请选择平台',
                }],

              })(
                <Select allowClear placeholder="请选择平台" onChange={this.platformChange.bind(this)}>
                  {
                    platformList.map((item, index) => {
                      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          {
            // 添加品目按钮(采购)
            Operate.canOperateMaterielStoresItemCreateButton() == true ?
              <Col sm={6}>
                <Col sm={3} />
                <Button type="primary" className={'mgr8'} onClick={this.addModal}>添加</Button>
              </Col> : ''
          }
        </Row>
      </Form>
      <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
      <Modal
        {...this.state.addModalDataSource}
        handleCancel={this.handleCancel}
        handleOk={this.handleOk}
      />
      <Modal
        {...this.state.editModalDataSource}
        handleCancel={this.handleCancel}
        handleOk={this.handleOks}
      />
    </div>);
  }
}

function mapStateToProps({ materials }) {
  return { materials };
}

export default connect(mapStateToProps)(Form.create()(ItemList));
