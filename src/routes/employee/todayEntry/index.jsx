// 员工管理 / 今日待入职员工
import React, { Component } from 'react';
import { Form, Table, Popconfirm, Popover } from 'antd';
import { Link } from 'react-router';
import { connect } from 'dva';
import moment from 'moment';
import dot from 'dot-prop';
import { CoreContent } from '../../../components/core';
import { Platform } from '../../../application/define';

import Search from './search';


class Range extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: dot.get(props, 'employee.waitEntryStaffList', { _meta: { result_count: 0 } }),
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'employee.waitEntryStaffList', []),
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
    this.private.dispatch({ type: 'employee/getWaitEntryStaffE', payload: tempParams });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 删除骑士
  onConfirmDelete = (index, id) => {
    const { searchParams } = this.private;
    const tempParams = {
      params: searchParams,
      page: searchParams.page || 1,
      limit: 30,
    };
    this.props.dispatch({
      type: 'employee/deleteWaitEntryStaffE',
      payload: {
        id,
        state: -1,
        params: tempParams,
      },
    });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    return (
      <Search onSearch={onSearch} onDownload={onDownload} />
    );
  }

  // 渲染警告
  renderWarning = () => {
    return (
      <div className="systemTextColor mgb16">备注：列表仅显示今日待入职员工，请在当天及时处理入职，未处理的将统一于次日置为未处理。</div>
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [{
      title: '所属平台ID',
      dataIndex: 'knight_id',
      key: 'knight_id',
      render: (text) => {
        return text;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return text;
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => {
        return text;
      },
    },
    {
      title: '所属平台身份证号',
      dataIndex: 'identity_card_id',
      key: 'identity_card_id',
      render: (text) => {
        return text && text.split('').map((item, index) => {
          return index >= 4 && index < 14 ? '*' : item;
        }).join('');
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name_list',
      key: 'supplier_name_list',
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
              {text[0]}等{text.length}个供应商
          </Popover>
          );
        }
        return names;
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      render: (text) => {
        return text;
      },
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      render: (text) => {
        return text;
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      render: (text) => {
        return text;
      },
    }, {
      title: '创建时间',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (text) => {
        return text;
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 120,
      render: (text, record, index) => {
        return (
          <div>
            <Link target="_blank" to={`Employee/TodayEntry/Edit?id=${record._id}`}>编辑</Link>
            <Popconfirm title="确定删除?" onConfirm={() => this.onConfirmDelete(index, record._id)}>
              <span className="mgl8 systemTextColor pointer">删除</span>
            </Popconfirm>
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
    const { renderSearch, renderContent, renderWarning } = this;
    return (
      <div>
        {/* 渲染搜索 */}
        {renderSearch()}
        {/* 渲染警告 */}
        {renderWarning()}
        {/* 渲染内容 */}
        {renderContent()}
      </div>
    );
  }

}

function mapStateToProps({ employee }) {
  return { employee };
}

export default Form.create()(connect(mapStateToProps)(Range))
