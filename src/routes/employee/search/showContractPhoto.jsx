/**
 *
 * 显示合同照片模板
 * @author Jay
 * @params props.contractPhotos {array}
 * @params props.title {string}
 */

import React, { Component } from 'react';
import { Row } from 'antd';
import ContractPhotoDetail from './showPhotoDetail';

class ShowContractPhoto extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { contractPhotos, title } = this.props;
    const style = {
      spanStyle: { width: 100, height: 120, display: 'inline-block', textAlign: 'center', marginRight: 25 },
      imgStyle: { width: 100, height: 100 },
    };
    return (
      <Row className="mgl32" style={{ marginTop: '20px' }}>
        <p>{title} :</p>
        <div style={{ marginLeft: 60 }}>
          {contractPhotos && contractPhotos.map((item, index) => {
            return (
              <ContractPhotoDetail photoUrl={item} key={index} {...style} />
            );
          })}
        </div>
      </Row>
    );
  }
}
export default ShowContractPhoto;
