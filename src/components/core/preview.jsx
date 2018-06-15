import React from 'react';
import { Base64 } from 'js-base64';
import styles from './style.less';

class CorePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: props.markdown ? props.markdown : '',     // markdown文件内容(优先显示)
      children: props.children ? props.children : '',     // 模块内容
      style: props.style ? props.style : {},              // 样式
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      markdown: nextProps.markdown ? nextProps.markdown : '',   // markdown文件内容(优先显示)
      children: nextProps.children ? nextProps.children : '',   // 模块内容
      style: nextProps.style ? nextProps.style : {},            // 样式
    });
  }

  render() {
    const { style, markdown, children } = this.state;

    // 默认显示children
    let content = children;

    // 如果有markdown内容，优先显示
    if (markdown !== '') {
      // 解析md文件，base64反编译
      const regex = /data:text\/x-markdown;base64,(.*)/;
      const matches = regex.exec(markdown);
      content = matches ? Base64.decode(matches[1]) : `markdown内容解析失败:${markdown}`;
    }

    return (
      <pre className={styles.contentPreview} style={style}>
        {content}
      </pre>
    );
  }
}

module.exports = CorePreview;
