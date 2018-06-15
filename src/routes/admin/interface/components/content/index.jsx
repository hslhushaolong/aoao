// 控件，界面
import React, { Component } from 'react';
import { CoreContent, CorePreview } from '../../../../../components/core';

class DemoCoreContent extends Component {

  // 渲染内容
  renderCase = (title = '', description = '', content = '', code = '') => {
    return (
      <div style={{ border: '1px solid #ebedf0', padding: '10px', borderRadius: '2px', margin: '0 0 16px' }}>
        <div style={{ borderBottom: '1px solid #ebedf0' }}>{content}</div>
        <div style={{ position: 'relative', width: '100%', padding: '15px 15px 10px', marginBottom: '10px', borderBottom: '1px dashed #ebedf0' }}>
          <span style={{ position: 'absolute', top: '-13px', left: '11px', backgroundColor: '#ffffff', padding: '5px' }}>{title}</span>
          <span>{ description }</span>
        </div>
        <CorePreview>{code}</CorePreview>
      </div>
    );
  }

  renderDescription = (description = '') => {
    return (
      <div>
        <p style={{ backgroundColor: '#ecf6fd', borderRadius: '2px', padding: '10px' }}>
          {description}
        </p>
        <p style={{ borderBottom: '1px solid #f7f7f7', margin: '10px' }} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDescription('CoreContent 组件，封装内容的容器。为了统一管理功能，功能页面必须封装在CoreContent中使用。')}

        {this.renderCase(
          '基本',
          '无标题的，内容容器',
          <CoreContent> 内容 </CoreContent>,
          '<CoreContent> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '标题',
          '带标题的，内容容器。 标题 为 可选参数 title, 标题提示 为 可选参数 titleTip。',
          <CoreContent title={'标题'} titleTip={'这里是标题提示'}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} titleTip={\'这里是标题提示\'}> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '标题扩展',
          '标题扩展 为 可选参数 titleExt, 可以使用纯文本或组件对象。',
          <CoreContent title={'标题'} titleExt={<span>添加 | 删除 | 操作</span>}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} titleExt={<span>添加 | 删除 | 操作</span>}> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '页脚',
          '页脚内容 为 可选参数 footer, 可以使用纯文本或组件对象。',
          <CoreContent title={'标题'} footer={<div style={{ fontSize: '10px' }}>这里是页脚内容</div>}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} footer={<div style={{ fontSize:\'10px\' }}>这里是页脚内容</div>}> 内容 </CoreContent>',
        )}

      </div>
    );
  }
}
export default DemoCoreContent;
