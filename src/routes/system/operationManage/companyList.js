// 合同归属管理模块
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Table, Modal, Button, Input, message } from 'antd';
import aoaoBossTools from '../../../utils/util';
import Operate from '../../../application/define/operate';
import { authorize } from '../../../application';
import Modules from '../../../application/define/modules';

class companyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 编辑公司名
      title: '编辑公司',                                            // 弹窗标题
      visible: false,                                              // 控制弹窗是否开启，默认不开启
      confirmLoading: dot.get(props, 'system.confirmLoading'),                 // table是否是loading状态
      defaultValue: '',                                            // 获取弹窗输入值
      third_part_id: '',                                           // 记录公司id号
      index: '',                                                   // 获得table行
      page: 1,                                                     // 默认列表请求页数
      total: dot.get(props, 'system.companyList._meta.result_count') || 10,        // 列表总条数
      // 新建公司名
      buildTitle: '添加公司',                                       // 新建公司弹窗标题
      buildDefaultValue: '请输入公司名称',                           // 新建公司弹窗输入默认值
      buildValue: '',                                              // 新建公司弹窗输入值
      buildVisible: false,                                         // 控制新建公司弹窗是否显示
      buildConfirmLoading: false,                                  // 新建公司loading
      columns: [                                                   // table header
        {
          title: '公司名称',
          dataIndex: 'name',
          width: '70%',
          key: 'name',
        }, {
          title: '操作',
          key: 'action',
          render: (text, record, index) => (
            <div>
              {/* 权限处理，只有运营管理才可以看到按钮
                运营管理录入,更改公司名称(运营管理)*/}
              {Operate.canOperateSystemEditCompany()
                ? <span>
                  <a
                    style={{
                      color: 'rgb(255,119,0)',
                      marginRight: '10px',
                    }}
                    onClick={() => this.onHandleChange(text, record, index)}
                  >
                    编辑</a>
                  {record.state === 60
                    ? <a
                      style={{
                        color: 'rgb(255,119,0)',
                      }}
                      onClick={() => this.stopCompany(text)}
                    >
                      禁用</a>
                      : <a
                        style={{
                          color: 'rgb(255,119,0)',
                        }}
                        onClick={() => this.openCompany(text)}
                      >启用</a>
                  }
                </span>
                : null}
            </div>
          ),
        },
      ],
      data: dot.get(props, 'system.companyList.data', []),                       // table渲染的数据
    };
  }
  componentWillReceiveProps(nextprops) {
    this.setState({
      confirmLoading: dot.get(nextprops, 'system.confirmLoading'),
      total: dot.get(nextprops, 'system.companyList._meta.result_count') || 10,
      data: dot.get(nextprops, 'system.companyList.data') || [],
    });
  }
  // 点击编辑公司，弹出弹窗
  onHandleChange(text, record, index) {
    this.setState({ defaultValue: text.name, index, third_part_id: text._id });
    this.showModal();
  }
  // 控制编辑公司弹窗
  showModal = () => {
    this.setState({ visible: true });
  }
  // 点击弹窗ok键，确认修改
  handleOk = () => {
    if (this.state.defaultValue == '') {
      message.warning('公司名不能为空');
      return;
    }
    this.props.dispatch({
      type: 'system/editCompanyE',
      payload: {
        third_part_id: this.state.third_part_id,
        params: {
          name: this.state.defaultValue,
        },
        page: this.state.page,
      },
    });
    this.setState({ visible: false });
  }
  // 点击取消，弹窗关闭
  handleCancel = () => {
    this.setState({ visible: false });
  }
  // 获得输入框内容
  handleChange = (e) => {
    this.setState({ defaultValue: e.target.value });
  }
  // 控制新建公司modal
  buildShowModal = () => {
    this.setState({ buildVisible: true });
  }
  // 获得新建公司输入框内容
  buildHandleChange = (e) => {
    this.setState({ buildValue: e.target.value });
  }
  // 关闭新建公司输入框
  buildHandleCancel = () => {
    this.setState({ buildVisible: false });
  }
  // 添加公司
  buildHandleOk = () => {
    if (this.state.buildValue == '') {
      message.warning('公司名不能为空');
      return;
    }
    this.props.dispatch({
      type: 'system/addCompanyE',
      payload: {
        params: { supplier_id: aoaoBossTools.readDataFromLocal(1, 'supplier_id'),
          name: this.state.buildValue },
        page: this.state.page,
      },
    });
    this.setState({ buildVisible: false,
      buildValue: '',
    });
  }
  // 控制table页码切换
  tableChange = (page) => {
    this.setState({ page });
    this.props.dispatch({
      type: 'system/getCompanyListE',
      payload: `limit=10&page=${page}&supplier_id=${aoaoBossTools.readDataFromLocal(1, 'supplier_id')}&permission_id=${Modules.ModuleSystemOperationManage.id}`,
    });
  }
  // 禁用三方公司
  stopCompany = (text) => {
    this.props.dispatch({
      type: 'system/editCompanyE',
      payload: {
        third_part_id: text._id,
        params: {
          state: -60,    // 禁用三方公司
        },
        page: this.state.page,
      },
    });
  }
  // 启用公司
  openCompany = (text) => {
    this.props.dispatch({
      type: 'system/editCompanyE',
      payload: {
        third_part_id: text._id,
        params: {
          state: 60,    // 启用三方公司
        },
        page: this.state.page,
      },
    });
  }
  render() {
    const {
      visible,                 // 控制弹窗显示
      confirmLoading,          // 控制table loading
      title,                   // 弹窗标题
      defaultValue,            // 弹窗输入值
      buildTitle,              // 新建弹窗的标题
      buildVisible,            // 控制新建弹窗是否显示
      buildValue,              // 新建弹窗的值
      buildDefaultValue,       // 新建弹窗默认值
      total,                   // 数据总数
    } = this.state;
    return (
      <div>
        <Table
          columns={this.state.columns} pagination={{
            defaultPageSize: 10,
            onChange: this.tableChange,
            total,
            showQuickJumper: true,
          }}
          dataSource={this.state.data} rowKey={record => (record._id)} loading={confirmLoading}
          bordered
        />
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          公司名称：<Input value={defaultValue} onChange={this.handleChange} />
        </Modal>
        {/* 运营管理录入,添加公司名称(运营管理)*/}
        {Operate.canOperateSystemAddCompany()
          ? <Button loading={this.state.confirmLoading} type="primary" onClick={this.buildShowModal}>添加公司</Button>
          : null}
        <Modal
          title={buildTitle}
          visible={buildVisible}
          onOk={this.buildHandleOk}
          onCancel={this.buildHandleCancel}
        >
          公司名称：
        <Input
          value={buildValue}
          defaultValue={buildDefaultValue}
          onChange={this.buildHandleChange}
        />
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ system }) {
  return { system };
}

export default connect(mapStateToProps)(companyList);
