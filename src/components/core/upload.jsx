import React from 'react';
import { Upload, Button, Icon, message } from 'antd';
import dot from 'dot-prop';
import { connect } from 'dva';

class CoreUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outExcel: props.outExcel ? props.outExcel : false,     // 是否验证传入的图片是不是excel/true 可以不是excel
      title: props.title ? props.title : '上传',  // 按钮标题
      token: dot.get(props, 'upload.token'),                  // 上传的token
      path: dot.get(props, 'upload.path'),                    // 文件地址
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    };

    // 获取上传token
    this.getToken();
  }

  componentWillReceiveProps(props) {
    this.setState({
      outExcel: props.outExcel ? props.outExcel : false,     // 是否验证传入的图片是不是excel/true 可以不是excel
      title: props.title ? props.title : '上传',  // 按钮标题
      token: dot.get(props, 'upload.token'),                 // 上传的token
      path: dot.get(props, 'upload.path'),                   // 文件地址
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    });

    // 请求成功返回的结果
    const { response } = props.upload;
    const { key, hash, error } = response;

    // 请求失败的回调函数
    if (error && props.onFailure) {
      props.onFailure(error);
      // 重置model层数据
      this.props.dispatch({ type: 'upload/resetUploadResponse', payload: {} });
    }

    // 请求成功的回调函数
    if (key && hash && props.onSuccess) {
      props.onSuccess(key, hash);
      // 重置model层数据
      this.props.dispatch({ type: 'upload/resetUploadResponse', payload: {} });
    }
  }

    // 获取七牛地址
  getToken = () => {
    // console.log("上传文件，获取token");
    const { dispatch } = this.props;
    dispatch({ type: 'upload/getUploadTokenE', payload: { file_name: 'xlsx' } });
  }

  // 上传文件到七牛
  startUpload = (file) => {
    const { token, path, outExcel } = this.state;
    // 判断文件格式
    if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(file.type) === -1 && !outExcel) {
      message.error('只能上传excel格式文件');
      return false;
    }

    // 如果文件正确则创建任务
    this.props.dispatch({ type: 'upload/uploadToServer', payload: { file, token, key: path } });
    return false;
  }

  render() {
    const { title } = this.state;
    // 设置上传地址
    const props = {
      action: '',
      name: 'file',
      beforeUpload: this.startUpload,
      showUploadList: false,
    };
    return (
      <div style={{ display: 'inline-block' }}>
        <Upload {...props}>
          <Button><Icon type="upload" />{title}</Button>
        </Upload>
      </div>
    );
  }
}
function mapStateToProps({ upload }) {
  return { upload };
}
export default connect(mapStateToProps)(CoreUpload);
