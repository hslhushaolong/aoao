/**
 * 员工离职详情模板
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

import aoaoBossTools from './../../../utils/util';
import { Position } from '../../../application/define';
import Operate from '../../../application/define/operate';
import { authorize } from '../../../application';

const FormItem = Form.Item;

class LeaveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.ModalFlag,  // 对话框可见性
      detail: props.detail,  // 员工详情
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      detail: nextProps.detail,
      visible: nextProps.ModalFlag,
    });
  }

  // 对话框点击取消
  handleCancel = () => {
    this.props.changeModalFlag();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal title={'离职审批'} visible={this.state.visible} onCancel={this.handleCancel} footer={null} style={{ minWidth: '700px' }}>
          <Form>
            <Row>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'姓名'}>
                  {getFieldDecorator('name')(
                    <span>{dot.get(this, 'state.detail.name')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'联系电话'}>
                  {getFieldDecorator('phone')(
                    <span>{dot.get(this, 'state.detail.phone')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'供应商名称'}>
                  {getFieldDecorator('supplier_name')(
                    <span>{dot.get(this, 'state.detail.supplier_name')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'身份证号'}>
                  {getFieldDecorator('identity_card_id')(
                    <span>{dot.get(this, 'state.detail.identity_card_id')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'平台'}>
                  {getFieldDecorator('platform')(
                    <span>
                      {dot.get(this, 'state.detail.platform_list', []).map((item, index) => {
                        return <span key={index}>{item.platform_name}</span>;
                      })}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'城市'}>
                  {getFieldDecorator('city_list')(
                    <span>
                      {dot.get(this, 'state.detail.city_list', []).map((item, index) => {
                        return <span key={index}>{item.city_name_joint}</span>;
                      })}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'商圈'}>
                  {getFieldDecorator('biz_district_list')(
                    <span>
                      {dot.get(this, 'state.detail.district_description', '--')}
                    </span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'职位'}>
                  {getFieldDecorator('poistion')(
                    <span>{authorize.poistionNameById(dot.get(this, 'state.detail.position_id'))}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'离职原因'}>
                  {getFieldDecorator('departure_reason')(
                    <span>{dot.get(this, 'state.detail.departure_reason')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'入职日期'}>
                  {getFieldDecorator('entry_date')(
                    <span>{dot.get(this, 'state.detail.entry_date', '--')}</span>,
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'离职日期'}>
                  {getFieldDecorator('departure_date')(
                    <span>{dot.get(this, 'state.detail.departure_date')}</span>,
                  )}
                </FormItem>
              </Col>
              {
                Operate.knightTypeShow(dot.get(this, 'state.detail.position_id')) == true ? '' : <Col sm={12}>
                  <FormItem {...formItemLayout} label={'工作交接备注'}>
                    {getFieldDecorator('job_transfer_remark', {
                      rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
                    })(
                      <span>{dot.get(this, 'state.detail.job_transfer_remark')}</span>,
                    )}
                  </FormItem>
                </Col>
              }
              <Col sm={12}>
                <FormItem {...formItemLayout} label={'审批人'}>
                  {getFieldDecorator('departure_approver_name', {
                    rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
                  })(
                    <span>{dot.has(this, 'state.detail.departure_log') ? this.state.detail.departure_log[this.state.detail.departure_log.length - 1].operator : '--'}</span>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
LeaveDetail = Form.create()(LeaveDetail);
export default LeaveDetail;
