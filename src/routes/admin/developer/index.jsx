// 职位 对照显示模块
import React, { Component } from 'react';
import { Table } from 'antd';
import { CoreContent } from '../../../components/core';
import BreadCrumb from '../../layout/breadcrumb';
import Modules from '../../../application/define/modules';
import Router from '../../../application/service/router';

class System extends Component {

  // 渲染模块定义
  renderModules = () => {
    const dataSource = Object.keys(Modules).map((key) => {
      return Modules[key];
    });

    const columns = [{
      title: '权限id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '模块key',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => {
        if (record.isPage) {
          return '页面';
        }
        if (record.isMenu) {
          return '菜单';
        }
        if (record.isOperate) {
          return '操作';
        }
      },
    }, {
      title: '模块名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path',
      render: (path) => {
        const breadcrumb = Router.breadcrumbByPath(`${path}`);
        return <BreadCrumb breadcrumb={breadcrumb} />;
      },
    }];

    return (
      <CoreContent title="模块定义" style={{ backgroundColor: '#FAFAFA' }} >
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </CoreContent>
    );
  }

  // 渲染定义的类型
  renderDefineType = (title, type, typeName) => {
    // 生成数据对象
    const dataSource = [];
    Object.keys(type).forEach((name) => {
      const value = type[name];
      const description = type.description(value);
      dataSource.push({
        key: value,   // 数值
        value,        // 数值
        name,         // 变量名字
        description,  // 中文描述
        hook: `${typeName}.${name}`, // 调用
      });
    });

    const columns = [{
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '变量名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '调用',
      dataIndex: 'hook',
      key: 'hook',
    }];

    return (
      <CoreContent title={title} style={{ backgroundColor: '#FAFAFA' }} >
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染模块信息 */}
        {this.renderModules()}
      </div>
    );
  }
}
export default System;
