// 骑士薪资指标库列表
import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';
import { CoreContent } from '../../../components/core';


// 指标模版
import IndexTemplate from './template/suppiler';

const { Option } = Select;

// 薪资指标的定义
const SalaryIndex = {
  elem: 'elem',
  meituan: 'meituan',
  baidu: 'baidu',
  // 描述
  description(rawValue) {
    switch (rawValue) {
      case this.elem: return '饿了么';
      case this.meituan: return '美团';
      case this.baidu: return '百度';
      default: return '--';
    }
  },
  // 指标模版
  template(dataSource) {
    return <IndexTemplate dataSource={dataSource} />;
  },
};

class chooseTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryIndex: SalaryIndex.elem,  // 默认值
      salarySpecifications: dot.get(props, 'system.salarySpecifications', {}),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      salarySpecifications: dot.get(nextProps, 'system.salarySpecifications', {}),
    });
  }

  // 切换指标
  onChangeSalaryIndex = (value) => {
    this.setState({
      salaryIndex: value,
    });
  }

  render() {
    const { salaryIndex } = this.state;
    // 标题
    const title = `${SalaryIndex.description(salaryIndex)}指标库`;
    // 扩展的标题插件（用于选择平台）
    const titleExt = (
      <Select defaultValue="elem" style={{ width: 100 }} onSelect={this.onChangeSalaryIndex} >
        <Option value="elem">饿了么</Option>
        <Option value="meituan">美团</Option>
        <Option value="baidu">百度</Option>
      </Select>
    );
    // 获取对应平台的数据，然后进行重新组装
    const dataSource = this.state.salarySpecifications[salaryIndex];
    const formatData = Object.keys(dataSource).map((key) => {
      return {
        ...dataSource[key],
        key,
      };
    });
    return (
      <CoreContent title={title} titleExt={titleExt}>
        {/* 渲染模版 */}
        {SalaryIndex.template(formatData)}
      </CoreContent>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}

export default connect(mapStateToProps)(chooseTemplate);
