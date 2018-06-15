import React, { Component } from 'react';
import { Form, Table, Popover, Switch, Popconfirm } from 'antd';
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
      dataSource: dot.get(props, 'system.distributeList', { _meta: { result_count: 0 } }),
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'system.distributeList', []),
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
    this.private.dispatch({ type: 'system/getBusinessDistributionE', payload: tempParams });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 商圈提醒设置
  onReminderChange = (flag, id) => {
    this.props.dispatch({
      type: 'system/bizSetUpE',
      payload: {
        flag: flag ? 1 : 0, // true为提醒，false为不提醒
        biz_district_id: id,
        page: this.private.searchParams.page || 1,
        limit: 30,
        params: this.private.searchParams,
      },
    });
  }

  // 商圈启用禁用
  onBizDistrictChange = (id, state, index) => {
    this.props.dispatch({
      type: 'system/updateBizDistrictE',
      payload: {
        state,
        biz_district_id: id,
        index,
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

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [{
      title: '平台商圈ID',
      dataIndex: 'platform_biz_district_id',
      key: 'platform_biz_district_id',
      render: (text) => {
        if (Object.prototype.toString.call(text) === '[object String]') text = [text];
        return text[0];
      },
    },
    {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      render: (text) => {
        if (Object.prototype.toString.call(text) === '[object String]') text = [text];
        return text[0];
      },
    },
    {
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
      title: '当前供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
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
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return text === 1 ? '启用' : '禁用';
      },
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    }, {
      title: '禁用时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text, record) => {
        return record.state === 1 ? '--' : moment(text).format('YYYY-MM-DD HH:mm');
      },
    }, {
      title: '最新操作人',
      dataIndex: 'latest_operator_name',
      key: 'latest_operator_name',
      render: (text, record) => {
        return text ? `${text}（${record.latest_operator_phone}）` : '';
      },
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 60,
      render: (text, record, index) => {
        let { state } = record;
        state = state === 1 ? 0 : 1; // 操作要与显示状态正好相反
        const message = state === 1 ? '启用' : '禁用';
        const title = state === 1 ?
          <h2>你确定要启用该商圈?</h2> :
          (
            <div >
              <h2 style={{ marginBottom: '10px' }}>你确定要禁用该商圈?</h2>
              <p>禁用商圈前，请确认该商圈下员工已全部离职。</p>
            </div>
          );
        return (
          <Popconfirm
            title={title}
            okText="确定" cancelText="取消"
            onConfirm={() => {
              this.onBizDistrictChange(record.biz_district_id, state, index);
            }}
          >
            <span className="mgl8 systemTextColor pointer">
              {/* // 对比供应商状态，看是显示禁用还是启用状态 */}
              {message}
            </span>
          </Popconfirm>
        );
      },
    }, {
      title: '异常账号设置提醒',
      dataIndex: 'remind',
      key: 'remind',
      render: (text, record) => {
        const remind = text === 1 ? true : text !== 0;
        return (<Switch
          checkedChildren="开" unCheckedChildren="关" defaultChecked={remind} onChange={(...args) => {
            this.onReminderChange(...args, record.biz_district_id);
          }}
        />);
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
