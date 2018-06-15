// 审核记录详情弹窗
import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import { ExpenseType, ExpenseVerifyState, ExpenseProcessState, Position } from '../../../../../application/define';
import { authorize } from '../../../../../application';
import { CoreContent } from '../../../../../components/core';

class VerifyRecordsModal extends Component {
  constructor(props) {
    super();
    this.state = {
      title: props.title ? props.title : undefined,           // 标题
      data: props.data ? props.data : [],                     // 数据
      onCancel: props.onCancel ? props.onCancel : undefined,  // 可见状态变更回调
      visible: props.visible ? props.visible : false,         // 是否显示弹窗
      positionInfoList: props.positionInfoList,
    };
    this.private = {
      modal: undefined,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      title: nextProps.title ? nextProps.title : undefined,           // 标题
      data: nextProps.data ? nextProps.data : [],                     // 数据
      onCancel: nextProps.onCancel ? nextProps.onCancel : undefined,  // 可见状态变更回调
      visible: nextProps.visible ? nextProps.visible : false,         // 是否显示弹窗
    });
  }

  // 取消
  onCancel = () => {
    // 回调函数，提交
    const { onCancel } = this.state;
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { title, visible, positionInfoList } = this.state;
    const columns = [
      {
        title: '职位',
        dataIndex: 'gid',
        key: 'gid',
        render: (text) => {
          const position = positionInfoList.find((item) => {
            return item.gid === text;
          });
          return (
            <div>
              {position && position.name}
            </div>
          );
        },
      },
      {
        title: '审核人',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          if (text === '' || text == null) {
            return '--';
          }
          return text;
        },
      },
      {
        title: '审核时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          if (text === '' || text == null) {
            return '--';
          }
          return text;
        },
      },
      {
        title: '审核结果',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return ExpenseProcessState.description(text);
        },
      },
      {
        title: '审核意见',
        dataIndex: 'desc',
        key: 'desc',
        render: (text) => {
          if (text === '' || text == null) {
            return '--';
          }
          return text;
        },
      },
    ];
    return (
      <Modal title={title} visible={visible} closable onCancel={this.onCancel} onOk={this.onCancel}>
        <div style={{ overflow: 'auto' }}>
          {
            this.props.data.map((item, index) => {
              return (
                <CoreContent title={`审核记录${index + 1}`} key={index}>
                  <Table columns={columns} dataSource={item} pagination={false} rowKey={(record, number) => number} />
                </CoreContent>
              );
            })
          }
        </div>
      </Modal>
    );
  }
}

export default VerifyRecordsModal;
