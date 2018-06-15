/**
 * 骑士补款，详情
*/
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import moment from 'moment';
import { Button, Table, Tooltip, Popconfirm, Input, Row, Col, message, DatePicker } from 'antd';

import { CoreContent } from '../../../../../components/core/index';
import { KnightSalaryApproveState, FillingEventType, DeductSubmitType, KnightSalaryType, renderReplaceAmount } from '../../../../../application/define/index';

class Detail extends Component {
  constructor(props) {
    super(props);
    const fundList = dot.get(props, 'salaryModel.knightFillingMessage.fund_list', []);
    this.state = {
      selectedRowKeys: [], // 选中的表格索引
      selectedRows: [], // 选中的数据
      fund_id: KnightSalaryType.fillingMoney, // 骑士补款
      pagination: false, // 表格是否显示分页器
      total: dot.get(props, 'salaryModel.knightFillingMessage.fund_list').length || 0, // 数据总量
      summaryDataSource: dot.get(props, 'salaryModel.knightFillingMessage.collect_items', []), // 汇总内容
      dataSource: fundList, // 列表内容
      isUpsertSalarySuccess: dot.get(props, 'salaryModel.knightFillingMessage.isUpsertSalarySuccess', false),
    };
  }

  componentWillReceiveProps = (nextprops) => {
    this.setState({
      summaryDataSource: dot.get(nextprops, 'salaryModel.knightFillingMessage.collect_items', []), // 汇总内容
      dataSource: dot.get(nextprops, 'salaryModel.knightFillingMessage.fund_list', []), // 列表内容
    });
  }

  // 批量提交
  onClickSelectedRows = () => {
    const { selectedRows } = this.state;
    const { location } = this.props;
    if (selectedRows.length) {
      // 提交前对未保存的数据进行验证
      const isEditing = selectedRows.filter((item) => {
        return item.editable;
      });
      if (isEditing.length > 0) {
        message.error('请保存数据后再提交申请');
        return false;
      }
      this.props.dispatch({
        type: 'salaryModel/getFillingMoneyDetailSumbit',
        payload: {
          data_list: selectedRows, // 选中的数据
          id: location.query.id, // 母单di
          detail_list: location.query.detail_list, // 详情列表
          fund_id: this.state.fund_id, // 骑士补款
          sort: -1, // 排序
        },
      });
      this.setState({ selectedRowKeys: [], selectedRows: [] });
    }
  }

  // 批量选中
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 扣款列表撤回
  onClickRevert = (_id) => {
    const { location } = this.props;
    if (this.state.isUpsertSalarySuccess) {
      this.state.dataSource.splice(this.state.dataSource.indexOf(_id), 1);
    }
    this.props.dispatch({ type: 'salaryModel/getFillingMoneyDetailWithdraw',
      payload: {
        _id, // id
        detail_list: location.query.detail_list, // 详情列表
        fund_id: this.state.fund_id, // 骑士补款
        id: location.query.id, // 母单id
        sort: -1, // 排序
      } });
  }

  // 扣款列表提交
  onClickSubmit = (record) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => record._id === item._id)[0];
    const { location } = this.props;
    if (target) {
      delete target.editable;
      this.cacheData = newData.map(item => ({ ...item }));
      this.props.dispatch({ type: 'salaryModel/getFillingMoneyDetailSumbit',
        payload: {
          data_list: [target], // 选中的数据
          id: location.query.id, // 母单id
          detail_list: location.query.detail_list, // 详情列表
          fund_id: this.state.fund_id, // 骑士补款
          sort: -1, // 排序
        },
      });
    }
  }

  // 扣款列表编辑
  onClickEdit = (id) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => id === item._id)[0];
    if (target) {
      target.editable = true;
      this.setState({ dataSource: newData });
    }
  }

  // 扣款列表编辑改变文本框里的内容
  onChangeValue = (value, id, column) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => id === item._id)[0];
    if (target) {
      target[column] = value;
      this.setState({ dataSource: newData });
    }
  }

  // 改变扣款日期
  onChangeDatePicker = (val, dateString, id, column) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => id === item._id)[0];
    if (target) {
      target[column] = dateString;
      this.setState({ dataSource: newData });
    }
  }

  // 保存可编辑的数据
  onClickSave = (id) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => id === item._id)[0];
    if (target) {
      if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(target.amount)) {
        this.setState({
          submitAble: false,
        });
        message.error('请输入正确的金额');
        return false;
      }
      target.editable = false;
      target[target.handl_type] = target.amount;
      this.setState({ dataSource: newData });
    }
  }

  // 扣款列表删除
  onDelete = (_id, index) => {
    this.props.dispatch({
      type: 'salaryModel/getFillingMoneyDetailRemoveDetail',
      payload: {
        _id, // id
        index, // 下标
      } });
  }

  // 扣款汇总
  renderSummary = () => {
    const { summaryDataSource } = this.state;
    const obj = {};
    summaryDataSource.forEach((val) => {
      for (const k in val) {
        obj[k] = val[k];
      }
    });
    const width = summaryDataSource.length > 6 ? 80 : 150;
    const style = {
      width,
      textAlign: 'center',
    };
    return (
      <div>
        <CoreContent>
          <Row type="flex">
            {
              <Col className="mgt16" key={'汇总项'} style={style}>{'汇总项'}</Col>
            }
            {
              Object.keys(obj).map((val, k) => {
                return <Col className="mgt16" key={k} style={style}>{FillingEventType.description(FillingEventType[val])}</Col>;
              })
            }
          </Row>
          <Row type="flex">
            {
              <Col className="mgt16" key={'城市'} style={style}>{'城市'}</Col>
            }
            {
              Object.keys(obj).map((val, k) => {
                return <Col className="mgt16" key={k} style={style}>{renderReplaceAmount(obj[val])}</Col>;
              })
            }
          </Row>
        </CoreContent>
        {
          Number(this.props.location.query.state) !== DeductSubmitType.waitForSubmit && <Button type="primary" size={'large'} style={{ width: '85px', marginLeft: '10px' }} onClick={this.onClickSelectedRows}>提交</Button>
        }
      </div>
    );
  }

  // 渲染input和DatePicker
  renderColumns(text, record, column) {
    // 判断是否为撤回
    if (record.editable) {
      // 判断column==date时，返回日期选择器，否则返回输入框
      if (column === 'date') {
        return (
          <DatePicker
            defaultValue={moment(record.date, 'YYYY-MM-DD')}
            onChange={(...arg) => {
              this.onChangeDatePicker(...arg, record._id, column);
            }
            }
          />
        );
      }
    }
    return (
      <div>
        { record.editable
          ? <Input style={{ margin: '-5px 0' }} value={text} onChange={e => this.onChangeValue(e.target.value, record._id, column)} />
          : text
      }
      </div>
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;
    dataSource.forEach((item) => {
      item.key = item._id;
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state !== KnightSalaryApproveState.reject && record.state !== KnightSalaryApproveState.disagree, //  驳回
      }),
    };
    let columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    }, {
      title: '商圈',
      dataIndex: 'district_name',
      key: 'district_name',
    }, {
      title: '骑士',
      dataIndex: 'knight_name',
      key: 'knight_name',
    }, {
      title: '补款项目',
      dataIndex: 'handl_type',
      key: 'handl_type',
      render: (text) => {
        return (
          <span>{FillingEventType.description(FillingEventType[text])}</span>
        );
      },
    }, {
      title: '补款金额／元',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        // 点击编辑时显示
        if (record.editable) {
          return this.renderColumns(text, record, 'amount');
        }
        // 将数字金额转为金额格式
        return renderReplaceAmount(text);
      },
    }, {
      title: '原因',
      dataIndex: 'cut_subsidy_other_cause',
      key: 'cut_subsidy_other_cause',
      render: (text, record) => this.renderColumns(text, record, 'cut_subsidy_other_cause'),
    }, {
      title: '补款日期',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => this.renderColumns(text, record, 'date'),
    }];
    if (Number(this.props.location.query.state) !== DeductSubmitType.waitForSubmit) {
      columns = [...columns, {
        title: '审核状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (text === KnightSalaryApproveState.reject) {
            // 驳回
            return (
              <Tooltip placement="top" title={record.examin_desc}>
                <span>{KnightSalaryApproveState.description(text)}</span>
              </Tooltip>
            );
          }
          return (
            <span>{KnightSalaryApproveState.description(text)}</span>
          );
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          if (record.editable) {
            return <a style={{ marginLeft: '10px' }} onClick={() => this.onClickSave(record._id)}>保存</a>;
          }
          switch (record.state) {
            // 待审核
            case KnightSalaryApproveState.pendding: return (
              <Popconfirm title="确定执行操作？" onConfirm={() => { this.onClickRevert(record._id); }} okText="确定" cancelText="取消">
                <a style={{ marginLeft: '10px' }}>撤回</a>
              </Popconfirm>
            );
            // 驳回
            case KnightSalaryApproveState.disagree:
            case KnightSalaryApproveState.reject: return (
              <div>
                <a style={{ marginLeft: '10px' }} onClick={() => this.onClickEdit(record._id)}>编辑</a>
                <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record._id, index)} okText="确认" cancelText="取消">
                  <a style={{ marginLeft: '10px' }}>删除</a>
                </Popconfirm>
                <Popconfirm title="确定执行操作？" onConfirm={() => { this.onClickSubmit(record); }} okText="确定" cancelText="取消">
                  <a style={{ marginLeft: '10px' }}>提交</a>
                </Popconfirm>
              </div>
            );
            default: return (
              <a>--</a>
            );
          }
        },
      },
      ];
      return (
        <CoreContent style={{ marginTop: '16px' }}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} pagination={false} />
        </CoreContent>
      );
    }
    return (
      <CoreContent>
        <Table
          columns={columns} dataSource={this.state.dataSource} pagination={false}
        />
      </CoreContent>
    );
  }

  render() {
    const { renderSummary, renderContent } = this;
    return (
      <div className="mgt16">

        {/* 扣款汇总 */}
        {renderSummary()}

        {/* 渲染内容列表 */}
        {renderContent()}
      </div>);
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Detail);
