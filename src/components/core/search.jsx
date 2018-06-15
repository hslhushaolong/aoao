import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { Form, Row, Col, Icon, Button } from 'antd';
import { CoreForm } from './index';
import styles from './style.less';

class CoreSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items ? props.items : [],                         // 详细item
      onReset: props.onReset ? props.onReset : undefined,            // 搜索的回调
      onSearch: props.onSearch ? props.onSearch : undefined,         // 搜索的回调
      onHookForm: props.onHookForm ? props.onHookForm : undefined,   // 绑定form控件
      operations: props.operations ? props.operations : '',          // 扩展操作按钮
      expand: props.expand !== undefined ? props.expand : false,     // 是否展开搜索条件
      isReset: props.isReset !== undefined ? props.isReset : false,  // 是否重置搜索
    };

    this.private = {
      isRenderMultiOperations: (dot.get(props, 'items', []).length > 3),   // 判断搜索条件是否超过3个，超过则渲染多行的搜索选项
    };
  }

  componentDidMount() {
    const { onHookForm } = this.state;
    const { form } = this.props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { expand, isReset } = this.state;

    this.setState({
      items: nextProps.items ? nextProps.items : [],                            // 详细item
      onReset: nextProps.onReset ? nextProps.onReset : undefined,               // 搜索的回调
      onSearch: nextProps.onSearch ? nextProps.onSearch : undefined,            // 搜索的回调
      onHookForm: nextProps.onHookForm ? nextProps.onHookForm : undefined,      // 绑定form控件
      operations: nextProps.operations ? nextProps.operations : '',             // 扩展操作按钮
      expand: nextProps.expand !== undefined ? nextProps.expand : expand,       // 是否展开搜索条件
      isReset: nextProps.isReset !== undefined ? nextProps.isReset : isReset,   // 是否重置搜索
    });

    // 判断搜索条件是否超过3个，超过则渲染多行的搜索选项
    this.private.isRenderMultiOperations = dot.get(nextProps, 'items', []).length > 3;
  }

  // 搜索
  onSearch = (e) => {
    const { onSearch } = this.state;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (onSearch) {
          onSearch(values);
        }
      }
    });
  }

  // 重置表单
  onReset = () => {
    const { onReset } = this.state;

    this.props.form.resetFields();
    this.setState({ isReset: false });

    if (onReset) {
      onReset(this.props.form.getFieldsValue());
    }
  }

  // 展开，收起
  onToggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // 渲染表单
  renderFormItems = () => {
    const { form } = this.props;
    const { items, expand, operations } = this.state;
    const { isRenderMultiOperations } = this.private;

    // 默认分3列展示条件
    const cols = 3;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    // 默认不展开的情况下，显示的项目不超过6条
    let formItems = _.cloneDeep(items);
    if (items.length > 6 && expand !== true) {
      formItems = formItems.slice(0, 6);
    }

    // 遍历数据，处理元素
    formItems.map((item, index) => {
      const result = item;

      // 判断检索的元素中是否有回调函数，回调函数填充form数据
      if (is.function(item.form)) {
        result.form = item.form(form);
      }

      return result;
    });

    // 判断，如果不渲染多行搜索条件，则展示为一行
    if (isRenderMultiOperations === false) {
      formItems.push({
        offset: (2 - items.length) * (24 / cols),
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <div className={styles.right}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={this.onReset} style={{ marginLeft: '10px' }}>重置</Button>
            <div className={styles.right} style={{ float: 'right', marginLeft: '10px' }}>
              {operations || ''}
            </div>
          </div>
        ),
      });
    }

    const props = {
      cols,
      items: formItems,
      layout,
    };
    return (
      <CoreForm {...props} />
    );
  }

  renderOperations = () => {
    const { operations, items } = this.state;
    const { isRenderMultiOperations } = this.private;
    // 如果检索条件小于等于3条，操作按钮直接渲染到表单中
    if (isRenderMultiOperations === false) {
      return <div />;
    }

    // 显示的项目超过6条, 则显示更多选项按钮
    let isShowOptions = false;
    if (items.length > 6) {
      isShowOptions = true;
    }

    // 更多选项
    const moreOptions = (
      <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.onToggle}>
        更多选项 <Icon type={this.state.expand ? 'up' : 'down'} />
      </a>
    );

    return (
      <div className={styles.footer}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={24} className={styles.right}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={this.onReset} style={{ marginLeft: '10px', marginRight: '8px' }}>重置</Button>
            <div className={styles.right} style={{ float: 'right' }}>
              {operations}
              {isShowOptions ? moreOptions : ''}
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { renderFormItems, renderOperations } = this;
    const { isReset } = this.state;

    // 重置表单
    if (isReset === true) {
      this.onReset();
    }

    return (
      <Form className="ant-advanced-search-form contentSearch" onSubmit={this.onSearch}>
        {/* 渲染表单内容 */}
        { renderFormItems() }

        {/* 渲染操作按钮 */}
        { renderOperations() }
      </Form>
    );
  }

}

const WrappedSearchComponent = Form.create()(CoreSearch);
module.exports = WrappedSearchComponent;
