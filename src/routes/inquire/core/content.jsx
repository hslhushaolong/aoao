import React from 'react';
import { Row, Col, Tooltip, Icon } from 'antd';
import styles from './style.less';

class CoreContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title ? props.title : '',              // 标题
      color: props.color ? props.color : '',              // 背景色
      titleTip: props.titleTip ? props.titleTip : '',     // 标题提示
      titleExt: props.titleExt ? props.titleExt : '',     // 标题扩展栏
      children: props.children ? props.children : '',     // 模块内容
      footer: props.footer ? props.footer : '',           // 模块页脚
      style: props.style ? props.style : {},              // 样式
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      title: nextProps.title ? nextProps.title : '',            // 标题
      color: nextProps.color ? nextProps.color : '',            // 背景色
      titleTip: nextProps.titleTip ? nextProps.titleTip : '',   // 标题提示
      titleExt: nextProps.titleExt ? nextProps.titleExt : '',   // 标题扩展栏
      children: nextProps.children ? nextProps.children : '',   // 模块内容
      footer: nextProps.footer ? nextProps.footer : '',         // 模块页脚
      style: nextProps.style ? nextProps.style : {},            // 样式
    });
  }

  renderHeader = () => {
    const { title, color, titleTip, titleExt } = this.state;

    // 判断是否显示标题
    if (title.length <= 0) {
      return <div />;
    }

    // 渲染的标题提示
    let tipContent = '';
    if (titleTip !== '') {
      tipContent = (
        <Tooltip title={titleTip} arrowPointAtCenter>
          <Icon type="question-circle-o" className={styles.tooltip} />
        </Tooltip>
      );
    }

    return (
      <div className={styles.title}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={12} className={styles.left}>
            <span className={styles.titleSpin} style={{ backgroundColor: color }} />
            {title}{tipContent}
          </Col>
          <Col span={12} className={styles.right}>{titleExt}</Col>
        </Row>
      </div>
    );
  }

  renderContent = () => {
    const { children } = this.state;
    return (
      <div className={styles.content}>
        {children}
      </div>
    );
  }

  renderFooter = () => {
    const { footer } = this.state;
    if (footer === '') {
      return <div />;
    }
    return (
      <div className={styles.footer}>{footer}</div>
    );
  }

  render() {
    const { renderHeader, renderContent, renderFooter } = this;
    const { color, style } = this.state;

    // 渲染背景标题的渐变颜色
    let backgroundImage = '';
    if (color) {
      // 转换16进制颜色到rgba
      const hexToRGB = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          return `rgb(${r}, ${g}, ${b})`;
        }
      };

      backgroundImage = `linear-gradient(-180deg, ${hexToRGB(color, 0.05)} 0%, #FFFFFF 100%)`;
      style.backgroundImage = backgroundImage;
    }

    return (
      <div className={styles.container} style={style}>
        {/* 渲染标题 */}
        { renderHeader() }
        {/* 渲染内容 */}
        { renderContent() }
        {/* 渲染页脚 */}
        { renderFooter() }
      </div>
    );
  }
}

module.exports = CoreContent;
