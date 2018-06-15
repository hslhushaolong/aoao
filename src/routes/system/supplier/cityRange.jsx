import React, { Component } from 'react';
import { Form, Table, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import dot from 'dot-prop';
import { CoreContent } from '../../../components/core';
import { Platform } from '../../../application/define';

import Search from './citySearch'


class Range extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: dot.get(props, 'system.cityDistributeList', { _meta: { result_count: 0 } }),
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'system.cityDistributeList', []),
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    const tempParams = {
      params,
      page: params.page || 1,
      limit: 30,
    };
    // 调用搜索
    this.private.dispatch({ type: 'system/getCityDistributionE', payload: tempParams });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    return (
      <Search onSearch={onSearch} onDownload={onDownload} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [{
      title: '平台',
      dataIndex: 'platform_code',
      key: 'platform_code',
      render: (text) => {
        return Platform.description(text);
      },
    },
    {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      render: (text) => {
        let names = [];
        if (Object.prototype.toString.call(text) === '[object String]') text = [text];
        if (!text) {
          return '暂无';
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
              {text[0]}等{text.length}个城市
          </Popover>
          );
        }
        return names;
      },
    },
    {
      title: '分配状态',
      dataIndex: 'allot',
      key: 'allot',
      render: (text) => {
        return text === 1 ? '未分配' : '已分配';
      },
    }, {
      title: '当前归属供应商',
      dataIndex: 'supplier_name_list',
      key: 'supplier_name_list',
      render: (text) => {
        return text;
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: () => {
        return '启用';
      },
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
      showTotal: total => `共 ${total} 条，30条/页`,
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 1000 }} />
      </CoreContent>
    );
  }

  render = () => {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索 */}
        {renderSearch()}
        {/* 渲染内容 */}
        {renderContent()}
      </div>
    );
  }

}

function mapStateToProps({ system }) {
  return { system };
}

export default Form.create()(connect(mapStateToProps)(Range));
