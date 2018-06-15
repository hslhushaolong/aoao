/**
 * 员工查询模块查询组件
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Form, Row, Col, Select, Button, Input, Popconfirm } from 'antd';
import aoaoBossTools from './../../../utils/util';
import { authorize } from '../../../application';
import Operate from '../../../application/define/operate';
import { Position } from '../../../application/define';

const [FormItem, Option] = [Form.Item, Select.Option];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],  // 城市
      areaList: [],  // 商圈
      isKnightMode: false,
      contractBelong: this.props.contractBelong || [],
      positionInfoList: this.props.positionInfoList || [],
    };
  }

  onPositionChange = (val) => {
    if (Number(val) === Position.postmanManager || Number(val) === Position.postman) {
      this.setState({
        isKnightMode: true,
      });
    } else {
      this.setState({
        isKnightMode: false,
      });
      this.props.form.setFieldsValue({
        knight_type_id_list: [],
      });
    }
  }

  // 提交搜索
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        this.props.search(values);
      }
    });
  };

  // 导出员工
  exportExcel = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const values = this.props.form.getFieldsValue();
        if (values.job_category_id_list) {
          values.job_category_id_list = values.job_category_id_list.map((item) => {
            item = Number(item);
            return item;
          });
        }
        if (values.position_id_list) {
          values.position_id_list = values.position_id_list.map((item) => {
            item = Number(item);
            return item;
          });
        }
        this.props.export(values);
      }
    });
  };

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return dataList;
  }

  // 获取城市列表
  platformChange = (data) => {
    // data 是平台名
    this.props.form.resetFields(['biz_district_id_list', 'city_spelling_list']);
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
    this.setState({
      cityList,
    });
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    this.props.form.resetFields(['biz_district_id_list']);
    const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
    const cityData = this.state.cityList;

    const areaArray = [];
    const areaData = [];
    keyList.forEach((item, index) => {
      areaArray.push(cityData[item].biz_district_list);
    });
    for (let i = 0; i < areaArray.length; i++) {
      areaArray[i].forEach((item, index) => {
        areaData.push(item);
      });
    }
    this.setState({
      areaList: areaData,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const jobType = this.props.knightTypeList || [];  // 工作类型列表
    const contractBelong = this.state.contractBelong; // 合同归属
    const roleId = authorize.roleId();
    const supplier = [authorize._vendor.data];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const longLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <div className="mgt8">
        <Form>
          <Row>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'职位'}>
                {getFieldDecorator('position_id_list', {
                  rules: [{ required: false, message: '请选择职位', trigger: 'onBlur', type: 'array' }],
                })(
                  <Select placeholder="请选择职位" mode="multiple" allowClear onChange={this.onPositionChange}>
                    {
                      this.state.positionInfoList.map((item, index) => {
                        return (
                          <Option value={`${item.gid}`} key={index}>{item.name}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'骑士类型'}>
                {getFieldDecorator('knight_type_id_list')(
                  <Select
                    placeholder="请选择骑士类型"
                    mode="multiple" allowClear
                    disabled={!this.state.isKnightMode}
                  >
                    {
                      jobType && jobType.length !== 0 && jobType.map((item, index) => {
                        return (
                          <Option
                            value={item._id}
                            key={index}
                          >{item.knight_type}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'合同归属'}>
                {getFieldDecorator('contract_belong_id')(
                  <Select
                    placeholder="请选择合同归属"
                    mode="multiple" allowClear
                  >
                    {
                      contractBelong && contractBelong.length !== 0 && contractBelong.map((item, index) => {
                        return (
                          <Option
                            value={item._id}
                            key={index}
                          >{item.name}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'供应商'}>
                {getFieldDecorator('supplier_list')(
                  <Select
                    placeholder="请选择供应商"
                    mode="multiple" allowClear
                  >
                    {
                      supplier.map((item, index) => {
                        return (<Option value={`${item.supplierId}`} key={index}>{item.supplierName}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'平台'}>
                {getFieldDecorator('platform_code_list', {
                  rules: [{
                    type: 'array', message: '请选择平台',
                  }, {
                    required: false, message: '请选择平台',
                  }],
                })(
                  <Select
                    mode="multiple" placeholder="请选择平台"
                    onChange={this.platformChange} allowClear
                    optionFilterProp="children"
                  >
                    {
                      this.createPlatformList().map((item, index) => {
                        return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="城市" {...formItemLayout}>
                {getFieldDecorator('city_spelling_list', {
                  rules: [{
                    type: 'array', message: '请选择城市',
                  }, {
                    required: false, message: '请选择城市',
                  }],
                })(
                  <Select
                    placeholder="请选择城市" onChange={this.handleCityChange}
                    mode="multiple" allowClear
                    optionFilterProp="children"
                  >
                    {
                      dot.get(this, 'state.cityList', []).map((item, index) => {
                        return (<Option
                          value={item.city_spelling}
                          key={index}
                        >{item.city_name_joint}</Option>);
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="商圈" {...formItemLayout}>
                {getFieldDecorator('biz_district_id_list', {
                  rules: [{
                    type: 'array', message: '请输入身份证号',
                  }, {
                    required: false, message: '请输入身份证号',
                  }],
                })(
                  <Select placeholder="请选择商圈" mode="multiple" allowClear optionFilterProp="children">
                    {
                      dot.get(this, 'state.areaList', []).map((item, index) => {
                        return (
                          <Option
                            value={item.biz_district_id}
                            key={item.biz_district_id}
                          >{item.biz_district_name}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'姓名'}>
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入姓名" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'手机号'}>
                {getFieldDecorator('phone', {
                  rules: [{ required: false, message: '请输入手机号', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入手机号" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'在职状态'}>
                {getFieldDecorator('state', {
                  rules: [{ required: false, message: '请选择骑士状态', trigger: 'onBlur', type: 'string' }],
                  initialValue: '50',
                })(
                  <Select
                    onChange={this.stateChange}
                    placeholder="请选择骑士状态" allowClear
                  >
                    <Option
                      value={'50'}
                      key={50}
                    >在职</Option>
                    <Option
                      value={'1'}
                      key={1}
                    >离职待审核</Option>
                    <Option
                      value={'-50'}
                      key={-50}
                    >离职</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...longLayout} label={'第三方平台骑士ID'}>
                {getFieldDecorator('associated_knight_id', {
                  rules: [{ required: false, message: '请输入第三方平台骑士ID', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入骑士id" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'身份证号'}>
                {getFieldDecorator('identity_card_id', {
                  rules: [{ required: false, message: '请输入身份证号', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入身份证号" />,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem {...longLayout} label={'平台身份证号'}>
                {getFieldDecorator('associated_identity_card_id', {
                  rules: [{ required: false, message: '请输入平台身份证号', trigger: 'onBlur', type: 'string' }],
                })(
                  <Input placeholder="请输入平台身份证号" />,
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <Col sm={3} />
              <Button type="primary" className={'mgr8'} onClick={this.handleSubmit}>查询</Button>
              {
                // 导出EXCEL(超级管理员)
                Operate.canOperateEmployeeSearchExportExcel() ?
                  <Popconfirm title="创建下载任务？" onConfirm={this.exportExcel} okText="确认" cancelText="取消">
                    <Button type="primary" className={'mgl8'}>导出EXCEL</Button>
                  </Popconfirm>
                : ''
              }
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

}

Search = Form.create()(Search);
export default Search;
