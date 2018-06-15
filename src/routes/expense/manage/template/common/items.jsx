// 平台，供应商，城市，商圈，分摊金额
// 科目三级联动选择 & 成本中心数据显示
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import { Select, Input, Button } from 'antd';
import { CoreForm } from '../../../../../components/core';
import { authorize } from '../../../../../application';
import { renderReplaceAmount } from '../../../../../application/define';

const { Option } = Select;

// 显示的项目
const CommonItemsType = {
  platform: 'platform',   // 平台
  vendor: 'vendor',       // 供应商
  city: 'city',           // 城市
  district: 'district',   // 商圈
  costCount: 'costCount', // 分单金额
  operatCreate: 'operatCreate', // 添加操作按钮
  operatDelete: 'operatDelete', // 删除操作按钮
};

class CommonItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: dot.get(props, 'value.key', ''),                     // 数据条目的key，用于删除使用
      config: dot.get(props, 'value.config', []),               // 设置项目，显示的内容
      platform: dot.get(props, 'value.platform', undefined),    // 平台
      vendor: dot.get(props, 'value.vendor', undefined),        // 供应商
      city: dot.get(props, 'value.city', undefined),            // 城市
      district: dot.get(props, 'value.district', undefined),    // 商圈
      costCount: renderReplaceAmount(dot.get(props, 'value.costCount', undefined)),          // 分单金额
      onChange: props.onChange ? props.onChange : undefined,    // 回调事件, 数据变化
      onCreate: props.onCreate ? props.onCreate : undefined,    // 回调事件, 创建按钮
      onDelete: props.onDelete ? props.onDelete : undefined,    // 回调事件, 删除按钮
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      key: dot.get(props, 'value.key', ''),                     // 数据条目的key，用于删除使用
      config: dot.get(props, 'value.config', []),               // 设置项目，显示的内容
      platform: dot.get(props, 'value.platform', undefined),    // 平台
      vendor: dot.get(props, 'value.vendor', undefined),        // 供应商
      city: dot.get(props, 'value.city', undefined),            // 城市
      district: dot.get(props, 'value.district', undefined),    // 商圈
      costCount: renderReplaceAmount(dot.get(props, 'value.costCount', undefined)),  // 分单金额
      onChange: props.onChange ? props.onChange : undefined,    // 回调事件, 数据变化
      onCreate: props.onCreate ? props.onCreate : undefined,    // 回调事件, 创建按钮
      onDelete: props.onDelete ? props.onDelete : undefined,    // 回调事件, 删除按钮
    });
  }

  onChange = ({ platform, vendor, city, district, costCount }) => {
    const { key, onChange } = this.state;
    const state = {
      platform,
      vendor,
      city,
      district,
      costCount,
    };
    this.setState(state);

    if (onChange) {
      onChange(key, state);
    }
  }

  // 创建操作的回调
  onCreate = () => {
    const { onCreate } = this.state;
    if (onCreate) {
      onCreate();
    }
  }

  // 删除操作的回调
  onDelete = () => {
    const { onDelete, key } = this.state;
    if (onDelete) {
      onDelete(key);
    }
  }

  // 平台
  onChangePlatform = (e) => {
    const { costCount } = this.state;
    this.onChange({
      platform: e,
      vendor: undefined,
      city: undefined,
      district: undefined,
      costCount,
    });
  }

  // 服务商
  onChangeVendor = (e) => {
    const { platform, costCount } = this.state;
    this.onChange({
      platform,
      vendor: e,
      city: undefined,
      district: undefined,
      costCount,
    });
  }

  // 城市
  onChangeCity = (e) => {
    const { platform, vendor, costCount } = this.state;
    this.onChange({
      platform,
      vendor,
      city: e,
      district: undefined,
      costCount,
    });
  }

  // 商圈
  onChangeDistrict = (e) => {
    const { platform, vendor, city, costCount } = this.state;
    this.onChange({
      platform,
      vendor,
      city,
      district: e,
      costCount,
    });
  }

  // 分摊金额
  onChangeCostCount = (e) => {
    const { platform, vendor, city, district } = this.state;
    this.onChange({
      platform,
      vendor,
      city,
      district,
      costCount: e.target.value,
    });
  }

  render() {
    const { platform, vendor, city, district, costCount, config } = this.state;
    const formItems = [];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.platform) !== -1) {
      formItems.push({
        label: '平台',
        span: 4,
        form: (
          <Select placeholder="请选择平台" value={platform} onChange={this.onChangePlatform}>
            {
              authorize.platform().map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.name}</Option>);
              })
            }
          </Select>
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      formItems.push({
        label: '供应商',
        span: 4,
        form: (
          <Select placeholder="请选择供应商" value={vendor} onChange={this.onChangeVendor}>
            <Option value={authorize.vendor.supplierId} alt={authorize.vendor.supplierName}>{authorize.vendor.supplierName} </Option>
            {/* NOTE: 供应商目前是单选
              {
              authorize.cities(platform).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
              })
            } */}
          </Select>
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.city) !== -1) {
      formItems.push({
        label: '城市',
        span: 4,
        form: (
          <Select placeholder="请选择城市" value={city} onChange={this.onChangeCity}>
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key} alt={item.description}>{item.description}</Option>);
              })
            }
          </Select>
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.district) !== -1) {
      formItems.push({
        label: '商圈',
        span: 5,
        form: (
          <Select placeholder="请选择商圈" value={district} onChange={this.onChangeDistrict}>
            {
              authorize.districts([city]).map((item, index) => {
                return <Option key={index} value={item.id} alt={item.name}>{item.name}</Option>;
              })
            }
          </Select>
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      formItems.push({
        label: '分摊金额',
        span: 4,
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 12 } },
        form: <Input placeholder="" value={costCount} onChange={this.onChangeCostCount} />,
      });
    }

    // 操作按钮
    if (config.indexOf(CommonItemsType.operatCreate) !== -1 && config.indexOf(CommonItemsType.operatDelete) !== -1) {
      formItems.push({
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon="plus" />
            <Button onClick={this.onDelete} shape="circle" icon="minus" />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatCreate) !== -1) {
      formItems.push({
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon="plus" />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatDelete) !== -1) {
      formItems.push({
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon="minus" />
          </div>
        ),
      });
    }

    return (
      <CoreForm items={formItems} cols={8} layout={layout} />
    );
  }
}
function mapStateToProps({ }) {
  return { };
}
CommonItems.CommonItemsType = CommonItemsType;
module.exports = connect(mapStateToProps)(CommonItems);
