/**
 * 上传图片页面
 * @author Jay
 */
import React from 'react';
import dot from 'dot-prop';
import { Upload, Icon, Modal, message } from 'antd';
import { connect } from 'dva';
import aoaoBossTools from './../../../../utils/util';
import { authorize } from '../../../../application';

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,  // 预览对话框
      previewImage: '',  // 预览照片地址
      token: dot.get(props, 'finance.token'),  // 获取的token
      path: dot.get(props, 'finance.path'),  // 图片地址
      field: dot.get(props, 'finance.field'),  // 图片类型
      contract_photo_list: [], // 合同照片列表
      receipt_photo_list: [],  // 收据照片列表
      type: props.type,  // 判断点击的是合同上传还是收据上传，由父组件传递进来
      contract_fileList: [],  // 本地操作的合同图片
      receipt_fileList: [],   // 本地操作的收据图片
      fileList: [],  // 上传图片列表
      notImage: false,  // 判断上传是否为图片
      maxCount: props.maxCount,  // 最大上传数量
    };
  }

  // 每次进入该页面，清空全局state中的图片数组
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/emptyImageListR',
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      token: props.finance.token,  // 上传token
      path: props.finance.path,  // 图片路径
      field: props.finance.field,  // 上传图片
      contract_photo_list: props.finance.contract_photo_list, // 合同照片列表
      receipt_photo_list: props.finance.receipt_photo_list,  // 收据照片列表
      maxCount: props.maxCount, // 最大上传数量
    });
  }

  // 删除图片回调
  onRemove(file) {
    const { type, contract_photo_list, receipt_photo_list } = this.state;
    if (type === 'contract_photo') {  // 删除合同照片
      const contract_list = contract_photo_list && contract_photo_list.filter((item, index) => {
        return item.name !== file.name;
      });
      // 修改全局的 contract_photo_list
      this.props.dispatch({
        type: 'finance/updateContractPhotoListR',
        payload: {
          contract_photo_list: contract_list,
        },
      });
    } else if (type === 'receipt_photo') {
      // 删除收据照片
      const receipt_list = receipt_photo_list && receipt_photo_list.filter((item, index) => {
        return item.name !== file.name;
      });
      // 修改全局的 contract_photo_list
      this.props.dispatch({
        type: 'finance/updateReceiptPhotoListR',
        payload: {
          receipt_photo_list: receipt_list,
        },
      });
    }
  }

  // 获取七牛的Token
  getToken(type) {
    this.props.dispatch({
      type: 'finance/getUploadTokenE',
      payload: type,
    });
  }

  // 照片预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 点击预览取消
  handleCancel = () => this.setState({ previewVisible: false })

  // 文件上传前钩子,在这个函数中上传图片
  beforeUpload = (file, fileList) => {
    // 验证上传文件是否为图片
    if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) == -1) {
      message.error('只能上传图片', 1);
      // 上传图片为非图片，将notImage标记为true
      this.setState(() => {
        return { notImage: true };
      });
      return;
    }
    const { token, path, field } = this.state;
    const name = file.name;
    // 如果上传的图片已经上传过，进行拦截
    for (let i = 0; i < this.state.fileList.length; i++) {
      const item = this.state.fileList[i];
      if (item.name === file.name) {
        message.error('此图片已经上传过', 1);
        return;
      }
    }
    // 上传图片到七牛
    this.props.dispatch({
      type: 'finance/postImageToQINIUE',
      payload: { file, token, key: path, field, name },
    });
  }

  // 上传图片回调
  handleChange({ fileList, file }) {
    // 判断上传是否为图片
    if (this.state.notImage) {
      // 置反
      this.setState({ notImage: false });
      return;
    }
    // 将每个图片的状态改为done
    fileList.forEach((file) => {
      file.status = 'done';
    });
    // 图片去重
    fileList = aoaoBossTools.uniqeByKeys(fileList, ['name', 'type']);
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, type } = this.state;
    const maxPicCount = this.state.maxCount || 20;  // 最大图片数量
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <div onMouseDown={this.getToken.bind(this, type)}>
          <Upload
            action=""
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange.bind(this)}
            beforeUpload={this.beforeUpload}
            onRemove={this.onRemove.bind(this)}
          >
            {fileList.length >= maxPicCount ? null : uploadButton}
          </Upload>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(PicturesWall);
