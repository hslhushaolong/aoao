/**
 * 骑士扣款，查询
*/
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { CoreSearch, CoreContent } from '../../../../../components/core';
import { authorize } from '../../../../../application';
import { DeductSubmitType, Modules, KnightSalaryType } from '../../../../../application/define';

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
      search: {
        supplier: supplier.supplierId,            // 供应商
        platform,           // 平台
        city: [],           // 城市
        district: [],     // 商圈
        complateState: [], // 完成状态
        dateRange: [],      // 申请创建日期
      },
      onSearch: props.onSearch, // 搜索回调
    };
    this.private = {
      supplierOption: [supplier],
    };
  }

  // 更换供应商
  onChangeSupplier = (e) => {
    const { form, search } = this.state;
    search.supplier = e;
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ city: [] });
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    search.platform = e;
    search.city = [];
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
      this.setState({ search });

      // 清空选项
      form.setFieldsValue({ district: [] });
      return;
    }
    // 保存城市参数
    search.city = e;
    this.setState({ search });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { search } = this.state;
    search.district = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch, defaultPlatform } = this.state;
    const defaultParam = { page: 1, limit: 30, fund_id: KnightSalaryType.deduction, sort: -1, permission_id: Modules.ModuleSalaryManageKnightDeduct.id };
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
    const { platform, city, district, supplier, complateState, dateRange } = values;
    const params = {
      platform, // 平台
      city, // 城市
      district, // 商圈
      supplier, // 供应商
      complateState, // 完成状态
      page: 1, // 页码
      limit: 30, // 每页条数
      createdStartDate: dot.has(dateRange, '0') ? moment(values.dateRange[0]).format('YYYY-MM-DD') : '', // 创建开始日期
      createdEndDate: dot.has(dateRange, '1') ? moment(values.dateRange[1]).format('YYYY-MM-DD') : '', // 创建结束日期
    };

    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { supplier, platform, city, district, complateState, dateRange } = this.state.search;
    const items = [
      // 后期会用
      // {
      //   label: '供应商',
      //   form: form => (form.getFieldDecorator('supplier', { initialValue: supplier })(
      //     <Select placeholder="请选择平台" onChange={this.onChangeSupplier} >
      //       {
      //         this.private.supplierOption.map((item, index) => {
      //           return (<Option value={`${item.supplierId}`} key={index}>{item.supplierName}</Option>);
      //         })
      //       }
      //     </Select>,
      //   )),
      // },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
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
        form: form => (form.getFieldDecorator('city', { initialValue: city })(
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
        form: form => (form.getFieldDecorator('district', { initialValue: district })(
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
        label: '完成状态',
        form: form => (form.getFieldDecorator('complateState', { initialValue: complateState })(
          <Select allowClear placeholder="请选择完成状态" >
            <Option value={`${DeductSubmitType.waitForSubmit}`}>{DeductSubmitType.description(DeductSubmitType.waitForSubmit)}</Option>
            <Option value={`${DeductSubmitType.unfinished}`}>{DeductSubmitType.description(DeductSubmitType.unfinished)}</Option>
            <Option value={`${DeductSubmitType.finished}`}>{DeductSubmitType.description(DeductSubmitType.finished)}</Option>
          </Select>,
        )),
      },
      {
        label: '创建日期',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: dateRange })(
          <RangePicker />,
        )),
      },
    ];

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
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
