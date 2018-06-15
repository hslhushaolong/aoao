/**
 * 下载模态框
 */
import React, { Component } from 'react';
import { Form, Row, Col, Select, Modal } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';

import { authorize } from '../../../../application';
import { CutEventType, Position } from '../../../../application/define';
import Modules from '../../../../application/define/modules';


const [FormItem, Option] = [Form.Item, Select.Option];

class ExcelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: this.props.form,
      search: this.props.search,
      showExcelDownloadPage: this.props.show,
    };
  }
  componentWillReceiveProps(nextProps) {
    nextProps.search.knight = dot.get(nextProps, 'inquireModel.knight') || [];
    this.setState({
      search: nextProps.search,
      showExcelDownloadPage: nextProps.show,
    });
  }
  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    search.platform = [e];
    search.city = [];
    search.district = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ city: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { form, search } = this.state;
    if (e.length <= 0) {
      search.city = [];
      search.district = [];
      this.setState({ search });

      // 清空选项
      form.setFieldsValue({ district: [] });
      return;
    }
    // 保存城市参数
    search.city = e;
    this.setState({ search });
  }
  // 更换区域
  onChangeDistrict = (e) => {
    const { search } = this.state;
    search.district = e;
    this.setState({ search });
    this.handleSearchKnight(e)
  }
  // 更换
  onChangeKnight = (e) => {
    const { search } = this.state;
    search.selectKnight = e;
    this.setState({ search });
  }
  // 更换
  onChangeCutEvent = (e) => {
    const { search } = this.state;
    search.cutEvent = e;
    this.setState({ search });
  }

  handleSearchKnight = (value ) => {
    const { dispatch } = this.props;
    const accountId = authorize.account.id;
    dispatch({
      type: 'inquireModel/getKnightListE',
      payload: {
        account_id: accountId,
        limit: 1000,
        page: 1,
        biz_district_id_list: value,
        permission_id: Modules.ModuleSearchInquire.id,
        position_id_list: [Position.postmanManager, Position.postman],   // 职位列表
      },
    });
  };

  onClickOk = () => {
    this.setState({ showExcelDownloadPage: false });
    // 下载模板
    this.props.onDownload()
  }
  onClikcCancel = () => {
    this.setState({ showExcelDownloadPage: false });
  }
  // 渲染下载模态框
  renderExcelDownloadPage = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { getFieldDecorator } = this.props.form;
    const { platform, city, district } = this.state.search;

    return (
      <Form>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="平台" {...formItemLayout}>
              {getFieldDecorator('platform')(
                <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
                  {
                    authorize.platform().map((item, index) => {
                      const key = item.id + index;
                      return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="城市" {...formItemLayout}>
              {getFieldDecorator('city')(
                <Select allowClear placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity}>
                  {
                    authorize.cities(platform).map((item, index) => {
                      const key = item + index;
                      return (<Option value={`${item.id}`} key={key}>{item.description}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="商圈" {...formItemLayout}>
              {getFieldDecorator('district', { initialValue: district })(
                <Select allowClear placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
                  {
                    authorize.districts(city).map((item, index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="骑士" {...formItemLayout}>
              {getFieldDecorator('selectKnight')(
                <Select allowClear placeholder="请选择城市" mode="multiple" onChange={this.onChangeKnight}>
                  {
                    this.state.search.knight.map((item, index) => {
                      return <Option key={index} value={`${item.name},${item.phone}`}>{`${item.name},${item.phone}`}</Option>;
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col sm={10}>
            <FormItem label="补款项目" {...formItemLayout}>
              {getFieldDecorator('cutEvent')(
                <Select allowClear placeholder="请选择补款项目" onChange={this.onChangeCutEvent}>
                  {Object.keys(CutEventType).map((key, index) => {
                    return Object.hasOwnProperty.call(CutEventType, key) ? <Option key={index} value={`${CutEventType[key]}`}>{CutEventType.description(CutEventType[key])}</Option> : '';
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>);
  }

  render = () => {
    return (<Modal
      title={'下载模板'} visible={this.state.showExcelDownloadPage}
      onOk={this.onClickOk} onCancel={this.onClikcCancel}
      okText="确认" cancelText="取消"
    >
      {this.renderExcelDownloadPage()}
    </Modal>);
  }
}
const mapStateToProps = ({ inquireModel }) => {
  return { inquireModel };
};

export default connect(mapStateToProps)(Form.create()(ExcelModal));
