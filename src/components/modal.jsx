/**
 * 公用modal
 * visible { boolean }  对话框的弹出与收起
 * title { string }  对话框的标题
 * content { array }  对话框的内容
 * example: props = {
 *   title: '通知消息'，
 *   visible: true,
 *   content: [{
 *     label: '名称',
 *     id: '',
 *     message: '请输入正确的值',
 *     required: true,
 *     placeholder: '请输入名称'，
 *     initialValue: null,
 *     checkValue: {  // 正则验证
         rule: 'number',
         message: '请输入数字',
       },
 *   }]
 * }
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Modal, Button, Form, Radio, Select, Input, InputNumber } from 'antd';

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

const checkRule = {
  // 数字
  number: /^[0-9]*$/,
  // 身份证号
  idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  // 手机号
  phoneNumber: /^1[34578]\d{9}$/,
};

class ModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false, // 弹框状态
      title: props.title || '通知',      // 弹窗标题
      content: props.content || [], // 弹窗内容
    };
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      visible: nextProps.visible,
      title: nextProps.title,
      content: nextProps.content,
    });
  };

  // 弹窗确认事件
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        this.props.handleOk(values); // 向父级反向传递值
        this.setState({
          visible: false,
        });
        this.props.form.resetFields();
      }
    });
  };

  // 弹窗取消事件
  handleCancel = (e) => {
    this.props.form.resetFields();
    this.props.handleCancel();
  };

  // 增加状态
  createRadio(Radio) {
    const Radios = Radio;
    if (Radios) {
      return (
        <RadioGroup>
          {
            Radios.map((item, index) => {
              return (<Radio value={item.value} key={index}>{item.name}</Radio>);
            })
          }
        </RadioGroup>
      );
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          title={this.state.title} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          okText="确认" cancelText="取消"
        >
          <Form>
            {
              dot.get(this, 'state.content', []).map((item, index) => {
                return (
                  <div key={index}>
                    {
                      item.initialValue && item.initialValue != null ?
                        <FormItem label={item.label} {...formItemLayout} key={index}>
                          {
                            item.Radio && item.Radio.length && item.Radio.length > 0 ?
                              getFieldDecorator(item.id, {
                                initialValue: item.initialValue,
                              })(
                                <RadioGroup>
                                  {
                                    item.Radio.map((item, index) => {
                                      return (<Radio value={item.value} key={index}>{item.name}</Radio>);
                                    })
                                  }
                                </RadioGroup>,
                              ) : getFieldDecorator(item.id, {
                                rules: [{
                                  type: 'string', message: item.message || '错误',
                                }, {
                                  required: item.required, message: item.message || '错误',
                                }],
                                initialValue: `${item.initialValue}`,
                              })(
                                <Input placeholder={item.placeholder} disabled={item.disabled ? item.disabled : false} />,
                            )}
                        </FormItem> :
                        <FormItem label={item.label} {...formItemLayout}>
                          {
                            // 是否要对值进行校验
                            item.checkValue ? getFieldDecorator(item.id, {
                              rules: [
                                {
                                  type: 'string',
                                  required: item.required,
                                  trigger: 'onBlur',
                                  validateTrigger: 'onFous',
                                  validator: (rule, value, callback) => {
                                    if (value === '') {
                                      callback(item.checkValue.message);
                                      return;
                                    }
                                    if (!(checkRule[item.checkValue.rule].test(value))) {
                                      callback(item.checkValue.message);
                                      return;
                                    }
                                    callback();
                                  },
                                },
                              ],
                            })(<Input placeholder={item.placeholder} />)
                            :
                            getFieldDecorator(item.id, {  // 不用校验值
                              rules: [{
                                type: 'string', message: item.message || '错误',
                              }, {
                                required: item.required, message: item.message || '错误',
                              }],
                            })(
                              <Input placeholder={item.placeholder} disabled={item.disabled ? item.disabled : false} />,
                            )
                        }
                        </FormItem>
                    }
                  </div>
                );
              })
            }
          </Form>
        </Modal>
      </div>
    );
  }
}
export default connect()(Form.create()(ModalPage));
