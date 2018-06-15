// 科目三级联动选择 & 成本中心数据显示
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import { Select } from 'antd';
import { CoreForm } from '../../../../../components/core';

const { Option } = Select;

// 科目级别
const SubjectLevel = {
  One: 1,     // 一级
  Two: 2,     // 二级
  Three: 3,   // 三级
};

class CommonSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: dot.get(props, 'expense.subjectData', []),      // 从服务器获取的数据
      subjectOne: dot.get(props, 'value.subjectOne', undefined),      // 第一级
      subjectTwo: dot.get(props, 'value.subjectTwo', undefined),      // 第二级
      subjectThree: dot.get(props, 'value.subjectThree', undefined),  // 第三级
      onChange: props.onChange ? props.onChange : undefined,    // 回调事件
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      subjects: dot.get(nextProps, 'expense.subjectData', []),        // 从服务器获取的数据
      subjectOne: dot.get(nextProps, 'value.subjectOne', undefined),        // 第一级
      subjectTwo: dot.get(nextProps, 'value.subjectTwo', undefined),        // 第二级
      subjectThree: dot.get(nextProps, 'value.subjectThree', undefined),    // 第三级
      onChange: nextProps.onChange ? nextProps.onChange : undefined,  // 回调事件
    });
  }

  // 数据变化时候的回调函数
  onChangeSubject = (level, value) => {
    const { onChange } = this.state;
    let { subjectOne, subjectTwo, subjectThree } = this.state;
    // 设置第一级数据
    if (level === SubjectLevel.One) {
      subjectOne = value;
      subjectTwo = undefined;
      subjectThree = undefined;
    }
    // 设置第二级数据
    if (level === SubjectLevel.Two) {
      subjectTwo = value;
      subjectThree = undefined;
    }
    // 设置第三级数据
    if (level === SubjectLevel.Three) {
      subjectThree = value;
    }

    this.setState({
      subjectOne,
      subjectTwo,
      subjectThree,
    });

    // 回调函数
    if (onChange) {
      onChange({
        subjectOne,
        subjectTwo,
        subjectThree,
      });
    }
  }

  // 根据级别获取数据
  getSubjectsByLevel = (level, id = '') => {
    const { subjects } = this.state;
    // 过滤一级数据
    if (level === SubjectLevel.One) {
      return subjects.filter(e => e.level === 1);
    }
    // 过滤二级数据
    if (level === SubjectLevel.Two) {
      return subjects.filter(e => e.level === 2 && e.parent_id === id);
    }
    // 过滤三级数据
    if (level === SubjectLevel.Three) {
      return subjects.filter(e => e.level === 3 && e.parent_id === id);
    }

    return [];
  }

  render() {
    const { subjectOne, subjectTwo, subjectThree } = this.state;
    const formItems = [
      {
        label: '一级科目',
        form: (
          <Select allowClear placeholder="请选择科目" value={subjectOne} onChange={(e) => { this.onChangeSubject(SubjectLevel.One, e); }}>
            {
              this.getSubjectsByLevel(SubjectLevel.One).map((item, index) => {
                const key = item._id + index;
                return (<Option value={item._id} key={key}>{item.name}</Option>);
              })
            }
          </Select>
        ),
      }, {
        label: '二级科目',
        form: (
          <Select allowClear placeholder="请选择科目" value={subjectTwo} onChange={(e) => { this.onChangeSubject(SubjectLevel.Two, e); }}>
            {
              this.getSubjectsByLevel(SubjectLevel.Two, subjectOne).map((item, index) => {
                const key = item._id;
                return (<Option value={item._id} key={key}>{item.name}</Option>);
              })
            }
          </Select>
        ),
      }, {
        label: '三级科目',
        form: (
          <Select allowClear placeholder="请选择科目" value={subjectThree} onChange={(e) => { this.onChangeSubject(SubjectLevel.Three, e); }}>
            {
              this.getSubjectsByLevel(SubjectLevel.Three, subjectTwo).map((item, index) => {
                const key = item._id;
                return (<Option value={item._id} key={key}>{item.name}</Option>);
              })
            }
          </Select>
        ),
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreForm items={formItems} cols={3} layout={layout} />
    );
  }
}
function mapStateToProps({ expense }) {
  return { expense };
}

module.exports = connect(mapStateToProps)(CommonSubject);
