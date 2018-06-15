/**
 *
 * 显示每个合同照片的模板
 * @author Jay
 * @class ContractPhotoDetail
 * @extends {Component}
 */
import React, { Component } from 'react';
import { Modal } from 'antd';

class ContractPhotoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,  // 对话框可见性
    };
  }

  // 点击图片
  imgClick(photoUrl) {
    this.setState({
      previewVisible: true,
    });
  }

  // 模态框取消按钮
  handleCancel() {
    this.setState({
      previewVisible: false,
    });
  }

  render() {
    const { photoUrl, spanStyle, imgStyle } = this.props;
    return (
      <span>
        <span style={{ ...spanStyle }} title="点击查看大图">
          <img style={{ ...imgStyle }} src={photoUrl} className="pointer" onClick={this.imgClick.bind(this, photoUrl)} />
        </span>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '92%', display: 'block', margin: '0 auto' }} src={photoUrl} />
        </Modal>
      </span>
    );
  }
}
export default ContractPhotoDetail;
