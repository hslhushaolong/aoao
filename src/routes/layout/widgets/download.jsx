/**
 * 下载任务列表的组建
 * */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Table, Tooltip } from 'antd';
import { utils } from '../../../application';
import { CoreContent } from '../../../components/core';

// 下载文件的类型定义
const DownloadTaskType = {
  salaryRecords: 'salary_collect',
  employeeRecords: 'download_staff',
  description(rawValue) {
    switch (rawValue) {
      case this.salaryRecords: return '薪资';
      case this.employeeRecords: return '员工列表';
      default: return '未知';
    }
  },
};

// 下载任务的状态
const DownloadState = {
  pendding: 0,
  process: 1,
  success: 100,
  failure: -100,
  description(rawValue) {
    switch (rawValue) {
      case this.pendding: return '待处理';
      case this.process: return '处理中';
      case this.success: return '处理完成';
      case this.failure: return '处理失败';
      default: return '未知';
    }
  },
};

class DownloadRecordsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.SystemDownloadModal.downloadRecords || [],
    };
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      dataSource: nextProps.SystemDownloadModal.downloadRecords || [],
    });
  };

  // 修改分页
  onChangePage = (page) => {
    this.props.dispatch({ type: 'SystemDownloadModal/fetchDownloadRecords', payload: { page } });
  }

  render() {
    const { dataSource } = this.state;
    const columns = [{
      title: '任务类型',
      dataIndex: 'target',
      key: 'target',
      render: text => DownloadTaskType.description(text),
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
    }, {
      title: '更新时间',
      dataIndex: 'update_at',
      key: 'update_at',
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: text => DownloadState.description(text),
    }, {
      title: '操作',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => {
        // 成功状态下，可下载文件
        if (record.state === DownloadState.success) {
          const type = DownloadTaskType.description(record.target);
          const time = moment(record.created_at).format('YYYY-MM-DD HH:mm');
          const filename = `${type}-${time}`;
          return <a download={filename} href={record.url}>下载</a>;
        }

        // 其他状态下，返回任务id
        return (
          <Tooltip title={`任务id: ${record.task_id}`}><Icon type="info-circle-o" /></Tooltip>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 10,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    return (
      <CoreContent style={{ width: '600px', margin: '10px 0px' }}>
        {/* 数据 */}
        <Table rowKey={record => record.task_id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }
}
function mapStateToProps({ SystemDownloadModal }) {
  return { SystemDownloadModal };
}

export default connect(mapStateToProps)(DownloadRecordsWidget);
