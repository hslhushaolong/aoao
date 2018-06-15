// 日期选择的控件
import React, { Component } from 'react';
import { Slider, Button, Row, Col, message, Popconfirm } from 'antd';
import { CoreContent } from '../../../../components/core';

class DateSlider extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      id: value.id,                         // 数据的id-未用
      min: value.min || 1,                  // 最小值
      max: value.max || 31,                 // 最大值
      selected: value.selected || 1,        // 选中数据
      disabled: value.disabled || false,    // 是否禁用
      canCreate: value.canCreate || false,  // 是否能够创建

      onChangeSlider: props.onChangeSlider, // 更新当前级别的回调
      // onDeleteSlider: props.onDeleteSlider, // 删除当前级别的回调
      // onCreateSlider: props.onCreateSlider, // 添加下一级的回调
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  // 更新当前级别数据
  onChangeSlider = (value) => {
    const { onChangeSlider } = this.state;

    this.setState({
      selected: value,
    });

    if (onChangeSlider) {
      onChangeSlider(Object.assign({}, this.state, { selected: value }));
    }
  }

  // 添加下一级的数据
  onCreateSlider = () => {
    const { onCreateSlider, canCreate } = this.state;
    if (canCreate !== true) {
      message.warning('请先选择平台');
      return;
    }

    this.setState({
      disabled: true,
    });

    // 调用上一级，添加新的slider
    if (onCreateSlider) {
      onCreateSlider(Object.assign({}, this.state, { disabled: true }));
    }
  }

  // 删除当前级别的数据
  onDeleteSlider = () => {
    const { onDeleteSlider } = this.state;
    // 调用上一级，添加新的slider
    if (onDeleteSlider) {
      onDeleteSlider(Object.assign({}, this.state, { disabled: true }));
    }
  }

  render() {
    const { min, max, selected, disabled, id } = this.state;
    return (
      <span style={{ marginLeft: '20px' }}>
        开始于: 第{selected[0]}天  截止到: 第{selected[1]}天
         {disabled ? '' : '作用时间: '}
        {
          disabled ? '' :
          <Slider range style={{ margin: '12px 20px', padding: '0px', height: '4px' }} min={min} max={max} value={selected} disabled={disabled} onChange={this.onChangeSlider} tipFormatter={value => `第${value}天`} />
        }
      </span>
    );
  }
}
export default DateSlider;
/**
 * <Row style={{ lineHeight: '28px' }}>
          <Col span={6}>
            // {id + 1} - 开始于: 第{selected[0]}天  截止到: 第{selected[1]}天
            开始于: 第{selected[0]}天  截止到: 第{selected[1]}天
            </Col>
            <Col span={2}>{disabled ? '' : '作用时间: '}</Col>
            <Col span={10}>
              {
                disabled ? '' :
                <Slider range style={{ margin: '12px 20px', padding: '0px', height: '4px' }} min={min} max={max} value={selected} disabled={disabled} onChange={this.onChangeSlider} tipFormatter={value => `第${value}天`} />
              }
            </Col>
             <Col span={6}>
            {
              disabled ? '' :
              <div style={{ float: 'right' }}>
              // 如果选中的数据为最大，则不显示添加的按钮
                {selected === 31 ? '' : <Button type="dashed" onClick={this.onCreateSlider}>添加</Button>}
                {
                  min === 1 ? '' :
                  <Popconfirm title="删除后数据无法恢复，确定执行操作？" onConfirm={this.onDeleteSlider} okText="确定" cancelText="取消">
                    <Button type="dashed" style={{ marginLeft: '10px' }}>删除</Button>
                  </Popconfirm>
                }
              </div>
            }
          </Col>
          </Row>

 */
