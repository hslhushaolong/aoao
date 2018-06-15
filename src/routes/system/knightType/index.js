/**
 * 骑士类型设置列表
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm } from 'antd';
import { authorize } from '../../../application';
import { CoreSearch, CoreContent } from '../../../components/core';
import Modules from '../../../application/define/modules';

const { Option } = Select;

class KnightType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                                                        // 搜索的form
      newVisible: false,                                                      // 新建类型对话框控制
      editVisible: false,                                                     // 编辑类型对话框控制
      dataSource: dot.get(props, 'system.knightTypeList.data', []),           // 表格数据
      total: dot.get(props, 'system.knightTypeList._meta.result_count', 0),   // 表格数据总条数
      buildSelect: undefined,                                                    // 新建平台选择
      buildWorkType: undefined,                                                      // 新建工作性质
      buildName: '',                                                          // 新建自定义类型
      editName: '',                                                           // 编辑自定义类型
      record: '',                                                             // 记录编辑的ID
      storePlatCode: '',                                                      // 记录点击编辑的平台
      storeId: '',                                                            // 记录点击编辑的ID
      storeWorkType: '',                                                       // 记录工作性质
      searchWorkType: '',                                                      // 搜索工作类型
    };
  }

  // 收到参数前生命周期
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'system.knightTypeList.data', []),         // 表格数据
      total: dot.get(nextProps, 'system.knightTypeList._meta.result_count', 0), // 表格数据总条数
    });
  }

  // 全职／兼职转枚举值
  transWorkType = (value) => {
    if (value === '全职') {
      return 3001;  // 全职白班
    } else {
      return 3002;  // 全职夜班
    }
  }

  // 换页
  tableChange = (page, size) => {
    const filed = this.state.form.getFieldsValue();
    const params = {
      account_id: authorize.account.id,
      limit: 30,
      page,
      state: Number(filed.state),
      platform_code: filed.platform_code,
      permission_id: Modules.ModuleSystemKnightType.id,
    };
    this.props.dispatch({
      type: 'system/getKnightTypeE',
      payload: params,
    });
  }

  // 重置
  onReset = () => {
    this.state.form.resetFields();
    this.setState({
      searchWorkType: '',
    });
  }

  // 把工作性质转换为枚举
  transWorkTypeToInt = (work) => {
    if (work === '全职') {
      return 3001;
    }
    if (work === '兼职') {
      return 3002;
    }
  }

  // 翻译工作性质
  transWorkTypeToString = (work) => {
    if (work === 3001) {
      return '全职';
    }
    if (work === 3002) {
      return '兼职';
    }
  }

  // 搜索
  onSearch = () => {
    const filed = this.state.form.getFieldsValue();
    // 设置保存之后默认搜索的工作类型
    this.setState({
      searchWorkType: filed.workType,
    });
    const params = {
      account_id: authorize.account.id,
      limit: 30,
      page: 1,
      platform_code: filed.platform_code,   // 平台
      work_type: this.transWorkTypeToInt(filed.workType),   // 工作类型
      custom_type: filed.custom_type,  // 自定义骑士类型名称
      permission_id: Modules.ModuleSystemKnightType.id,
    };
    // 状态60启用 -60停用 是int
    if (filed.state) {
      params.state = Number(filed.state);
    }

    this.props.dispatch({
      type: 'system/getKnightTypeE',
      payload: params,
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 点击新建
  onBuildType = () => {
    this.setState({
      newVisible: true,
    });
  }

  // 隐藏对话框
  onhideModalBuild = () => {
    this.setState({
      newVisible: false,
      buildSelect: '',    // 新建的平台
      buildName: '',      // 新建的名字
      buildWorkType: '',  // 新建的骑士类型
    });
  }

  // 确认新建对话框
  onBuildOk = () => {
    const { buildSelect, buildName, buildWorkType } = this.state;
    // antdDesign 输入框清空数据会变成''，筛选过滤
    if (buildSelect === '' || buildSelect == null) {
      message.warning('请选择平台');
    } else if (buildName === '' || buildSelect == null) {
      message.warning('请填写骑士类型');
    } else if (buildWorkType === '' || buildSelect == null) {
      message.warning('请选择工作性质');
    } else {
      const params = {
        account_id: authorize.account.id,
        custom_type: buildName,
        platform_code: buildSelect,
        state: 60,    // 启用
        work_type: this.transWorkType(buildWorkType),
      };
      // 添加骑士类型
      this.props.dispatch({ type: 'system/addKnightTypeE', payload: params });
      this.setState({
        newVisible: false,
        buildSelect: '',
        buildName: '',
        buildWorkType: '',
      });
    }
  }

  // 新建类型平台回调
  onChangeSelect = (value) => {
    this.setState({
      buildSelect: value,
    });
  }

  // 新建类型工作性质回调
  onChangeWorkType = (value) => {
    this.setState({
      buildWorkType: value,
    });
  }

  // 新建名字平台回调
  onChangeName = (value) => {
    this.setState({
      buildName: value.target.value,
    });
  }

  // 点击编辑
  onEdit = (platform_code, id, custom_type, work_type) => {
    this.setState({
      editVisible: true,
      storePlatCode: platform_code,
      storeId: id,
      storeWorkType: this.transWorkTypeToString(work_type),
      editName: custom_type,
    });
  }

  // 隐藏编辑对话框
  onhideModalEdit = () => {
    this.setState({
      editVisible: false,
      editName: '',
    });
  }

  // 编辑确认
  onEditOk = () => {
    const { editName, storeWorkType } = this.state;
    if (this.state.editName === '') {
      message.warning('请填写骑士类型');
    } else {
      const params = {};
      params.url = this.state.storeId;
      params.params = {
        account_id: authorize.account.id,
        custom_type: editName,
        platform_code: this.state.storePlatCode,
        state: 60,    // 启用骑士类型
        work_type: this.transWorkType(storeWorkType),
      };
      // 更新数据
      this.props.dispatch({ type: 'system/editKnightTypeE', payload: params });
      this.setState({
        newVisible: false,
      });
      this.setState({
        editVisible: false,
        editName: '',
      });
    }
  }

  // 禁用
  onStop = (platform_code, id, custom_type, workType) => {
    const params = {};
    params.url = id;
    params.params = {
      account_id: authorize.account.id,
      platform_code,
      state: -60,            // 状态为禁用骑士类型
      work_type: workType,
      custom_type,
    };
    // 禁用
    this.props.dispatch({ type: 'system/editKnightTypeE', payload: params });
  }

  // 编辑名字平台回调
  onChangeEditName = (value) => {
    this.setState({
      editName: value.target.value,
    });
  }

  // 转换平台为汉字
  transChinese = (str) => {
    if (str === 'elem') {
      return '饿了么';
    } else if (str === 'meituan') {
      return '美团';
    } else if (str === 'baidu') {
      return '百度';
    } else if (str === 60) {    // 启用 骑士类型
      return '启用';
    } else if (str === -60) {    // 禁用 骑士类型
      return '禁用';
    }
  }
  // 选择平台回调
  onChangeSelect = (value) => {
    this.setState({
      buildSelect: value,
    });
  }
  // 渲染搜索区域
  renderSearch = () => {
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform_code')(
          <Select placeholder="请选择平台" mode="multiple">
            {authorize.platform().map(item => (
              <Option value={item.id} key={item.id}>{item.name}</Option>
            ))}
          </Select>,
        )),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择状态">
            <Option value="60" key="60">启用</Option>
            <Option value="-60" key="-60">禁用</Option>
          </Select>,
        )),
      },
      {
        label: '工作性质',
        form: form => (form.getFieldDecorator('workType')(
          <Select placeholder="请选择工作性质">
            <Option value="全职" key="quanzhi">全职</Option>
            <Option value="兼职" key="jianzi">兼职</Option>
          </Select>,
        )),
      },
      {
        label: '自定义类型',
        form: form => (form.getFieldDecorator('custom_type')(
          <Input placeholder="请输入自定义类型" />,
        )),
      },
    ];
    const props = {
      items,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  }

  // 渲染列表区域
  renderList = () => {
    const columns = [{
      title: '平台',
      dataIndex: 'platform_code',
      key: 'platform_code',
      render: (text) => {
        return (
          <span>{this.transChinese(text)}</span>
        );
      },
    }, {
      title: '骑士类型',
      dataIndex: 'knight_type',
      key: 'knight_type',
    }, {
      title: '工作性质',
      dataIndex: 'work_type',
      key: 'work_type',
      render: (text, record) => {
        let workType = '全职';
        if (text === 3002) {
          workType = '兼职';
        }
        return (
          <span>{workType}</span>
        );
      },
    }, {
      title: '自定义类型',
      dataIndex: 'custom_type',
      key: 'custom_type',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return (
          <span>{this.transChinese(text)}</span>
        );
      },
    }, {
      title: '编辑',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            {record.state === 60 ?
              <span>
                <a style={{ color: '#FF7700' }} onClick={() => { this.onEdit(record.platform_code, record._id, record.custom_type, record.work_type); }}>编辑</a>
                <Popconfirm placement="bottomRight" title={'确定要禁用骑士类型吗'} onConfirm={() => { this.onStop(record.platform_code, record._id, record.custom_type, record.work_type); }} okText="确认" cancelText="取消">
                  <a style={{ color: '#FF7700', marginLeft: '10px' }}>禁用</a>
                </Popconfirm>
              </span>
              : null}
          </div>
        );
      },
    }];
    const newDataSource = this.state.dataSource;
    return (
      <Table
        dataSource={newDataSource} columns={columns} rowKey={(record, index) => {
          return index;
        }}
        pagination={{
          defaultPageSize: 30,
          onChange: this.tableChange,
          total: this.state.total,
          showQuickJumper: true,
        }}
        bordered
      />
    );
  }

  // 渲染新建按钮
  renderButton = () => {
    return (
      <div>
        <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.onBuildType}>新增骑士类型</Button>
        <Modal
          title="新增骑士类型"
          visible={this.state.newVisible}
          onOk={this.onBuildOk}
          onCancel={this.onhideModalBuild}
          okText="确认"
          cancelText="取消"
        >
          <Row style={{ width: '100%', marginBottom: '28px' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">平台：</Col>
            <Col span="10">
              <Select style={{ width: '100%' }} placeholder="请选择平台" value={this.state.buildSelect} onChange={this.onChangeSelect}>
                {authorize.platform().map(item => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginBottom: '28px' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">工作性质：</Col>
            <Col span="10">
              <Select style={{ width: '100%' }} placeholder="请选择工作性质" value={this.state.buildWorkType} onChange={this.onChangeWorkType}>
                <Option value="全职" key="quanzhi">全职</Option>
                <Option value="兼职" key="jianzhi">兼职</Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ width: '100%' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">自定义类型：</Col>
            <Col span="10">
              <Input placeholder="请输入自定义类型" value={this.state.buildName} onChange={this.onChangeName} />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="编辑骑士类型"
          visible={this.state.editVisible}
          onOk={() => { this.onEditOk(); }}
          onCancel={this.onhideModalEdit}
          okText="确认"
          cancelText="取消"
        >
          <Row style={{ width: '100%', marginBottom: '28px' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">平台：</Col>
            <Col span="10" style={{ lineHeight: '28px' }}>
              {this.transChinese(this.state.storePlatCode)}
            </Col>
          </Row>
          <Row style={{ width: '100%', marginBottom: '28px' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">工作性质：</Col>
            <Col span="10" style={{ lineHeight: '28px' }}>
              {this.state.storeWorkType}
            </Col>
          </Row>
          <Row style={{ width: '100%' }}>
            <Col style={{ lineHeight: '28px', textAlign: 'right' }} offset="3" span="4">自定义类型：</Col>
            <Col span="10">
              <Input placeholder="请输入自定义类型" value={this.state.editName} onChange={this.onChangeEditName} />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染搜索区域 */}
        {this.renderSearch()}
        {/* 渲染添加按钮 */}
        {this.renderButton()}
        {/* 渲染列表 */}
        {this.renderList()}
      </div>
    );
  };
}

function mapStateToProps({ system }) {
  return { system };
}
export default connect(mapStateToProps)(KnightType);
