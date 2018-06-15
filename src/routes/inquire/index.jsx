/**
 * 大查询 index
 */
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { message, Icon } from 'antd';
// import { CoreContent } from '../../components/core';
import Search from './search';
import InquireTable from './table';
import { authorize } from './../../application';
import aoaoBossTools from './../../utils/util';
import Operate from '../../application/define/operate';

import {
  BILL_TYPE,                       // 账单类型
  // 默认选中全部指标
  CHECKED_TARGET_ELEM_DISTRICT_ESTIMATE,
  CHECKED_TARGET_MEITUAN_DISTRICT_ESTIMATE,
  CHECKED_TARGET_BAIDU_DISTRICT_ESTIMATE,
} from './targetCheckBox';

// 如果平台有elem， 默认显示elem, 否则 meituan、baidu
let Initplatform = '';
if (authorize.hasPlatform('elem')) {
  Initplatform = 'elem';
} else {
  if (authorize.hasPlatform('meituan')) {
    Initplatform = 'meituan';
  }
  if (authorize.hasPlatform('baidu')) {
    Initplatform = 'baidu';
  }
}

class Index extends Component {
  constructor(props) {
    super();
    this.state = {
      cityList: [],                                               // 保存当前城市keys
      city: authorize.cities([Initplatform]),                                                       // 城市
      page: 1,
      limit: 10,
      params: null,
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  // props初始化不建议放在 constructor中
  componentWillMount = () => {
    // 账号ID
    const accountId = authorize.account.id;
    const { city, cityList } = this.state;
    city.map((item) => {
      return cityList.push(item.id);
    });
    // 初始化数据-model层
    const { billInfo, averageList, totalList, averageData, totalData } = this.props.inquireModel;
    this.setState({
      billInfo,
      averageList,
      totalList,
      averageData,
      totalData,
      cityList,    // 城市keys
    });

    //  请求 手工账单数据
    this.getBillInfo();
    //  请求初始化table数据
    this.getSearchMethod();
  }

  componentWillReceiveProps = (nextProps) => {
    const { billInfo, averageList, totalList, averageData, totalData, knight } = nextProps.inquireModel;
    this.setState({
      billInfo,      // 账单信息
      averageList,   // 平均table数据源
      totalList,     // 总量table数据源
      averageData,   // 平均数据
      totalData,     // 总量数据
      knight,        // 骑士列表
    });
  }
  // 获取账单信息接口
  getBillInfo = () => {
    const { dispatch } = this.private;
    // 账号ID
    const accountId = authorize.account.id;
    dispatch({
      type: 'inquireModel/getBillInfoE',
      payload: { account_id: accountId },
    });
  }
  // 查询接口
  getSearchMethod = (targets) => {
    const { dispatch } = this.private;
    const { cityList } = this.state;
    const { params, page, limit } = this.state;
    // 账号ID
    const accountId = authorize.account.id;
    // 默认选中全部指标项-影响因素：商圈、骑士()、账单类型
    let checkedTargetInit = [];
    if (Initplatform == 'elem') {
      checkedTargetInit = CHECKED_TARGET_ELEM_DISTRICT_ESTIMATE;
    }
    if (Initplatform == 'meituan') {
      checkedTargetInit = CHECKED_TARGET_MEITUAN_DISTRICT_ESTIMATE;
    }
    if (Initplatform == 'baidu') {
      checkedTargetInit = CHECKED_TARGET_BAIDU_DISTRICT_ESTIMATE;
    }
    
    // 权限不同参数不同-默认显示到城市:超管、coo、运营管理、总监、城市经理、城市助理
    let payloadParams = {
      account_id: accountId,              // 账号ID
      platform_code: Initplatform,        // 平台string
      city_spelling_list: cityList,       // 城市list
      check_field: checkedTargetInit,      // 默认选中指标项
      bill_type: BILL_TYPE.estimate,      // 账单类型
      start_date: moment().subtract(2, 'day').format('YYYY-MM-DD'),
      end_date: moment().subtract(2, 'day').format('YYYY-MM-DD'),
      page: params && params.page ? 1 : page,      // 区别page参数：检索和分页请求
      limit,
    };
    if (targets && targets.length > 0) {
      // 修改选中指标项后，点击确认实时查询
      payloadParams.check_field = targets;
    }
    // search 参数---当Arguments.length ===1 || Arguments.length==2 && Arguments[0]!==null
    if (params) {
      payloadParams.platform_code = params.platform ? params.platform : Initplatform;
      payloadParams.city_spelling_list = params.city && params.city.length > 0 ? params.city : cityList;
      payloadParams.start_date = params.startDate || moment().subtract(1, 'day').format('YYYY-MM-DD');
      payloadParams.end_date = params.endDate || moment().subtract(1, 'day').format('YYYY-MM-DD');
      payloadParams.bill_type = params.bill ? Number(params.bill) : BILL_TYPE.estimate;
      payloadParams.biz_district_level = params.districtLevel ? params.districtLevel.join() : ''; // 商圈等级
      payloadParams.biz_district_id_list = params.district ? params.district : [];                // 商圈
      payloadParams.knight_id_list = params.knight ? params.knight : [];  // 骑士
      if (params.checkedOption && params.checkedOption.length > 0) {
        // 默认值在search组件赋值
        payloadParams.check_field = params.checkedOption;
      }
    }
    // 权限不同参数不同-默认显示到商圈:调度、站长
    const districtIds = [];     // 商圈IDs
    authorize.districts(cityList).forEach((item) => {
      districtIds.push(item.id);
    });

    // 判断权限 站长&调度时，不选择商圈时默认为全部城市下的全部商圈
    // 收支查询,限制城市级查询(站长,调度)
    if (Operate.canOperateBalanceSearchLimitCity() && !payloadParams.biz_district_id_list) {
      if (districtIds === undefined || districtIds.length < 1) {
        // 如果调度、站长角色 请求城市级数据，提示：'您没有此查询权限'
        message.info('您没有查询城市级数据权限，请选择商圈,', 3);
        return;
      }
      // 所有商圈（未选择商圈等级时，默认全部商圈）
      payloadParams = Object.assign(payloadParams, { biz_district_id_list: districtIds });
    }
    dispatch({
      type: 'inquireModel/getSearchListE',
      payload: payloadParams,
    });
  }

  // 获取 page和pageSize
  getPageParams = (page, limit) => {
    const { params } = this.state;
    this.setState({
      page: page || 1,
      limit: limit || 10,
    }, () => {
      this.getSearchMethod();
    });
  }
  // 搜索
  searchHandle = (params) => {
    // 请求table数据: 搜索时page & limit 初始化
    this.setState({ params, page: 1, limit: 10 }, () => {
      this.getSearchMethod();
    });
  }
  // 渲染 搜索功能
  renderSearch = () => {
    const { cityList } = this.state;
    const searchProps = {
      Initplatform,
      cityList,
      getSearchMethod: this.getSearchMethod,  // 请求table方法
    };
    return (
      <Search searchHandle={this.searchHandle} {...searchProps} />
    );
  };
  // 渲染 table
  renderTable = () => {
    const tableProps = {
      getPageParams: this.getPageParams,   // 获取 page 参数
      page: this.state.page,
      limit: this.state.limit,
    };
    return (
      <InquireTable {...tableProps} />
    );
  }

  render() {
    const { renderSearch, renderTable } = this;
    const { billInfo } = this.state;
    // 账单时间格式化
    const accurateTime = billInfo.accurate_time ? moment(billInfo.accurate_time.$date).format('YYYY-MM-DD') : '暂无';
    const forecastTime = billInfo.forecast_time ? moment(billInfo.forecast_time.$date).format('YYYY-MM-DD') : '暂无';

    return (
      <div>
        <p style={{ backgroundColor: 'rgb(227, 227, 228)', padding: '5px 10px', width: '100%', marginBottom: '10px' }}>
          <Icon type="info-circle" style={{ color: 'rgb(46, 150, 219)', fontSize: '14px' }} />
          <span style={{ fontSize: '14px', marginLeft: '10px' }}>提示：手工账单数据已出至{accurateTime}， 最新账单数据已出至{forecastTime}</span>
        </p>
        {/* 渲染检索条件&指标选项 */}
        {renderSearch()}
        {/* 渲染table */}
        {renderTable()}
      </div>);
  }
}

const mapStateToProps = ({ inquireModel }) => {
  return { inquireModel };
};

export default connect(mapStateToProps)(Index);
