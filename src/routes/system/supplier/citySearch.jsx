/**
 * 供应商列表
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select } from 'antd';

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
    const supplier = authorize._vendor.data

    this.state = {
      form: undefined,  // 搜索的form
      defaultPlatform: platform,  // 默认的平台参数
      search: {
        supplier: supplier.supplierId,       // 供应商名称
        platform: [],           // 平台
        city: [],           // 城市
        distributeType: '',     // 分配状态
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

  // 分配类型变更
  onChangeDistributeType = (e) => {
    const { search } = this.state;
    search.distributeType = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      platform: [],  // 平台
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      this.onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const isEmpty = value => value === '' || value === null || value === undefined;
    const { supplier, platform, city, distributeType } = values;
    const params = {
      platform: Array.isArray(platform) ? platform : [platform],
      city,
      supplier: isEmpty(supplier) ? supplier : [supplier],
      distributeType,
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
    const { supplier, platform, city } = this.state.search;
    const items = [
      {
        label: '供应商名称',
        form: form => (form.getFieldDecorator('supplier', { initialValue: supplier })(
          <Select placeholder="请选择供应商" onChange={this.onChangeSupplier} >
            {
              this.private.supplierOption.map((item, index) => {
                const key = item.id + index;
                return (<Option value={`${item.supplierId}`} key={key}>{item.supplierName}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <Select placeholder="请选择平台" optionFilterProp="children" onChange={this.onChangePlatform}>
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
          <Select allowClear placeholder="请选择城市" optionFilterProp="children" mode="multiple" onChange={this.onChangeCity}>
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
        label: '分配情况',
        form: form => (form.getFieldDecorator('distributeType')(
          <Select allowClear placeholder="请选择分配情况" onChange={this.onChangeDistributeType}>
            <Option key={1} value={'1'}>{'未分配'}</Option>
            <Option key={2} value={'2'}>{'已分配'}</Option>
          </Select>,
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
