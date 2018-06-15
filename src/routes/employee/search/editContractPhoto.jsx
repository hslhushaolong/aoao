/**
 *
 * 编辑合同照片模板
 * @author Jay
 * @params props.contractPhotos {array}
 * @params props.title {string}
 */

import React, { Component } from 'react';
import EditPhotoDetail from './editPhotoDetail';

class EditContractPhoto extends Component {
  constructor(props) {
    super(props);
  }

  // 点击删除
  handleDelete = (index) => {
    // 调用父级删除方法
    if (this.props.handleDelete) {
      this.props.handleDelete(index);
    }
  }

  render() {
    const { contractPhotos, title } = this.props;
    const style = {
      spanStyle: { width: 95, height: 95, display: 'inline-block', textAlign: 'center', marginRight: 10 },
      imgStyle: { width: 95, height: 95 },
    };
    return (
      <div style={{ marginLeft: 5 }}>
        {contractPhotos && contractPhotos.map((item, index) => {
          return (
            <EditPhotoDetail photoUrl={item} key={index} {...style} index={index} handleDelete={this.handleDelete} />
          );
        })}
      </div>
    );
  }
}
export default EditContractPhoto;
