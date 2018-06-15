// 薪资更新任务列表页
import moment from 'moment';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Table, Button, Popover } from 'antd';
import { CoreContent } from '../../../../components/core';
import { SalaryTaskState, SalaryTaskTime } from '../../../../application/define';
import { authorize } from '../../../../application';
import TaskCreateModal from './create';

import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      isShowTaskCreateModal: false,   // 是否显示创建内容的弹窗
      dataSource: dot.get(props, 'SalaryTaskModel.salaryTasks', []),   // 汇总数据
      positionList: dot.get(props, 'salaryModel.positionList', []), // 职位list
      supplierList: dot.get(props, 'system.supplierList', []),        // 供应商列表
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: dot.get(props, 'SalaryTaskModel.salaryTasks', []),
      positionList: dot.get(props, 'salaryModel.positionList', []), // 职位list
      supplierList: dot.get(props, 'system.supplierList', []),        // 供应商列表
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    // 调用搜索
    this.private.dispatch({ type: 'SalaryTaskModel/fetchSalaryTasks', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 显示创建弹窗
  onShowTaskCreateModal = () => {
    this.setState({
      isShowTaskCreateModal: true,
    });
  }

  // 隐藏创建弹窗
  onHideTaskCreateModal = () => {
    this.setState({
      isShowTaskCreateModal: false,
    });
  }

  // 创建任务
  onCreateTask = (values) => {
    this.private.dispatch({ type: 'SalaryTaskModel/createSalaryTasks', payload: values });
    this.onHideTaskCreateModal();
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    const props = {
      positionList: this.state.positionList,
    };
    return (
      <Search onSearch={onSearch} onDownload={onDownload} {...props} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [{
      title: '城市',
      dataIndex: 'city_list',
      key: 'city_list',
      render: (text) => {
        const names = [];
        text.forEach((item) => {
          names.push(item && item.city_name_joint);
        });
        return names.join('，');
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_list',
      key: 'biz_list',
      render: (text) => {
        let names = [];
        if (!text || text.length === 0) {
          return '全部';
        }
        // 只有一个时
        if (text.length === 1) {
          names = text[0];
        }
        // 多个时
        if (text.length > 1) {
          const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
          names = (
            <Popover placement="top" content={content} trigger="hover">
              {text[0]}等{text.length}个商圈
            </Popover>
          );
        }
        return names;
      },
    }, {
      title: '职位',
      dataIndex: 'position_id_list',
      key: 'position_id_list',
      render: (text) => {
        return authorize.poistionNameById(text[0]);
      },
    }, {
      title: '骑士类型',
      dataIndex: 'knight_type_list',
      key: 'knight_type_list',
      render: (text) => {
        let names = [];
        if (!text || text.length === 0) {
          return '全部';
        }
        // 只有一个时
        if (text.length === 1) {
          names = text[0];
        }
        // 多个时
        if (text.length > 1) {
          const content = <p style={{ width: '300px' }}>{text.join(',')}</p>;
          names = (
            <Popover placement="top" content={content} trigger="hover">
              {text[0]}等{text.length}个类型
            </Popover>
          );
        }
        return names;
      },
    }, {
      title: '薪资单更新日期',
      dataIndex: 'compute_date',
      key: 'compute_date',
      render: (text, record) => {
        return `${SalaryTaskTime.description(record.compute_time_slot)} - ${text}`;
      },
    }, {
      title: '创建日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    }, {
      title: '更新状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return SalaryTaskState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        // 只有已经完成的任务才能查看详情
        if (record.state !== SalaryTaskState.finish) {
          return '';
        }
        // 临时
        const cityCode = [];
        record.city_list.forEach((item) => {
          cityCode.push(item.city_code);
        });
        return (
          <div>
            <a target='_blank' href={`/#/Salary/Search/Records?id=${record._id}&platform=${record.platform_code}&city=${cityCode}&isTask=1`}>查看</a>
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    return (
      <CoreContent>
        <div style={{ marginBottom: '10px' }} >
          <Button type="primary" style={{ marginRight: '10px' }} onClick={this.onShowTaskCreateModal}>新建薪资更新任务</Button>
        </div>

        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 1000 }} />
      </CoreContent>
    );
  }

  // 渲染创建内容的弹窗
  renderTaskCreateModal = () => {
    return (<TaskCreateModal
      onSubmit={this.onCreateTask}
      onCancle={this.onHideTaskCreateModal}
      visible={this.state.isShowTaskCreateModal}
      supplierList={this.state.supplierList}
    />);
  }

  render() {
    const { renderSearch, renderContent, renderTaskCreateModal } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染内容栏目 */}
        {renderContent()}

        {/* 渲染创建任务的弹窗 */}
        {renderTaskCreateModal()}
      </div>
    );
  }
}

function mapStateToProps({ SalaryTaskModel, salaryModel, system }) {
  return { SalaryTaskModel, salaryModel, system };
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
