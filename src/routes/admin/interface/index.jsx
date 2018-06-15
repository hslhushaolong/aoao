// 控件，界面
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CoreContent, CorePreview } from '../../../components/core';

// 动态显示的模块
import DemoCoreContent from './components/content';
import DemoCoreForm from './components/search';
import DemoCoreSearch from './components/form';

import Application from './document/application.md';
import Modules from './document/modules.md';
import Interfaces from './document/interface.md';
import Plan from './document/plan.md';

import Admin from '../README.md';
import Inquire from '../../inquire/README.md';
import OperationManage from '../../operationManage/README.md';
import Employee from '../../employee/README.md';
import Materials from '../../materials/README.md';
import Finance from '../../finance/README.md';
import Salary from '../../salary/README.md';
import Account from '../../account/README.md';
import System from '../../system/README.md';
// 渲染显示的数据类型
const ContentType = {
  Markdown: 0,  // markdown文件
  Component: 1, // 组件
};

class Interface extends Component {
  constructor() {
    super();
    this.state = {
      title: '模块开发文档',                                                     // 渲染的标题
      content: <CorePreview markdown={require('./document/modules.md')} />,  // 渲染的内容
      noWapper: false,  // 显示的内容是否进行外层封装
    };
    this.private = {
      // 边栏
      sider: [
        {
          title: '说明文档',
          data: [
            { title: '项目开发文档', type: ContentType.Markdown, file: Application },
            { title: '模块开发文档', type: ContentType.Markdown, file: Modules },
            { title: '页面开发规范', type: ContentType.Markdown, file: Interfaces },
            { title: '项目开发计划', type: ContentType.Markdown, file: Plan },
          ],
        },
        {
          title: '模块实例',
          data: [
            { title: 'CoreContent', type: ContentType.Component, noWapper: true, component: <DemoCoreContent /> },
            { title: 'CoreForm', type: ContentType.Component, component: <DemoCoreForm /> },
            { title: 'CoreSearch', type: ContentType.Component, component: <DemoCoreSearch /> },
          ],
        },
        {
          title: '模块说明',
          data: [
            { title: '超级管理', type: ContentType.Markdown, file: Admin },
            { title: '查询管理', type: ContentType.Markdown, file: Inquire },
            { title: '操作管理', type: ContentType.Markdown, file: OperationManage },
            { title: '员工管理', type: ContentType.Markdown, file: Employee },
            { title: '物资管理', type: ContentType.Markdown, file: Materials },
            { title: '财务管理', type: ContentType.Markdown, file: Finance },
            { title: '薪资管理', type: ContentType.Markdown, file: Salary },
            { title: '我的账户', type: ContentType.Markdown, file: Account },
            { title: '系统管理', type: ContentType.Markdown, file: System },
          ],
        },
      ],
    };
  }

  // 边栏链接点击
  onClickSider = (item) => {
    const title = item.title;
    const noWapper = !!item.noWapper;
    let content = '';

    // 判断，如果是markdown，则显示markdown文件
    if (item.type === ContentType.Markdown) {
      if (item.file === undefined) {
        content = '未找到该文件';
      } else {
        // const markdown = require(`${item.file}`);
        content = <CorePreview markdown={item.file} />;
      }
    }

    // 判断如果是模块，则显示模块
    if (item.type === ContentType.Component) {
      content = item.component;
    }

    this.setState({ title, content, noWapper });
  }

  // 渲染边栏模块
  renderSider = ({ title, data }) => {
    const { onClickSider } = this;
    return (
      <CoreContent title={title} key={title}>
        {data.map((item) => {
          return (
            <Row span={24} style={{ padding: '3px' }} key={item.title}>
              <a onClick={() => onClickSider(item)}>{item.title}</a>
            </Row>
          );
        })}
      </CoreContent>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { title, content, noWapper } = this.state;

    // 如果不需要外层的封装，则直接返回数据
    if (noWapper) {
      return content;
    }

    return (<CoreContent title={title}> {content} </CoreContent>);
  }

  render() {
    const { renderSider } = this;
    const { sider } = this.private;

    return (
      <Row span="24" gutter={16}>
        <Col span="5">
          {/* 渲染边栏 */}
          {sider.map(item => renderSider(item))}
        </Col>
        <Col span="19">
          {this.renderContent()}
        </Col>
      </Row>
    );
  }
}
export default Interface;
