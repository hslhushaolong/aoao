/**
 * 费用申请首页
 * @author Jay
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Select, Form } from 'antd';
import RentApply from './rentHouseApply/rentApply';
import TravelApply from './travelApply/traveApply';
import TeamBuildApply from './teamBuildApply/teamBuild';
import UnexpectedApply from './unexpectedApply/unexpectedApply';
import PurchaseApply from './purchaseApply/purchaseApply';
import PunishmentApply from './punishmentApply/punishmentApply';
import OtherApply from './otherApply/otherApply';
import OfficeApply from './officeApply/officeApply';

const [FormItem, Option] = [Form.Item, Select.Option];

class IndexPage extends React.Component {
  constructor() {
    super();
    this.state = {
      applyType: '200001',  // 默认为财务申请
    };
  }

  // 切换申请类型
  changeApplyType(e) {
    this.setState({
      applyType: e,
    });
    // 修改全局申请类型
    this.props.dispatch({
      type: 'finance/switchApplyTypeR',
      payload: e,
    });
  }

  // 根据申请类型不同，切换不同组件
  showApplyTypeComponent() {
    switch (this.state.applyType) {
      case '200001':  // 财务申请
        return <RentApply />;
      case '200005' :  // 差旅报销
        return <TravelApply />;
      case '200006' :  // 团建报销
        return <TeamBuildApply />;
      case '200009' :  // 意外支持
        return <UnexpectedApply />;
      case '200008' :  // 收购申请
        return <PurchaseApply />;
      case '200007' :  // 盖章罚款
        return <PunishmentApply />;
      case '200010' :  // 其他申请
        return <OtherApply />;
      case '200011' :  // 办公申请
        return <OfficeApply />;
      default :
        return '';
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div>
        <Form>
          <Row>
            <Col sm={8}>
              <FormItem label="选择申请类型" {...formItemLayout}>
                {getFieldDecorator('apply_city', {
                  rules: [{
                    type: 'string', message: '请选择申请类型',
                  }, {
                    required: false, message: '请选择申请类型',
                  }],
                  initialValue: '200001',
                })(
                  <Select placeholder="租房申请" onChange={this.changeApplyType.bind(this)}>
                    <Option value={'200001'}>租房申请</Option>
                    <Option value={'200005'}>差旅报销</Option>
                    <Option value={'200006'}>团建 | 招待</Option>
                    <Option value={'200009'}>意外支出</Option>
                    <Option value={'200008'}>收购款</Option>
                    {/* <Option value={'200007'}>盖章罚款</Option> // 隐藏盖章罚款选项  */}
                    <Option value={'200010'}>采购</Option>
                    <Option value={'200011'}>办公费用</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        {
          this.showApplyTypeComponent()
        }
      </div>
    );
  }
}

function mapStateToProps({ finance }) {
  return { finance };
}
export default connect(mapStateToProps)(Form.create()(IndexPage));
