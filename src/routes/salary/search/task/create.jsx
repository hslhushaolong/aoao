/**
 * 新建薪资更新任务
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { Modal, Form, Tooltip, Select, DatePicker, Icon, Alert } from 'antd';
import { CoreForm } from '../../../../components/core';
import { authorize, system } from '../../../../application';
import { SalaryTaskTime, KnightTypeWorkProperty } from '../../../../application/define';

const { MonthPicker } = DatePicker;
const { Option } = Select;

class TaskCreateModal extends Component {
  constructor(props) {
    super();
    this.state = {
      onSubmit: props.onSubmit ? props.onSubmit : undefined,  // 提交参数
      onCancle: props.onCancle ? props.onCancle : undefined,  // 可见状态变更回调
      visible: props.visible ? props.visible : false,         // 是否显示弹窗
      supplierList: props.supplierList ? props.supplierList : [],  // 供应商列表
      values: {
        supplier: '',       // 供应商
        platform: '',       // 平台
        city: [],           // 城市
        district: [],       // 商圈
        taskTime: undefined, // 薪资计算周期
        knightType: [],     // 职位类型
        position: '',       // 职位
        verifyState: '',    // 审核状态
        date: '',           // 更新日期
        month: '',          // 更新月份
        workProperty: '',   // 工作性质
      },

    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      onSubmit: nextProps.onSubmit ? nextProps.onSubmit : undefined,  // 提交参数
      onCancle: nextProps.onCancle ? nextProps.onCancle : undefined,  // 可见状态变更回调
      visible: nextProps.visible ? nextProps.visible : false,         // 是否显示弹窗
      supplierList: nextProps.supplierList ? nextProps.supplierList : [],  // 供应商列表
    });
  }

  // 重制state
  onReset = () => {
    this.setState({
      visible: false,
      values: {
        supplier: '',       // 供应商
        platform: '',       // 平台
        city: [],           // 城市
        district: [],       // 商圈
        taskTime: undefined, // 薪资计算周期
        knightType: [],     // 职位类型
        position: '',       // 职位
        verifyState: '',    // 审核状态
        date: '',           // 更新日期
        month: '',          // 更新月份
        workProperty: '',   // 工作性质
      },
    });
    this.props.form.resetFields();
  }
  // 更换供应商
  onChangeSupplier = (e) => {
    const { values } = this.state;
    const { form } = this.props;

    values.supplier = e;
    values.city = [];
    values.district = [];
    // values.knightType = [];
    this.setState({ values });

    // 清空选项
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });
    // form.setFieldsValue({ knightType: [] });
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { values } = this.state;
    const { form } = this.props;

    values.platform = e;
    values.city = [];
    values.district = [];
    values.knightType = [];
    this.setState({ values });

    // 清空选项
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });
    form.setFieldsValue({ knightType: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { values } = this.state;
    const { form } = this.props;

    // 保存城市参数
    values.city = e;
    values.district = [];
    form.setFieldsValue({ district: [] });
    this.setState({ values });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { values } = this.state;
    values.district = e;
    this.setState({ values });
  }

  // 更换职位
  onChangePosition = (e) => {
    const { values } = this.state;
    values.position = e;
    this.setState({ values });
  }

  // 更换工作性质
  onChangeWorkProperty = (e) => {
    const { values } = this.state;
    const { form } = this.props;

    values.knightType = [];
    values.workProperty = Number(e);
    form.setFieldsValue({ knightType: [] });
    this.setState({ values });
  }

  // 更换任务时间
  onChangeTaskTime = (e) => {
    const { values } = this.state;
    const { form } = this.props;

    values.date = '';
    values.month = '';
    values.taskTime = e;
    // 清空当前的月份和日期选择
    if (form.getFieldValue('date')) {
      form.setFieldsValue({ date: undefined });
    }
    if (form.getFieldValue('month')) {
      form.setFieldsValue({ month: undefined });
    }

    this.setState({ values });
  }

  // 添加项目
  onSubmit = () => {
    const { onSubmit } = this.state;
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }

      if (onSubmit) {
        Object.assign(values, { supplier_id: authorize.account.supplierId });
        onSubmit(values);
      }
    });

    // 重置
    this.onReset();
  }

  // 取消
  onCancle = () => {
    // 回调函数，提交
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle();
    }

    // 重置
    this.onReset();
  }

  // 不可使用的日期（从上月一号之前的日期均不可用）
  onDisabledDate = (current) => {
    const object = moment();
    const year = object.year();
    const month = object.month(); // 默认的返回从0～11,所以不需要再减1（Months are zero indexed, so January is month 0.）
    return current && current < moment(`${year}-${month}-1`, 'YYYY-MM-DD');
  }

  render() {
    const { onSubmit, onCancle } = this;
    const { visible } = this.state;
    const { platform, city, district, workProperty, knightType, taskTime } = this.state.values;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '供应商',
        form: getFieldDecorator('supplier', { rules: [{ required: true, message: '请选择平台' }] })(
          <Select placeholder="请选择供应商" onChange={this.onChangeSupplier}>
            {
              dot.get(this, 'state.supplierList.data', []).map((item, index) => {
                const key = item._id + index;
                return (<Option value={`${item._id}`} key={key}>{item.supplier_name}</Option>);
              })
            }
          </Select>,
        ),
      },
      {
        label: '平台',
        form: getFieldDecorator('platform', { rules: [{ required: true, message: '请选择平台' }] })(
          <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
            {
              authorize.platform().map((item, index) => {
                const key = item.id + index;
                return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('city', { initialValue: city })(
          <Select allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择城市" onChange={this.onChangeCity}>
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item + index;
                return (<Option value={`${item.id}`} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        ),
      },
      {
        label: '商圈',
        form: getFieldDecorator('district', { initialValue: district })(
          <Select allowClear optionFilterProp="children" placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        ),
      },
      {
        label: '职位',
        form: getFieldDecorator('position')(
          <Select placeholder="请选择职位">
            {
              authorize.positions(true).filter(item => item.operable).map((item, index) => {
                const key = item.id + index;
                return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        ),
      },
      {
        label: '工作性质',
        form: getFieldDecorator('workProperty', { rules: [{ required: true, message: '请选择工作性质' }] })(
          <Select placeholder="请选择工作性质" onChange={this.onChangeWorkProperty}>
            <Option value={`${KnightTypeWorkProperty.fulltime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.fulltime)}</Option>
            <Option value={`${KnightTypeWorkProperty.parttime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.parttime)}</Option>
          </Select>,
        ),
      },
      {
        label: '骑士类型',
        form: getFieldDecorator('knightType', { initialValue: knightType, rules: [{ required: true, message: '请选择骑士类型' }] })(
          <Select allowClear optionFilterProp="children" mode="multiple" placeholder="请选择骑士类型">
            {system.knightTypeByWorkProperty(workProperty).map((item, index) => {
              return (<Option value={`${item.id}`} key={index}>{item.name}</Option>);
            })}
          </Select>,
        ),
      },
    ];

    // 判断是否是全职，如果是全职，只显示特定的月份选项
    if (workProperty === KnightTypeWorkProperty.fulltime) {
      formItems.push({
        label: <span>薪资更新时间段 <Tooltip title="仅允许更新本月和上月薪资单"><Icon type="info-circle-o" /></Tooltip></span>,
        form: getFieldDecorator('taskTime', { initialValue: taskTime, rules: [{ required: true, message: '请选择薪资更新时间段' }] })(
          <Select placeholder="薪资更新时间段" onChange={this.onChangeTaskTime}>
            <Option value={`${SalaryTaskTime.month}`}>{SalaryTaskTime.description(SalaryTaskTime.month)}</Option>
          </Select>,
        ),
      });
    } else {
      formItems.push({
        label: <span>薪资更新时间段 <Tooltip title="仅允许更新本月和上月薪资单"><Icon type="info-circle-o" /></Tooltip></span>,
        form: getFieldDecorator('taskTime', { initialValue: taskTime, rules: [{ required: true, message: '请选择薪资更新时间段' }] })(
          <Select placeholder="薪资更新时间段" onChange={this.onChangeTaskTime}>
            <Option value={`${SalaryTaskTime.month}`}>{SalaryTaskTime.description(SalaryTaskTime.month)}</Option>
            <Option value={`${SalaryTaskTime.earlyMonth}`}>{SalaryTaskTime.description(SalaryTaskTime.earlyMonth)}</Option>
            <Option value={`${SalaryTaskTime.lastMonth}`}>{SalaryTaskTime.description(SalaryTaskTime.lastMonth)}</Option>
            <Option value={`${SalaryTaskTime.earlyPeriod}`}>{SalaryTaskTime.description(SalaryTaskTime.earlyPeriod)}</Option>
            <Option value={`${SalaryTaskTime.middlePeriod}`}>{SalaryTaskTime.description(SalaryTaskTime.middlePeriod)}</Option>
            <Option value={`${SalaryTaskTime.lastPeriod}`}>{SalaryTaskTime.description(SalaryTaskTime.lastPeriod)}</Option>
            <Option value={`${SalaryTaskTime.weekOne}`}>{SalaryTaskTime.description(SalaryTaskTime.weekOne)}</Option>
            <Option value={`${SalaryTaskTime.weekTwo}`}>{SalaryTaskTime.description(SalaryTaskTime.weekTwo)}</Option>
            <Option value={`${SalaryTaskTime.weekThree}`}>{SalaryTaskTime.description(SalaryTaskTime.weekThree)}</Option>
            <Option value={`${SalaryTaskTime.weekFour}`}>{SalaryTaskTime.description(SalaryTaskTime.weekFour)}</Option>
            <Option value={`${SalaryTaskTime.daily}`}>{SalaryTaskTime.description(SalaryTaskTime.daily)}</Option>
          </Select>,
        ),
      });
    }

    // 判断薪资更新时间段类型，如果是天，则显示日期选择器
    if (taskTime === `${SalaryTaskTime.daily}`) {
      formItems.push(
        {
          label: '日期',
          form: getFieldDecorator('date', { rules: [{ required: true, message: '请选择日期' }] })(
            <DatePicker disabledDate={this.onDisabledDate} />,
          ),
        },
      );
    } else if (taskTime !== '' && taskTime !== undefined) {
      formItems.push(
        {
          label: '月份',
          form: getFieldDecorator('month', { rules: [{ required: true, message: '请选择月份' }] })(
            <MonthPicker disabledDate={this.onDisabledDate} />,
          ),
        },
      );
    }

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };

    return (
      <Modal
        title="新建薪资更新任务"
        visible={visible}
        onOk={onSubmit}
        onCancel={onCancle}
        width={620}
      >
        <Form layout="horizontal">
          <CoreForm items={formItems} cols={1} layout={layout} />
          <Alert showIcon message="请确保要更新的商圈存在骑士和有效的薪资规则，若没有则不显示薪资单，或更新状态异常！" type="info" />
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(TaskCreateModal);
