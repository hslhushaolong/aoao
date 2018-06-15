/**
 * 获取所有财务申请页
 * @author Jay
 * @class IndexPage
 *
 */
import React from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker, Badge, Pagination, Modal, Icon, Table } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Operate from '../../../application/define/operate';
import BreakModal from './breakModal';
import { authorize } from '../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: dot.get(props, 'finance.financeOrderList.data.length', 0),  // 数据总量
      cityList: [],       // 城市列表
      page: 1,            // 默认页码
      current: 1,         // 默认的高亮页码
      pageSize: 30,       // 每页显示数据量
      searchValue: {},    // 搜索条件
      visible: false,     // 弹窗可见属性
      break_id: '',       // 断租id
      applyAmount: '',    // coo界面，同意申请总额
      approveModal: false,  // coo界面，同意申请弹出框
      order_id: '',       // 申请id
      state: '',          // 审核状态
      selectedRowKeys: [],    // 选中的表格索引
      selectedRows: [],       // 选中的数据
      approveButtonEnable: true,  // 审批按钮默认不可点
      batchApproveModal: false,  // 批量同意弹窗
      checkState: '',  // 批量审核状态
      approveTitle: '',  // 审核提示文字
      columns: [{
        title: '单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '申请类型',
        dataIndex: 'finance_apply_type',
        key: 'finance_apply_type',
        render: (text) => {
          return (<span>
            {aoaoBossTools.enumerationConversion(text)}
          </span>);
        },
      }, {
        title: '申请日期',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return (<span>
            {aoaoBossTools.prctoMinute(text, 3)}
          </span>);
        },
      }, {
        title: '申请城市',
        dataIndex: 'city_name',
        key: 'city_name',
      }, {
        title: '申请金额 (元)',
        dataIndex: 'total_money',
        key: 'total_money',
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          let status = 'success';
          const warning = [20010];   // 待审核
          const error = [20011];     // 审核未通过
          const success = [20012];   // 审核通过
          if (success.indexOf(text) !== -1) {
            status = 'success';
          } else if (warning.indexOf(text) !== -1) {
            status = 'warning';
          } else {
            status = 'error';
          }
          return (<span>
            <Badge status={status} text={aoaoBossTools.enumerationConversion(text)} />
          </span>);
        },
      }, {
        title: '操作',
        render: (text, record) => {
          const permission = Operate.canOperateFinanceApplyVerifyButton();
          const className = 'mgl8 systemTextColor pointer';
          const applyType = record.finance_apply_type;       // 房屋申请类型
          const address = this.getDetailAddress(applyType);  // 获取详情的路由地址
          /**
            * 点击薪资详情跳转到 `Salary/Search/Detail?id=${record._id}`
            * 点击财务详情 跳转到 Finance/FinanceApply/${address}?id=${record._id}
          */
          const url = record.finance_apply_type === 200012 ? `Salary/Search/Detail?id=${record._id}` : `Finance/FinanceApply/${address}?id=${record._id}`;
          if (!permission) {  // 非coo的情况
            switch (applyType) {  // 判断申请类型
              case 200001 : // 新租申请
              case 200002 :  // 续租申请
              case 200003 :  // 断租申请
                switch (record.option_state) {  // 判断审核状态
                  case true:  // 已审核
                    return (
                      <span>
                        <span><Link
                          to={url} className={className}
                        >详情</Link>
                        </span>
                        <span>
                          <span><Link
                            to={`Finance/FinanceApply/Relet?id=${record._id}`}
                            className={className}
                          >续租</Link>
                          </span>
                          <span
                            onClick={this.handleBreak.bind(this, record._id)}
                            className={className}
                          >断租
                            </span>
                        </span>
                      </span>
                    );
                  case false :  // 未审核
                    return (
                      <span>
                        <span><Link
                          to={url} className={className}
                        >详情</Link>
                        </span>
                      </span>
                    );
                  default :
                    break;
                }
                break;
              case 200012 :  // 薪资申请详情，后面并入default中
                return (
                  <span>
                    <span><Link
                      to={url} className={className}
                    >详情</Link>
                    </span>
                  </span>
                );
              default :  // 其他财务申请类型, 非coo查看详情
                return (
                  <span>
                    <span><Link
                      to={url} className={className}
                    >详情</Link>
                    </span>
                  </span>
                );
            }
          } else {  // coo 登录的情况
            switch (record.state) {  // 判断审核状态
              case 20010:  // 待审核
                return (
                  <span>
                    <span><Link
                      to={url} className={className}
                    >详情</Link>
                    </span>
                    <span>
                      <span
                        onClick={this.handleApprove.bind(this, record._id, record.total_money, record.state)}
                        className={className}
                      >同意
                      </span>
                      <span
                        onClick={this.handleReject.bind(this, record._id, record.total_money, record.state)}
                        className={className}
                      >驳回
                      </span>
                    </span>
                  </span>
                );
              case 20011:  // 通过
              case 20012:  // 驳回
                return (
                  <span>
                    <span><Link
                      to={url} className={className}
                    >详情</Link>
                    </span>
                  </span>
                );
              default :
                break;
            }
          }
        },
      }],
      dataSource: dot.get(props, 'finance.financeOrderList.data') || [],
    };
  }

  // 获取列表数据
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/getFinanceOrderListE',
      payload: {
        page: this.state.page,
        limit: this.state.limit,
        sort: this.state.sort,
      },
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: dot.get(props, 'finance.financeOrderList.data') || [],  // 列表数据
      total: dot.get(props, 'finance.financeOrderList._meta.result_count') || 0,  // 数据总量
    });
  }

  // coo 登录的情况下，根据申请类型不同，跳转到详情页
  getDetailAddress = (applyType) => {
    const type = applyType || '';
    switch (type) {
      case 200001:  // 新租
        return 'Detail';
      case 200002:  // 续租
        return 'ReletDetail';
      case 200003:  // 断租详情
        return 'BreakDetail';
      case 200005:  // 差旅报销详情
        return 'TravelDetail';
      case 200006:  // 团建详情
        return 'TeamBuildDetail';
      case 200007:  // 盖章罚款详情
        return 'PunishmentDetail';
      case 200008:  // 收购详情
        return 'PurchaseDetail';
      case 200009:  // 意外支出详情
        return 'UnexpectedDetail';
      case 200010:  // 更多详情
        return 'MoreDetail';
      case 200011:  // 办公详情
        return 'OfficeDetail';
      default :
        return '';
    }
  }

  // coo 点击同意,弹出modal对话框
  handleApprove(id, amount) {
    this.setState({
      applyAmount: amount,  // 申请总额
      order_id: id,  // 申请id
      state: 20012,  // 同意
      approveModal: true,  // 显示对话框
      modalText: '您要同意该申请吗？',  // 对话框文案
    });
  }

  // 点击同意申请modal框的确认按钮，发送请求
  handleApproveOk() {
    const { order_id, state } = this.state;
    this.setState({
      approveModal: false,  // 关闭对话框
      selectedRowKeys: [],  // 选择项
      approveButtonEnable: true,  // 同意按钮可点
    });
    this.props.dispatch({
      type: 'finance/approveFinanceApplyE',
      payload: {
        order_id_list: [order_id],
        state,
        page: this.state.current,
      },
    });
  }

  // coo 点击驳回
  handleReject(id, amount) {
    this.setState({
      applyAmount: amount,
      order_id: id,
      state: 20011,  // 驳回
      approveModal: true,
      modalText: '您要驳回该申请吗？',
    });
  }

  // 点击断租
  handleBreak(breakId) {
    this.setState({
      visible: true,
      break_id: breakId,
    });
  }

  // 点击模态框取消
  handleCancel() {
    this.setState({
      visible: false,
      approveModal: false,
      batchApproveModal: false,
    });
  }

  // 点击模态框确定
  handleOk(values) {
    // 获取当前订单的id
    const order_id = this.state.break_id;
    values.apply_order_id = order_id;
    values.finance_apply_type = 200003;  // 断租类型
    this.props.dispatch({
      type: 'finance/submitRentApplyE',
      payload: values,
    });
    this.setState({
      visible: false,
    });
  }

  // 点击搜索按钮
  handleSearch() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        if (values.finance_apply_type) {
          // 申请类型字符串数组转为数字数组
          values.finance_apply_type = values.finance_apply_type.map((item, index) => {
            return parseInt(item);
          });
        }
        if (values.state) {
          // 审核状态字符串数组转为数字数组
          values.state = values.state.map((item, index) => {
            return parseInt(item);
          });
        }
        if (values.date) {
          values.date = aoaoBossTools.prctoMinute(values.date, 0).substr(0, 10);
        } else {
          delete values.date;
        }
        // 修改本地搜索条件
        this.setState({
          searchValue: values,
          current: 1,
        });
        values.limit = this.state.pageSize;
        values.page = this.state.page;
        values.sort = this.state.sort;
        this.props.dispatch({
          type: 'finance/getFinanceOrderListE',
          payload: {
            ...values,
          },
        });
      }
    });
  }

  // 点击分页条
  pageChange(page, pageSize) {
    this.setState({
      current: page,
      pageSize,
    });
    const { dispatch } = this.props;
    const value = this.state.searchValue;
    value.limit = pageSize;
    value.page = page;
    dispatch({
      type: 'finance/getFinanceOrderListE',
      payload: value,
    });
  }

  // 批量同意
  batchApproving = () => {
    const { selectedRows } = this.state;
    this.setState({
      batchApproveModal: true,  // 显示批量审核对话框
      approveTitle: `是否确定批量同意${selectedRows.length}条资金申请？`,
      checkState: true, // 审核状态设为同意
    });
  }

  // 批量驳回
  batchRejecting = () => {
    const { selectedRows } = this.state;
    this.setState({
      batchApproveModal: true,  // 显示批量审核对话框
      checkState: false, // 审核状态设为驳回
      approveTitle: `是否确定批量驳回${selectedRows.length}条资金申请？`,
    });
  }

  // 批量审批弹窗的确定按钮
  handleBatchApprove = () => {
    const { selectedRows, checkState } = this.state;
    const orderIdList = [];
    selectedRows.forEach((item) => {
      orderIdList.push(item._id);
    });
    // 根据 checkState 判断同意还是驳回  20012 同意， 20011 驳回
    const state = checkState ? 20012 : 20011;
    this.props.dispatch({
      type: 'finance/approveFinanceApplyE',
      payload: {
        order_id_list: orderIdList,
        state,
      },
    });
    this.setState({
      batchApproveModal: false,  // 隐藏批量同意对话框
      selectedRowKeys: [],  // 批量选择项
      approveButtonEnable: true,   // 批量审核按钮可点
    });
  }

  // 批量选中
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const approveButtonEnable = selectedRows.length <= 0;  // 有批量选择，按钮才可点
    this.setState({ selectedRowKeys, selectedRows, approveButtonEnable });
  };

  render() {
    const cityList = aoaoBossTools.getAllAreaFromPermission('city_list');  // 获取城市
    const permission = Operate.canOperateFinanceApplyVerifyButton();  // 判断审核权限
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;  // 批量选择项
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state !== 20010, // 20010 待审核
      }),
    };
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={8}>
            <FormItem {...formItemLayout} label={'单号'}>
              {getFieldDecorator('order_id', {
                rules: [{ required: false, message: '请输入单号', trigger: 'onBlur', type: 'string' }],
              })(
                <Input placeholder="请输入单号" />,
              )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="申请类型" {...formItemLayout}>
              {getFieldDecorator('finance_apply_type', {
                rules: [{
                  type: 'array', message: '请选择申请类型',
                }, {
                  required: false, message: '请选择申请类型',
                }],
              })(
                <Select placeholder="请选择申请类型" mode="multiple" allowClear>
                  <Option value={'200001'}>新租申请</Option>
                  <Option value={'200002'}>续租申请</Option>
                  <Option value={'200003'}>断租申请</Option>
                  <Option value={'200005'}>差旅报销</Option>
                  <Option value={'200006'}>团建|招待</Option>
                  {/** * <Option value={'200007'}>盖章罚款</Option> ***/}
                  <Option value={'200008'}>收购款</Option>
                  <Option value={'200009'}>意外费用</Option>
                  <Option value={'200010'}>采购</Option>
                  <Option value={'200011'}>办公费用</Option>
                  <Option value={'200012'}>薪资申请</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="申请日期" {...formItemLayout}>
              {getFieldDecorator('date', {
                rules: [{
                  type: 'object', message: '请输入申请日期',
                }, {
                  required: false, message: '请输入申请日期',
                }],
              })(
                <DatePicker format={'YYYY-MM-DD'} />,
              )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem {...formItemLayout} label={'申请城市'}>
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
                      return (<Option value={item.city_spelling} key={index}>{item.city_name}</Option>);
                    })
                  }
                </Select>,
                )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="申请状态" {...formItemLayout}>
              {getFieldDecorator('state', {
                rules: [{
                  type: 'array', message: '请选择申请状态',
                }, {
                  required: false, message: '请选择申请状态',
                }],
              })(
                <Select placeholder="请选择申请状态" mode="multiple" allowClear>
                  <Option value={'20010'}>待审核</Option>
                  <Option value={'20011'}>未通过</Option>
                  <Option value={'20012'}>通过</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <Col sm={2} />
            <Button type="primary" className={'mgr8'} onClick={this.handleSearch.bind(this)}>搜索</Button>
          </Col>
        </Row>
      </Form>
      {
        // 批量同意按钮
        permission ? <Row>
          <Col sm={6} className={'ant-col-sm-8 mgb8'}>
            <Button type="primary" onClick={this.batchApproving} disabled={this.state.approveButtonEnable}>批量同意</Button>
            <Button className="mgl8" type="primary" onClick={this.batchRejecting} disabled={this.state.approveButtonEnable}>批量驳回</Button>
          </Col>
        </Row> : ''
      }

      <Table
        pagination={false} columns={this.state.columns} dataSource={this.state.dataSource} bordered
        rowSelection={permission ? rowSelection : null} rowKey={(record) => { return record._id; }}
      />

      <div>
        <BreakModal
          handleCancel={this.handleCancel.bind(this)}
          visible={this.state.visible}
          handleOk={this.handleOk.bind(this)}
        />
      </div>
      <div className="fltr">
        {
          this.state.total > 0 ?
            <Pagination
              onChange={this.pageChange.bind(this)}
              className="mgt8"
              total={this.state.total}
              showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
              pageSize={this.state.pageSize}
              current={this.state.current}
            />
            : ''
        }
      </div>
      <div>
        <Modal
          title="信息确认"
          visible={this.state.approveModal}
          onCancel={this.handleCancel.bind(this)}
          width="450px"
          onOk={this.handleApproveOk.bind(this)}
          okText="确认"
          cancelText="取消"
        >
          <div style={{ paddingLeft: '60px', fontSize: '14px', position: 'relative' }}>
            <span style={{ color: 'red', position: 'absolute', left: '40px', top: '1px' }}><Icon type="exclamation-circle-o" /></span>
            <p style={{ marginBottom: '8px' }}>申请金额为：{this.state.applyAmount}</p>
            <p style={{ fontSize: '10px' }}>{this.state.modalText}</p>
          </div>
        </Modal>
      </div>
      {/** ****  批量审核弹窗  ******/}
      <div>
        <Modal
          title="提示"
          visible={this.state.batchApproveModal}
          onCancel={this.handleCancel.bind(this)}
          width="450px"
          onOk={this.handleBatchApprove.bind(this)}
          okText="确认"
          cancelText="取消"
        >
          <p>{this.state.approveTitle}</p>
        </Modal>
      </div>
    </div>);
  }
}

function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(Form.create()(IndexPage));
