// kpi上传页面的上传弹窗组件
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import {
  Form,
  Modal,
  DatePicker,
  Row,
  Col,
  Select,
  Upload,
  Button,
  Icon,
  message,
  Spin,
} from 'antd';
import styles from './upload.less';

const [FormItem,
  Option] = [Form.Item, Select.Option];
const { RangePicker } = DatePicker;

class ModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,                     // 弹框状态
      title: props.title,                         // 弹窗标题
      content: props.content,                     // 弹窗内容
      loading: props.loading,                     // loading状态
      token: props.token,                        // 七牛token
      path: props.path,                          // 七牛key
      searchPreset: {                            // 搜索项
        platform: [{ value: 'elem', name: '饿了么' }, { value: 'baidu', name: '百度' }],   // 平台
        type: [],                                // 类型
      },
      search: {                                  // 选中项
        platform: 'elem',                        // 平台
        type: '60071',                           // 类型   kpi日报
      },
    };
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      visible: nextProps.visible,
      title: nextProps.title,
      content: nextProps.content,
      path: nextProps.path,
      token: nextProps.token,
      loading: nextProps.loading,
    });
  };
  // 改变平台重置所属类型选择列表
  onChangePlatform = (value) => {
    if (value === 'elem') {
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'baidu', name: '百度' }],            // 平台
          type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],       // 类型
        },
        search: {
          platform: 'elem',         // 平台
          type: '60071',            // 类型 kpi日报
        },
      });
    } else if (value === 'baidu') {
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60070', name: '运力计划' }],                                      // 类型
        },
        search: {
          platform: 'baidu',     // 平台
          type: '60070',         // 类型 运力计划
        },
      });
    }
    this.props.form.resetFields(['template_type']);
  }

  // 弹窗确认事件
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        this.props.handleOk(values);
        this.props.form.resetFields();
      }
    });
  };

  // 弹窗取消事件
  handleCancel = () => {
    this.props.handleCancel();
    this.props.form.resetFields();
  };

// 获得七牛token
  getToken = (params) => {
    this.props.getQINIUtoken(params);
  };

  render() {
    const that = this;
    const { getFieldDecorator } = this.props.form;
    // 上传文件
    const props = {
      name: 'file',
      action: '', //  //jsonplaceholder.typicode.com/posts/
      showUploadList: false,
      data(file) {
        return { token: 'token', key: 'path', file };
      },
      beforeUpload(file) {   // 文件上传前生命周期//将文件发到7牛
        if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(file.type) === -1) {
          message.error('只能上传excel格式文件');
          return false;
        }
        that.getToken(file);
      },
    };
    return (
      <div className={styles.upload}>
        <Modal
          title={this.state.title} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} okText="保存" cancelText="取消" style={{
            top: '35%',
            overflow: 'hidden',
          }}
        >
          <Form>
            <Spin
              tip="Loading..." style={{
                height: '120%',
              }} spinning={this.state.loading}
            >
              <FormItem label="归属时间" {...{ labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } } }}>
                {getFieldDecorator('date', {
                  rules: [
                    {
                      required: true,
                      message: '请选择时间',
                    },
                  ],
                })(<RangePicker />)}
              </FormItem>
              <FormItem label="平台:" {...{ labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } } }}>
                {getFieldDecorator('platform_code', {
                  rules: [
                    {
                      required: true,
                      message: '请选择平台',
                    },
                  ],
                })(
                  <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
                    {
                        dot.get(this, 'state.searchPreset.platform', []).map((item) => {
                          return (<Option value={item.value} key={item.value}>{item.name}</Option>);
                        })
                  }
                  </Select>,
                )}
              </FormItem>
              <FormItem label="所属类型:" {...{ labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } } }}>
                {getFieldDecorator('template_type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择类型" onChange={this.onChangeType}>
                    {
                        dot.get(this, 'state.searchPreset.type', []).map((item) => {
                          return (<Option value={item.value} key={item.value}>{item.name}</Option>);
                        })
                    }
                  </Select>,
                )}
              </FormItem>
              <Row>
                <Col sm={17} id={styles.btn}>
                  <FormItem label="文件" {...{ labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 18 } } }}>
                    {getFieldDecorator('file', {
                      rules: [
                        {
                          required: true,
                          message: '请上传文件',
                        },
                      ],
                    })(
                      <Upload {...props}>
                        <Button className={styles.resetHover}>
                          <Icon type="upload" />
                                点击上传
                              </Button>
                      </Upload>,
                          )}
                  </FormItem>
                </Col>
              </Row>
            </Spin>
          </Form>
        </Modal>
      </div>
    );
  }
}

ModalPage = Form.create()(ModalPage);
export default connect()(ModalPage);
