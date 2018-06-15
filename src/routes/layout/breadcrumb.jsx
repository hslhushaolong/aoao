/**
 * 面包屑
 * */
import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

class BreadCrumbComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumb: props.breadcrumb || [],
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      breadcrumb: nextProps.breadcrumb || [],
    });
  };

  renderBreadcrumb = () => {
    const { breadcrumb } = this.state;
    const content = [];
    breadcrumb.forEach((item) => {
      content.push(<Breadcrumb.Item key={item.key}> {item.title} </Breadcrumb.Item>);
    });
    return (
      <Breadcrumb style={{ marginBottom: 8 }}>
        {content}
      </Breadcrumb>
    );
  }

  render() {
    return (
      <div>
        {this.renderBreadcrumb()}
      </div>
    );
  }
}

export default BreadCrumbComponent;
