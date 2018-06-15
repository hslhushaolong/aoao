/**
 * 员工管理 / 今日待入职员工-查询
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, Input } from 'antd';

import { CoreSearch, CoreContent } from '../../../components/core';
import { authorize } from '../../../application';

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
        platform: [],           // 平台
        city: [],           // 城市
        district: [],     // 商圈
        knightName: '',       // 骑士姓名
        phone: '',           // 手机号
        idNumber: '',           // 身份证号
      },
      onSearch: props.onSearch,       // 搜索回调
      onDownload: props.onDownload,   // 下载文件回调
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
    form.setFieldsValue({ city: [], district: [] });
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

  // 更换骑士姓名
  onChangeKnightName = (e) => {
    const { search } = this.state;
    search.knightName = e;
    this.setState({ search });
  }

  // 更换手机号
  onChangePhone = (e) => {
    const { search } = this.state;
    search.phone = e;
    this.setState({ search });
  }

  // 更换身份证号
  onChangeIdNumber = (e) => {
    const { search } = this.state;
    search.idNumber = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch, defaultPlatform } = this.state;
    const params = {
      // platform: defaultPlatform,  // 平台
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { platform, city, district, supplier, knightName, phone, idNumber } = values;
    const params = {
      platform: platform && platform !== '' ? [platform] : [],
      city,
      district,
      supplier: supplier && supplier !== '' ? [supplier] : [],
      knightName,
      phone,
      idNumber, // 平台和供应商为单选，所以需要包装成数组
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
    const { supplier, platform, city, district, knightName, phone, idNumber } = this.state.search;
    const items = [
      {
        label: '供应商',
        form: form => (form.getFieldDecorator('supplier')(
          <Select placeholder="全部" onChange={this.onChangeSupplier} >
            {
              this.private.supplierOption.map((item, index) => {
                return (<Option value={`${item.supplierId}`} key={index}>{item.supplierName}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform')(
          <Select placeholder="全部" onChange={this.onChangePlatform}>
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
        label: '姓名',
        form: form => (form.getFieldDecorator('knightName', { initialValue: knightName })(
          <Input placeholder="请输入员工姓名" onChange={this.onChangeKnightName} />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone', { initialValue: phone })(
          <Input placeholder="请输入员工手机号" onChange={this.onChangePhone} />,
        )),
      },
      {
        label: '所属平台身份证号',
        form: form => (form.getFieldDecorator('idNumber', { initialValue: idNumber })(
          <Input placeholder="请输入员工身份证号" onChange={this.onChangeIdNumber} />,
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
