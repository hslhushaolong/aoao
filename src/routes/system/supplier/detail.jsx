
/**
 * 供应商管理-详情页
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Form, Row, Button, Input, Icon } from 'antd';

import { CoreContent, CoreForm } from '../../../components/core';
import { supplierState, bizDistrictState } from './define';
import styles from './component/style.less';


class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: dot.get(props, 'system.supplierDetail.biz_district_info_list') || [],     // 供应商商圈列表
      dataSearch: [], // 供应商过滤数据-过滤商圈、平台、城市
      filterDropdownVisibleBizDistrictName: false, // 是否显示商圈查询框
      filterDropdownVisiblePlatform: false, // 是否显示平台查询框
      filterDropdownVisibleCityName: false, // 是否显示城市查询框
      filterIconBizDistrictName: false, // 控制table栏icon图标颜色 商圈
      filterIconPlatform: false, // 控制table栏icon图标颜色 平台
      filterIconCityName: false, // 控制table栏icon图标颜色 城市
      bizDistrictName: '', // 商圈
      platformName: '', // 平台
      cityName: '', // 城市
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      dataSource: dot.get(nextProps, 'system.supplierDetail.biz_district_info_list') || [],     // 供应商商圈列表
    });
  }

  // 改变商圈值
  onChangeBizDistrictName = (e) => {
    // filtered: 有检索条件为true,否则为false
    const text = e.target.value;
    this.setState({
      bizDistrictName: text, // 商圈
      filterIconBizDistrictName: !!text, // 控制table栏icon图标颜色 商圈
    });
  }

  // 改变平台值
  onChangePlatformName = (e) => {
    const text = e.target.value;
    this.setState({
      platformName: text, // 平台
      filterIconPlatform: !!text, // 控制table栏icon图标颜色 平台
    });
  }

  // 改变城市值
  onChangeCityName = (e) => {
    const text = e.target.value;
    this.setState({
      cityName: text, // 城市
      filterIconCityName: !!text, // 控制table栏icon图标颜色 城市
    });
  }

  // 查询商圈
  onSearchBizDistrictName = () => {
    const { bizDistrictName, dataSource } = this.state;
    const reg = new RegExp(bizDistrictName, 'gi');
    const data = Object.assign(dataSource);
    this.setState({
      filterDropdownVisibleBizDistrictName: false, // 是否显示商圈查询框
      dataSearch: data.map((record) => { // 供应商商圈列表
        const match = record.biz_district_name && record.biz_district_name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          biz_district_name: record.biz_district_name,
        };
      }).filter(record => !!record),
    });
  }

  // 查询平台
  onSearchPlatformName = () => {
    const { platformName, dataSource } = this.state;
    const reg = new RegExp(platformName, 'gi');
    const data = Object.assign(dataSource);
    this.setState({
      filterDropdownVisiblePlatform: false, // 是否显示平台查询框
      dataSearch: data.map((record) => { // 供应商商圈列表
        const match = record.platform_name && record.platform_name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          platform_name: record.platform_name,
        };
      }).filter(record => !!record),
    });
  }

  // 查询城市
  onSearchCityName = () => {
    const { cityName, dataSource } = this.state;
    const reg = new RegExp(cityName, 'gi');
    const data = Object.assign(dataSource);
    this.setState({
      filterDropdownVisibleCityName: false, // 是否显示城市查询框
      dataSearch: data.map((record) => { // 供应商商圈列表
        const match = record.city_name_joint && record.city_name_joint.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          city_name_joint: record.city_name_joint,
        };
      }).filter(record => !!record),
    });
  }

  // 重置商圈
  onReset = (type) => {
    const { bizDistrictName, platformName, cityName, filterIconBizDistrictName, filterIconPlatform, filterIconCityName } = this.state;
    this.setState({
      bizDistrictName: type === 'bizDistrictName' ? '' : bizDistrictName, // 商圈
      filterIconBizDistrictName: type === 'bizDistrictName' ? false : filterIconBizDistrictName, // 制table栏icon图标颜色 商圈
      platformName: type === 'platformName' ? '' : platformName, // 平台
      filterIconPlatform: type === 'platformName' ? false : filterIconPlatform, // 控制table栏icon图标颜色 平台
      cityName: type === 'cityName' ? '' : cityName, // 城市
      filterIconCityName: type === 'cityName' ? false : filterIconCityName, // 控制table栏icon图标颜色 城市
    });
  }

  // 基本信息
  renderUserInfo = () => {
    const { supplierDetail } = this.props.system;
    const formItems = [
      {
        label: '供应商名称',
        form: dot.get(supplierDetail, 'supplier_name', '--'),
      }, {
        label: '供应商ID',
        form: dot.get(supplierDetail, 'supplier_id', '--'),
      }, {
        label: '状态',
        form: supplierDetail.state ? supplierState.description(supplierDetail.state) : '--',
      }, {
        label: '创建时间',
        form: supplierDetail.created_at ? moment(dot.get(supplierDetail, 'created_at')).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '禁用时间',
        form: supplierDetail.forbidden_at ? moment(dot.get(supplierDetail, 'forbidden_at')).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新操作时间',
        form: supplierDetail.updated_at ? moment(dot.get(supplierDetail, 'updated_at')).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新操作人',
        form: dot.get(supplierDetail, 'operator_name', '--'),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="基本信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 业务范围
  renderBusiness = () => {
    const { bizDistrictName, platformName, cityName } = this.state;
    const data = bizDistrictName || platformName || cityName ? this.state.dataSearch : this.state.dataSource;
    const columns = [
      {
        title: '平台商圈ID',
        dataIndex: 'platform_district_id',
        key: 'platform_district_id',
        width: '10%',
      },
      {
        title: '商圈',
        dataIndex: 'biz_district_name',
        key: 'biz_district_name',
        width: '20%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input
                placeholder="请输入商圈"
                value={this.state.bizDistrictName}
                onChange={this.onChangeBizDistrictName}
                onPressEnter={this.onSearchBizDistrictName}
              />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearchBizDistrictName} size="small" style={{ float: 'left' }}>查询</Button>
              <Button size="small" onClick={() => this.onReset('bizDistrictName')} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filterIconBizDistrictName ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisibleBizDistrictName,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisibleBizDistrictName: visible, // 是否显示商圈查询框
          });
        },
      },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        width: '20%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input
                placeholder="请输入平台"
                value={this.state.platformName}
                onChange={this.onChangePlatformName}
                onPressEnter={this.onSearchPlatformName}
              />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearchPlatformName} size="small" style={{ float: 'left' }}>查询</Button>
              <Button size="small" onClick={() => this.onReset('platformName')} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filterIconPlatform ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisiblePlatform,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisiblePlatform: visible, // 是否显示平台查询框
          });
        },
      },
      {
        title: '城市',
        dataIndex: 'city_name_joint',
        key: 'city_name_joint',
        width: '20%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input
                placeholder="请输入城市"
                value={this.state.cityName}
                onChange={this.onChangeCityName}
                onPressEnter={this.onSearchCityName}
              />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearchCityName} size="small" style={{ float: 'left' }}>查询</Button>
              <Button size="small" onClick={() => this.onReset('cityName')} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filterIconCityName ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisibleCityName,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisibleCityName: visible, // 是否显示城市查询框
          });
        },
      },
      {
        title: '添加时间',
        dataIndex: 'distribute_time',
        key: 'distribute_time',
        width: '20%',
        render: (text) => {
          return (
            <span>{text ? moment(dot.get(text)).format('YYYY-MM-DD HH:mm') : '--'}</span>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        filterMultiple: false, // 是否多选
        // 表头的筛选菜单项
        filters: [{
          text: '启用',
          value: '启用',
        }, {
          text: '禁用',
          value: '禁用',
        }],
        // 自定义 fiter 图标。
        filterIcon: <Icon type="bars" style={{ color: '#aaa' }} />,
        // 本地模式下，确定筛选的运行函数
        onFilter: (text, record) => bizDistrictState.description(record.state) === text,
        render: (text) => {
          return (
            <span>{bizDistrictState.description(text)}</span>
          );
        },
      },
    ];
    return (
      <div>
        <CoreContent title="业务范围" footer={`总共${this.state.dataSource.length}条`} style={{ textAlign: 'right' }} >
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ y: 1530 }}
            bordered
          />
        </CoreContent>
        <Row justify={'center'} type="flex" className="mgt16">
          <Button>
            <Link to="System/Supplier">返回</Link>
          </Button>
        </Row>
      </div>
    );
  }
  // 渲染
  render() {
    const { renderUserInfo, renderBusiness } = this;
    return (
      <div>
        {/* 基本信息 */}
        {renderUserInfo()}

        {/* 业务范围 */}
        {renderBusiness()}
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}
export default Form.create()(connect(mapStateToProps)(Detail));
