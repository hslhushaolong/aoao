/**
 * 骑士补款，审核，详情，查询
*/
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { CoreSearch, CoreContent } from '../../../../../../../components/core';
import { authorize } from '../../../../../../../application';
import { KnightSalaryApproveState, KnightSalaryType, FillingEventType } from '../../../../../../../application/define';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);

    // 默认获取当前账户的第一条平台数据
    let platform;
    if (dot.has(authorize.platform(), '0.id')) {
      platform = dot.get(authorize.platform(), '0.id');
    }
    const supplier = authorize._vendor.data;
    this.state = {
      form: undefined,  // 搜索的form
      defaultPlatform: platform,  // 默认的平台参数
      date: props.date,
      search: {
        supplier: supplier.supplierId,            // 供应商
        platform,           // 平台
        city: [],           // 城市
        district: [],     // 商圈
        complateState: [], // 审核状态
        deductRange: [],  // 补款日期
        knightName: [], // 骑士姓名
        handlType: [],  // 补款项目,
        submitPeople: [], // 提交人
        submitDate: '', // 提交时间
      },
      dataSource: props.dataSource, // 数据列表
      submitterList: props.submitterList, // 提交人列表
      onSearch: props.onSearch, // 搜索回调
    };
    this.private = {
      supplierOption: [supplier],
    };
  }

  componentWillReceiveProps = (nextprops) => {
    this.setState({
      dataSource: nextprops.dataSource, // 数据列表
    });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    if (e.length <= 0) {
      this.setState({
        dataSource: this.props.dataSource, // 数据列表
      });
      // 清空选项
    } else {
      const dataSource = [];
      this.props.dataSource.forEach((item) => {
        e.forEach((val) => {
          if (item.district_id === val) {
            dataSource.push(item);
          }
        });
      });
      this.setState({
        dataSource, // 数据列表
      });
    }
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    search.platform = e;
    // 城市商圈清空
    search.city = [];
    search.district = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ city: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { form, search } = this.state;
    if (e.length <= 0) {
      search.city = [];
      search.district = [];
      this.setState({
        search, // 查询
        dataSource: this.props.dataSource, // 数据列表
      });

      // 清空选项
      form.setFieldsValue({ district: [] });
      return;
    }
    // 保存城市参数
    search.city = e;
    const dataSource = [];
    this.props.dataSource.forEach((item) => {
      e.forEach((val) => {
        if (item.city_spelling === val) {
          dataSource.push(item);
        }
      });
    });
    this.setState({
      search, // 查询
      dataSource, // 数据列表
    });
  }


  // 更换姓名
  onChangeKnightName = (e) => {
    const { search } = this.state;
    search.knightName = e;
    this.setState({ search });
  }

  // 更改提交人
  onChangeSubmitPeople = (e) => {
    const { search } = this.state;
    search.submitPeople = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch, defaultPlatform } = this.state;
    const defaultParam = { fund_id: KnightSalaryType.fillingMoney, sort: -1 };
    const params = {
      platform: defaultPlatform,  // 平台
      ...defaultParam,
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      params.platform = defaultPlatform;
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { platform, city, district, supplier, complateState, submitPeople, submitDate, deductRange, knightName, handlType } = values;
    const params = {
      platform, // 平台
      knightIdList: knightName, // 骑士列表
      city, // 城市
      district, // 商圈
      supplier, // 供应商
      complateState, // 审核状态
      handlType, // 项目列表
      submitPeople, // 提交人
      fundStartDate: dot.has(deductRange, '0') ? moment(values.deductRange[0]).format('YYYY-MM-DD') : '', // 补款开始时间
      fundEndDate: dot.has(deductRange, '1') ? moment(values.deductRange[1]).format('YYYY-MM-DD') : '', // 补款结束时间
      submitStartDate: dot.has(submitDate, '0') ? moment(values.submitDate[0]).format('YYYY-MM-DD HH:mm') : '', // 提交开始时间
      submitEndDate: dot.has(submitDate, '1') ? moment(values.submitDate[1]).format('YYYY-MM-DD HH:mm') : '', // 提交结束时间
    };

    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 不可选择的日期
  disabledDate = (current) => {
    const date = this.state.date.split('-');
    if (moment(current).month() > (date[1] - 1) || moment(current).month() < (date[1] - 1)) {
      return true;
    }
    return false;
  }

  // 搜索功能
  render = () => {
    const { platform, city } = this.state.search;
    const { disabledDate } = this;
    // 骑士列表
    const knightList = this.state.dataSource.reduce((acc, item) => {
      if (!acc[item.staff_id]) {
        acc[item.staff_id] = 1;
        acc.resultArr.push(item);
      }
      return acc;
    }, { resultArr: [] }).resultArr;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: authorize.platform()[0].id })(
          <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
            {
            authorize.platform().map((item, index) => {
              const key = item.id + index;
              return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
            })
          }
          </Select>,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city')(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择城市" onChange={this.onChangeCity}>
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item + index;
                return (<Option value={`${item.id}`} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('district')(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="商圈" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('knightName')(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择骑士">
            {
              knightList.map((item, index) => {
                return <Option key={index} value={item.staff_id}>{item.knight_name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '补款项目',
        form: form => (form.getFieldDecorator('handlType')(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择补款项目" >
            <Option value="subsidy_special_time">{FillingEventType.description(FillingEventType.subsidy_special_time)}</Option>
            <Option value="subsidy_special_season">{FillingEventType.description(FillingEventType.subsidy_special_season)}</Option>
            <Option value="subsidy_weather">{FillingEventType.description(FillingEventType.subsidy_weather)}</Option>
            <Option value="subsidy_recommend_entry">{FillingEventType.description(FillingEventType.subsidy_recommend_entry)}</Option>
            <Option value="subsidy_checking">{FillingEventType.description(FillingEventType.subsidy_checking)}</Option>
            <Option value="subsidy_order_num">{FillingEventType.description(FillingEventType.subsidy_order_num)}</Option>
            <Option value="subsidy_kf_remission">{FillingEventType.description(FillingEventType.subsidy_kf_remission)}</Option>
            <Option value="subsidy_seniority">{FillingEventType.description(FillingEventType.subsidy_seniority)}</Option>
            <Option value="subsidy_charge">{FillingEventType.description(FillingEventType.subsidy_charge)}</Option>
            <Option value="subsidy_car">{FillingEventType.description(FillingEventType.subsidy_car)}</Option>
            <Option value="subsidy_phone">{FillingEventType.description(FillingEventType.subsidy_phone)}</Option>
            <Option value="subsidy_equip_return">{FillingEventType.description(FillingEventType.subsidy_equip_return)}</Option>
            <Option value="subsidy_other">{FillingEventType.description(FillingEventType.subsidy_other)}</Option>
          </Select>,
        )),
      },
      {
        label: '审核状态',
        form: form => (form.getFieldDecorator('complateState')(
          <Select allowClear placeholder="请选择审核状态" >
            <Option value={`${KnightSalaryApproveState.pendding}`}>{KnightSalaryApproveState.description(KnightSalaryApproveState.pendding)}</Option>
            <Option value={`${KnightSalaryApproveState.success}`}>{KnightSalaryApproveState.description(KnightSalaryApproveState.success)}</Option>
            <Option value={`${KnightSalaryApproveState.reject}`}>{KnightSalaryApproveState.description(KnightSalaryApproveState.reject)}</Option>
          </Select>,
        )),
      },
      {
        label: '补款日期',
        form: form => (form.getFieldDecorator('deductRange',
        { initialValue: [moment(`${this.state.date}`, 'YYYY-MM'), moment(moment(`${this.state.date}`).endOf('month').format('YYYY-MM-DD'))] })(
          <RangePicker
            disabledDate={disabledDate}
          />,
        )),
      },
      {
        label: '提交人',
        form: form => (form.getFieldDecorator('submitPeople')(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择提交人" onChange={this.onChangeSubmitPeople}>
            {
              this.state.submitterList.map((item, index) => {
                return <Option key={item._id + index} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '提交时间',
        form: form => (form.getFieldDecorator('submitDate')(
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
          />,
        )),
      },
    ];

    const props = {
      items, // 查询的每一项
      onReset: this.onReset, // 重置
      onSearch: this.onSearch, // 查询
      onHookForm: this.onHookForm, // 获取提交用的form表单
      expand: true,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
