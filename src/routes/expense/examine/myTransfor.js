// 穿梭框
import { connect } from 'dva';
import React, { Component } from 'react';
import { TreeSelect, Modal, Input, Button, Row, Col, Transfer } from 'antd';
import { authorize } from '../../../application';

class MyTransfor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,                                  // 弹窗
      treeSource: props.expense.examineTree,          // 储存原始tree数据
      treeStore: props.expense.examineName,            // 存储可供搜索的数据
      treeData: props.expense.examineTree,              // 存储搜索之后的tree数据
      searchData: '',                                 // 要搜索的内容
      targetKeys: [], // 穿梭狂右侧的值
    };
  }
  // 穿梭框改变值
  handleChange = (values) => {
    this.setState({
      targetKeys: values,
    });
  }
  // 寻找主题
  findTitle = (data) => {
    const title = [];
    data.forEach((branch) => {
      this.props.expense.examineName.forEach((item) => {
        if (branch === item._id) {
          title.push(`${item.name} ${item.phone}`);
        }
      });
    });
    return title;
  }
  // 穿梭框确认
  handleOk = () => {
    // 如果穿梭框不为空
    if (this.state.targetKeys.length != 0) {
      // 就将值传给外面的函数
      this.props.onSelect(this.state.targetKeys, this.findTitle(this.state.targetKeys));
    }
    this.props.onCancel();
    // 重置为空
    this.setState({ targetKeys: [] });
  }
  // 穿梭框取消
  handleCancle = () => {
    this.props.onCancel();
  }
  render =() => {
    return (
      <Modal
        title="审批流设置" visible={this.props.visible}
        onOk={this.handleOk} onCancel={this.handleCancle}
      >
        <Transfer
          dataSource={this.props.expense.examineTree}
          showSearch
          onChange={this.handleChange}
          targetKeys={this.state.targetKeys}
          render={item => item.title}
          listStyle={{
            height: 400,
          }}
          titles={['全选／合计', '全选／合计']}
        />
      </Modal>
    );
  }
}

function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(MyTransfor);
