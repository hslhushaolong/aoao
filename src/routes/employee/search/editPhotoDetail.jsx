/**
 *
 * 显示每个合同照片的模板
 * @author Jay
 * @class ContractPhotoDetail
 * @extends {Component}
 */
import React, { Component } from 'react';
import { Modal, Icon } from 'antd';
import styles from './editPhotoDetail.less';

class EditPhotoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,  // 图片预览对话框
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

  // 点击删除
  handleDelete(index) {
    if (this.props.handleDelete) {
      this.props.handleDelete(index);
    }
  }

  render() {
    const { photoUrl, spanStyle, imgStyle, index } = this.props;
    return (
      <span className={styles.picNav}>
        <span style={{ ...spanStyle }} title="点击查看大图">
          <img style={{ ...imgStyle }} src={photoUrl} className="pointer" onClick={this.imgClick.bind(this, photoUrl)} />
          <b><Icon type="delete" style={{ fontSize: 16, color: '#fff' }} onClick={this.handleDelete.bind(this, index)} /></b>
        </span>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '92%', display: 'block', margin: '0 auto' }} src={photoUrl} />
        </Modal>
      </span>
    );
  }
}
export default EditPhotoDetail;
