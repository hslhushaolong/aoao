import React from 'react';
import { Form, Row, Col } from 'antd';

// 默认的布局
const defaultLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

class CoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: props.cols ? props.cols : '1',              // 列数
      layout: props.layout ? props.layout : defaultLayout,     // 布局
      items: props.items ? props.items : [],            // 详细item
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      cols: nextProps.cols ? nextProps.cols : '1',              // 列数
      layout: nextProps.layout ? nextProps.layout : defaultLayout,     // 布局
      items: nextProps.items ? nextProps.items : [],            // 详细item
    });
  }

  renderForms = (forms, layout, label) => {
    const children = [];
    if (forms.length > 0) {
      forms.forEach((item, index) => {
        const labelContent = (index === 0) ? label : '';
        children.push(
          <Form.Item {...layout} label={labelContent} style={{ marginBottom: '10px' }}>
            {item}
          </Form.Item>,
        );
      });
      return children;
    }

    return (
      <Form.Item {...layout} label={label} style={{ marginBottom: '10px' }}>
        {forms}
      </Form.Item>
    );
  }

  // 渲染表单
  renderFormItems = (items, cols, renderLayout) => {
    // 判断，如果表单项目为空，则直接返回
    if (items.length <= 0) {
      return (<Row gutter={16}><Col span={24} /></Row>);
    }

    // 表单项目
    const children = [];
    items.forEach((item, index) => {
      // label名称, 位置偏移
      const { label, hide } = item;

      // 具体表单内容, 表单布局, 栅格左侧的间隔格数
      let { form, layout, span, offset } = item;

      // key值(如果label为空的时候，取随机值渲染)
      const key = (label !== undefined) ? index + label : index + Math.random();

      // 判断form表单数据
      if (typeof form !== 'object') {
        form = <div />;
      }

      // 判断表单布局信息
      if (!layout) {
        layout = renderLayout;
      }
      // 当前列布局
      if (!span) {
        span = 24 / cols;
      }

      // 栅格左侧的间隔格数
      if (!offset) {
        offset = 0;
      }

      // 隐藏某项检索条件是否需要隐藏
      if (!hide) {
        children.push(
          <Col span={span} offset={offset} key={key}>
            {this.renderForms(form, layout, label)}
          </Col>,
        );
      }
    });
    return (
      <Row gutter={16}>
        {children}
      </Row>
    );
  }

  render() {
    const { items, cols, layout } = this.state;

    // 渲染的表单内容
    return this.renderFormItems(items, cols, layout);
  }

}

module.exports = CoreForm;
