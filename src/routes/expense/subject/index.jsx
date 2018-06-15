// 科目列表页面
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm, Form, Popover } from 'antd';
import { Level, State, CostCenter } from '../transInt';
import { authorize } from '../../../application';
import dot from 'dot-prop';
import Search from './search';
import MyModal from './myModal';
import EditModal from './EditModel';
import Operate from '../../../application/define/operate';

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVisible: false,   // 新建弹窗
      editVisible: false,  // 编辑弹窗
      editData: {},           // 编辑信息
    };
  }
  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.props.dispatch({ type: 'expense/getSubjectListE', payload: { page, limit } });
  }
  // 分页
  tableChange = (page, size) => {
    this.props.dispatch({ type: 'expense/getSubjectListE', payload: { page, limit: size } });
  }
  // 展示表单数据
  renderTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
        render: (text) => {
          return <div>{Level[`${text}`]}</div>;
        },
      },
      {
        title: '科目名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          // 如果数据长度大于8就气泡展示
          return (
            <div>{text.length <= 8 ? text :
            <Popover content={text} title="科目描述" trigger="hover">
              <div>{text.length <= 8 ? text : text.substr(0, 8)}</div>
            </Popover>}
            </div>
          );
        },
      },
      {
        title: '上级科目',
        dataIndex: 'parent_name',
        key: 'parent_name',
        render: (text) => {
          return text === '' ? '--' : text;
        },
      },
      {
        title: '创建日期',
        dataIndex: 'created_date',
        key: 'created_date',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '成本归属',
        dataIndex: 'cost_center',
        key: 'cost_center',
        render: (text) => {
          return <div>{text.map(item => (<span style={{ margin: '0 5px' }} key={item}> {CostCenter[`${item}`]} </span>))}</div>;
        },
      },
      {
        title: '科目描述',
        dataIndex: 'desc',
        key: 'desc',
        render: (text) => {
          if (text === '') {
            return '--';
          }
          // 如果长度大于8就气泡展示
          return (
            <div>{text.length <= 8 ? text :
            <Popover content={text} title="科目描述" trigger="hover">
              <div>{text.length <= 8 ? text : text.substr(0, 8)}</div>
            </Popover>}
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return <div>{State[`${text}`]}</div>;
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return (
            <div>{
              record.creator_id !== authorize.account.id ? null :
              Operate.canOperateExpenseSubjectEditButton() ?
              record.state === 1 ? <div><a onClick={() => { this.openEditModel(record); }} style={{ marginRight: '10px' }}>编辑</a>
                <Popconfirm title="您是否确定停用该科目" onConfirm={() => { this.changeState(record._id, 0); }} okText="确定" cancelText="取消">
                  <a>停用</a>
                </Popconfirm>
              </div> : <div>
                <Popconfirm title="您是否确定启用该科目" onConfirm={() => { this.changeState(record._id, 1); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>启用</a>
                </Popconfirm>
                <Popconfirm title="您是否确定删除该科目" onConfirm={() => { this.changeState(record._id, -1); }} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm></div> : null
            }
            </div>
          );
        },
      },
    ];
    return (
      <Table
        columns={columns} dataSource={this.props.expense.subjectList.data} rowKey={record => record._id}
        onShowSizeChange={this.onShowSizeChange}
        pagination={{
          defaultPageSize: 30,
          onChange: this.tableChange,
          total: dot.get(this.props, 'expense.subjectList._meta.result_count', 0),
          showTotal: total => `总共${total}条`,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: this.onShowSizeChange,
        }}
      />
    );
  }

  // 状态编辑
  changeState = (id, state) => {
    // 停用启用编辑
    this.props.dispatch({
      type: 'expense/editSubjectE',
      payload: {
        _id: id,
        state,   // 0停用 1启用 -1删除
      },
    });
  }

  // 新增科目
  openModel = () => {
    // 获得科目名称列表
    this.props.dispatch({ type: 'expense/getSubjectNameE' });
    this.setState({
      newVisible: true,
    });
  }

  // 编辑科目
  openEditModel = (record) => {
    this.setState({
      editVisible: true,
      editData: record,  // 编辑信息
    });
  }

// 关闭新增科目
  closeModel = () => {
    this.setState({
      newVisible: false,
      editVisible: false,
    });
  }

  // 新建提交
  handleSubmit = (values) => {
    this.props.dispatch({
      type: 'expense/buildSubjectE',
      payload: values,
    });
    this.setState({
      newVisible: false,
    });
  }

  // 编辑提交
  handleEditSubmit = (values) => {
    this.props.dispatch({
      type: 'expense/editSubjectE',
      payload: values,
    });
    this.setState({
      editVisible: false,
    });
  }

  render = () => {
    return (
      <div>
        <Search />
        <div style={{ textAlign: 'right', margin: '10px 0' }}>
          {Operate.canOperateExpenseSubjectEditButton() ? <Button type="primary" onClick={this.openModel}>新增科目</Button> : ''}
        </div>
        {this.renderTable()}
        <MyModal visible={this.state.newVisible} onSubmit={this.handleSubmit} onCancel={this.closeModel} />
        <EditModal visible={this.state.editVisible} onSubmit={this.handleEditSubmit} onCancel={this.closeModel} editData={this.state.editData} />
      </div>
    );
  }
}

function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(Index);
