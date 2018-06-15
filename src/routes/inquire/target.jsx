/**
 * 大查询-Target
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Checkbox, Modal, Button } from 'antd';

class Target extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowOption: false,  // 控制模态框
      platformTarget: props.platformTarget || [],     // 初始化全部指标项
      checkedOption: props.checkedOption || [],       // 选中指标项（点击确认时参数）
    };
    this.private = {
      dispatch: props.dispatch,
      getSearchMethod: props.getSearchMethod,   // search方法
      onCheckedTargets: props.onCheckedTargets, // 获取选中targets
    };
  }
  // update
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      platformTarget: nextProps.platformTarget,
      checkedOption: nextProps.checkedOption,
    });
  }

  // 弹出模态框
  onShowOptions = () => {
    const { isShowOptions } = this.state;
    this.setState({
      isShowOptions: !isShowOptions,
    });
  }
  // 选择指标选项函数
  onChangeSpecification = (e, title) => {
    const { checkedOption } = this.state;
    if (!e) {
      return;
    }
    // e.target.checked=> false: 删除;true: 添加;
    const target = checkedOption;
    if (e.target.checked && checkedOption.indexOf(title) === -1) {
      // true  添加到选中指标项中
      target.push(title);
    } else {
      // false  在数组中时从中删除指标项
      if (target.indexOf(title) !== -1) target.splice(target.indexOf(title), 1);
    }
    this.setState({
      checkedOption: target,
    });
  }
  // OK
  handleOk = () => {
    const { onCheckedTargets, getSearchMethod } = this.private;
    const { checkedOption } = this.state;
    // 点击确定后，update数据
    // update targets到search组件，并保存;之后只修改search条件时，仍用最新修改的targets;
    onCheckedTargets(checkedOption);
    // 实现点击确认时，实时请求search接口；
    getSearchMethod(checkedOption);
    // 控制modal状态
    this.onShowOptions();
  }
  // Cancel
  handleCancel = () => {
    // 点击取消后，不传参
    this.onShowOptions();
  }
  // 处理数据源
  renderContent = () => {
    const { platformTarget } = this.state;
    return (
      <div>
        {
          platformTarget && platformTarget.map((options, optionsIndex) => {
            return (
              <div key={optionsIndex}>
                <p style={{ lineHeight: '30px' }}>{options.title}</p>
                {
                  // 判断是否是二维数组，是则继续遍历，否则展示数据
                  (options.items[0] instanceof Array) ?
                    options.items.map((items, index) => {
                      return (
                        <div key={index}>
                          {
                            items.map((item, key) => {
                              return (
                                <div key={key}>
                                  {
                                    item.item.map((it, itIndex) => {
                                      return <Checkbox key={itIndex} defaultChecked onChange={e => this.onChangeSpecification(e, it.value)} >{it.label}</Checkbox>;
                                    })
                                  }
                                </div>
                              );
                            })
                          }
                          <br />
                        </div>
                      );
                    })
                    :
                    <div key={optionsIndex}>
                      {
                        options.items.map((it, itIndex) => {
                          return <Checkbox key={itIndex} defaultChecked onChange={e => this.onChangeSpecification(e, it.value)} >{it.label}</Checkbox>;
                        })
                      }
                      <br />
                    </div>
                }
              </div>
            );
          })
        }
      </div>
    );
  }
  // 指标选择specification_list
  renderSpecificationList = () => {
    const { isShowOptions } = this.state;     // 控制模态框
    const btn = (
      <a style={{ marginLeft: 8, fontSize: 14 }} onClick={this.onShowOptions}>
        修改指标
      </a>
    );

    return (
      <div style={{ marginBottom: 10, width: '100%', lineHeight: '60px' }}>
        <div style={{ backgroundColor: '#FAFAFA', height: '60px', padding: '0 20px' }}>
          <span style={{ fontSize: 14, float: 'left' }}>指标项</span>
          <span style={{ float: 'right' }}>{btn}</span>
        </div>
        <Modal
          width="540px"
          closable={false}
          maskClosable
          title="修改指标"
          visible={isShowOptions}
          onOk={this.handleOk}
          // onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
          {this.renderContent()}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染指标选项 */}
        {this.renderSpecificationList()}
      </div>
    );
  }
}
const mapStateToProps = ({ inquireModel }) => {
  return { inquireModel };
};
export default connect(mapStateToProps)(Target);
