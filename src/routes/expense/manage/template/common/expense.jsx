// 费用信息模块模版
import dot from 'dot-prop';
import { Select } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { ExpenseCostCenter, ExpenseCostBelong } from '../../../../../application/define';
import is from 'is_js';

// 项目
import CommonItems from '../common/items';

const { CommonItemsType } = CommonItems;
const { Option } = Select;

class CommonExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectOne: dot.get(props, 'subjectOne', undefined),  // 一级项目的id，判断成本中心显示的数据
      costCenter: dot.get(props, 'value.costCenter', undefined),  // 成本中心
      costBelong: dot.get(props, 'value.costBelong', `${ExpenseCostBelong.average}`),  // 成本归属
      costItems: dot.get(props, 'value.costItems', [{}]),       // 子项目
      onChange: props.onChange ? props.onChange : undefined,    // 回调事件
    };
  }

  componentWillReceiveProps = (props, lastProps) => {
    this.setState({
      subjectOne: dot.get(props, 'subjectOne', undefined),  // 一级项目的id，判断成本中心显示的数据
      costCenter: dot.get(props, 'value.costCenter', undefined),  // 成本中心
      costBelong: dot.get(props, 'value.costBelong', `${ExpenseCostBelong.average}`),  // 成本归属
      costItems: dot.get(props, 'value.costItems', [{}]),       // 子项目
      onChange: props.onChange ? props.onChange : undefined,    // 回调事件
    });
  }
  // 回调函数
  onChange = (state) => {
    const { onChange } = this.state;
    this.setState(state);

    // 调用上级回调
    if (onChange) {
      onChange(state);
    }
  }

  // 成本中心
  onChangeCostCenter = (e) => {
    const { costBelong } = this.state;
    const state = {
      costCenter: e,
      costBelong,
      costItems: [{}],
    };
    this.onChange(state);
  }
  // 成本归属
  onChangeCostBelong = (e) => {
    const { costCenter } = this.state;
    const state = {
      costCenter,
      costBelong: e,
      costItems: [{}],
    };
    this.onChange(state);
  }

  // 修改子项目内容
  onChangeItem = (key, e) => {
    const { costCenter, costBelong, costItems } = this.state;
    dot.set(costItems, `${key}`, e);
    const state = {
      costCenter,
      costBelong,
      costItems,
    };
    this.onChange(state);
  }

  // 创建子项目
  onCreateItem = () => {
    const { costCenter, costBelong, costItems } = this.state;
    costItems.push({});
    const state = {
      costCenter,
      costBelong,
      costItems,
    };
    this.onChange(state);
  }

  // 删除子项目
  onDeleteItem = (index) => {
    const { costCenter, costBelong, costItems } = this.state;
    costItems.splice(index, 1);
    const state = {
      costCenter,
      costBelong,
      costItems,
    };
    this.onChange(state);
  }

  // 根据成本中心获取配置文件
  getConfig = (costCenter, costBelong, enableCreate = true, enableDelete = true) => {
    let config = [];
    switch (Number(costCenter)) {
      // 项目
      case ExpenseCostCenter.project:
        config = [
          CommonItemsType.platform,
        ];
        break;
      // 项目主体总部
      case ExpenseCostCenter.headquarter:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
        ];
        break;
      // 城市
      case ExpenseCostCenter.city:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
          CommonItemsType.city,
        ];
        break;
      // 城市 或 商圈
      case ExpenseCostCenter.district:
      case ExpenseCostCenter.knight:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
          CommonItemsType.city,
          CommonItemsType.district,
        ];
        break;
      default: config = [CommonItemsType.platform];
    }
    // 判断是否是自定义分摊
    if (Number(costBelong) === ExpenseCostBelong.custom) {
      config.push(CommonItemsType.costCount);
    }

    // 创建操作按钮
    if (enableCreate) {
      config.push(CommonItemsType.operatCreate);
    }

    // 删除操作按钮
    if (enableDelete) {
      config.push(CommonItemsType.operatDelete);
    }

    return config;
  }

  // 渲染子项目
  renderItems = () => {
    const { costCenter, costBelong, costItems } = this.state;
    return (
      <CoreContent style={{ backgroundColor: '#ffffff' }}>
        {/* 分摊子项目 */}
        {
          costItems.map((item, index, records) => {
            const length = records.length;
            // 显示的项目
            let config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 1) {
              config = this.getConfig(costCenter, costBelong, true, false);
            // 多行数据的情况下，最后一条显示创建按钮
            } else if (index === length - 1) {
              config = this.getConfig(costCenter, costBelong);
            // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else {
              config = this.getConfig(costCenter, costBelong, false);
            }

            // 合并表单数据，传递给下一级组件
            const value = Object.assign({ key: index }, item, { config });
            return <CommonItems key={index} value={value} onCreate={this.onCreateItem} onDelete={this.onDeleteItem} onChange={this.onChangeItem} />;
          })
        }
      </CoreContent>
    );
  }

  // 渲染成本中心，成本归属
  renderSelect = () => {
    let { subjectOne, costCenter, costBelong } = this.state;

    // 科目一的数据
    const data = dot.get(this.props, 'expense.subjectName', {});
    // 成本中心显示的选项
    let costCenterItems = [];
    // 查到选中的一级科目
    const subject = data.find(item => item._id === subjectOne);
    // 如果清除科目则科目是undefined
    if (is.not.empty(subject) && is.existy(subject)) {
      costCenterItems = subject.cost_center;
    }
    if (costCenterItems.indexOf(parseFloat(costCenter)) === -1) {
      costCenter = undefined;
    }
    if (costCenter !== undefined) {
      costCenter = costCenter.toString();
    }
    const formItems = [
      {
        label: '成本中心',
        form: (
          <Select placeholder="请选择成本中心" value={costCenter} onChange={this.onChangeCostCenter}>
            {costCenterItems.map((item) => {
              return <Option value={item.toString()} key={item.toString()}>{ExpenseCostCenter.description(item)}</Option>;
            })}
          </Select>
        ),
      }, {
        label: '成本归属',
        form: (
          <Select placeholder="请选择成本中心" value={`${costBelong}`} onChange={this.onChangeCostBelong}>
            <Option value={`${ExpenseCostBelong.average}`}>{ExpenseCostBelong.description(ExpenseCostBelong.average)}</Option>
            <Option value={`${ExpenseCostBelong.percent}`}>{ExpenseCostBelong.description(ExpenseCostBelong.percent)}</Option>
            <Option value={`${ExpenseCostBelong.custom}`}>{ExpenseCostBelong.description(ExpenseCostBelong.custom)}</Option>
          </Select>
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return <CoreForm items={formItems} cols={3} layout={layout} />;
  }

  render = () => {
    return (
      <div>
        {/* 渲染成本中心，成本归属 */}
        {this.renderSelect()}
        {/* 渲染选项 */}
        {this.renderItems()}
      </div>
    );
  }
}

function mapStateToProps({ approval, expense }) {
  return { approval, expense };
}
export default connect(mapStateToProps)(CommonExpense);
