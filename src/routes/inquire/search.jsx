/**
 * 大查询-Search
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker, Checkbox, message, Icon } from 'antd';
import { CoreSearch, CoreContent } from './core/index';
import { authorize } from './../../application';
import Target from './target';
import Operate from '../../application/define/operate';
import { Position } from '../../application/define';
import Modules from '../../application/define/modules';

import {
  ELEM_DISTRICT_TARGET,             // 商圈级指标选项-饿了么
  ELEM_DISTRICT_TARGET_ESTIMATE,
  MEITUAN_DISTRICT_TARGET,          // 商圈级指标选项-美团
  MEITUAN_DISTRICT_TARGET_ESTIMATE,
  BAIDU_DISTRICT_TARGET_ESTIMATE,   // 商圈级指标选项-百度(只有预估)
  ELEM_KNIGHT_TARGET,               // 骑士级指标选项-饿了么
  ELEM_KNIGHT_TARGET_ESTIMATE,
  MEITUAN_KNIGHT_TARGET,            // 骑士级指标选项-美团
  MEITUAN_KNIGHT_TARGET_ESTIMATE,
  BAIDU_KNIGHT_TARGET,              // 骑士级指标选项-百度
  BILL_TYPE,                        // 账单枚举值
  // 默认选中全部指标
  CHECKED_TARGET_ELEM_DISTRICT_ESTIMATE,
  CHECKED_TARGET_ELEM_DISTRICT_ACCURACY,
  CHECKED_TARGET_ELEM_KNIGHT_ESTIMATE,
  CHECKED_TARGET_ELEM_KNIGHT_ACCURACY,
  CHECKED_TARGET_MEITUAN_DISTRICT_ESTIMATE,
  CHECKED_TARGET_MEITUAN_DISTRICT_ACCURACY,
  CHECKED_TARGET_MEITUAN_KNIGHT_ESTIMATE,
  CHECKED_TARGET_MEITUAN_KNIGHT_ACCURACY,
  CHECKED_TARGET_BAIDU_DISTRICT_ESTIMATE,
  // CHECKED_TARGET_BAIDU_DISTRICT_ACCURACY,
  CHECKED_TARGET_BAIDU_KNIGHT,
} from './targetCheckBox.jsx';

const { RangePicker } = DatePicker;
const { Option } = Select;
class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: undefined,          // 搜索的form
      checkedOption: [],       // 所有选中指标项
      districtLevelData: [],   // 商圈级别&商圈数据
      districtLevelSource: [], // 商圈级别数据
      districtSource: [],      // 商圈级别对应的商圈列表
      platformTarget: [],      // 展示指标项
      knightList: [],          // 某商圈下的骑士列表
      targets: [],             // 保存选中指标项
      search: {
        platform: props.Initplatform,   // 平台
        city: [],                       // 城市
        district: [],                   // 商圈
        dateRange: [],                  // 申请创建日期
        knight: [],                     // 骑士
        bill: BILL_TYPE.estimate,       // 账单
        districtLevel: [],              // 商圈级别
      },
    };
    this.private = {
      dispatch: props.dispatch,
      getSearchMethod: props.getSearchMethod,  // search方法
    };
  }
  // props 初始化
  componentWillMount = () => {
    const { platform, knight, bill } = this.state.search;
    // 默认选中全部指标项-影响因素：商圈、骑士()、账单类型
    const target = this.updateSpecificationTarget(platform, knight, bill);
    this.setState({
      checkedOption: target.checkedTarget,    // 选中指标项
      platformTarget: target.showTarget,      // 显示全部指标项
    });
  }
  componentWillReceiveProps = (nextProps) => {
    const { knight, districtLevelData } = nextProps.inquireModel;
    this.setState({
      districtLevelData,      // 商圈级数据
      knightList: knight,                 // 更新骑士列表
    });
    // 处理商圈等级数据
    if (districtLevelData && districtLevelData.length > 0) {
      // 商圈等级数据 俄了么：无； 美团、百度：独家-TSABC(默认)、非独家-TSABC、无-TSABC；
      const districtLevelList = [];    //  商圈等级数据
      districtLevelData.forEach((items) => {
        districtLevelList.push({ key: items.name, title: items.name });
      });
      this.setState({
        districtLevelSource: districtLevelList, // 商圈等级（选中商圈等级后过滤商圈数据）
      });
    }
  }

  // 切换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    const { knight, bill } = search;
    if (e.length <= 0) {
      search.platform = this.props.Initplatform;
      search.city_spelling = [];
      search.district = [];
      search.districtLevel = [];
      search.knight = [];
      this.setState({ search });
      return;
    }
    // 保存平台参数
    search.platform = e;
    const target = this.updateSpecificationTarget(e, knight, bill);
    this.setState({
      // bill: BILL_TYPE.estimate,               // 切换平台账单恢复预估-影响日期组件（异步延时，用getFieldValue）
      checkedOption: target.checkedTarget,    // 选中指标项
      platformTarget: target.showTarget,      // 显示全部指标项
      targets: [],   // 清空选中指标项
      search,
    });

    // 清空选项
    form.setFieldsValue({ city: [], district: [], districtLevel: [], knight: [], bill: BILL_TYPE.estimate });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { dispatch } = this.private;
    const { form, search } = this.state;
    // 清空选项
    form.setFieldsValue({ city: [], district: [], districtLevel: [], knight: [] });
    if (e.length <= 0) {
      search.city = [];
      search.districtLevel = [];
      search.district = [];
      search.knight = [];
      this.setState({ search });
      return;
    }
    // 切换等级时 update相应的商圈列表
    const accountId = authorize.account.id;
    // 选择城市时，请求对应城市的商圈等级（无城市无商圈无商圈等级）
    dispatch({
      type: 'inquireModel/getDistrictLevelE',
      payload: {
        platform_code: search.platform,
        account_id: accountId,
        city_spelling_list: e,
      },
    });
    // 保存城市参数
    search.city = e;
    this.setState({ search });
  }

  // 更换商圈等级
  onChangeDistrictLevel = (e) => {
    // 需要过滤对应等级的商圈列表
    const { form, search, districtLevelData } = this.state;
    if (e) {
      // districtLevel typeOf Array
      search.districtLevel = [e];
      // 根据商圈等级过滤商圈列表 filter:返回值是数组且返回 item.district_info_list 和item 一样
      let districtList = [];
      districtList = districtLevelData && districtLevelData.filter((item) => {
        return item.name == e && item;
      });
      this.setState({
        search,
        knightList: [],
        districtSource: dot.get(districtList, '0.district_info_list'),
      });
    } else {
      search.districtLevel = [];
      this.setState({
        search,
        knightList: [],       // 清空骑士数据
        districtLevel: [],    // 商圈级别空，显示全部商圈数据
      });
    }
    // 清空选项-切换商圈等级时，情况骑士，商圈数据已重新setState
    form.setFieldsValue({ district: [], knight: [] });
  }

  // 更换商圈
  onChangeDistrict = (e) => {
    const { dispatch } = this.private;
    const { form, search } = this.state;
    if (e.length <= 0) {
      // 调度、站长无权限查询城市级数据；
      // 收支查询,限制城市级查询(站长,调度)
      if (Operate.canOperateBalanceSearchLimitCity()) {
        message.info('您没有查询城市级数据权限，请选择商圈');
      }
      search.district = [];
      // 更换城市级数据、骑士级数据、账单类型时，清空targets；
      this.setState({ search, knightList: [], targets: [] });
      // 清空选项
      form.setFieldsValue({ knight: [] });
      return;
    }

    const accountId = authorize.account.id;
    search.district = e;
    this.setState({ search });
    // 选择多个商圈时，友情提示
    if (e && e.length > 1) {
      message.info('选择单个商圈时，可选择骑士', 5);
      return;
    }

    // 单个商圈时请求骑士列表
    if (e && e.length === 1) {
      dispatch({
        type: 'inquireModel/getKnightListE',
        payload: {
          account_id: accountId,
          limit: 1000,
          page: 1,
          biz_district_id_list: e,
          permission_id: Modules.ModuleSearchInquire.id,
          position_id_list: [Position.postmanManager, Position.postman],   // 职位列表
        },
      });
    }
  }

  // 更换骑士
  onChangeKnight = (e) => {
    const { search } = this.state;
    const { platform, bill } = search;
    // 状态控制是否有骑士被选中，进而 更新指标项
    search.knight = e;
    const target = this.updateSpecificationTarget(platform, e, bill);
    this.setState({
      search,
      targets: [],
      checkedOption: target.checkedTarget,    // 选中指标项
      platformTarget: target.showTarget,      // 显示全部指标项
    });
  }
  // 更换账单
  onChangeBill = (e) => {
    if (!e) {
      return;
    }
    const { search } = this.state;
    const { platform, knight } = search;
    search.bill = e;
    const target = this.updateSpecificationTarget(platform, knight, e);
    this.setState({
      targets: [],    // 清空选中指标项
      search,
      checkedOption: target.checkedTarget,    // 选中指标项
      platformTarget: target.showTarget,      // 显示全部指标项
    });
  }
  // 获取最新指标项
  onCheckedTargets = (targets) => {
    this.setState({
      targets,
    });
  }
  // 搜索
  onSearch = (values) => {
    const { checkedOption, districtLevelData, targets, search } = this.state;
    this.state.form.validateFields((err, values) => {
      if (!err) {
        // 请求参数---所有条件保存params中
        const params = values;
        // 选中指标项(默认全部checkedOption)--修改指标项并确认时，用targets，并保存选中指标项
        params.checkedOption = targets.length > 0 ? targets : checkedOption;
        if (values) {
          // values 有效
          params.platform = values.platform;
          params.city = values.city;
          // 站长、调度商圈-无商圈等级时，默认数据为该城市下全部商圈；（index中做）
          // 所有角色---只选商圈等级未选择商圈时，商圈默认参数为该等级下全部商圈；
          const districtIds = [];
          if (districtLevelData && districtLevelData.length > 0) {
            // district_info_list
            districtLevelData.forEach((item) => {
              item.district_info_list.forEach((i) => {
                districtIds.push(i.biz_district_id);
              });
            });
          }
          // 选择商圈用选中ID；其次判断是否选择商圈等级：有则用该商圈下所有商圈ids,无则空；
          params.district = values.district && values.district.length > 0 ? values.district : search.districtLevel.length > 0 ? districtIds : [];
          params.districtLevel = [values.districtLevel];
          params.knight = values.knight;
          params.bill = values.bill;
          // elem meituan 平台且账单类型是准确时，用dateRangeR，预估用dateRange
          if ((search.platform == 'elem' || search.platform == 'meituan') && (params.bill == BILL_TYPE.accuracy)) {
            if (values.dateRangeR && values.dateRangeR.length === 2) {
              params.startDate = values.dateRangeR[0] ? moment(values.dateRangeR[0]).format('YYYY-MM-DD') : '';
              params.endDate = values.dateRangeR[1] ? moment(values.dateRangeR[1]).format('YYYY-MM-DD') : '';
              // 饿了么-准确账单时不可以请求某一天的数据
              if (params.startDate === params.endDate) {
                return message.info('饿了么平台准确账单不支持查看单天数据，请选择时间段', 2);
              }
            }
          } else if (values.dateRange && values.dateRange.length === 2) {
            params.startDate = values.dateRange[0] ? moment(values.dateRange[0]).format('YYYY-MM-DD') : '';
            params.endDate = values.dateRange[1] ? moment(values.dateRange[1]).format('YYYY-MM-DD') : '';
          }
          this.props.searchHandle(params);
        }
      }
    });
  };

  // 重置
  onReset = () => {
    this.setState({
      search: {
        platform: this.props.Initplatform,   // 平台
        city: [],                   // 城市
        district: [],               // 商圈
        dateRange: [],              // 申请创建日期
        knight: [],                 // 骑士
        bill: BILL_TYPE.estimate,                  // 账单
        districtLevel: [],         // 商圈级别
      },
    });

    // 刷新列表
    this.props.searchHandle();
  };

  // onChangeDate
  onChangeDate = (dateString, dateArr) => {
    this.setState({
      dateRange: dateArr,
    });
  }
  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 禁选日期 - elem 准确
  disabledDate = (current) => {
    // 1-15-月末可选
    return (current && current.get('date') > 1 && current.get('date') < 15) ||
      (current.get('date') < current.daysInMonth() && current.get('date') > 15);
  }
  // 禁选日期 - meituan 准确
  disabledDateMeiTuan = (current) => {
    // Can not select start and end
    return current && current.get('date') > 1 && current.get('date') < current.daysInMonth();
  }
  // update 指标项
  updateSpecificationTarget = (platform, knight, billType) => {
    const target = {};
    target.checkedTarget = [];
    // 未操作指标项-修改平台或者选择骑士或者修改账单类型-update 全部指标项
    if (platform == 'elem') {
      target.checkedTarget = CHECKED_TARGET_ELEM_DISTRICT_ESTIMATE;
      target.showTarget = ELEM_DISTRICT_TARGET_ESTIMATE;
      if (billType == BILL_TYPE.accuracy) {
        // 账单类型：准确
        target.showTarget = ELEM_DISTRICT_TARGET;
        target.checkedTarget = CHECKED_TARGET_ELEM_DISTRICT_ACCURACY;
      }
      // 如果选择骑士-则骑士维度
      if (knight && knight.length > 0) {
        // 骑士维度：账单类型准确/预估
        target.checkedTarget = billType == BILL_TYPE.accuracy ? CHECKED_TARGET_ELEM_KNIGHT_ACCURACY : CHECKED_TARGET_ELEM_KNIGHT_ESTIMATE;
        target.showTarget = billType == BILL_TYPE.accuracy ? ELEM_KNIGHT_TARGET : ELEM_KNIGHT_TARGET_ESTIMATE;
      }
    }
    if (platform == 'meituan') {
      target.checkedTarget = CHECKED_TARGET_MEITUAN_DISTRICT_ESTIMATE;
      target.showTarget = MEITUAN_DISTRICT_TARGET_ESTIMATE;
      if (billType == BILL_TYPE.accuracy) {
        // 账单类型：准确
        target.checkedTarget = CHECKED_TARGET_MEITUAN_DISTRICT_ACCURACY;
        target.showTarget = MEITUAN_DISTRICT_TARGET;
      }
      // 如果选择骑士-则骑士维度
      if (knight && knight.length > 0) {
        // 骑士维度：账单类型准确/预估
        target.checkedTarget = billType == BILL_TYPE.accuracy ? CHECKED_TARGET_MEITUAN_KNIGHT_ACCURACY : CHECKED_TARGET_MEITUAN_KNIGHT_ESTIMATE;
        target.showTarget = billType == BILL_TYPE.accuracy ? MEITUAN_KNIGHT_TARGET : MEITUAN_KNIGHT_TARGET_ESTIMATE;
      }
    }
    if (platform == 'baidu') {
      // 百度平台 商圈级和骑士级 账单类型只有预估
      target.checkedTarget = CHECKED_TARGET_BAIDU_DISTRICT_ESTIMATE;
      target.showTarget = BAIDU_DISTRICT_TARGET_ESTIMATE;
      // 如果选择骑士-则骑士维度
      if (knight && knight.length > 0) {
        // 骑士维度：账单类型准确/预估(百度平台预估准确指标相同)
        target.checkedTarget = CHECKED_TARGET_BAIDU_KNIGHT;
        target.showTarget = BAIDU_KNIGHT_TARGET;
      }
    }
    return target;
  }
  // 渲染检索条件
  renderSearch = () => {
    const { knightList, districtSource, districtLevelSource } = this.state;
    const { platform, city, districtLevel, bill } = this.state.search;
    const cityParams = city.length > 0 ? city : this.props.cityList;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
            {
              authorize.platform().map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city')(
          <Select showSearch allowClear optionFilterProp="children" placeholder="全部" mode="multiple" onChange={this.onChangeCity}>
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '商圈等级',
        form: form => (form.getFieldDecorator('districtLevel')(
          <Select allowClear showSearch optionFilterProp="children" placeholder="商圈等级" onChange={this.onChangeDistrictLevel} style={{ width: '180px' }}>
            {
              platform !== 'elem' && districtLevelSource.map((item, index) => {
                const key = item.title + index;
                return <Option key={key} value={item.title}>{item.title}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '商圈',
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } },
        form: form => (form.getFieldDecorator('district')(
          <Select showSearch allowClear optionFilterProp="children" placeholder="全部" mode="multiple" onChange={this.onChangeDistrict}>
            {
              // 商圈等级过滤后商圈数据districtSource、全部商圈authorize.districts(city)
              (districtLevel && districtLevel.length > 0 ? districtSource : authorize.districts(cityParams)).map((item, index) => {
                const key = item.id + index;
                const keyLevel = item.biz_district_id + index;
                if (districtLevel.length > 0) {
                  return item && <Option key={keyLevel} value={item.biz_district_id}>{item.biz_district_name}</Option>;
                }
                return item && <Option key={key} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '骑士',
        form: form => (form.getFieldDecorator('knight')(
          <Select showSearch allowClear optionFilterProp="children" placeholder="请先选择一个商圈" mode="multiple" onChange={this.onChangeKnight}>
            {
              knightList && knightList.map((item, index) => {
                const key = item._id + index;
                return <Option key={key} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '账单',
        form: form => (form.getFieldDecorator('bill', { initialValue: bill })(
          <Select showSearch allowClear optionFilterProp="children" placeholder="请选择账单" onChange={this.onChangeBill}>
            {
              platform === 'baidu' ?
                <Select.OptGroup>
                  <Option key={1} value={BILL_TYPE.estimate}>预估</Option>
                </Select.OptGroup>
                :
                <Select.OptGroup>
                  <Option key={1} value={BILL_TYPE.estimate}>预估</Option>
                  <Option key={2} value={BILL_TYPE.accuracy}>准确</Option>
                </Select.OptGroup>
            }
          </Select>,
        )),
      }, {
        label: '日期',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: [moment().subtract(2, 'day'), moment().subtract(2, 'day')] })(
          <RangePicker style={{ width: '180px' }} />,
        )),
      }, {
        label: '日期',
        form: form => (form.getFieldDecorator('dateRangeR')(
          <RangePicker style={{ width: '180px' }} disabledDate={this.disabledDate} />,
        )),
      },
      {
        label: '日期',
        form: form => (form.getFieldDecorator('dateRangeR')(
          <RangePicker style={{ width: '180px' }} disabledDate={this.disabledDateMeiTuan} />,
        )),
      },
    ];
    let formItems = items.slice(0, 7);
    // 初始化时bill为undefined，切换时有值
    const billState = this.state.form && this.state.form.getFieldValue(['bill']);
    if (platform == 'elem' && billState === BILL_TYPE.accuracy) {
      // 饿了么 账单类型=准确时: 1、15、30
      formItems = items.slice(0, 6).concat(items.slice(7, 8));
    } else if (platform == 'meituan' && billState === BILL_TYPE.accuracy) {
      // 美团  账单类型=准确时 1、30/31
      formItems = items.slice(0, 6).concat(items.slice(8));
    } else {
      // 其他
      formItems = items.slice(0, 7);
    }
    const props = {
      items: formItems,
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
  renderTargets = () => {
    const { platformTarget, checkedOption } = this.state;
    const targetProps = {
      checkedOption,   // 选中指标项
      platformTarget,  // 全部指标项
      getSearchMethod: this.private.getSearchMethod,  // search方法
      onCheckedTargets: this.onCheckedTargets,        // 获取最新targets并保存
    };
    return <Target {...targetProps} />;
  }
  render() {
    return (
      <div>
        {/* 渲染检索条件 */}
        {this.renderSearch()}
        {/* 渲染指标选项 */}
        {/* {this.renderTargets()} */}
      </div>
    );
  }
}
const mapStateToProps = ({ inquireModel }) => {
  return { inquireModel };
};
export default connect(mapStateToProps)(Search);
