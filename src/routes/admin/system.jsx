// 角色，职位，权限 对照显示模块
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../components/core';
import Package from '../../../package.json';
import Config from '../../../config.js';

class System extends Component {

  // 渲染系统信息
  renderPackage = () => {
    const formItems = [
      {
        label: '系统当前版本',
        form: Package.version,
      },
    ];
    const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
    return (
      <CoreContent title="系统信息" style={{ backgroundColor: '#FAFAFA' }} >
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染系统设置 (涉及显示敏感信息，模块暂时屏蔽)
  renderConfig = () => {
    const formItems = [
      {
        label: 'AccessKey',
        form: Config.AccessKey,
      }, {
        label: 'SecretKey',
        form: Config.SecretKey,
      }, {
        label: 'accessToken',
        form: Config.accessToken(),
      }, {
        label: '调用服务器',
        form: Config.prod,
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <CoreContent title="系统设置" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染系统信息 */}
        {this.renderPackage()}

        {/* 渲染系统设置 */}
        {/* {this.renderConfig()} */}
      </div>
    );
  }
}
export default System;
