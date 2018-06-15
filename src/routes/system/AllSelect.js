/*
全选组件参数说名
options:传入的option数组 [{city_id:'1',city_name:'北京'},{city_id:'2',city_name:'上海'},{city_id:'3',city_name:'广州'},]
areaKeyValueList: 生成option的value 'city_id'
names: 生成option的name 'city_name'
getAllSelectValue: 表单值的回调函数 (value) => {this.setState({data:value})}
data: 控制选中的数据 this.state.data
placeholder: placeholder
styles: style
*/

import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class AllSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],                      // 选中的value数组
      options: props.options || [],                // option选项
      value: props.values || 'value',              // value字段
      name: props.names || 'name',                 // name字段
      getAllSelectValue: props.getAllSelectValue,  // 获得value值
      style: props.styles || {},                   // style
      placeholder: props.placeholder || '',        // placeholder
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      data: nextProps.data || [],
      options: nextProps.options || [],
      value: nextProps.values || 'value',
      name: nextProps.names || 'name',
      getAllSelectValue: nextProps.getAllSelectValue,
      style: nextProps.styles || {},
      placeholder: nextProps.placeholder || '',
    });
  }

  // 检测是否存在
  exist = (prop) => {
    if (prop != null) {            // 检测是否是Null或者undefined
      return true;
    } else {
      return false;
    }
  }

  // 深拷贝
  deepClone = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  }

  // 数组格式转换
  arrayConverson = (arra) => {
    const arr = this.deepClone(arra);
    const { value, name } = this.state;
    const array = [];
    // 将传入的数据转换格式，以便能多选
    for (let i = 0; i < arr.length; i++) {
      const obj = {};
      obj.value = arr[i][value];
      obj.name = arr[i][name];
      array.push(obj);
    }
    // 删除第一个重复的多选
    if (array.length !== 0) {
      array.unshift({ value: 'allSelect', name: '全选' });
    }
    return array;
  }

  // 选值的回调
  handleChange=(data) => {
    const { options, value, getAllSelectValue } = this.state;
    if (data.indexOf('allSelect') !== -1) {  // 检测是否已经添加全选选项
      const store = [];
      for (let i = 0; i < options.length; i++) {
        store.push(options[i][value]);
      }
      this.setState({
        data: store,
      });
      if (this.exist(getAllSelectValue)) {
        getAllSelectValue(store);
      }
    } else {
      if (this.exist(getAllSelectValue)) {
        getAllSelectValue(data);
      }
      this.setState({
        data,
      });
    }
  }

  render() {
    const { options, style, data, placeholder } = this.state;
    const resource = this.arrayConverson(options);
    return (
      <Select
        className="maxHeight"
        showSearch
        optionFilterProp="children"
        style={style}
        mode="multiple"
        allowClear
        value={data}
        onChange={this.handleChange}
        placeholder={placeholder}
      >
        {resource.map(item => (
          <Option value={item.value} key={item.value}>{item.name}</Option>
        ))}
      </Select>
    );
  }
}

export default AllSelect;
