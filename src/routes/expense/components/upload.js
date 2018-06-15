// 上传文件组件---用于费用管理中的所有上传功能
// 解决了原上传组件只能上传excel文件，上传的文件名字不能自定义，不能多次上传的问题
// 上传流程：1.向后端发送文件名，获得上传七牛需要的token。
         // 2.带着后端返回的token和文件上传七牛，获得七牛返回的唯一key。
        //  3.将七牛返回的key发送给后端保存
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Upload,
  Button,
  Icon,
  message,
} from 'antd';
import styles from './upload.less';

class ModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: dot.get(props, 'operationManage.token'),                        // 七牛token
      path: dot.get(props, 'operationManage.path'),                          // 七牛key
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    };
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (props) => {
    // 检测七牛的key是否改变，改变说明传回了新的就抛出去
    if (props.operationManage.path != this.state.path && props.onSuccess) {
      // 把七牛返回的key传出去
      props.onSuccess(props.operationManage.path);
    }

    this.setState({
      token: dot.get(props, 'operationManage.token'),                        // 七牛token
      path: dot.get(props, 'operationManage.path'),                          // 七牛key
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    });
  };
  // 获得七牛token
  getQINIUToken = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'operationManage/getUploadTokenE', payload: params });   // path token
  };

// 获得七牛token
  getToken = (params) => {
    this.getQINIUToken(params);
  };

  render() {
    const that = this;
    // 上传文件
    const props = {
      name: 'file',
      action: '', //  //jsonplaceholder.typicode.com/posts/
      showUploadList: false,        // antd文档
      data(file) {
        return { token: 'token', key: 'path', file };
      },
      beforeUpload(file) {   // 文件上传前生命周期//将文件发到7牛
        that.getToken(file);
      },
    };
    return (
      <div className={styles.upload}>
        <Row>
          <Col sm={17} id={styles.btn}>
            <Upload {...props}>
              <Button className={styles.resetHover}>
                <Icon type="upload" />
                                点击上传
                              </Button>
            </Upload>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ upload, operationManage }) {
  return { upload, operationManage };
}
ModalPage = Form.create()(ModalPage);
export default connect(mapStateToProps)(ModalPage);
