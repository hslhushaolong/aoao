/**
 * 工号管理新建页面
 */
import { connect } from 'dva';
import moment from 'moment';
import is from 'is_js';
import React, { Component } from 'react';
import { Select, DatePicker, Input, Form, Button, Modal, message } from 'antd';

import { authorize, session } from './../../../application';
import { exists } from './utils';
import dot from 'dot-prop';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
import AllSelect from '../../../components/AllSelect';

const { Option } = Select;

class Build extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      handleOptions: [],                    // 处理原因选项
      date_list: dot.get(props, 'employee.deliveryDetailList.date_list', []),   // 重复时间段
      deliveryCity: session.get('employee.delivery.build.create') || {},      // 获得运力账号平台城市
      visible: props.visible || false,      // 控制弹窗
      cancle: props.onCancle || null,       // 关闭函数
      knightOptions: dot.get(props, 'employee.deliveryFindList.result', []),     // 骑士选项
      search: {
        jobCategory: [],  // 职位类型
        platform: [],     // 平台
        city: [],         // 城市
        district: [],     // 商圈
        dateRange: [],    // 申请创建日期
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible || false,
      cancle: nextProps.onCancle || null,
      knightOptions: dot.get(nextProps, 'employee.deliveryFindList.result', []),
      date_list: dot.get(nextProps, 'employee.deliveryDetailList.date_list', []),
      deliveryCity: session.get('employee.delivery.build.create') || {},      // 获得运力账号平台城市
    });
  }

  // 查询按钮
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          account_id: authorize.account.id,
          platform_code: this.state.deliveryCity.platform_code,
          city_spelling: this.state.deliveryCity.city_spelling,
          biz_district_list: values.district,
        };
        // antd bug 清除搜索会是‘’
        if (values.phone != null && values.phone != '') {
          params.phone = values.phone;
        }
        this.props.dispatch({ type: 'employee/deliveryFindE', payload: params });
        this.props.form.setFieldsValue({ knight: undefined });
      }
    });
  }

  // 重置
  onReset = () => {
    this.state.form.resetFields(['handling_reason']);
  }

  // 搜索
  onSearch = (values) => {
    this.props.searchHandle(values);
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 改变平台
  onChangePlatform = (e) => {
    const { search } = this.state;
    const { form } = this.props;

    // 重置表单数据
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });

    // 保存平台参数
    search.platform = [e];
    search.city = [];
    search.district = [];
    this.setState({ search });
  }

  // 改变城市
  onChangeCity = (e) => {
    const { search } = this.state;
    const { form } = this.props;
    form.setFieldsValue({ district: [] });

    // 保存城市参数
    search.city = [e];
    search.district = [];
    this.setState({ search });
  }

  // 检测时间是否可选
  checkConfirm = (rule, value, callback) => {
    const timeRange = this.state.date_list || [];
    const timeList = [];
    let flag = true;
    // 判断时间是否可选，取出起始时间
    for (let i = 0; i < timeRange.length; i++) {
      const oneList = [];
      const startTimeDay = timeRange[i][0].split('-')[2];
      const endTimeDay = timeRange[i][1].split('-')[2];
      oneList.push(startTimeDay);
      oneList.push(endTimeDay);
      timeList.push(oneList);
    }

    if (exists(value)) {
      const startDate = moment(value[0]).format('YYYY-MM-DD').split('-')[2];
      const endDate = moment(value[1]).format('YYYY-MM-DD').split('-')[2];
      // 遍历时间，判断时间是否可选，赋值flag
      timeList.forEach((item) => {
        if (startDate < item[0] && endDate > item[1]) {
          flag = false;
        }
      });
      // 判断时间是否可选
      if (flag) {
        callback();
      } else {
        message.warning('请选择正确时间段');
      }
    } else {
      message.warning('请选择正确时间段');
    }
  }

  // 改变商圈
  onChangeDistrict = (e) => {
    const { search } = this.state;
    search.district = [e];
    this.setState({ search });
  }

  //  关闭弹窗
  onCancle = () => {
    if (this.state.cancle) { this.state.cancle(); }
    this.props.form.resetFields();
  }

  // 确认
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 选择了骑士类型和时间要进行格式转换
        if (exists(values.knight) && exists(values.dateRange)) {
          const startDate = moment(values.dateRange[0]).format('YYYY-MM-DD');
          const endDate = moment(values.dateRange[1]).format('YYYY-MM-DD');
          const timeRange = `${startDate}~${endDate}`;
          const params = {
            account_id: authorize.account.id,
            platform_code: this.state.deliveryCity.platform_code,
            city_spelling: this.state.deliveryCity.city_spelling,
            transport_staff_id: window.location.hash.split('=')[1], // 运力工号员工ID
            actual_transport_staff_id: values.knight, // 替跑工号员工ID
            ascription_date: timeRange, // 替跑时间
          };

          // 取出后台需要返回的字段（前端显示大多不需要，原路给回去）
          this.state.knightOptions.forEach((item) => {
            // 通过knight_id匹配数组里对应的骑士
            if (item.knight_id === values.knight) {
              params.biz_district_id = item.biz_district_id;
              // 后台要int类型，
              params.transport_type = parseInt(item.transport_type, 10);
              params.phone = item.phone;
              params.name = item.name;
            }
          });
          // antd 搜索bug,清除数据显示''
          if (values.phone != null && values.phone != '') {
            // 输入查询的手机号i 一定要和当前骑士的手机号一样
            if (params.phone != values.phone) {
              message.warning('输入的手机号与骑士不一致');
              return;
            }
          }
          // 确认创建替跑工号
          this.props.dispatch({ type: 'employee/deliveryBuildE', payload: params });
          // 关闭创建弹窗
          this.onCancle();
          // 获取列表数据
          this.props.dispatch({ type: 'employee/deliveryDeFindR', payload: null });
        } else {
          message.warning('请选择骑士');
        }
      }
    });
  }

  // 不可选日期
  disabledDate = (current) => {
    // 如果不是当月则不能使用
    if (current.month() !== moment().month()) {
      return true;
    }

    // 如果替跑账号时段为空，则可以使用
    if (is.empty(this.state.date_list)) {
      return false;
    }

    // 是否禁用
    let isDisable = false;
    this.state.date_list.forEach((item) => {
      // 时间段的开始和结束
      const startDate = moment(item[0], 'YYYY-MM-DD');
      const endDate = moment(item[1], 'YYYY-MM-DD');

      // 判断是否在时间段之内，并且日期等于开始和结束，都设置为禁用
      if (current.isBetween(startDate, endDate, 'day') || current.isSame(startDate, 'day') || current.isSame(endDate, 'day')) {
        isDisable = true;
      }
    });
    return isDisable;
  }

  // 渲染表单
  renderForm = () => {
    const { platform, city } = this.state.search;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="选择时间">
          {getFieldDecorator('dateRange', {
            rules: [{
              required: true,
              message: '请选择时间范围',
              // 验证时间是否可选 antd文档
            }, { validator: this.checkConfirm, message: '该时间内有骑士替跑' }],
          },
        )(
          <RangePicker disabledDate={this.disabledDate} />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="平台">
          <span>{this.state.deliveryCity.platform_name}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="城市">
          <span>{this.state.deliveryCity.city_name}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="商圈">
          {getFieldDecorator('district', {
            rules: [{
              required: true, message: '请选择商圈',
            }],
          })(
            <AllSelect placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
              {
                authorize.districts([this.state.deliveryCity.city_spelling]).map((item, index) => {
                  return <Option key={index} value={item.id}>{item.name}</Option>;
                })
              }
            </AllSelect>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('phone')(
            <Input placeholder="请输入手机号" onChange={this.onChangePhone} />,
          )}
        </FormItem>
        <div style={{ margin: '-12px auto 12px', textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">查询</Button>
        </div>
        <FormItem {...formItemLayout} label="骑士确认">
          {getFieldDecorator('knight')(
            <Select placeholder="请先查询骑士" onChange={this.onChangeDistrict}>
              {
                this.state.knightOptions.map((item) => {
                  return <Option value={`${item.knight_id}`} key={`${item.knight_id}-${item.transport_type}`}>{item.name}</Option>;
                })
              }
            </Select>,
          )}
        </FormItem>
      </Form>
    );
  }

  // 搜索功能
  render = () => {
    return (
      <div>
        <Modal
          title="新建运力"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.onCancle}
        >
          {this.renderForm()}
        </Modal>

      </div>
    );
  };
}
const BuildModal = Form.create()(Build);
const mapStateToProps = ({ employee }) => {
  return { employee };
};
export default connect(mapStateToProps)(BuildModal);
