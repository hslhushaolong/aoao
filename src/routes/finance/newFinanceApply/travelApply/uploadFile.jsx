/**
 * 上传文件
 * @author Jay
 */
import React from 'react';
import dot from 'dot-prop';
import { Upload, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import aoaoBossTools from './../../../../utils/util';
import { authorize } from '../../../../application';

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],  // 上传文件地址
      token: dot.get(props, 'finance.token'),  // 获取的token
      path: dot.get(props, 'finance.path'),  // 文件地址
      files_address: [],  // 七牛返回的文件url地址数组
      notPDF: false,  // 判断是否上传的pdf文件
    };
  }

  // 清空全局state中的图片和文件地址列表
  componentDidMount() {
    this.props.dispatch({
      type: 'finance/emptyImageListR',
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      token: dot.get(props, 'finance.token'),
      path: dot.get(props, 'finance.path'),
      files_address: dot.get(props, 'finance.files_address'),  // 文件地址
    });
  }

  // 获取七牛地址
  getToken() {
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/getUploadTokenE',
      payload: {},
    });
  }

  // 上传文件的回调函数
  handleChange(info) {
    // 判断上传文件类型
    if (this.state.notPDF) {
      this.setState({ notPDF: false });
      return;
    }
    let fileList = info.fileList;
    // 将要传给后台的文件地址数组 files_address 进行过滤
    let { files_address } = this.state;
    const arr = [];
    for (let i = 0; i < files_address.length; i++) {
      const element = files_address[i];
      for (let j = 0; j < fileList.length; j++) {
        const item = fileList[j];
        if (element.name == item.name) {
          arr.push(element);
        }
      }
    }
    files_address = arr;
    // 重置文件状态
    fileList.forEach((file, index) => {
      file.status = 'done';
    });
    // 文件地址去重
    files_address = aoaoBossTools.uniqeByKeys(files_address, ['name']);
    // 文件去重
    fileList = aoaoBossTools.uniqeByKeys(fileList, ['name']);
    this.setState({ fileList });
    // 更新全局的文件地址数组
    this.props.dispatch({
      type: 'finance/updateFilesAddressR',
      payload: {
        files_address,
      },
    });
  }

  // 上传文件到七牛
  beforeUpload(file) {
    const { token, path } = this.state;
    // 判断文件格式
    if (['application/pdf'].indexOf(file.type) == -1) {
      message.error('只能上传PDF格式文件');
      this.setState(() => {
        return { notPDF: true };
      });
      return;
    }
    // 如果上传的图片已经上传过，进行拦截
    for (let i = 0; i < dot.get(this, 'state.fileList').length; i++) {
      const item = this.state.fileList[i];
      if (item.name === file.name) {
        message.error('此图片已经上传过');
        return;
      }
    }
    // 如果文件正确则创建任务
    this.props.dispatch({ type: 'finance/postFileToQINIUE', payload: { file, token, key: path } });
  }

  render() {
    // 设置上传地址
    const props = {
      action: '',
      name: 'file',
      showUploadList: true,
      onChange: this.handleChange.bind(this),
      multiple: true,
      beforeUpload: this.beforeUpload.bind(this),
    };
    return (
      <div onMouseDown={this.getToken.bind(this)} style={{ display: 'inline-block' }}>
        <Upload {...props} fileList={this.state.fileList}>
          <Button>
            <Icon type="upload" /> 上传文件
          </Button>
        </Upload>
      </div>
    );
  }
}
function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(UploadFile);
